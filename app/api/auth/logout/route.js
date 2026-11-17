import { cookies } from "next/headers";
import { ACCESS_COOKIE, authResponse, destroySession, REFRESH_COOKIE, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const store = await cookies();
    const token = body.refreshToken || store.get(REFRESH_COOKIE)?.value || store.get(SESSION_COOKIE)?.value;
    await destroySession(token);
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
    store.delete(SESSION_COOKIE);
    return Response.json({ ok: true });
  } catch (error) {
    return authResponse(error);
  }
}
