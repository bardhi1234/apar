import {
  ArrowUpRight,
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useWishlist,
} from "../context/WishlistContext";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

export default function ProductCard({
  product,
}) {
  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const favorite =
    isInWishlist(product.id);

  const getNumber = (value) => {
    if (typeof value === "number") {
      return value;
    }

    if (!value) return null;

    const cleaned = String(value)
      .replace(",", ".")
      .replace(/[^0-9.-]/g, "");

    const number = Number(cleaned);

    return Number.isFinite(number)
      ? number
      : null;
  };

  const priceNumber =
    getNumber(product.price);

  const oldPriceNumber =
    getNumber(product.oldPrice);

  const formatPrice = (
    value,
    fallback
  ) => {
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return `${value.toFixed(2)} €`;
    }

    return fallback || "";
  };

  const displayPrice =
    formatPrice(
      priceNumber,
      product.price
    );

  const displayOldPrice =
    oldPriceNumber !== null
      ? formatPrice(
          oldPriceNumber,
          product.oldPrice
        )
      : null;

  const discountPercent =
    priceNumber !== null &&
    oldPriceNumber !== null &&
    oldPriceNumber > priceNumber
      ? Math.round(
          ((oldPriceNumber -
            priceNumber) /
            oldPriceNumber) *
            100
        )
      : null;

  const secondImage =
    product.images?.length > 1
      ? product.images[1]
      : null;

  const imageCount =
    product.images?.length || 1;

  const hasStock =
    product.stock !== undefined &&
    product.stock !== null;

  const isOutOfStock =
    hasStock &&
    Number(product.stock) <= 0;

  const lowStock =
    hasStock &&
    !isOutOfStock &&
    Number(product.stock) <= 5;

  const productCode =
    `APAR-${String(
      product.id
    ).padStart(3, "0")}`;

  const handleWishlist = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product.id);
  };

  return (
    <article className="group relative">

      {/* ===================================== */}
      {/* LUXURY CARD */}
      {/* ===================================== */}

      <div className="relative bg-white">

        {/* VERY SUBTLE OUTER SHADOW */}
        <div className="pointer-events-none absolute -inset-[1px] z-0 border border-black/[0.07] transition-all duration-700 group-hover:border-black/[0.14] group-hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)]" />

        {/* IMAGE */}
        <div className="relative z-10 overflow-hidden bg-[#eeeeec]">

          <Link
            to={`/product/${product.id}`}
            className="relative block aspect-[4/5] overflow-hidden"
            aria-label={`Shiko ${product.name}`}
          >

            {/* ============================= */}
            {/* MAIN IMAGE */}
            {/* ============================= */}

            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out ${
                secondImage
                  ? "scale-[1.015] group-hover:scale-[1.04] group-hover:opacity-0"
                  : "scale-[1.015] group-hover:scale-[1.055]"
              }`}
            />

            {/* ============================= */}
            {/* SECOND IMAGE */}
            {/* ============================= */}

            {secondImage && (
              <img
                src={secondImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-[1.065] object-cover opacity-0 transition-all duration-[1100ms] ease-out group-hover:scale-[1.015] group-hover:opacity-100"
              />
            )}

            {/* ============================= */}
            {/* CINEMATIC OVERLAYS */}
            {/* ============================= */}

            <div className="pointer-events-none absolute inset-0 bg-black/[0.02] transition duration-700 group-hover:bg-black/[0.05]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%] bg-gradient-to-b from-black/30 via-black/[0.07] to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-700 group-hover:h-[55%] group-hover:from-black/95 group-hover:via-black/50" />

            {/* DARK SIDE VIGNETTE */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/[0.08] via-transparent to-black/[0.04]" />

            {/* ============================= */}
            {/* PREMIUM LIGHT SHEEN */}
            {/* ============================= */}

            <div className="pointer-events-none absolute -left-[80%] top-0 h-full w-[45%] rotate-[12deg] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent opacity-0 blur-md transition-all duration-[1200ms] group-hover:left-[140%] group-hover:opacity-100" />

            {/* ============================= */}
            {/* GIANT LOGO WATERMARK */}
            {/* ============================= */}

            <img
              src={APAR_LOGO}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[17%] left-1/2 w-[72%] -translate-x-1/2 object-contain opacity-[0.045] mix-blend-screen transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-[0.075]"
            />

            {/* ============================= */}
            {/* MICRO BRAND — TOP CENTER */}
            {/* ============================= */}

            <div className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 items-center gap-2 lg:flex">

              <span className="h-px w-5 bg-white/25" />

              <span className="whitespace-nowrap text-[7px] font-black tracking-[0.38em] text-white/45">
                APAR COLLECTION
              </span>

              <span className="h-px w-5 bg-white/25" />

            </div>

            {/* ============================= */}
            {/* BOTTOM BRANDING */}
            {/* ============================= */}

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-5 sm:right-5">

              <div className="flex items-end justify-between gap-4">

                <div>

                  {/* SMALL APAR LOGO */}
                  <img
                    src={APAR_LOGO}
                    alt="APAR"
                    className="w-[82px] object-contain opacity-100 mix-blend-screen sm:w-[100px]"
                  />

                  {/* TAGLINE */}
                  <div className="mt-2 flex items-center gap-2">

                    <div className="flex">
                      <span className="h-[2px] w-3 bg-[#009246]" />
                      <span className="h-[2px] w-3 bg-white/80" />
                      <span className="h-[2px] w-3 bg-[#CE2B37]" />
                    </div>

                    <p className="hidden text-[7px] font-bold tracking-[0.3em] text-white/55 sm:block">
                      WEAR YOUR STORY
                    </p>

                  </div>

                </div>

                {/* PRODUCT NUMBER */}
                <div className="text-right">

                  <p className="text-[7px] font-semibold tracking-[0.28em] text-white/40">
                    {productCode}
                  </p>

                  <p className="mt-1 text-[8px] font-black tracking-[0.18em] text-white/75">
                    {String(
                      product.id
                    ).padStart(2, "0")}
                  </p>

                </div>

              </div>

            </div>

            {/* ============================= */}
            {/* PREMIUM HOVER CTA */}
            {/* ============================= */}

            <div className="pointer-events-none absolute bottom-[78px] left-4 right-4 z-30 hidden translate-y-4 items-center justify-between border-t border-white/20 pt-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:left-5 sm:right-5 lg:flex">

              <span className="text-[9px] font-black tracking-[0.24em] text-white">
                VIEW PRODUCT
              </span>

              <div className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/[0.08] text-white backdrop-blur-md">
                <ArrowUpRight
                  size={15}
                />
              </div>

            </div>

          </Link>

          {/* ================================= */}
          {/* BADGES */}
          {/* ================================= */}

          <div className="pointer-events-none absolute left-3 top-3 z-30 flex flex-col items-start gap-1.5 sm:left-4 sm:top-4">

            {product.badge && (
              <span className="border border-white/10 bg-black/90 px-3 py-2 text-[8px] font-black tracking-[0.2em] text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}

            {discountPercent && (
              <span className="bg-[#CE2B37] px-3 py-2 text-[8px] font-black tracking-[0.2em] text-white shadow-[0_8px_30px_rgba(206,43,55,0.25)]">
                −{discountPercent}%
              </span>
            )}

            {isOutOfStock && (
              <span className="bg-[#111] px-3 py-2 text-[8px] font-black tracking-[0.18em] text-white">
                SOLD OUT
              </span>
            )}

          </div>

          {/* ================================= */}
          {/* WISHLIST GLASS BUTTON */}
          {/* ================================= */}

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              favorite
                ? "Largo nga Wishlist"
                : "Shto në Wishlist"
            }
            title={
              favorite
                ? "Largo nga Wishlist"
                : "Shto në Wishlist"
            }
            className={`absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center border transition-all duration-500 sm:right-4 sm:top-4 ${
              favorite
                ? "scale-[1.02] border-white/20 bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                : "border-white/25 bg-black/20 text-white backdrop-blur-xl hover:border-white hover:bg-white hover:text-black"
            }`}
          >
            <Heart
              size={17}
              strokeWidth={1.6}
              fill={
                favorite
                  ? "currentColor"
                  : "none"
              }
              className="transition duration-300"
            />
          </button>

          {/* ================================= */}
          {/* PHOTO COUNTER */}
          {/* ================================= */}

          {imageCount > 1 && (
            <div className="pointer-events-none absolute right-3 top-[62px] z-30 flex items-center gap-1.5 border border-white/10 bg-black/30 px-2.5 py-1.5 backdrop-blur-xl transition duration-500 sm:right-4 sm:top-[68px]">

              <span className="text-[8px] font-black text-white">
                {String(
                  imageCount
                ).padStart(2, "0")}
              </span>

              <span className="text-[7px] tracking-[0.2em] text-white/45">
                IMAGES
              </span>

            </div>
          )}

        </div>

        {/* ===================================== */}
        {/* PRODUCT INFO */}
        {/* ===================================== */}

        <div className="relative z-10 bg-white px-4 pb-5 pt-5 sm:px-5 sm:pb-6">

          {/* TOP META */}
          <div className="flex items-center justify-between gap-3">

            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">
              {product.category}
            </p>

            <span className="text-[8px] font-semibold tracking-[0.18em] text-neutral-300">
              {productCode}
            </span>

          </div>

          {/* PRODUCT NAME */}
          <Link
            to={`/product/${product.id}`}
            className="group/title mt-3 block"
          >
            <div className="flex items-start justify-between gap-5">

              <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-black leading-[1.35] tracking-[-0.02em] text-black transition duration-300 group-hover/title:text-neutral-600 sm:text-[16px]">
                {product.name}
              </h3>

              <ArrowUpRight
                size={15}
                className="mt-1 hidden flex-shrink-0 text-neutral-300 transition-all duration-300 group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-black sm:block"
              />

            </div>
          </Link>

          {/* DIVIDER */}
          <div className="my-4 h-px bg-neutral-100" />

          {/* PRICE + STOCK */}
          <div className="flex items-end justify-between gap-3">

            <div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                <span className="text-[17px] font-black tracking-[-0.03em] text-black sm:text-lg">
                  {displayPrice}
                </span>

                {displayOldPrice && (
                  <span className="text-xs font-medium text-neutral-400 line-through">
                    {displayOldPrice}
                  </span>
                )}

              </div>

              {discountPercent && (
                <p className="mt-1.5 text-[9px] font-bold tracking-[0.08em] text-[#CE2B37]">
                  SAVE {discountPercent}%
                </p>
              )}

            </div>

            {/* STOCK */}
            {hasStock && (
              <div className="flex items-center gap-2 pb-1">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOutOfStock
                      ? "bg-red-600"
                      : lowStock
                      ? "bg-amber-500"
                      : "bg-green-600"
                  }`}
                />

                <span
                  className={`text-[8px] font-bold tracking-[0.08em] ${
                    isOutOfStock
                      ? "text-red-600"
                      : lowStock
                      ? "text-amber-600"
                      : "text-neutral-400"
                  }`}
                >
                  {isOutOfStock
                    ? "SOLD OUT"
                    : lowStock
                    ? `ONLY ${product.stock}`
                    : "IN STOCK"}
                </span>

              </div>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <Link
            to={`/product/${product.id}`}
            className="mt-5 flex min-h-[46px] items-center justify-between border-t border-neutral-100 pt-4 text-black sm:hidden"
          >

            <span className="text-[9px] font-black tracking-[0.2em]">
              SHIKO PRODUKTIN
            </span>

            <ArrowUpRight
              size={15}
            />

          </Link>

        </div>

        {/* ===================================== */}
        {/* BOTTOM BRAND LINE */}
        {/* ===================================== */}

        <div className="relative z-10 flex h-[2px] w-full overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">

          <span className="flex-1 bg-[#009246]" />

          <span className="flex-1 bg-neutral-200" />

          <span className="flex-1 bg-[#CE2B37]" />

        </div>

      </div>

    </article>
  );
}