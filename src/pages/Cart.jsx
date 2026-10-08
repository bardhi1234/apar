import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  useCart,
} from "../context/CartContext";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

export default function Cart() {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const getNumber = (
    value
  ) => {
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    const parsed = Number(
      String(value || "")
        .replace(",", ".")
        .replace(
          /[^0-9.-]/g,
          ""
        )
    );

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  };

  const getMaxStock = (
    item
  ) => {
    const stock =
      Number(item.stock);

    if (
      Number.isFinite(stock)
    ) {
      return Math.max(
        0,
        stock
      );
    }

    return 99;
  };

  return (
    <>
      <Header />

      <main className="min-h-[700px] bg-[#f6f6f4]">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <section className="relative overflow-hidden bg-[#050505] text-white">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute -left-32 top-0 h-[300px] w-[300px] rounded-full bg-[#009246]/[0.04] blur-[120px]" />

            <div className="absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-[#CE2B37]/[0.04] blur-[120px]" />

          </div>

          <div className="relative mx-auto max-w-[1500px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">

            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">

              <div>

                <img
                  src={APAR_LOGO}
                  alt="APAR"
                  className="w-[105px] object-contain mix-blend-screen opacity-80"
                />

                <p className="mt-6 text-[9px] font-black tracking-[0.42em] text-neutral-500">
                  APAR / SHOPPING BAG
                </p>

                <h1 className="mt-3 text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  SHPORTA
                </h1>

                <div className="mt-6 flex">

                  <span className="h-[2px] w-9 bg-[#009246]" />

                  <span className="h-[2px] w-9 bg-white/70" />

                  <span className="h-[2px] w-9 bg-[#CE2B37]" />

                </div>

              </div>

              {cart.length > 0 && (
                <div className="sm:text-right">

                  <p className="text-[9px] font-bold tracking-[0.25em] text-neutral-500">
                    TOTAL ITEMS
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {cartCount}
                  </p>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {cart.length === 0 ? (
          <section className="mx-auto flex min-h-[600px] max-w-[1500px] flex-col items-center justify-center px-5 py-24 text-center sm:px-6 lg:px-10">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-neutral-200 bg-white">

              <ShoppingBag
                size={36}
                strokeWidth={1.2}
                className="text-neutral-300"
              />

            </div>

            <p className="mt-8 text-[9px] font-black tracking-[0.35em] text-neutral-400">
              APAR BAG
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
              Shporta është bosh.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
              Zbulo koleksionin APAR
              dhe shto produktet që
              dëshiron të porosisësh.
            </p>

            <Link
              to="/shop"
              style={{
                color:
                  "#ffffff",
              }}
              className="group mt-8 flex min-h-[56px] items-center gap-8 bg-black px-7 text-xs font-black tracking-[0.12em] text-white"
            >
              SHOP COLLECTION

              <ArrowRight
                size={16}
                style={{
                  color:
                    "#ffffff",
                }}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>

          </section>
        ) : (
          <section className="mx-auto grid max-w-[1500px] gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10 lg:py-14">

            {/* ================================= */}
            {/* PRODUCTS */}
            {/* ================================= */}

            <div>

              {/* TOP BAR */}
              <div className="mb-4 flex items-center justify-between border border-neutral-200 bg-white px-5 py-4">

                <div>

                  <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
                    YOUR BAG
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "artikull"
                      : "artikuj"}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-neutral-400 transition hover:text-red-600"
                >
                  <Trash2
                    size={14}
                  />

                  PASTRO SHPORTËN
                </button>

              </div>

              {/* PRODUCT CARDS */}
              <div className="space-y-4">

                {cart.map(
                  (
                    item,
                    index
                  ) => {
                    const price =
                      getNumber(
                        item.price
                      );

                    const oldPrice =
                      getNumber(
                        item.oldPrice
                      );

                    const maxStock =
                      getMaxStock(
                        item
                      );

                    const atMaxStock =
                      item.quantity >=
                      maxStock;

                    const discount =
                      oldPrice >
                      price
                        ? Math.round(
                            ((oldPrice -
                              price) /
                              oldPrice) *
                              100
                          )
                        : null;

                    const lineTotal =
                      price *
                      item.quantity;

                    return (
                      <article
                        key={`${item.id}-${item.size || "no-size"}-${item.color || "no-color"}-${index}`}
                        className="group border border-neutral-200 bg-white p-4 transition duration-500 hover:border-neutral-300 hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:p-5"
                      >

                        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">

                          {/* IMAGE */}
                          <Link
                            to={`/product/${item.id}`}
                            className="relative block aspect-[4/5] overflow-hidden bg-neutral-100"
                          >

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                            />

                            <span className="absolute bottom-2 left-2 bg-black/85 px-2 py-1 text-[7px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            {discount && (
                              <span className="absolute left-2 top-2 bg-[#CE2B37] px-2.5 py-1.5 text-[8px] font-black text-white">
                                -
                                {
                                  discount
                                }
                                %
                              </span>
                            )}

                          </Link>

                          {/* PRODUCT INFO */}
                          <div className="flex min-w-0 flex-col">

                            <div className="flex items-start justify-between gap-4">

                              <div className="min-w-0">

                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-400">
                                  {
                                    item.category
                                  }
                                </p>

                                <Link
                                  to={`/product/${item.id}`}
                                  className="mt-2 block"
                                >
                                  <h2 className="text-base font-black tracking-[-0.02em] text-black transition hover:text-neutral-500 sm:text-lg">
                                    {
                                      item.name
                                    }
                                  </h2>
                                </Link>

                                {/* VARIANTS */}
                                <div className="mt-3 flex flex-wrap gap-2">

                                  {item.size && (
                                    <span className="border border-neutral-200 bg-[#f8f8f6] px-2.5 py-1.5 text-[8px] font-bold tracking-[0.1em] text-neutral-600">
                                      SIZE{" "}
                                      {
                                        item.size
                                      }
                                    </span>
                                  )}

                                  {item.color && (
                                    <span className="border border-neutral-200 bg-[#f8f8f6] px-2.5 py-1.5 text-[8px] font-bold tracking-[0.1em] text-neutral-600">
                                      {
                                        item.color
                                      }
                                    </span>
                                  )}

                                </div>

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
                                aria-label={`Largo ${item.name}`}
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                            {/* PRICE */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">

                              <span className="text-base font-black">
                                {price.toFixed(
                                  2
                                )}{" "}
                                €
                              </span>

                              {oldPrice >
                                price && (
                                <span className="text-xs text-neutral-400 line-through">
                                  {oldPrice.toFixed(
                                    2
                                  )}{" "}
                                  €
                                </span>
                              )}

                              {discount && (
                                <span className="text-[9px] font-black text-[#CE2B37]">
                                  SAVE{" "}
                                  {
                                    discount
                                  }
                                  %
                                </span>
                              )}

                            </div>

                            {/* MOBILE DIVIDER */}
                            <div className="my-4 h-px bg-neutral-100" />

                            {/* QUANTITY / TOTAL */}
                            <div className="mt-auto flex flex-wrap items-end justify-between gap-4">

                              <div>

                                <p className="mb-2 text-[8px] font-black tracking-[0.2em] text-neutral-400">
                                  QUANTITY
                                </p>

                                <div className="flex h-10 items-center border border-neutral-300 bg-white">

                                  <button
                                    type="button"
                                    disabled={
                                      item.quantity <=
                                      1
                                    }
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.size,
                                        item.color,
                                        item.quantity -
                                          1
                                      )
                                    }
                                    className="flex h-full w-10 items-center justify-center transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-25"
                                  >
                                    <Minus
                                      size={
                                        13
                                      }
                                    />
                                  </button>

                                  <span className="flex h-full min-w-[42px] items-center justify-center border-x border-neutral-200 px-2 text-xs font-black">
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <button
                                    type="button"
                                    disabled={
                                      atMaxStock
                                    }
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.size,
                                        item.color,
                                        item.quantity +
                                          1
                                      )
                                    }
                                    className="flex h-full w-10 items-center justify-center transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-25"
                                  >
                                    <Plus
                                      size={
                                        13
                                      }
                                    />
                                  </button>

                                </div>

                                {atMaxStock && (
                                  <p className="mt-2 text-[9px] font-semibold text-amber-600">
                                    Maksimumi
                                    në stok:{" "}
                                    {
                                      maxStock
                                    }
                                  </p>
                                )}

                              </div>

                              <div className="text-right">

                                <p className="text-[8px] font-black tracking-[0.2em] text-neutral-400">
                                  TOTAL
                                </p>

                                <p className="mt-1 text-xl font-black tracking-[-0.03em]">
                                  {lineTotal.toFixed(
                                    2
                                  )}{" "}
                                  €
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-3 text-[10px] font-black tracking-[0.14em] text-black transition hover:gap-4"
              >
                VAZHDO SHOPPING

                <ArrowRight
                  size={15}
                />
              </Link>

            </div>

            {/* ================================= */}
            {/* SUMMARY */}
            {/* ================================= */}

            <aside className="h-fit border border-neutral-200 bg-white lg:sticky lg:top-24">

              {/* SUMMARY HEADER */}
              <div className="border-b border-neutral-200 bg-black p-6 text-white">

                <p className="text-[9px] font-black tracking-[0.3em] text-neutral-500">
                  APAR ORDER
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  Përmbledhja
                </h2>

              </div>

              <div className="p-6">

                {/* COUNT */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-5">

                  <span className="text-xs text-neutral-500">
                    Artikujt
                  </span>

                  <span className="text-xs font-bold">
                    {
                      cartCount
                    }
                  </span>

                </div>

                {/* SUBTOTAL */}
                <div className="flex items-center justify-between border-b border-neutral-200 py-5">

                  <span className="text-xs text-neutral-500">
                    Nëntotali
                  </span>

                  <span className="text-sm font-black">
                    {cartTotal.toFixed(
                      2
                    )}{" "}
                    €
                  </span>

                </div>

                {/* SHIPPING */}
                <div className="border-b border-neutral-200 py-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <span className="text-xs text-neutral-500">
                        Dërgesa
                      </span>

                      <p className="mt-1 text-[9px] leading-5 text-neutral-400">
                        Zgjidhet sipas
                        shtetit në
                        checkout.
                      </p>

                    </div>

                    <span className="text-right text-[10px] font-bold">
                      2.50 € – 5.00 €
                    </span>

                  </div>

                </div>

                {/* SHIPPING OPTIONS */}
                <div className="my-5 space-y-2">

                  <div className="flex items-center justify-between bg-[#f7f7f5] px-4 py-3">

                    <span className="text-[10px] font-semibold text-neutral-500">
                      Kosovë
                    </span>

                    <span className="text-[10px] font-black">
                      2.50 €
                    </span>

                  </div>

                  <div className="flex items-center justify-between bg-[#f7f7f5] px-4 py-3">

                    <span className="text-[10px] font-semibold text-neutral-500">
                      Shqipëri
                    </span>

                    <span className="text-[10px] font-black">
                      5.00 €
                    </span>

                  </div>

                  <div className="flex items-center justify-between bg-[#f7f7f5] px-4 py-3">

                    <span className="text-[10px] font-semibold text-neutral-500">
                      Maqedoni e Veriut
                    </span>

                    <span className="text-[10px] font-black">
                      5.00 €
                    </span>

                  </div>

                </div>

                {/* TOTAL */}
                <div className="flex items-end justify-between border-t border-neutral-200 pt-6">

                  <div>

                    <p className="text-sm font-black">
                      TOTALI
                    </p>

                    <p className="mt-1 text-[9px] text-neutral-400">
                      Pa dërgesë
                    </p>

                  </div>

                  <span className="text-3xl font-black tracking-[-0.05em]">
                    {cartTotal.toFixed(
                      2
                    )}{" "}
                    €
                  </span>

                </div>

                {/* CHECKOUT */}
                <Link
                  to="/checkout"
                  style={{
                    color:
                      "#ffffff",
                  }}
                  className="group mt-7 flex min-h-[60px] w-full items-center justify-between bg-black px-6 text-xs font-black tracking-[0.1em] text-white transition hover:bg-neutral-800"
                >
                  <span
                    style={{
                      color:
                        "#ffffff",
                    }}
                  >
                    VAZHDO NË
                    CHECKOUT
                  </span>

                  <ArrowRight
                    size={17}
                    style={{
                      color:
                        "#ffffff",
                    }}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-4 text-center text-[10px] leading-5 text-neutral-400">
                  Pagesa bëhet në
                  dorëzim.
                </p>

                {/* TRUST */}
                <div className="mt-6 grid grid-cols-3 border-t border-neutral-200 pt-5">

                  <div className="text-center">

                    <Truck
                      size={17}
                      className="mx-auto"
                    />

                    <p className="mt-2 text-[7px] font-black tracking-[0.1em] text-neutral-500">
                      DELIVERY
                    </p>

                  </div>

                  <div className="border-x border-neutral-200 text-center">

                    <ShieldCheck
                      size={17}
                      className="mx-auto"
                    />

                    <p className="mt-2 text-[7px] font-black tracking-[0.1em] text-neutral-500">
                      SECURE
                    </p>

                  </div>

                  <div className="text-center">

                    <PackageCheck
                      size={17}
                      className="mx-auto"
                    />

                    <p className="mt-2 text-[7px] font-black tracking-[0.1em] text-neutral-500">
                      COD
                    </p>

                  </div>

                </div>

              </div>

              {/* BRAND LINE */}
              <div className="flex h-[2px]">

                <span className="flex-1 bg-[#009246]" />

                <span className="flex-1 bg-neutral-200" />

                <span className="flex-1 bg-[#CE2B37]" />

              </div>

            </aside>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}