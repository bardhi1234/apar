
import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  ChevronRight,
  CreditCard,
  ImageOff,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

// ======================================
// PROTEINFITNESS CONFIGURATION
// ======================================

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

// ======================================
// PRICE HELPERS
// ======================================

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

  const raw = String(value)
    .trim()
    .replace(/[\s€]/g, "");

  const normalized =
    raw.includes(",") && raw.includes(".")
      ? raw.lastIndexOf(",") > raw.lastIndexOf(".")
        ? raw.replace(/\./g, "").replace(",", ".")
        : raw.replace(/,/g, "")
      : raw.replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

function euro(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

// ======================================
// IMAGE HELPERS
// ======================================

function imageUrl(image) {
  if (typeof image === "string") {
    return image;
  }

  if (image && typeof image === "object") {
    return (
      image.secure_url ||
      image.url ||
      image.image_url ||
      ""
    );
  }

  return "";
}

function getProductImage(item) {
  const firstImage = Array.isArray(item.images)
    ? item.images[0]
    : null;

  return (
    imageUrl(item.image) ||
    imageUrl(firstImage) ||
    ""
  );
}

function getCategoryName(category) {
  if (typeof category === "string") {
    return category;
  }

  return category?.name || "Suplemente";
}

// ======================================
// CART COMPONENT
// ======================================

export default function Cart() {
  const {
    cart = [],
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  useEffect(() => {
    document.title = "Shporta | ProteinFitness";
  }, []);

  const items = Array.isArray(cart) ? cart : [];

  // ======================================
  // CALCULATE CART
  // ======================================

  const totalItems = Number.isFinite(
    Number(cartCount)
  )
    ? Number(cartCount)
    : items.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 1),
        0
      );

  const calculatedTotal = items.reduce(
    (sum, item) => {
      const price = toPrice(item.price);
      const quantity =
        Number(item.quantity) || 1;

      return sum + (price || 0) * quantity;
    },
    0
  );

  const subtotal =
    toPrice(cartTotal) ?? calculatedTotal;

  const hasInvalidPrice = items.some(
    (item) => toPrice(item.price) === null
  );

  const getStock = (item) => {
    if (
      item.stock === null ||
      item.stock === undefined ||
      item.stock === ""
    ) {
      return null;
    }

    const stock = Number(item.stock);

    return Number.isFinite(stock)
      ? Math.max(0, Math.floor(stock))
      : null;
  };

  const hasStockIssue = items.some((item) => {
    const stock = getStock(item);

    return (
      stock !== null &&
      Number(item.quantity) > stock
    );
  });

  const canCheckout =
    items.length > 0 &&
    !hasInvalidPrice &&
    !hasStockIssue;

  // ======================================
  // RENDER
  // ======================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#080808] text-white">

        {/* ================================= */}
        {/* CART HERO */}
        {/* ================================= */}

        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#090909]">

          {/* BACKGROUND EFFECTS */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-36 top-0 h-[420px] w-[420px] rounded-full bg-[#FF7900]/[0.06] blur-[130px]" />

            <div className="absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full bg-[#FF7900]/[0.04] blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-[1500px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">

            {/* BREADCRUMB */}
            <nav
              aria-label="Navigimi"
              className="mb-9 flex items-center gap-2 text-xs"
            >
              <Link
                to="/"
                className="text-neutral-500 transition hover:text-[#FF7900]"
              >
                Ballina
              </Link>

              <ChevronRight
                size={14}
                className="text-[#FF7900]"
              />

              <Link
                to="/shop"
                className="text-neutral-500 transition hover:text-[#FF7900]"
              >
                Produktet
              </Link>

              <ChevronRight
                size={14}
                className="text-[#FF7900]"
              />

              <span className="font-bold text-white">
                Shporta
              </span>
            </nav>

            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">

              <div>
                {/* BRAND LABEL */}
                <div className="flex items-center gap-3">

                  <span className="h-[2px] w-9 bg-[#FF7900]" />

                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FF7900]">
                    PROTEINFITNESS STORE
                  </p>
                </div>

                {/* TITLE */}
                <h1 className="mt-5 text-[clamp(3rem,7vw,6.5rem)] font-black uppercase leading-none tracking-[-0.06em]">
                  SHPORTA
                  <span className="text-[#FF7900]">.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
                  Kontrollo produktet, variantet dhe
                  sasitë përpara se të vazhdosh me porosinë.
                </p>
              </div>

              {/* ITEMS COUNTER */}
              <div className="flex items-center gap-4 rounded-xl border border-[#FF7900]/20 bg-[#FF7900]/[0.06] px-5 py-4">

                <ShoppingBag
                  size={26}
                  className="text-[#FF7900]"
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    ARTIKUJ NË SHPORTË
                  </p>

                  <p
                    className="mt-1 text-2xl font-black text-white"
                    aria-live="polite"
                  >
                    {totalItems}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ORANGE ACCENT */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FF7900]/70 to-transparent" />

        </section>

        {/* ================================= */}
        {/* EMPTY CART */}
        {/* ================================= */}

        {items.length === 0 ? (
          <section className="mx-auto flex min-h-[560px] max-w-[1500px] flex-col items-center justify-center px-5 py-20 text-center">

            <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-[#FF7900]/20 bg-[#FF7900]/[0.07]">

              <ShoppingBag
                size={46}
                strokeWidth={1.4}
                className="text-[#FF7900]"
              />
            </div>

            <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#FF7900]">
              PROTEINFITNESS
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
              SHPORTA ËSHTË
              <span className="block text-[#FF7900]">
                BOSH.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400">
              Ende nuk ke shtuar produkte.
              Eksploro proteinat, kreatinën,
              vitaminat dhe aksesorët sportivë.
            </p>

            <Link
              to="/shop"
              className="group mt-9 inline-flex min-h-[56px] items-center gap-5 rounded-xl bg-[#FF7900] px-7 text-xs font-black uppercase tracking-[0.08em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFA03D]"
            >
              SHIKO PRODUKTET

              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </section>
        ) : (
          /* ================================= */
          /* CART WITH PRODUCTS */
          /* ================================= */

          <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-9 lg:px-10 lg:py-16">

            {/* ================================= */}
            {/* LEFT — PRODUCTS */}
            {/* ================================= */}

            <div className="min-w-0">

              {/* TOP BAR */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#141414] px-4 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7900]/10">

                    <ShoppingBag
                      size={20}
                      className="text-[#FF7900]"
                    />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                      PRODUKTET E TUA
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "artikull"
                        : "artikuj"}
                    </p>
                  </div>
                </div>

                {/* CLEAR CART */}
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-neutral-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={15} />
                  PASTRO SHPORTËN
                </button>

              </div>

              {/* ================================= */}
              {/* PRODUCT CARDS */}
              {/* ================================= */}

              <div className="space-y-4">

                {items.map((item, index) => {
                  const price = toPrice(item.price);

                  const oldPrice = toPrice(
                    item.oldPrice ?? item.old_price
                  );

                  const quantity = Math.max(
                    1,
                    Math.floor(Number(item.quantity) || 1)
                  );

                  const stock = getStock(item);

                  // Pa informacion për stokun,
                  // limiti teknik i sasisë është 99.
                  const maxQuantity =
                    stock === null ? 99 : stock;

                  const atMaxStock =
                    quantity >= maxQuantity;

                  const discounted =
                    price !== null &&
                    oldPrice !== null &&
                    oldPrice > price;

                  const discountPercent = discounted
                    ? Math.round(
                        ((oldPrice - price) / oldPrice) *
                          100
                      )
                    : 0;

                  const lineTotal =
                    price !== null
                      ? price * quantity
                      : null;

                  const image = getProductImage(item);

                  const category = getCategoryName(
                    item.category
                  );

                  return (
                    <article
                      key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-3 transition-all duration-300 hover:border-[#FF7900]/40 sm:p-5"
                    >
                      {/* TOP ACCENT */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7900]/40 to-transparent" />

                      <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-6">

                        {/* ================================= */}
                        {/* PRODUCT IMAGE */}
                        {/* ================================= */}

                        <Link
                          to={`/product/${encodeURIComponent(item.id)}`}
                          className="relative block aspect-[4/5] self-start overflow-hidden rounded-xl border border-white/10 bg-[#202020]"
                        >

                          {image ? (
                            <img
                              src={image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-3"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageOff
                                size={28}
                                className="text-neutral-600"
                              />
                            </div>
                          )}

                          {/* DISCOUNT BADGE */}
                          {discounted && (
                            <span className="absolute left-1.5 top-1.5 rounded bg-[#FF7900] px-1.5 py-1 text-[9px] font-black text-black sm:left-2 sm:top-2 sm:px-2">
                              −{discountPercent}%
                            </span>
                          )}

                        </Link>

                        {/* ================================= */}
                        {/* PRODUCT INFORMATION */}
                        {/* ================================= */}

                        <div className="flex min-w-0 flex-col">

                          {/* CATEGORY + DELETE */}
                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#FF9C37]">
                                {category}
                              </p>

                              <Link
                                to={`/product/${encodeURIComponent(item.id)}`}
                                className="mt-2 block"
                              >
                                <h2 className="line-clamp-2 text-sm font-black leading-5 text-white transition-colors hover:text-[#FF9C37] sm:text-lg sm:leading-6">
                                  {item.name}
                                </h2>
                              </Link>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item.id,
                                  item.size,
                                  item.color
                                )
                              }
                              aria-label={`Largo ${item.name} nga shporta`}
                              title="Largo produktin"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                          {/* ================================= */}
                          {/* PRODUCT VARIANTS */}
                          {/* ================================= */}

                          {(item.size || item.color) && (
                            <div className="mt-3 flex flex-wrap gap-2">

                              {item.size && (
                                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[10px] text-neutral-300">
                                  Pesha:{" "}
                                  <strong className="text-white">
                                    {item.size}
                                  </strong>
                                </span>
                              )}

                              {item.color && (
                                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[10px] text-neutral-300">
                                  Shija:{" "}
                                  <strong className="text-white">
                                    {item.color}
                                  </strong>
                                </span>
                              )}

                            </div>
                          )}

                          {/* ================================= */}
                          {/* PRICE */}
                          {/* ================================= */}

                          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">

                            <span className="text-base font-black text-white sm:text-xl">
                              {price !== null
                                ? euro(price)
                                : "Çmimi i padisponueshëm"}
                            </span>

                            {discounted && (
                              <span className="text-xs text-neutral-500 line-through">
                                {euro(oldPrice)}
                              </span>
                            )}

                          </div>

                          {/* STOCK WARNING */}
                          {stock !== null &&
                            stock < quantity && (
                              <p className="mt-2 text-[10px] font-semibold text-amber-400">
                                Sasia tejkalon stokun e regjistruar.
                              </p>
                            )}

                          {/* ================================= */}
                          {/* QUANTITY AND TOTAL */}
                          {/* ================================= */}

                          <div className="mt-auto pt-4">

                            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">

                              {/* QUANTITY */}
                              <div>
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                                  SASIA
                                </p>

                                <div className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-white/15 bg-[#0B0B0B]">

                                  <button
                                    type="button"
                                    aria-label="Zvogëlo sasinë"
                                    disabled={quantity <= 1}
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.size,
                                        item.color,
                                        quantity - 1
                                      )
                                    }
                                    className="flex h-full w-9 items-center justify-center transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 sm:w-10"
                                  >
                                    <Minus size={15} />
                                  </button>

                                  <span className="flex h-full min-w-[38px] items-center justify-center border-x border-white/15 px-2 text-xs font-black text-white">
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    aria-label="Rrit sasinë"
                                    disabled={atMaxStock}
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.size,
                                        item.color,
                                        quantity + 1
                                      )
                                    }
                                    className="flex h-full w-9 items-center justify-center transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 sm:w-10"
                                  >
                                    <Plus size={15} />
                                  </button>

                                </div>

                              </div>

                              {/* LINE TOTAL */}
                              <div className="text-right">

                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                                  TOTALI
                                </p>

                                <p className="text-lg font-black tracking-tight text-[#FF9C37] sm:text-xl">
                                  {lineTotal !== null
                                    ? euro(lineTotal)
                                    : "—"}
                                </p>

                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    </article>
                  );
                })}

              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="group mt-7 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.09em] text-neutral-300 transition-colors hover:text-[#FF7900]"
              >
                <ArrowLeft
                  size={18}
                  className="text-[#FF7900] transition-transform group-hover:-translate-x-1"
                />

                VAZHDO BLERJET
              </Link>

            </div>

            {/* ================================= */}
            {/* RIGHT — ORDER SUMMARY */}
            {/* ================================= */}

            <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-[#141414] lg:sticky lg:top-24">

              {/* SUMMARY HEADER */}
              <div className="border-b border-white/10 bg-[#1A1A1A] px-6 py-6">

                <div className="flex items-center gap-3">

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7900]/10">

                    <PackageCheck
                      size={23}
                      className="text-[#FF7900]"
                    />

                  </span>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#FF7900]">
                      PROTEINFITNESS
                    </p>

                    <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
                      PËRMBLEDHJA
                    </h2>
                  </div>

                </div>

              </div>

              {/* SUMMARY BODY */}
              <div className="px-5 py-6 sm:px-6">

                {/* COUNT */}
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">

                  <span className="text-sm text-neutral-400">
                    Artikujt
                  </span>

                  <span className="text-sm font-bold text-white">
                    {totalItems}
                  </span>

                </div>

                {/* SUBTOTAL */}
                <div className="flex items-center justify-between gap-4 border-b border-white/10 py-5">

                  <span className="text-sm text-neutral-400">
                    Nëntotali
                  </span>

                  <span className="text-base font-black text-white">
                    {euro(subtotal)}
                  </span>

                </div>

                {/* DELIVERY */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 py-5">

                  <div>
                    <p className="text-sm text-neutral-300">
                      Dërgesa
                    </p>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      Kostoja përcaktohet sipas
                      destinacionit në Checkout.
                    </p>
                  </div>

                  <Truck
                    size={20}
                    className="shrink-0 text-[#FF7900]"
                  />

                </div>

                {/* SHIPPING DESTINATIONS */}
                <div className="my-6 rounded-xl border border-white/10 bg-[#0C0C0C] p-4">

                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#FF7900]">
                    DESTINACIONET
                  </p>

                  <div className="space-y-3 text-xs text-neutral-400">

                    <div className="flex items-center justify-between">
                      <span>Kosovë</span>
                      <span className="text-neutral-300">
                        Sipas adresës
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Shqipëri</span>
                      <span className="text-neutral-300">
                        Sipas adresës
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Maqedoni e Veriut</span>
                      <span className="text-neutral-300">
                        Sipas adresës
                      </span>
                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* FINAL TOTAL */}
                {/* ================================= */}

                <div className="border-t border-white/10 pt-6">

                  <div className="flex items-end justify-between gap-4">

                    <div>
                      <p className="text-sm font-black uppercase text-white">
                        TOTALI
                      </p>

                      <p className="mt-1 text-[11px] text-neutral-500">
                        Pa koston e dërgesës
                      </p>
                    </div>

                    <span className="text-3xl font-black tracking-tight text-[#FF7900]">
                      {euro(subtotal)}
                    </span>

                  </div>

                  {/* CHECKOUT BUTTON */}
                  {canCheckout ? (
                    <Link
                      to="/checkout"
                      className="group mt-7 flex min-h-[58px] w-full items-center justify-between gap-3 rounded-xl bg-[#FF7900] px-5 text-xs font-black uppercase tracking-[0.08em] text-black transition-all duration-300 hover:bg-[#FFA03D]"
                    >
                      VAZHDO NË CHECKOUT

                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="mt-7 flex min-h-[58px] w-full cursor-not-allowed items-center justify-center rounded-xl bg-neutral-800 px-5 text-xs font-black uppercase text-neutral-500"
                      >
                        KONTROLLO PRODUKTET
                      </button>

                      <p className="mt-3 text-xs leading-6 text-amber-400">
                        Kontrollo çmimin dhe
                        disponueshmërinë e produkteve
                        para vazhdimit.
                      </p>
                    </>
                  )}

                  <p className="mt-4 text-center text-[11px] leading-6 text-neutral-500">
                    Totali final dhe mundësitë e
                    pagesës konfirmohen gjatë porosisë.
                  </p>

                </div>

                {/* ================================= */}
                {/* TRUST FEATURES */}
                {/* ================================= */}

                <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">

                  <div className="text-center">

                    <Truck
                      size={21}
                      className="mx-auto text-[#FF7900]"
                    />

                    <p className="mt-2 text-[9px] font-bold uppercase text-neutral-400">
                      DËRGESA
                    </p>

                  </div>

                  <div className="border-x border-white/10 text-center">

                    <ShieldCheck
                      size={21}
                      className="mx-auto text-[#FF7900]"
                    />

                    <p className="mt-2 text-[9px] font-bold uppercase text-neutral-400">
                      POROSIA
                    </p>

                  </div>

                  <div className="text-center">

                    <CreditCard
                      size={21}
                      className="mx-auto text-[#FF7900]"
                    />

                    <p className="mt-2 text-[9px] font-bold uppercase text-neutral-400">
                      PAGESA
                    </p>

                  </div>

                </div>

              </div>

              {/* BRAND BOTTOM LINE */}
              <div className="h-[3px] bg-gradient-to-r from-[#FF7900] via-[#FFB15E] to-[#FF7900]" />

            </aside>

          </section>
        )}

        {/* ================================= */}
        {/* BOTTOM BRAND STRIP */}
        {/* ================================= */}

        <section className="border-t border-white/10 bg-[#0D0D0D]">

          <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-6 px-5 py-9 sm:flex-row sm:items-center sm:px-6 lg:px-10">

            <div className="flex items-center gap-4">

              <img
                src={LOGO}
                alt="ProteinFitness"
                loading="lazy"
                className="h-14 w-20 shrink-0 object-contain sm:w-24"
              />

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white">
                  PROTEINFITNESS
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Sports Supplements Store
                </p>
              </div>

            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#FF7900] hover:text-[#FFB15E]"
            >
              EKSPLORO PRODUKTET

              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
