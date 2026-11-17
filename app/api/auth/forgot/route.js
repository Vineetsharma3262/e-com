import { authResponse, forgotPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await forgotPassword(body);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return authResponse(error);
  }
}
