"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/components/ShopProvider";
import { saveCheckout } from "@/lib/checkout";
import { formatINR } from "@/lib/site";

export function ProductCard({ product }) {
  const { t, addItem } = useShop();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const single = product.sizes.length === 1;

  function add() {
    addItem(product.slug, size, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  function buy() {
    saveCheckout({ source: "buy", lines: [{ slug: product.slug, size, qty: 1 }] });
    router.push("/checkout");
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {product.pieces > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-night">
            {product.pieces === 3 ? t("piece3") : t("piece2")}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="text-[15px] font-semibold leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold">{formatINR(product.price)}</span>
        </p>
        {single ? (
          <p className="mt-2.5 text-xs text-muted">{size === "One size" ? t("oneSize") : size}</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${t("size")} for ${product.name}`}>
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={size === option}
                onClick={() => setSize(option)}
                className={`min-w-9 rounded-md border px-2 py-1 text-xs font-semibold transition ${
                  size === option ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={add}
            className="rounded-full border border-ink/20 px-2 py-2 text-[12px] font-semibold transition hover:border-ink sm:text-sm"
          >
            {t("addToCart")}
          </button>
          <button
            type="button"
            onClick={buy}
            className="rounded-full bg-ink px-2 py-2 text-[12px] font-semibold text-bg transition hover:bg-accent hover:text-white sm:text-sm"
          >
            {t("buyNow")}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {added ? t("added") : ""}
        </span>
      </div>
    </article>
  );
}
