"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/components/ShopProvider";
import { useInfiniteSlice } from "@/components/useInfiniteSlice";
import { sortProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/site";

const filters = [
  { slug: "all", key: "allProductsFilter", href: "/collections/all" },
  { slug: "men", key: "mensClothing", href: "/collections/men" },
  { slug: "women", key: "womensClothing", href: "/collections/women" },
];

export function CollectionView({ collection, products, count, from }) {
  const { t } = useShop();
  const [sort, setSort] = useState("featured");
  const ordered = useMemo(() => (sort === "featured" ? products : sortProducts(products, sort)), [products, sort]);
  const { shown, sentinel, hasMore } = useInfiniteSlice(ordered.length, 16, `${collection.slug}:${sort}`);
  const title = t(filters.find((item) => item.slug === collection.slug)?.key || "allProducts");

  return (
    <>
      <section className="relative overflow-hidden bg-night text-[#f3ece3]">
        <img src={collection.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f2b544]">{t("collectionKicker")}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-lg text-lg text-[#f3ece3]/75">{collection.blurb}</p>
          <p className="mt-4 text-sm font-semibold">
            {count} {t("stylesFrom")} {formatINR(from)}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-accent">{t("home")}</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-ink">{title}</span>
            </li>
          </ol>
        </nav>
        <div className="-mx-4 mt-6 mb-8 overflow-x-auto px-4">
          <div className="flex w-max gap-2">
            {filters.map((filter) => {
              const active = filter.slug === collection.slug;
              return (
                <Link
                  key={filter.slug}
                  href={filter.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? "border-ink bg-ink text-bg" : "border-line bg-card hover:border-ink/50"
                  }`}
                >
                  {t(filter.key)}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted">
            {count} {t("stylesFrom").split("·")[0].trim()}
          </p>
          <label className="flex items-center gap-2 text-sm font-medium text-muted">
            {t("sortBy")}
            <select
              aria-label={t("sortBy")}
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-line bg-card px-3 py-2 font-semibold text-ink focus:border-ink focus:outline-none"
            >
              <option value="featured">{t("featured")}</option>
              <option value="low">{t("low")}</option>
              <option value="high">{t("high")}</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.slice(0, shown).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm font-medium text-muted" aria-live="polite">
          {t("shownOf").replace("{shown}", String(shown)).replace("{total}", String(ordered.length))}
        </p>
        {hasMore && <div ref={sentinel} className="h-8" aria-hidden />}
      </div>
    </>
  );
}
