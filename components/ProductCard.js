"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useShop } from "@/components/ShopProvider";
import { formatINR } from "@/lib/site";

export function ProductCard({ product }) {
  const { t, addItem } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const single = product.sizes.length === 1;

  function add() {
    addItem(product.slug, size, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={add}
          aria-label={`Add ${product.name}, size ${size}, to cart`}
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-night shadow-lg transition hover:bg-accent hover:text-white sm:translate-y-2 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
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
        <span className="sr-only" aria-live="polite">
          {added ? t("added") : ""}
        </span>
      </div>
    </article>
  );
}
