import { cookies } from "next/headers";
import { authBody, authResponse, REFRESH_COOKIE, rotateRefresh, SESSION_COOKIE, setAuthCookies } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const store = await cookies();
    const refreshToken = body.refreshToken || store.get(REFRESH_COOKIE)?.value || store.get(SESSION_COOKIE)?.value;
    const result = await rotateRefresh(refreshToken);
    setAuthCookies(store, result);
    return Response.json(authBody(result));
  } catch (error) {
    return authResponse(error);
  }
}
