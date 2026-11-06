"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ChevronRight, CreditCard, Phone, Plus, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/components/ShopProvider";
import { formatINR, site } from "@/lib/site";

const trust = [
  [Truck, "trust1"],
  [RotateCcw, "trust2"],
  [CreditCard, "trust3"],
  [BadgeCheck, "trust4"],
];

export function ProductView({ product, related }) {
  const { t, addItem, setCartOpen } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const detailsRef = useRef(null);
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = true;
  }, [product.slug]);
  const single = product.sizes.length === 1;
  const categoryKey = {
    men: "mensClothing",
    women: "womensClothing",
    footwear: "footwear",
    bags: "bags",
  }[product.category];
  const categoryTitle = t(categoryKey);
  const panels = [
    { id: "details", label: t("details"), items: product.details },
    { id: "delivery", label: t("delivery"), items: product.delivery },
    { id: "care", label: t("care"), items: product.care },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-accent">{t("home")}</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/collections/${product.category}`} className="hover:text-accent">{categoryTitle}</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-ink">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-bg-alt">
              <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{categoryTitle}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-5 flex flex-wrap items-baseline gap-2">
              <span className="font-serif text-3xl font-semibold">{formatINR(product.price)}</span>
              <span className="text-sm text-muted">{t("inclTax")}</span>
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">{product.description}</p>
            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t("size")}: {size === "One size" ? t("oneSize") : size}
                </p>
                <Link href="/contact" className="text-sm font-semibold text-accent underline underline-offset-2">
                  {t("sizeHelp")}
                </Link>
              </div>
              {!single && (
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={t("size")}>
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={size === option}
                      onClick={() => setSize(option)}
                      className={`min-w-12 rounded-lg border px-3 py-2 font-semibold transition ${
                        size === option ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  addItem(product.slug, size, 1);
                  setCartOpen(true);
                }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-white transition hover:bg-accent-hover"
              >
                <ShoppingBag className="h-5 w-5" />
                {t("addToCart")}
              </button>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 font-semibold transition hover:border-ink hover:bg-ink hover:text-bg"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z" />
                  </svg>
                  {t("enquire")}
                </Link>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 font-semibold transition hover:border-ink hover:bg-ink hover:text-bg"
                >
                  <Phone className="h-4 w-4" />
                  {t("callOrder")}
                </a>
              </div>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-2.5">
              {trust.map(([Icon, key]) => (
                <li key={key} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {panels.map((panel) => (
                <details key={panel.id} ref={panel.id === "details" ? detailsRef : undefined} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                    {panel.label}
                    <Plus className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45" />
                  </summary>
                  <ul className="list-disc space-y-1.5 pb-5 pl-5 leading-relaxed text-muted">
                    {panel.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-line bg-bg-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
              {t("more")} {categoryTitle.toLowerCase()}
            </p>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{t("also")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
