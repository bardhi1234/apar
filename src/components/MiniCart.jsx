
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ImageOff,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

// ======================================
// HELPERS
// ======================================

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
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

  return Number.isFinite(number) ? number : null;
}

function euro(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function productImage(item) {
  const candidate =
    item.image ||
    (Array.isArray(item.images)
      ? item.images[0]
      : null);

  if (typeof candidate === "string") {
    return candidate;
  }

  return (
    candidate?.secure_url ||
    candidate?.url ||
    candidate?.image_url ||
    ""
  );
}

function getCategory(value) {
  return typeof value === "string"
    ? value
    : value?.name || "Suplemente";
}

function getStock(item) {
  if (
    item.stock === null ||
    item.stock === undefined ||
    item.stock === ""
  ) {
    return null;
  }

  const number = Number(item.stock);

  return Number.isFinite(number)
    ? Math.max(0, Math.floor(number))
    : null;
}

function getQuantity(value) {
  return Math.max(
    1,
    Math.floor(Number(value) || 1)
  );
}

// ======================================
// MINICART
// ======================================

export default function MiniCart() {
  const {
    cart = [],
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const items = Array.isArray(cart) ? cart : [];

  const count = Number.isFinite(Number(cartCount))
    ? Number(cartCount)
    : items.reduce(
        (sum, item) =>
          sum + getQuantity(item.quantity),
        0
      );

  const subtotal =
    toNumber(cartTotal) ??
    items.reduce(
      (sum, item) =>
        sum +
        (toNumber(item.price) ?? 0) *
          getQuantity(item.quantity),
      0
    );

  // ======================================
  // TOTAL QUANTITY PER PRODUCT
  // ======================================

  function quantityForProduct(id) {
    return items.reduce(
      (sum, item) =>
        String(item.id) === String(id)
          ? sum + getQuantity(item.quantity)
          : sum,
      0
    );
  }

  // ======================================
  // CHECKOUT VALIDATION
  // ======================================

  const hasCartIssue = items.some((item) => {
    const price = toNumber(item.price);
    const stock = getStock(item);
    const qty = Number(item.quantity);

    return (
      price === null ||
      price <= 0 ||
      !Number.isInteger(qty) ||
      qty <= 0 ||
      (stock !== null &&
        quantityForProduct(item.id) > stock)
    );
  });

  // ======================================
  // ESC, FOCUS, BODY SCROLL LOCK
  // ======================================

  useEffect(() => {
    if (!isCartOpen) return undefined;

    const previousFocus =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeCart();
        return;
      }

      if (
        event.key !== "Tab" ||
        !dialogRef.current
      ) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled])'
        )
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousFocus?.focus?.();
    };
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* ================================= */}
      {/* BACKDROP */}
      {/* ================================= */}

      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-[110] bg-black/75 backdrop-blur-[5px] transition-opacity duration-300 ${
          isCartOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* ================================= */}
      {/* DRAWER */}
      {/* ================================= */}

      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal={
          isCartOpen ? "true" : undefined
        }
        aria-label="Shporta e ProteinFitness"
        aria-hidden={!isCartOpen}
        className={`fixed right-0 top-0 z-[120] flex h-[100dvh] w-full max-w-[470px] flex-col overflow-hidden border-l border-white/10 bg-[#0B0B0B] text-white shadow-[-25px_0_100px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out ${
          isCartOpen
            ? "visible translate-x-0"
            : "pointer-events-none invisible translate-x-full"
        }`}
      >

        {/* ORANGE TOP LINE */}
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#FF7900] via-[#FFB35D] to-[#FF7900]" />

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#111111] px-5 py-5 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <img
              src={LOGO}
              alt="ProteinFitness"
              className="h-14 w-16 shrink-0 object-contain"
            />

            <div className="min-w-0">

              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#FF7900]">
                PROTEINFITNESS
              </p>

              <div className="mt-1 flex items-center gap-2">

                <h2 className="text-lg font-black uppercase tracking-tight sm:text-xl">
                  SHPORTA JOTE
                </h2>

                {count > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FF7900] px-1.5 text-[11px] font-black text-black">
                    {count}
                  </span>
                )}

              </div>

            </div>
          </div>

          {/* CLOSE */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Mbyll shportën"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white transition hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================================= */}
        {/* EMPTY CART */}
        {/* ================================= */}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-7 py-14 text-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-[#FF7900]/25 bg-[#FF7900]/10">
              <ShoppingBag
                size={38}
                strokeWidth={1.4}
                className="text-[#FF7900]"
              />
            </div>

            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.22em] text-[#FF7900]">
              PROTEINFITNESS STORE
            </p>

            <h3 className="mt-3 text-3xl font-black uppercase tracking-tight">
              SHPORTA ËSHTË BOSH.
            </h3>

            <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-400">
              Zbulo proteinat, kreatinën dhe
              aksesorët sportivë dhe shto produktet
              që të duhen.
            </p>

            <Link
              to="/shop"
              onClick={closeCart}
              className="group mt-8 inline-flex min-h-[54px] w-full max-w-[290px] items-center justify-between rounded-xl bg-[#FF7900] px-6 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#FFA33E]"
            >
              SHIKO PRODUKTET

              <ArrowRight
                size={19}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>
        ) : (
          <>
            {/* ================================= */}
            {/* SCROLLABLE PRODUCT LIST */}
            {/* ================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">

              {items.map((item, index) => {
                const price = toNumber(item.price);

                const oldPrice = toNumber(
                  item.oldPrice ?? item.old_price
                );

                const quantity = getQuantity(
                  item.quantity
                );

                const stock = getStock(item);

                const combinedQuantity =
                  quantityForProduct(item.id);

                const availableForThisVariant =
                  (stock ?? 99) -
                  (combinedQuantity - quantity);

                const atMax =
                  quantity >= availableForThisVariant;

                const discounted =
                  price !== null &&
                  oldPrice !== null &&
                  oldPrice > price;

                const discount = discounted
                  ? Math.round(
                      ((oldPrice - price) /
                        oldPrice) *
                        100
                    )
                  : 0;

                const image = productImage(item);

                const lineTotal =
                  price === null
                    ? null
                    : price * quantity;

                return (
                  <article
                    key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}-${index}`}
                    className="border-b border-white/10 py-6"
                  >

                    <div className="flex gap-4">

                      {/* PRODUCT IMAGE */}
                      <Link
                        to={`/product/${encodeURIComponent(item.id)}`}
                        onClick={closeCart}
                        className="relative h-[118px] w-[96px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#202020]"
                      >

                        {image ? (
                          <img
                            src={image}
                            alt={item.name || "Produkt"}
                            loading="lazy"
                            className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageOff
                              size={28}
                              className="text-neutral-600"
                            />
                          </div>
                        )}

                        {/* DISCOUNT */}
                        {discounted && (
                          <span className="absolute left-1.5 top-1.5 rounded bg-[#FF7900] px-1.5 py-1 text-[9px] font-black text-black">
                            -{discount}%
                          </span>
                        )}

                      </Link>

                      {/* PRODUCT INFORMATION */}
                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#FF9C37]">
                              {getCategory(item.category)}
                            </p>

                            <Link
                              to={`/product/${encodeURIComponent(item.id)}`}
                              onClick={closeCart}
                              className="mt-1.5 block text-sm font-black leading-5 text-white hover:text-[#FF9C37]"
                            >
                              {item.name || "Produkt"}
                            </Link>

                          </div>

                          {/* REMOVE */}
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.size,
                                item.color
                              )
                            }
                            aria-label={`Largo ${item.name || "produktin"} nga shporta`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                        {/* VARIANTS */}
                        {(item.size || item.color) && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">

                            {item.size && (
                              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-neutral-300">
                                Pesha:{" "}
                                <strong className="text-white">
                                  {item.size}
                                </strong>
                              </span>
                            )}

                            {item.color && (
                              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-neutral-300">
                                Shija:{" "}
                                <strong className="text-white">
                                  {item.color}
                                </strong>
                              </span>
                            )}

                          </div>
                        )}

                        {/* PRICE */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <strong className="text-base font-black text-white">
                            {price !== null
                              ? euro(price)
                              : "Çmimi mungon"}
                          </strong>

                          {discounted && (
                            <span className="text-xs text-neutral-500 line-through">
                              {euro(oldPrice)}
                            </span>
                          )}

                        </div>

                      </div>
                    </div>

                    {/* ================================= */}
                    {/* QUANTITY / TOTAL */}
                    {/* ================================= */}

                    <div className="mt-4 flex items-end justify-between gap-4">

                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          SASIA
                        </p>

                        <div className="inline-flex h-10 overflow-hidden rounded-lg border border-white/15 bg-[#151515]">

                          <button
                            type="button"
                            aria-label={`Zvogëlo sasinë e ${item.name || "produktit"}`}
                            disabled={quantity <= 1}
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                quantity - 1
                              )
                            }
                            className="flex w-10 items-center justify-center transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="flex min-w-11 items-center justify-center border-x border-white/15 px-2 text-xs font-black">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Rrit sasinë e ${item.name || "produktit"}`}
                            disabled={atMax}
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                quantity + 1
                              )
                            }
                            className="flex w-10 items-center justify-center transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        {stock !== null &&
                          combinedQuantity >= stock && (
                            <p className="mt-2 text-[10px] font-medium text-amber-400">
                              Kufiri i stokut: {stock}
                            </p>
                          )}

                      </div>

                      {/* LINE TOTAL */}
                      <div className="text-right">

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          TOTALI
                        </p>

                        <p className="text-xl font-black text-[#FF9C37]">
                          {lineTotal !== null
                            ? euro(lineTotal)
                            : "—"}
                        </p>

                      </div>
                    </div>

                  </article>
                );
              })}

            </div>

            {/* ================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================= */}

            <div className="shrink-0 border-t border-white/10 bg-[#111111] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 sm:px-6">

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  Artikujt
                </span>

                <span className="font-bold">
                  {count}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    NËNTOTALI
                  </p>

                  <p className="mt-1 text-[11px] text-neutral-500">
                    Pa dërgesë
                  </p>
                </div>

                <strong className="text-3xl font-black tracking-tight text-[#FF7900]">
                  {euro(subtotal)}
                </strong>

              </div>

              {/* DELIVERY */}
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-3">

                <Truck
                  size={17}
                  className="shrink-0 text-[#FF7900]"
                />

                <p className="text-[11px] leading-5 text-neutral-400">
                  Tarifa e dërgesës llogaritet në
                  Checkout sipas shtetit.
                </p>

              </div>

              {/* CHECKOUT */}
              {hasCartIssue ? (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-5 text-amber-300"
                >
                  Kontrollo çmimet dhe stokun e
                  produkteve para se të vazhdosh.
                </p>
              ) : (
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="group mt-4 flex min-h-[56px] w-full items-center justify-between rounded-xl bg-[#FF7900] px-5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#FFA33E]"
                >
                  VAZHDO NË CHECKOUT

                  <ArrowRight
                    size={19}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              )}

              {/* FULL CART */}
              <Link
                to="/cart"
                onClick={closeCart}
                className="mt-3 flex min-h-[47px] w-full items-center justify-center rounded-xl border border-white/15 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-[#FF7900] hover:text-[#FF7900]"
              >
                SHIKO SHPORTËN
              </Link>

              {/* CONTINUE SHOPPING */}
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-neutral-500 transition hover:text-white"
              >
                <ChevronLeft size={15} />
                VAZHDO BLERJET
              </button>

            </div>
          </>
        )}

      </aside>
    </>
  );
}
