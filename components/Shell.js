"use client";

import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchDialog } from "@/components/SearchDialog";
import { useShop } from "@/components/ShopProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function Shell({ children }) {
  const { toast } = useShop();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
      <WhatsAppButton />
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
