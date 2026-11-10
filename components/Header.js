"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useShop } from "@/components/ShopProvider";

const links = [
  { href: "/collections/men", key: "men" },
  { href: "/collections/women", key: "women" },
  { href: "/contact", key: "contact" },
];

export function Header() {
  const { t, lang, setLang, toggleTheme, count, setCartOpen, setSearchOpen, menuOpen, setMenuOpen } =
    useShop();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40">
      <Link
        href="/#shop"
        className="flex items-center justify-center gap-1.5 bg-night px-4 py-2 text-center text-xs font-semibold text-[#f3ece3] sm:text-sm"
      >
        {t("announcement")}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
      <div className="border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Aurelle home" className="flex items-center">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-[15px] font-semibold transition hover:bg-card hover:text-accent ${
                    pathname === link.href ? "text-accent" : ""
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                className="hidden items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink xl:flex"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((open) => !open)}
              >
                {lang === "hi" ? t("hindi") : t("english")}
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 min-w-32 overflow-hidden rounded-xl border border-line bg-card py-1 shadow-lg">
                  {[
                    ["en", "english"],
                    ["hi", "hindi"],
                  ].map(([code, key]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setLang(code);
                        setLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm font-medium hover:bg-bg-alt ${
                        lang === code ? "text-accent" : ""
                      }`}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("toggleTheme")}
              className="rounded-full p-2 text-accent hover:bg-card"
            >
              <Sun className="hidden h-5 w-5 dark:block" />
              <Moon className="h-5 w-5 dark:hidden" />
            </button>
            <Link
              href="/#shop"
              className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-bg transition hover:bg-accent hover:text-white xl:inline-flex"
            >
              {t("shopNow")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-label={t("search")}
              className="hidden rounded-full p-2 hover:bg-card sm:block"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" aria-label={t("profile")} className="rounded-full p-2 hover:bg-card">
              <UserRound className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setCartOpen(true);
              }}
              aria-label={`${t("openCart")}, ${count} items`}
              className="relative rounded-full p-2 hover:bg-card"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M5 7h14l-1.5 12h-11z" strokeLinejoin="round" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-card lg:hidden"
              aria-expanded={menuOpen}
              aria-label={t("toggleMenu")}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex w-full items-center gap-2 border-b border-line px-4 py-3 text-left text-sm font-semibold sm:hidden"
            >
              <Search className="h-4 w-4" />
              {t("search")}
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block border-b border-line px-4 py-3.5 text-[15px] font-semibold"
              >
                {t(link.key)}
              </Link>
            ))}
            <Link href="/account" onClick={closeMenu} className="block border-b border-line px-4 py-3.5 text-[15px] font-semibold">
              {t("profile")}
            </Link>
            <div className="flex gap-2 px-4 py-3 xl:hidden">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${lang === "en" ? "bg-ink text-bg" : "border border-line"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${lang === "hi" ? "bg-ink text-bg" : "border border-line"}`}
              >
                हिन्दी
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
