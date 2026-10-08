import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import { useProducts } from "../hooks/useProducts";

import {
  useWishlist,
} from "../context/WishlistContext";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

export default function Wishlist() {
  const { products } = useProducts();
  const {
    wishlist,
    clearWishlist,
  } = useWishlist();

  /*
    ========================================
    WISHLIST PRODUCTS
    ========================================
  */

  const wishlistProducts =
    products.filter(
      (product) =>
        wishlist.some(
          (id) =>
            String(id) ===
            String(product.id)
        )
    );

  const wishlistCount =
    wishlistProducts.length;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f6f6f4]">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <section className="relative overflow-hidden bg-[#050505] text-white">

          {/* PREMIUM BACKGROUND */}
          <div className="pointer-events-none absolute inset-0">

            <div className="absolute -left-40 top-0 h-[360px] w-[360px] rounded-full bg-[#009246]/[0.05] blur-[140px]" />

            <div className="absolute -right-40 top-0 h-[360px] w-[360px] rounded-full bg-[#CE2B37]/[0.05] blur-[140px]" />

            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black/30" />

          </div>

          <div className="relative mx-auto max-w-[1500px] px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">

            {/* TOP */}
            <div className="flex items-center justify-between gap-5">

              <img
                src={APAR_LOGO}
                alt="APAR"
                className="w-[105px] object-contain mix-blend-screen opacity-80 sm:w-[120px]"
              />

              {wishlistCount > 0 && (
                <div className="hidden items-center gap-3 sm:flex">

                  <span className="h-px w-8 bg-white/20" />

                  <p className="text-[8px] font-black tracking-[0.3em] text-neutral-500">
                    SAVED COLLECTION
                  </p>

                </div>
              )}

            </div>

            {/* TITLE */}
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <Heart
                    size={15}
                    strokeWidth={1.5}
                  />

                  <p className="text-[9px] font-black tracking-[0.42em] text-neutral-500">
                    APAR / WISHLIST
                  </p>

                </div>

                <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  WISHLIST
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400">
                  Ruaj produktet që të
                  pëlqejnë dhe kthehu tek
                  ato kur të jesh gati për
                  porosi.
                </p>

                {/* BRAND LINE */}
                <div className="mt-7 flex">

                  <span className="h-[2px] w-10 bg-[#009246]" />

                  <span className="h-[2px] w-10 bg-white/70" />

                  <span className="h-[2px] w-10 bg-[#CE2B37]" />

                </div>

              </div>

              {/* COUNT */}
              <div className="border-l border-white/10 pl-5 sm:text-right">

                <p className="text-[8px] font-black tracking-[0.3em] text-neutral-500">
                  SAVED ITEMS
                </p>

                <div className="mt-2 flex items-end gap-2 sm:justify-end">

                  <span className="text-4xl font-black tracking-[-0.05em]">
                    {String(
                      wishlistCount
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="pb-1 text-[9px] font-bold tracking-[0.15em] text-neutral-500">
                    ITEMS
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-6 lg:px-10 lg:py-14">

          {wishlistCount > 0 ? (
            <>
              {/* ============================= */}
              {/* TOOLBAR */}
              {/* ============================= */}

              <div className="mb-8 flex flex-col gap-5 border border-neutral-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center bg-black text-white">

                    <Heart
                      size={17}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />

                  </div>

                  <div>

                    <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
                      YOUR SELECTION
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {wishlistCount}{" "}
                      {wishlistCount === 1
                        ? "produkt i ruajtur"
                        : "produkte të ruajtura"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Link
                    to="/shop"
                    className="hidden min-h-[42px] items-center gap-2 border border-neutral-300 px-4 text-[9px] font-black tracking-[0.12em] text-black transition hover:border-black sm:flex"
                  >
                    VAZHDO SHOPPING

                    <ArrowRight
                      size={13}
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={
                      clearWishlist
                    }
                    className="flex min-h-[42px] items-center gap-2 border border-neutral-200 px-4 text-[9px] font-black tracking-[0.12em] text-neutral-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2
                      size={14}
                    />

                    PASTRO WISHLIST
                  </button>

                </div>

              </div>

              {/* ============================= */}
              {/* PRODUCTS */}
              {/* ============================= */}

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">

                {wishlistProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}

              </div>

              {/* ============================= */}
              {/* BOTTOM CTA */}
              {/* ============================= */}

              <div className="mt-14 border-t border-neutral-200 pt-8">

                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
                      APAR COLLECTION
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em]">
                      Zbulo më shumë.
                    </h2>

                  </div>

                  <Link
                    to="/shop"
                    style={{
                      color:
                        "#ffffff",
                    }}
                    className="group flex min-h-[54px] items-center justify-between gap-10 bg-black px-6 text-[10px] font-black tracking-[0.12em] text-white transition hover:bg-neutral-800"
                  >
                    <span
                      style={{
                        color:
                          "#ffffff",
                      }}
                    >
                      SHOP COLLECTION
                    </span>

                    <ArrowRight
                      size={15}
                      style={{
                        color:
                          "#ffffff",
                      }}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                </div>

              </div>

            </>
          ) : (
            /* ================================= */
            /* EMPTY STATE */
            /* ================================= */

            <div className="flex min-h-[600px] flex-col items-center justify-center px-5 py-20 text-center">

              <div className="relative">

                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">

                  <Heart
                    size={34}
                    strokeWidth={1.2}
                    className="text-neutral-300"
                  />

                </div>

                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-4 border-[#f6f6f4] bg-[#CE2B37]" />

              </div>

              <div className="mt-8 flex">

                <span className="h-[2px] w-7 bg-[#009246]" />

                <span className="h-[2px] w-7 bg-neutral-300" />

                <span className="h-[2px] w-7 bg-[#CE2B37]" />

              </div>

              <p className="mt-7 text-[9px] font-black tracking-[0.4em] text-neutral-400">
                APAR / WISHLIST
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                Wishlist është bosh.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-500">
                Kliko zemrën te produktet
                që të pëlqejnë dhe ato do
                të ruhen këtu automatikisht.
              </p>

              <Link
                to="/shop"
                style={{
                  color:
                    "#ffffff",
                }}
                className="group mt-8 flex min-h-[58px] min-w-[245px] items-center justify-between bg-black px-6 text-[10px] font-black tracking-[0.12em] text-white transition hover:bg-neutral-800"
              >
                <span
                  style={{
                    color:
                      "#ffffff",
                  }}
                >
                  ZBULO PRODUKTET
                </span>

                <ArrowRight
                  size={16}
                  style={{
                    color:
                      "#ffffff",
                  }}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* TRUST */}
              <div className="mt-10 flex items-center gap-4 text-neutral-400">

                <ShoppingBag
                  size={14}
                />

                <span className="text-[9px] font-semibold tracking-[0.14em]">
                  SHOP · SAVE · ORDER
                </span>

              </div>

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}