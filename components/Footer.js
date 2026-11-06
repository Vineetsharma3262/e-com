"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useShop } from "@/components/ShopProvider";
import { site } from "@/lib/site";

const shopLinks = [
  ["/collections/men", "mensClothing"],
  ["/collections/women", "womensClothing"],
  ["/collections/footwear", "footwear"],
  ["/collections/bags", "bags"],
  ["/collections/all", "allProducts"],
];

const helpLinks = [
  ["/about", "about"],
  ["/contact", "contactUs"],
  ["/terms#shipping", "shippingPolicy"],
  ["/terms#returns", "returnsPolicy"],
  ["/terms#cancellation", "cancellations"],
  ["/privacy", "privacy"],
  ["/terms", "terms"],
];

export function Footer() {
  const { t } = useShop();
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-10 bg-night text-[#e9e1d6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-8">
        <div>
          <span className="inline-block rounded-xl bg-white px-4 py-3">
            <span className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md border-2 border-dashed border-[#c4521c]/60 text-[9px] font-bold tracking-wider text-[#c4521c]">
                LOGO
              </span>
              <span className="font-serif text-xl font-semibold leading-none tracking-tight text-[#1b1714]">Your Brand</span>
            </span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#e9e1d6]/75">{t("footerBlurb")}</p>
          <div className="mt-5 flex gap-3">
            <a href={site.instagram} aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-[#e2672c] hover:text-[#e2672c]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={site.facebook} aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-[#e2672c] hover:text-[#e2672c]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2b544]">{t("shop")}</h4>
          <ul className="space-y-2.5 text-sm">
            {shopLinks.map(([href, key]) => (
              <li key={href}>
                <Link className="hover:text-[#f2b544]" href={href}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2b544]">{t("help")}</h4>
          <ul className="space-y-2.5 text-sm">
            {helpLinks.map(([href, key]) => (
              <li key={href}>
                <Link className="hover:text-[#f2b544]" href={href}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2b544]">{t("contact")}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[#e2672c]" />
              <span>
                <a href={`tel:${site.phoneTel}`} className="hover:text-[#f2b544]">{site.phoneDisplay}</a>
                <a href={`https://wa.me/${site.whatsapp}`} className="mt-1 block hover:text-[#f2b544]">{t("chatWa")}</a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#e2672c]" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-[#f2b544]">{site.email}</a>
            </li>
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-[#e2672c]" />
              <span>
                {site.addressLines[0]}
                <br />
                {site.addressLines[1]}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-12 text-center">
        <h4 className="px-4 font-serif text-2xl font-semibold text-white">{t("newsletter")}</h4>
        {done ? (
          <p className="mt-5 text-sm font-semibold text-[#f2b544]">{t("subscribed")}</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setDone(true);
            }}
            className="mx-auto mt-5 flex max-w-sm items-center rounded-full border border-white/30 bg-white/5 pl-5 pr-2 focus-within:border-[#e2672c]"
          >
            <label htmlFor="footer-email" className="sr-only">{t("email")}</label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder={t("email")}
              className="min-w-0 flex-1 bg-transparent py-3 text-white placeholder:text-white/60 focus:outline-none"
            />
            <button type="submit" aria-label={t("subscribe")} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[#e9e1d6]/60 sm:flex-row lg:px-8">
          <p>{t("rights")}</p>
          <p>{t("payments")}</p>
        </div>
      </div>
    </footer>
  );
}
