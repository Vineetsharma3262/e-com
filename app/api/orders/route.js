import { authResponse, createOrder, currentUser, listOrders } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    return Response.json({ ok: true, orders: await listOrders(user.id) });
  } catch (error) {
    return authResponse(error);
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const order = await createOrder(user.id, body);
    return Response.json({ ok: true, order });
  } catch (error) {
    return authResponse(error);
  }
}
