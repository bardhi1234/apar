
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  ShoppingBag,
  Star,
} from "lucide-react";

import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function BestSellers() {
  const {
    products: allProducts = [],
    loading = false,
  } = useProducts();

  // =====================================
  // FILTER BESTSELLER PRODUCTS
  // =====================================

  const bestSellers = (
    Array.isArray(allProducts) ? allProducts : []
  )
    .filter((product) => {
      const badge = String(
        product.badge || ""
      )
        .trim()
        .replace(/[\s_-]+/g, "")
        .toUpperCase();

      return badge === "BESTSELLER";
    })
    .slice(0, 4);

  // HIDE SECTION WHEN NO PRODUCTS
  if (!loading && bestSellers.length === 0) {
    return null;
  }

  return (
    <section
      id="best-sellers"
      className="relative isolate overflow-hidden bg-[#0A0A0A] py-20 text-white sm:py-24 lg:py-32"
    >
      {/* ===================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ===================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-48 top-0 h-[550px] w-[550px] rounded-full bg-[#FF7900]/[0.05] blur-[150px]" />

        <div className="absolute -right-48 bottom-0 h-[550px] w-[550px] rounded-full bg-[#FF7900]/[0.04] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

      </div>

      {/* ===================================== */}
      {/* MAIN CONTAINER */}
      {/* ===================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        {/* ===================================== */}
        {/* SECTION HEADER */}
        {/* ===================================== */}

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

          <div className="max-w-[800px]">

            {/* EYEBROW */}
            <div className="mb-6 flex items-center gap-3">

              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF7900]/30 bg-[#FF7900]/10">

                <Flame
                  size={20}
                  strokeWidth={1.8}
                  className="text-[#FF7900]"
                />

              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#FF7900] sm:text-xs">
                PROTEINFITNESS BESTSELLERS
              </span>

            </div>

            {/* HEADING */}
            <h2 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.055em]">

              <span className="block text-white">
                MË TË
              </span>

              <span className="block text-[#FF7900]">
                KËRKUARAT.
              </span>

            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl border-l-[3px] border-[#FF7900] pl-5 text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">

              Eksploro produktet e përzgjedhura
              të ProteinFitness. Zbulo proteinat,
              kreatinën dhe suplementet sportive
              që kemi veçuar për ty.

            </p>

          </div>

          {/* DESKTOP BUTTON */}
          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#FF7900]/60 pb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-[#FF7900] hover:text-[#FF7900]"
          >

            SHIKO TË GJITHA PRODUKTET

            <ArrowUpRight
              size={19}
              className="text-[#FF7900] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />

          </Link>

        </div>

        {/* ===================================== */}
        {/* SECTION DIVIDER */}
        {/* ===================================== */}

        <div className="my-10 h-px w-full bg-gradient-to-r from-[#FF7900]/70 via-white/10 to-transparent" />

        {/* ===================================== */}
        {/* PRODUCT COUNT */}
        {/* ===================================== */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <Star
              size={17}
              strokeWidth={1.8}
              className="text-[#FF7900]"
            />

            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-neutral-300">
              PRODUKTET E ZGJEDHURA
            </p>

          </div>

          {!loading && (
            <span className="rounded-full border border-[#FF7900]/25 bg-[#FF7900]/10 px-4 py-2 text-[10px] font-bold tracking-[0.08em] text-[#FF9A31]">
              {bestSellers.length} PRODUKTE
            </span>
          )}

        </div>

        {/* ===================================== */}
        {/* PRODUCTS GRID */}
        {/* ===================================== */}

        {loading ? (
          <div
            role="status"
            aria-label="Duke ngarkuar produktet"
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >

            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#171717]"
                >

                  <div className="aspect-[4/5] bg-white/5" />

                  <div className="space-y-3 p-4">

                    <div className="h-3 w-1/2 rounded bg-white/10" />

                    <div className="h-5 w-4/5 rounded bg-white/10" />

                    <div className="h-4 w-1/3 rounded bg-white/10" />

                    <div className="h-10 rounded-lg bg-[#FF7900]/10" />

                  </div>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">

            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="min-w-0"
              >

                <ProductCard product={product} />

              </div>
            ))}

          </div>
        )}

        {/* ===================================== */}
        {/* BOTTOM CTA */}
        {/* ===================================== */}

        {!loading && (
          <div className="mt-14 overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-gradient-to-r from-[#1D140D] via-[#151515] to-[#101010]">

            <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center lg:px-9 lg:py-10">

              {/* LEFT CONTENT */}
              <div className="flex items-center gap-4">

                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10">

                  <ShoppingBag
                    size={25}
                    strokeWidth={1.7}
                    className="text-[#FF7900]"
                  />

                </span>

                <div>

                  <h3 className="text-base font-black uppercase tracking-[-0.02em] text-white sm:text-lg">
                    ZBULO PROTEINFITNESS
                  </h3>

                  <p className="mt-2 max-w-lg text-xs leading-6 text-neutral-400 sm:text-sm">

                    Shfleto katalogun tonë dhe
                    eksploro produktet sportive
                    të disponueshme.

                  </p>

                </div>

              </div>

              {/* CTA */}
              <Link
                to="/shop"
                className="group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-3 rounded-lg bg-[#FF7900] px-7 text-xs font-extrabold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFA03D] sm:w-auto"
              >

                EKSPLORO DYQANIN

                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </Link>

            </div>

            {/* BOTTOM ORANGE LINE */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF7900]/60 to-transparent" />

          </div>
        )}

      </div>

    </section>
  );
}
