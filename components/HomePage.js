"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, RotateCcw, Sparkles, Truck, Wallet } from "lucide-react";
import { FaqList } from "@/components/FaqList";
import { ShopGrid } from "@/components/ShopGrid";
import { useShop } from "@/components/ShopProvider";
import { collectionStats, collections, spotlight } from "@/lib/catalog";
import { formatINR, site } from "@/lib/site";

const ticker = [
  "NEW SEASON EDIT",
  "नया कलेक्शन",
  "FREE SHIPPING OVER ₹299",
  "EASY 7-DAY RETURNS",
  "CASH ON DELIVERY",
  "पूरे भारत में डिलीवरी",
  "TEES · SHIRTS · SUITS",
];

export function HomePage() {
  const { t, addItem, setCartOpen } = useShop();

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--saffron)_18%,transparent),transparent_55%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {t("heroBadge")}
            </p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.02] sm:text-6xl xl:text-7xl">
              {t("heroBefore")}
              <span className="italic text-accent">{t("heroEm")}</span>
              {t("heroAfter")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t("heroBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/women" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover">
                {t("shopWomen")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections/men" className="inline-flex items-center rounded-full border border-ink/25 px-6 py-3 font-semibold transition hover:border-ink hover:bg-ink hover:text-bg">
                {t("shopMen")}
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                [t("stat30"), t("stat30l")],
                [t("statPrice"), t("statPricel")],
                [t("statIndia"), t("statIndial")],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-2xl font-semibold sm:text-3xl">{value}</dt>
                  <dd className="mt-1 text-sm text-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto grid w-full max-w-[34rem] grid-cols-[1.15fr_1fr] gap-4">
            <div className="relative aspect-[4/5.4] overflow-hidden rounded-t-full rounded-b-3xl">
              <img src="/images/hero-women.jpg" alt="Woman in a fitted ivory dress and sun hat" className="h-full w-full object-cover" />
            </div>
            <div className="relative mt-16 aspect-[4/5.4] overflow-hidden rounded-3xl">
              <img src="/images/hero-men.jpg" alt="Man in a navy blazer and white shirt" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -top-4 right-0 sm:-right-4">
              <div className="relative grid h-28 w-28 place-items-center rounded-full bg-night shadow-2xl">
                <svg viewBox="0 0 120 120" className="absolute h-full w-full animate-spin-slow" aria-hidden>
                  <defs>
                    <path id="badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
                  </defs>
                  <text fill="#f2b544" fontSize="10.5" fontWeight="700" letterSpacing="2.6">
                    <textPath href="#badge-circle">NEW SEASON · AURELLE ·</textPath>
                  </text>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#e2672c]" fill="currentColor" aria-hidden>
                  <path d="M3 17h18a9 9 0 0 0-18 0z" />
                  <path d="M12 2.5v3.5M4.6 6.1l2.4 2.4M19.4 6.1 17 8.5M1.5 12.5h3M19.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M2 20h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="absolute -left-2 bottom-6 flex items-center gap-3 rounded-2xl border border-line bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-8">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent">
                <Truck className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-bold">{t("cardFree")}</span>
                <span className="block text-sm text-muted">{t("cardFreeSub")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-line bg-bg-alt">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-4 text-sm lg:grid-cols-4 lg:px-8">
          {[
            [Truck, "Free shipping", "over ₹299"],
            [RotateCcw, "7-day", "easy returns"],
            [Wallet, "Cash on delivery", "& UPI"],
            [BadgeCheck, "Quality checked", "before dispatch"],
          ].map(([Icon, strong, rest]) => (
            <li key={strong} className="flex items-center justify-center gap-2">
              <Icon className="h-4 w-4 shrink-0" />
              <span>
                <b className="font-bold">{strong}</b> <span className="text-muted">{rest}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t("shopBy")}</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{t("findFit")}</h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {collections.map((collection) => {
            const stats = collectionStats(collection.slug);
            const title = t(collection.slug === "men" ? "mensClothing" : collection.slug === "women" ? "womensClothing" : collection.slug);
            return (
              <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                <img src={collection.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <h3 className="font-serif text-xl font-semibold sm:text-2xl">{title}</h3>
                  <p className="mt-0.5 hidden text-sm text-white/80 sm:block">{collection.blurb}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
                    {stats.count} {t("stylesFrom")} {formatINR(stats.from)}
                    <ArrowRight className="h-4 w-4" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <div className="relative grid overflow-hidden rounded-3xl border border-line bg-card md:grid-cols-2">
          <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-accent via-saffron to-accent" />
          <div className="relative min-h-[26rem]">
            <img src={spotlight.image} alt={spotlight.name} className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
          <div className="p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{t("spotlightKicker")}</p>
            <h2 className="mt-2 font-serif text-4xl font-semibold">{spotlight.name}</h2>
            <p className="mt-4 leading-relaxed text-muted">{t("spotlightBody")}</p>
            <p className="mt-5 flex flex-wrap items-baseline gap-2">
              <span className="font-serif text-3xl font-semibold">{formatINR(spotlight.price)}</span>
              <span className="text-sm text-muted">{t("inclTax")}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  addItem(spotlight.slug, spotlight.sizes[0], 1);
                  setCartOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
              >
                {t("addToCart")}
              </button>
              <Link href={`/products/${spotlight.slug}`} className="inline-flex items-center rounded-full border border-ink/25 px-6 py-3 font-semibold transition hover:border-ink hover:bg-ink hover:text-bg">
                {t("viewDetails")}
              </Link>
            </div>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[t("perk1"), t("perk2"), t("perk3"), t("perk4")].map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 text-accent">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-night py-3.5 text-[#f3ece3]">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {[...ticker, ...ticker].map((item, index) => (
                <li key={`${copy}-${item}-${index}`} className="flex items-center gap-6 px-3 text-sm font-bold uppercase tracking-[0.14em]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#e2672c]" fill="currentColor" aria-hidden>
                    <path d="M3 17h18a9 9 0 0 0-18 0z" />
                    <path d="M12 2.5v3.5M4.6 6.1l2.4 2.4M19.4 6.1 17 8.5M1.5 12.5h3M19.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M2 20h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section id="shop" className="relative py-20">
        <span id="men" className="absolute top-0" aria-hidden />
        <span id="women" className="absolute top-0" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ShopGrid />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="relative grid overflow-hidden rounded-3xl bg-night text-[#f3ece3] md:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f2b544]">{t("occasionKicker")}</p>
            <p className="mt-4 font-serif text-5xl font-semibold leading-[1] sm:text-6xl">
              {t("occasionTitle").split(". ")[0]}.
              <br />
              <span className="italic text-[#e2672c]">{t("occasionTitle").split(". ")[1]}</span>
            </p>
            <p className="mt-5 max-w-sm text-[#f3ece3]/75">{t("occasionBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/women" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover">
                {t("shopEdit")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections/men" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white hover:text-night">
                {t("shopMen")}
              </Link>
            </div>
          </div>
          <div className="relative min-h-96">
            <img src="/images/editorial.jpg" alt="Model in a flowing floral gown" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-night to-transparent md:block" />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t("whyKicker")}</p>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{t("whyTitle")}</h2>
            <p className="mt-4 text-[17px] text-muted">{t("whyBody")}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["/images/rack.jpg", "A rail of neutral-toned clothes", "why1k", "why1t", "why1b"],
              ["/images/atelier.jpg", "Blouses and shirts on wooden hangers", "why2k", "why2t", "why2b"],
              ["/images/store.jpg", "Inside a menswear store", "why3k", "why3t", "why3b"],
            ].map(([src, alt, k, title, body]) => (
              <article key={k} className="group overflow-hidden rounded-2xl border border-line bg-card">
                <div className="relative aspect-[16/10] overflow-hidden [&_img]:transition [&_img]:duration-700 group-hover:[&_img]:scale-105">
                  <img src={src} alt={alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{t(k)}</p>
                  <h3 className="mt-1 font-serif text-xl font-semibold">{t(title)}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{t(body)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t("faqKicker")}</p>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{t("faqTitle")}</h2>
          </div>
          <FaqList />
          <p className="mt-6 text-center text-sm text-muted">
            {t("faqStill")}{" "}
            <a className="font-semibold text-accent underline underline-offset-2" href={`tel:${site.phoneTel}`}>
              {site.phoneDisplay}
            </a>{" "}
            {t("faqOr")}{" "}
            <a className="font-semibold text-accent underline underline-offset-2" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
