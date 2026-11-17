import { createHash, createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { getProduct } from "@/lib/catalog";
import { jsonValue, query } from "@/lib/db";
import { site } from "@/lib/site";

const scryptAsync = promisify(scrypt);

export const ACCESS_COOKIE = "wv_access";
export const REFRESH_COOKIE = "wv_refresh";
export const SESSION_COOKIE = "wv_session";
export const ACCESS_MAX_AGE = 60 * 15;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 45 * 1000;
const OTP_HOUR_LIMIT = 5;

const baseCookie = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const cookieOptions = { ...baseCookie, maxAge: SESSION_MAX_AGE };
export const accessCookieOptions = { ...baseCookie, maxAge: ACCESS_MAX_AGE };

export class AuthError extends Error {
  constructor(code, status = 400, extra = {}) {
    super(code);
    this.code = code;
    this.status = status;
    this.extra = extra;
  }
}

export function authResponse(error) {
  if (error instanceof AuthError) {
    return Response.json({ ok: false, error: error.code, ...error.extra }, { status: error.status });
  }
  console.error(error);
  return Response.json({ ok: false, error: "SERVER" }, { status: 500 });
}

function emailOf(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new AuthError("INVALID_EMAIL");
  }
  return email;
}

function passwordOf(value) {
  const password = String(value || "");
  if (password.length < 8 || password.length > 200) throw new AuthError("WEAK_PASSWORD");
  return password;
}

function nameOf(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 80) throw new AuthError("NAME_SHORT");
  return name;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 32);
  return `${salt}:${Buffer.from(derived).toString("hex")}`;
}

async function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const derived = Buffer.from(await scryptAsync(password, salt, 32));
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hashesMatch(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function publicUser(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email };
}

function mapAddress(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    pincode: row.pincode,
    locality: row.locality || "",
    address: row.address,
    landmark: row.landmark || "",
    city: row.city,
    state: row.state,
    isDefault: Boolean(row.is_default),
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    items: jsonValue(row.items) || [],
    address: jsonValue(row.address) || {},
    payment: row.payment,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function findUserByEmail(email) {
  const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

function jwtSecret() {
  return process.env.JWT_SECRET || "wearveltho-dev-only-set-JWT_SECRET";
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function signAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: now,
      exp: now + ACCESS_MAX_AGE,
    }),
  );
  const data = `${header}.${payload}`;
  const signature = createHmac("sha256", jwtSecret()).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function readAccessToken(token) {
  const [header, payload, signature] = String(token || "").split(".");
  if (!header || !payload || !signature) return null;
  const expected = createHmac("sha256", jwtSecret()).update(`${header}.${payload}`).digest("base64url");
  if (!hashesMatch(expected, signature)) return null;
  try {
    const body = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!body?.sub || Number(body.exp) * 1000 <= Date.now()) return null;
    return body;
  } catch {
    return null;
  }
}

async function userFromAccess(token) {
  const payload = readAccessToken(token);
  if (!payload) return null;
  const result = await query(
    `SELECT id, name, email FROM users WHERE id = $1 AND email_verified = TRUE`,
    [payload.sub],
  );
  return publicUser(result.rows[0]);
}

export async function userFromToken(token) {
  if (!token) return null;
  const result = await query(
    `SELECT u.id, u.name, u.email, u.email_verified
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.email_verified = TRUE`,
    [sha256(token)],
  );
  return publicUser(result.rows[0]);
}

async function issueAuth(user) {
  const publicRecord = publicUser(user);
  const accessToken = signAccessToken(publicRecord);
  const refreshToken = randomBytes(32).toString("hex");
  await query(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)`,
    [crypto.randomUUID(), publicRecord.id, sha256(refreshToken), new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString()],
  );
  return {
    user: publicRecord,
    accessToken,
    refreshToken,
    expiresIn: ACCESS_MAX_AGE,
    tokenType: "Bearer",
  };
}

export function authBody(result) {
  return {
    ok: true,
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
    tokenType: "Bearer",
  };
}

export function setAuthCookies(store, result) {
  store.set(ACCESS_COOKIE, result.accessToken, accessCookieOptions);
  store.set(REFRESH_COOKIE, result.refreshToken, cookieOptions);
  store.delete(SESSION_COOKIE);
}

export async function rotateRefresh(refreshToken) {
  const user = await userFromToken(refreshToken);
  if (!user) throw new AuthError("INVALID_REFRESH", 401);
  await query(`DELETE FROM sessions WHERE token_hash = $1`, [sha256(refreshToken)]);
  return issueAuth(user);
}

export async function currentUser() {
  const headerStore = await headers();
  const bearer = headerStore.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer) {
    const user = await userFromAccess(bearer);
    if (user) return user;
  }

  const store = await cookies();
  const accessUser = await userFromAccess(store.get(ACCESS_COOKIE)?.value);
  if (accessUser) return accessUser;

  const refresh = store.get(REFRESH_COOKIE)?.value || store.get(SESSION_COOKIE)?.value;
  if (!refresh) return null;
  try {
    const next = await rotateRefresh(refresh);
    setAuthCookies(store, next);
    return next.user;
  } catch {
    return null;
  }
}

async function sendOtpEmail(email, code, purpose) {
  const subject = purpose === "reset" ? "Reset your Wearveltho password" : "Your Wearveltho verification code";
  const text = `Your Wearveltho code is ${code}. It expires in 10 minutes.`;
  const html = `<p>Your Wearveltho code is <strong style="font-size:20px;letter-spacing:4px">${code}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`;

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") throw new AuthError("EMAIL_FAILED", 502);
    console.info(`OTP for ${email}: ${code}`);
    return code;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Wearveltho <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend error", response.status, detail);
    throw new AuthError("EMAIL_FAILED", 502);
  }
  return undefined;
}

async function issueOtp(email, purpose) {
  const recent = await query(
    `SELECT created_at FROM otp_codes WHERE email = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1`,
    [email, purpose],
  );
  const latest = recent.rows[0]?.created_at ? new Date(recent.rows[0].created_at).getTime() : 0;
  if (latest && Date.now() - latest < OTP_COOLDOWN_MS) {
    throw new AuthError("WAIT", 429);
  }

  const hour = await query(
    `SELECT COUNT(*)::int AS count FROM otp_codes WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
    [email],
  );
  if (Number(hour.rows[0]?.count || 0) >= OTP_HOUR_LIMIT) {
    throw new AuthError("RATE_LIMITED", 429);
  }

  const code = String(randomInt(100000, 1000000));
  await query(`DELETE FROM otp_codes WHERE email = $1 AND purpose = $2`, [email, purpose]);
  await query(
    `INSERT INTO otp_codes (id, email, purpose, code_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
    [crypto.randomUUID(), email, purpose, sha256(code), new Date(Date.now() + OTP_TTL_MS).toISOString()],
  );
  try {
    const devCode = await sendOtpEmail(email, code, purpose);
    return devCode ? { devCode } : {};
  } catch (error) {
    await query(`DELETE FROM otp_codes WHERE email = $1 AND purpose = $2`, [email, purpose]);
    throw error;
  }
}

async function consumeOtp(email, purpose, code) {
  const normalized = String(code || "").replace(/\D/g, "");
  if (!/^\d{6}$/.test(normalized)) throw new AuthError("INVALID_OTP");

  const result = await query(
    `SELECT * FROM otp_codes WHERE email = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1`,
    [email, purpose],
  );
  const row = result.rows[0];
  if (!row) throw new AuthError("INVALID_OTP");
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await query(`DELETE FROM otp_codes WHERE id = $1`, [row.id]);
    throw new AuthError("OTP_EXPIRED");
  }
  if (Number(row.attempts) >= 5) {
    await query(`DELETE FROM otp_codes WHERE id = $1`, [row.id]);
    throw new AuthError("TOO_MANY");
  }
  if (!hashesMatch(sha256(normalized), row.code_hash)) {
    await query(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
    throw new AuthError("INVALID_OTP");
  }
  await query(`DELETE FROM otp_codes WHERE email = $1 AND purpose = $2`, [email, purpose]);
}

export async function registerUser({ name, email, password }) {
  const cleanEmail = emailOf(email);
  const cleanName = nameOf(name);
  const cleanPassword = passwordOf(password);
  const existing = await findUserByEmail(cleanEmail);
  if (existing?.email_verified) throw new AuthError("EMAIL_TAKEN", 409);

  const passwordHash = await hashPassword(cleanPassword);
  if (existing) {
    await query(`UPDATE users SET name = $1, password_hash = $2 WHERE id = $3`, [cleanName, passwordHash, existing.id]);
  } else {
    await query(
      `INSERT INTO users (id, name, email, password_hash, email_verified) VALUES ($1, $2, $3, $4, FALSE)`,
      [crypto.randomUUID(), cleanName, cleanEmail, passwordHash],
    );
  }

  const otp = await issueOtp(cleanEmail, "register");
  return { step: "otp", email: cleanEmail, ...otp };
}

export async function resendOtp({ email, purpose }) {
  const cleanEmail = emailOf(email);
  const cleanPurpose = purpose === "reset" ? "reset" : "register";
  const user = await findUserByEmail(cleanEmail);
  if (!user) throw new AuthError("NOT_REGISTERED", 404);
  if (cleanPurpose === "register" && user.email_verified) throw new AuthError("ALREADY_VERIFIED", 409);
  const otp = await issueOtp(cleanEmail, cleanPurpose);
  return { step: "otp", email: cleanEmail, ...otp };
}

export async function verifyRegistration({ email, code }) {
  const cleanEmail = emailOf(email);
  const user = await findUserByEmail(cleanEmail);
  if (!user) throw new AuthError("NOT_REGISTERED", 404);
  if (user.email_verified) throw new AuthError("ALREADY_VERIFIED", 409);
  await consumeOtp(cleanEmail, "register", code);
  await query(`UPDATE users SET email_verified = TRUE WHERE id = $1`, [user.id]);
  return issueAuth({ ...user, email_verified: true });
}

export async function loginUser({ email, password }) {
  const cleanEmail = emailOf(email);
  const user = await findUserByEmail(cleanEmail);
  if (!user) throw new AuthError("NOT_REGISTERED", 404);
  const matches = await verifyPassword(String(password || ""), user.password_hash);
  if (!matches) throw new AuthError("WRONG_PASSWORD", 401);
  if (!user.email_verified) {
    let otp = {};
    try {
      otp = await issueOtp(cleanEmail, "register");
    } catch (error) {
      if (!(error instanceof AuthError) || (error.code !== "WAIT" && error.code !== "RATE_LIMITED")) throw error;
    }
    throw new AuthError("NEEDS_VERIFICATION", 403, { email: cleanEmail, ...otp });
  }
  return issueAuth(user);
}

export async function forgotPassword({ email }) {
  const cleanEmail = emailOf(email);
  const user = await findUserByEmail(cleanEmail);
  if (!user) throw new AuthError("NOT_REGISTERED", 404);
  const otp = await issueOtp(cleanEmail, "reset");
  return { step: "otp", email: cleanEmail, ...otp };
}

export async function resetPassword({ email, code, password }) {
  const cleanEmail = emailOf(email);
  const cleanPassword = passwordOf(password);
  const user = await findUserByEmail(cleanEmail);
  if (!user) throw new AuthError("NOT_REGISTERED", 404);
  await consumeOtp(cleanEmail, "reset", code);
  const passwordHash = await hashPassword(cleanPassword);
  await query(`UPDATE users SET password_hash = $1, email_verified = TRUE WHERE id = $2`, [passwordHash, user.id]);
  return issueAuth({ ...user, email_verified: true });
}

export async function destroySession(token) {
  if (!token) return;
  await query(`DELETE FROM sessions WHERE token_hash = $1`, [sha256(token)]);
}

export async function listAddresses(userId) {
  const result = await query(
    `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC`,
    [userId],
  );
  return result.rows.map(mapAddress);
}

function addressInput(input) {
  const fullName = nameOf(input.fullName);
  const phone = String(input.phone || "").replace(/\D/g, "");
  const pincode = String(input.pincode || "").replace(/\D/g, "");
  const address = String(input.address || "").trim();
  const city = String(input.city || "").trim();
  const state = String(input.state || "").trim();
  if (!/^\d{10}$/.test(phone) || !/^\d{6}$/.test(pincode) || address.length < 5 || !city || !state) {
    throw new AuthError("ADDRESS_INVALID");
  }
  return {
    fullName,
    phone,
    pincode,
    locality: String(input.locality || "").trim().slice(0, 120),
    address: address.slice(0, 300),
    landmark: String(input.landmark || "").trim().slice(0, 120),
    city: city.slice(0, 80),
    state: state.slice(0, 80),
    isDefault: Boolean(input.isDefault),
  };
}

async function markDefault(userId, id) {
  await query(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
  await query(`UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2`, [id, userId]);
}

export async function createAddress(userId, input) {
  const fields = addressInput(input);
  const count = await query(`SELECT COUNT(*)::int AS count FROM addresses WHERE user_id = $1`, [userId]);
  const id = crypto.randomUUID();
  const isDefault = fields.isDefault || Number(count.rows[0]?.count || 0) === 0;
  await query(
    `INSERT INTO addresses (id, user_id, full_name, phone, pincode, locality, address, landmark, city, state, is_default)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [id, userId, fields.fullName, fields.phone, fields.pincode, fields.locality, fields.address, fields.landmark, fields.city, fields.state, isDefault],
  );
  if (isDefault) await markDefault(userId, id);
  return listAddresses(userId);
}

export async function updateAddress(userId, id, input) {
  const existing = await query(`SELECT id FROM addresses WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (!existing.rows[0]) throw new AuthError("NOT_FOUND", 404);
  if (input && Object.keys(input).every((key) => key === "isDefault" || key === "id") && input.isDefault) {
    await markDefault(userId, id);
    return listAddresses(userId);
  }
  const fields = addressInput(input);
  await query(
    `UPDATE addresses
     SET full_name=$1, phone=$2, pincode=$3, locality=$4, address=$5, landmark=$6, city=$7, state=$8, is_default=$9
     WHERE id=$10 AND user_id=$11`,
    [fields.fullName, fields.phone, fields.pincode, fields.locality, fields.address, fields.landmark, fields.city, fields.state, fields.isDefault, id, userId],
  );
  if (fields.isDefault) {
    await markDefault(userId, id);
  } else {
    const defaults = await query(`SELECT id FROM addresses WHERE user_id = $1 AND is_default = TRUE`, [userId]);
    if (!defaults.rows.length) {
      await query(
        `UPDATE addresses SET is_default = TRUE WHERE id = (
          SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1
        )`,
        [userId],
      );
    }
  }
  return listAddresses(userId);
}

export async function deleteAddress(userId, id) {
  const existing = await query(`SELECT is_default FROM addresses WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (!existing.rows[0]) throw new AuthError("NOT_FOUND", 404);
  await query(`DELETE FROM addresses WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (existing.rows[0].is_default) {
    await query(
      `UPDATE addresses SET is_default = TRUE WHERE id = (
        SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1
      )`,
      [userId],
    );
  }
  return listAddresses(userId);
}

export async function listOrders(userId) {
  const result = await query(`SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
  return result.rows.map(mapOrder);
}

export async function createOrder(userId, input) {
  const payment = input?.payment === "online" ? "online" : input?.payment === "cod" ? "cod" : "";
  if (!payment) throw new AuthError("PAYMENT_INVALID");
  const addressId = String(input?.addressId || "");
  const addressResult = await query(`SELECT * FROM addresses WHERE id = $1 AND user_id = $2`, [addressId, userId]);
  if (!addressResult.rows[0]) throw new AuthError("ADDRESS_INVALID");
  const lines = Array.isArray(input?.lines) ? input.lines : [];
  if (!lines.length) throw new AuthError("EMPTY_CART");

  const items = lines.map((line) => {
    const product = getProduct(line?.slug);
    const qty = Number(line?.qty);
    if (!product || !product.sizes.includes(line?.size) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      throw new AuthError("ORDER_INVALID");
    }
    return {
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: line.size,
      qty,
      price: product.price,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= site.freeShippingOver ? 0 : site.shippingFee;
  const order = {
    id: `AUR${Date.now().toString().slice(-8)}`,
    items,
    address: mapAddress(addressResult.rows[0]),
    payment,
    subtotal,
    shipping,
    total: subtotal + shipping,
    createdAt: new Date().toISOString(),
  };

  await query(
    `INSERT INTO orders (id, user_id, items, address, payment, subtotal, shipping, total, created_at)
     VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7,$8,$9)`,
    [order.id, userId, JSON.stringify(order.items), JSON.stringify(order.address), order.payment, order.subtotal, order.shipping, order.total, order.createdAt],
  );
  return order;
}
