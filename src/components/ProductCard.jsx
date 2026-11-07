
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  Heart,
  ImageOff,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// LOGO ORIGJINALE PROTEINFITNESS
const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

// KONVERTIMI I ÇMIMEVE
function toPrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0
      ? value
      : null;
  }

  const cleaned = String(value)
    .trim()
    .replace(/\s|€/g, "");

  const normalized =
    cleaned.includes(",") && cleaned.includes(".")
      ? cleaned.lastIndexOf(",") >
        cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "")
      : cleaned.replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

// FORMATIMI I ÇMIMIT NË EURO
const euro = (value) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);

// MERR URL E FOTOGRAFISË
function imageUrl(image) {
  if (typeof image === "string") {
    return image;
  }

  if (image && typeof image === "object") {
    return (
      image.url ||
      image.secure_url ||
      image.image_url ||
      ""
    );
  }

  return "";
}

export default function ProductCard({ product }) {
  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [imageError, setImageError] = useState(false);

  if (!product || product.id == null) {
    return null;
  }

  // WISHLIST
  const favorite = isInWishlist(product.id);

  // ÇMIMET
  const price = toPrice(product.price);

  const oldPrice = toPrice(
    product.oldPrice ?? product.old_price
  );

  // KONTROLLI I ZBRITJES
  const discounted =
    price !== null &&
    oldPrice !== null &&
    oldPrice > price;

  const discountPercent = discounted
    ? Math.round(
        ((oldPrice - price) / oldPrice) * 100
      )
    : 0;

  // FOTOGRAFITË
  const allImages = [
    product.image,
    ...(Array.isArray(product.images)
      ? product.images
      : []),
  ]
    .map(imageUrl)
    .filter(Boolean);

  const images = [...new Set(allImages)];

  const mainImage = images[0] || null;
  const secondImage = images[1] || null;

  // KONTROLLI I STOKUT
  const stock =
    product.stock === null ||
    product.stock === undefined ||
    product.stock === ""
      ? null
      : Number(product.stock);

  const hasStockInfo =
    stock !== null && Number.isFinite(stock);

  const outOfStock =
    hasStockInfo && stock <= 0;

  const lowStock =
    hasStockInfo && stock > 0 && stock <= 5;

  const canBuy = price !== null && !outOfStock;

  // VARIANTET
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : [];

  const colors = Array.isArray(product.colors)
    ? product.colors
    : [];

  const needsSelection =
    sizes.length > 1 || colors.length > 1;

  // KATEGORIA
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "SUPLEMENTE";

  const productLink = `/product/${encodeURIComponent(
    product.id
  )}`;

  const productCode = `PF-${String(
    product.id
  ).padStart(3, "0")}`;

  // SHTO NË SHPORTË
  function handleAddToCart() {
    if (!canBuy || needsSelection) {
      return;
    }

    addToCart(
      {
        ...product,
        price,
        image: mainImage || product.image || "",
      },
      {
        quantity: 1,
        size: sizes[0] ?? null,
        color: colors[0] ?? null,
      }
    );
  }

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] text-white shadow-[0_12px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FF7900]/65 hover:shadow-[0_22px_65px_rgba(255,121,0,0.10)] motion-reduce:transform-none">

      {/* ================================= */}
      {/* PRODUCT IMAGE */}
      {/* ================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#292929] via-[#1B1B1B] to-[#101010]">

        <Link
          to={productLink}
          aria-label={`Shiko produktin ${product.name}`}
          className="relative block aspect-[4/5] overflow-hidden"
        >

          {mainImage && !imageError ? (
            <>
              {/* MAIN IMAGE */}
              <img
                src={mainImage}
                alt={
                  product.name ||
                  "Produkt ProteinFitness"
                }
                loading="lazy"
                onError={() => setImageError(true)}
                className={`absolute inset-0 h-full w-full object-contain p-5 transition-all duration-700 motion-reduce:transition-none sm:p-7 ${
                  secondImage
                    ? "group-hover:scale-105 group-hover:opacity-0"
                    : "group-hover:scale-105"
                }`}
              />

              {/* SECOND IMAGE ON HOVER */}
              {secondImage && (
                <img
                  src={secondImage}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-105 object-contain p-5 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none sm:p-7"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-500">
              <ImageOff
                size={35}
                strokeWidth={1.5}
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Foto në përgatitje
              </span>
            </div>
          )}

          {/* PROTEINFITNESS WATERMARK */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <img
              src={LOGO}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-10 w-28 object-contain opacity-40 sm:h-12 sm:w-36"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

        </Link>

        {/* ================================= */}
        {/* PRODUCT BADGES */}
        {/* ================================= */}

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[65%] flex-col items-start gap-2">

          {/* DISCOUNT */}
          {discounted && (
            <span className="rounded-md bg-[#FF7900] px-2.5 py-1.5 text-[10px] font-black tracking-wide text-black sm:px-3 sm:text-xs">
              −{discountPercent}% ZBRITJE
            </span>
          )}

          {/* CUSTOM BADGE */}
          {product.badge && (
            <span className="max-w-full truncate rounded-md border border-white/15 bg-black/80 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}

          {/* OUT OF STOCK */}
          {outOfStock && (
            <span className="rounded-md bg-black/90 px-2.5 py-1.5 text-[9px] font-black text-white">
              PA STOK
            </span>
          )}

        </div>

        {/* ================================= */}
        {/* WISHLIST BUTTON */}
        {/* ================================= */}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            favorite
              ? "Largo nga të preferuarat"
              : "Shto te të preferuarat"
          }
          aria-pressed={favorite}
          title={
            favorite
              ? "Largo nga të preferuarat"
              : "Shto te të preferuarat"
          }
          className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7900] ${
            favorite
              ? "border-[#FF7900] bg-[#FF7900] text-black"
              : "border-white/20 bg-black/50 text-white hover:border-[#FF7900] hover:text-[#FF7900]"
          }`}
        >
          <Heart
            size={18}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>

      </div>

      {/* ================================= */}
      {/* PRODUCT INFORMATION */}
      {/* ================================= */}

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4 sm:px-5 sm:pb-5 sm:pt-5">

        {/* CATEGORY & CODE */}
        <div className="flex items-center justify-between gap-2">

          <span className="min-w-0 truncate text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FF9B39]">
            {category}
          </span>

          <span className="shrink-0 text-[9px] font-medium text-neutral-600">
            {productCode}
          </span>

        </div>

        {/* PRODUCT NAME */}
        <Link
          to={productLink}
          className="mt-2 block"
        >
          <h3 className="line-clamp-2 min-h-[44px] text-sm font-extrabold leading-[1.45] tracking-[-0.015em] text-white transition-colors hover:text-[#FF9B39] sm:text-base">
            {product.name || "Produkt ProteinFitness"}
          </h3>
        </Link>

        {/* ================================= */}
        {/* PRICE */}
        {/* ================================= */}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">

          <span className="text-lg font-black tracking-tight text-white sm:text-2xl">
            {price !== null
              ? euro(price)
              : "Çmimi në përgatitje"}
          </span>

          {/* OLD PRICE */}
          {discounted && (
            <span className="text-xs font-medium text-neutral-500 line-through">
              {euro(oldPrice)}
            </span>
          )}

        </div>

        {/* ================================= */}
        {/* STOCK STATUS */}
        {/* ================================= */}

        <div className="mt-2 min-h-5">

          {outOfStock ? (
            <p className="text-[10px] font-bold text-red-400">
              ● PA STOK
            </p>
          ) : lowStock ? (
            <p className="text-[10px] font-bold text-amber-400">
              ● VETËM {Math.floor(stock)} NË STOK
            </p>
          ) : hasStockInfo ? (
            <p className="text-[10px] font-bold text-green-400">
              ● NË STOK
            </p>
          ) : (
            <p className="text-[10px] text-neutral-500">
              Kontakto për disponueshmërinë
            </p>
          )}

        </div>

        {/* ================================= */}
        {/* ADD TO CART */}
        {/* ================================= */}

        <div className="mt-auto pt-4">

          {needsSelection || !canBuy ? (
            <Link
              to={productLink}
              className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg bg-[#FF7900] px-3 text-[11px] font-black uppercase tracking-wide text-black transition-colors hover:bg-[#FFA23B] sm:px-4"
            >
              {canBuy
                ? "ZGJIDH VARIANTIN"
                : "SHIKO PRODUKTIN"}

              <ArrowUpRight size={18} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canBuy}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF7900] px-2 text-[10px] font-black uppercase tracking-wide text-black transition-colors hover:bg-[#FFA23B] disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 sm:px-4 sm:text-xs"
            >
              <ShoppingBag size={17} />
              SHTO NË SHPORTË
            </button>
          )}

        </div>

        {/* DETAILS BUTTON */}
        <Link
          to={productLink}
          className="mt-3 inline-flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 transition-colors hover:text-[#FF7900]"
        >
          SHIKO DETAJET

          <ArrowUpRight size={14} />
        </Link>

      </div>

      {/* BOTTOM ACCENT */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF7900]/65 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    </article>
  );
}
