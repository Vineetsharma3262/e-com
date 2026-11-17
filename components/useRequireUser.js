"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/components/ShopProvider";

export function useRequireUser(nextPath = "/account") {
  const router = useRouter();
  const { ready, user } = useShop();

  useEffect(() => {
    if (!ready || user) return;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [ready, user, router, nextPath]);

  return ready && Boolean(user);
}
