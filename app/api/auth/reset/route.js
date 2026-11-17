import { cookies } from "next/headers";
import { authBody, authResponse, resetPassword, setAuthCookies } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await resetPassword(body);
    setAuthCookies(await cookies(), result);
    return Response.json(authBody(result));
  } catch (error) {
    return authResponse(error);
  }
}
