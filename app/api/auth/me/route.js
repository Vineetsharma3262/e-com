import { authResponse, currentUser, listAddresses, listOrders } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ ok: true, user: null, addresses: [], orders: [] });
    const [addresses, orders] = await Promise.all([listAddresses(user.id), listOrders(user.id)]);
    return Response.json({ ok: true, user, addresses, orders });
  } catch (error) {
    return authResponse(error);
  }
}
