const keys = {
  NOT_REGISTERED: "notRegistered",
  WRONG_PASSWORD: "wrongPassword",
  EMAIL_TAKEN: "emailTaken",
  INVALID_OTP: "invalidOtp",
  OTP_EXPIRED: "otpExpired",
  TOO_MANY: "tooManyAttempts",
  RATE_LIMITED: "rateLimited",
  WAIT: "otpWait",
  WEAK_PASSWORD: "weakPassword",
  INVALID_EMAIL: "invalidEmail",
  NAME_SHORT: "nameShort",
  EMAIL_FAILED: "emailFailed",
  ALREADY_VERIFIED: "alreadyVerified",
  NEEDS_VERIFICATION: "needsVerification",
  ADDRESS_INVALID: "addressRequired",
  PASSWORD_MISMATCH: "passwordMismatch",
};

export function authMessage(t, code) {
  const key = keys[code];
  return key ? t(key) : t("authGeneric");
}

export const DEV_OTP_KEY = "wv-dev-otp";

export function rememberDevCode(code) {
  if (!code || typeof window === "undefined") return;
  sessionStorage.setItem(DEV_OTP_KEY, String(code));
}

export async function postAuth(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json().catch(() => ({ ok: false, error: "SERVER" }));
}
