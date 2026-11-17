import { authResponse, currentUser, deleteAddress, updateAddress } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const addresses = await updateAddress(user.id, id, body);
    return Response.json({ ok: true, addresses });
  } catch (error) {
    return authResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    const { id } = await params;
    const addresses = await deleteAddress(user.id, id);
    return Response.json({ ok: true, addresses });
  } catch (error) {
    return authResponse(error);
  }
}
