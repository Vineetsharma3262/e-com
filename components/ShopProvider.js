"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { faqs, faqsHi, getProduct } from "@/lib/catalog";
import { translate } from "@/lib/i18n";
import { site } from "@/lib/site";

const ShopContext = createContext(null);

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used within ShopProvider");
  return value;
}

function lineId(slug, size) {
  return `${slug}::${size}`;
}

export function ShopProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refreshAccount = useCallback(async () => {
    const response = await fetch("/api/auth/me");
    const data = await response.json().catch(() => ({ user: null, addresses: [], orders: [] }));
    setUser(data.user || null);
    setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
    setOrders(Array.isArray(data.orders) ? data.orders : []);
    return data.user || null;
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang === "hi" || storedLang === "en") setLangState(storedLang);
    setDark(document.documentElement.classList.contains("dark"));
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(stored)) setCart(stored);
    } catch {
      setCart([]);
    }
    refreshAccount().finally(() => setReady(true));
  }, [refreshAccount]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    if (ready) localStorage.setItem("lang", lang);
  }, [lang, ready]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1600);
  }

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  function setLang(next) {
    setLangState(next);
  }

  function addItem(slug, size, qty = 1) {
    setCart((current) => {
      const id = lineId(slug, size);
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...current, { id, slug, size, qty }];
    });
    notify(translate(lang, "added"));
  }

  function changeQty(id, delta) {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        const qty = item.qty + delta;
        return qty <= 0 ? [] : [{ ...item, qty }];
      }),
    );
  }

  function removeItem(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  async function saveAddress(input) {
    const hasId = Boolean(input.id);
    const response = await fetch(hasId ? `/api/addresses/${input.id}` : "/api/addresses", {
      method: hasId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await response.json().catch(() => ({ ok: false, error: "ADDRESS_INVALID" }));
    if (!data.ok) throw new Error(data.error || "ADDRESS_INVALID");
    setAddresses(data.addresses);
  }

  async function removeAddress(id) {
    const response = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({ ok: false }));
    if (!data.ok) {
      notify(translate(lang, "addressFailed"));
      return;
    }
    setAddresses(data.addresses);
  }

  async function setDefaultAddress(id) {
    const response = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    const data = await response.json().catch(() => ({ ok: false }));
    if (!data.ok) {
      notify(translate(lang, "addressFailed"));
      return;
    }
    setAddresses(data.addresses);
  }

  async function placeOrder({ lines, address, payment }) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment,
        addressId: address.id,
        lines: lines.map((line) => ({
          slug: line.product?.slug || line.slug,
          size: line.size,
          qty: line.qty,
        })),
      }),
    });
    const data = await response.json().catch(() => ({ ok: false, error: "ORDER_FAILED" }));
    if (!data.ok) throw new Error(data.error || "ORDER_FAILED");
    setOrders((current) => [data.order, ...current]);
    return data.order;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAddresses([]);
    setOrders([]);
  }

  function checkoutHref() {
    return user ? "/checkout" : "/login?next=/checkout";
  }

  const lines = cart
    .map((item) => {
      const product = getProduct(item.slug);
      if (!product) return null;
      return { ...item, product, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);

  const count = lines.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = lines.length === 0 ? 0 : subtotal >= site.freeShippingOver ? 0 : site.shippingFee;
  const total = subtotal + shipping;

  const value = {
    lang,
    setLang,
    t: (key) => translate(lang, key),
    faqs: lang === "hi" ? faqsHi : faqs,
    dark,
    toggleTheme,
    cart: lines,
    count,
    subtotal,
    shipping,
    total,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    addItem,
    changeQty,
    removeItem,
    clearCart,
    ready,
    user,
    refreshAccount,
    logout,
    checkoutHref,
    addresses,
    orders,
    saveAddress,
    removeAddress,
    setDefaultAddress,
    placeOrder,
    toast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
