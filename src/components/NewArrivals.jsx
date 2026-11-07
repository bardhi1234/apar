
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  BadgePercent,
  Tag,
} from "lucide-react";

import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function NewArrivals() {
  const {
    products: allProducts = [],
    loading,
  } = useProducts();

  // SHFAQ VETËM PRODUKTET ME ZBRITJE
  const discountedProducts = allProducts
    .filter((product) => {
      const price = Number(product.price);
      const oldPrice = Number(product.oldPrice);

      return (
        Number.isFinite(price) &&
        Number.isFinite(oldPrice) &&
        price >= 0 &&
        oldPrice > price
      );
    })
    .sort((a, b) => {
      const discountA =
        ((Number(a.oldPrice) - Number(a.price)) /
          Number(a.oldPrice)) *
        100;

      const discountB =
        ((Number(b.oldPrice) - Number(b.price)) /
          Number(b.oldPrice)) *
        100;

      return discountB - discountA;
    });

  // MAKSIMUMI 4 PRODUKTE
  const visibleProducts = discountedProducts.slice(0, 4);

  // NËSE NUK KA ZBRITJE, MOS SHFAQ SEKSIONIN
  if (!loading && visibleProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="zbritje"
      className="relative isolate overflow-hidden bg-[#0B0B0B] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FF7900]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#FF7900]/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

          <div className="max-w-[750px]">

            {/* SMALL TITLE */}
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#FF7900]/30 bg-[#FF7900]/10">
                <BadgePercent
                  size={19}
                  className="text-[#FF7900]"
                />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FF7900] sm:text-xs">
                PROTEINFITNESS OFFERS
              </span>
            </div>

            {/* MAIN TITLE */}
            <h2 className="text-[clamp(2.6rem,5.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.05em]">

              <span className="block text-white">
                ZBRITJE
              </span>

              <span className="block text-[#FF7900]">
                SPECIALE.
              </span>

            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl border-l-[3px] border-[#FF7900] pl-5 text-sm leading-7 text-neutral-400 sm:text-base">
              Zbulo produktet tona me çmime të reduktuara.
              Eksploro ofertat aktuale dhe zgjidh
              produktet që të përshtaten.
            </p>

          </div>

          {/* ALL PRODUCTS BUTTON */}
          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#FF7900]/60 pb-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-[#FF7900] hover:text-[#FF7900]"
          >
            SHIKO DYQANIN

            <ArrowUpRight
              size={19}
              className="text-[#FF7900] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-[#FF7900]/60 via-white/10 to-transparent" />

        {/* OFFER INFORMATION */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <Tag
              size={17}
              className="text-[#FF7900]"
            />

            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-300">
              PRODUKTET NË OFERTË
            </p>
          </div>

          {!loading && (
            <span className="rounded-full border border-[#FF7900]/25 bg-[#FF7900]/10 px-4 py-2 text-[10px] font-bold tracking-wide text-[#FF9A31]">
              {discountedProducts.length} PRODUKTE ME ZBRITJE
            </span>
          )}

        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div
            role="status"
            aria-label="Duke ngarkuar ofertat"
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#171717]"
              >
                <div className="aspect-[4/5] bg-white/10" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                  <div className="h-4 w-4/5 rounded bg-white/10" />
                  <div className="h-4 w-1/3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">

            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1.5 text-black transition-all duration-500 hover:-translate-y-1 hover:border-[#FF7900]/70 hover:shadow-[0_20px_55px_rgba(255,121,0,0.12)] sm:p-2"
              >

                {/* PRODUCT CARD */}
                <ProductCard product={product} />

              </div>
            ))}

          </div>
        )}

        {/* BOTTOM CTA */}
        {!loading && (
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#FF7900]/20 bg-gradient-to-r from-[#1C130C] via-[#141414] to-[#101010] px-6 py-7 sm:flex-row sm:items-center lg:px-9 lg:py-9">

            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF7900]/15">
                <BadgePercent
                  size={25}
                  className="text-[#FF7900]"
                />
              </span>

              <div>
                <h3 className="text-base font-black uppercase tracking-[-0.02em] text-white sm:text-lg">
                  ZBULO MË SHUMË PRODUKTE
                </h3>

                <p className="mt-1 text-xs leading-6 text-neutral-400 sm:text-sm">
                  Eksploro katalogun e plotë të ProteinFitness.
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="group inline-flex min-h-[52px] w-full shrink-0 items-center justify-center gap-3 rounded-lg bg-[#FF7900] px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-black transition-all duration-300 hover:bg-[#FFA03D] sm:w-auto"
            >
              SHIKO PRODUKTET

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}
