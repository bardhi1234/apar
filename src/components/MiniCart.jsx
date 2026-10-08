import {
  useEffect,
} from "react";

import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

export default function MiniCart() {
  const {
    cart,
    cartCount,
    cartTotal,

    isCartOpen,
    closeCart,

    removeFromCart,
    updateQuantity,
  } = useCart();

  /*
    ========================================
    ESC + BODY SCROLL LOCK
    ========================================
  */

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        closeCart();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isCartOpen,
    closeCart,
  ]);

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
      {/* ================================= */}
      {/* OVERLAY */}
      {/* ================================= */}

      <div
        onClick={
          closeCart
        }
        className={`fixed inset-0 z-[110] bg-black/70 backdrop-blur-[5px] transition-all duration-500 ${
          isCartOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* ================================= */}
      {/* DRAWER */}
      {/* ================================= */}

      <aside
        aria-hidden={
          !isCartOpen
        }
        className={`fixed right-0 top-0 z-[120] flex h-[100dvh] w-full max-w-[470px] flex-col bg-[#f8f8f6] shadow-[-30px_0_100px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* APAR LINE */}
        <div className="flex h-[2px] w-full flex-shrink-0">

          <span className="flex-1 bg-[#009246]" />

          <span className="flex-1 bg-white" />

          <span className="flex-1 bg-[#CE2B37]" />

        </div>

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-black px-5 py-5 text-white sm:px-6">

          <div>

            <img
              src={APAR_LOGO}
              alt="APAR"
              className="w-[105px] object-contain mix-blend-screen"
            />

            <div className="mt-2 flex items-center gap-2">

              <ShoppingBag
                size={13}
                strokeWidth={1.7}
              />

              <p className="text-[9px] font-bold tracking-[0.28em] text-neutral-500">
                SHOPPING BAG
              </p>

              {cartCount >
                0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[9px] font-black text-black">
                  {
                    cartCount
                  }
                </span>
              )}

            </div>

          </div>

          <button
            type="button"
            onClick={
              closeCart
            }
            aria-label="Mbyll shportën"
            className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            <X
              size={19}
            />
          </button>

        </div>

        {/* ================================= */}
        {/* EMPTY CART */}
        {/* ================================= */}

        {cart.length ===
        0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 bg-white">

              <ShoppingBag
                size={30}
                strokeWidth={1.2}
                className="text-neutral-300"
              />

            </div>

            <p className="mt-8 text-[9px] font-black tracking-[0.35em] text-neutral-400">
              APAR BAG
            </p>

            <h3 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Shporta është bosh.
            </h3>

            <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-500">
              Zbulo koleksionin
              APAR dhe shto
              produktet që të
              pëlqejnë.
            </p>

            <Link
              to="/shop"
              onClick={
                closeCart
              }
              style={{
                color:
                  "#ffffff",
              }}
              className="group mt-8 flex min-h-[56px] w-full max-w-[280px] items-center justify-between bg-black px-6 text-xs font-black tracking-[0.12em] text-white"
            >
              SHOP COLLECTION

              <ArrowRight
                size={16}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        ) : (
          <>
            {/* ================================= */}
            {/* PRODUCT LIST */}
            {/* ================================= */}

            <div className="flex-1 overflow-y-auto overscroll-contain">

              <div className="px-5 sm:px-6">

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

                    return (
                      <div
                        key={`${item.id}-${item.size || "no-size"}-${item.color || "no-color"}-${index}`}
                        className="border-b border-neutral-200 py-6"
                      >

                        <div className="flex gap-4">

                          {/* IMAGE */}
                          <Link
                            to={`/product/${item.id}`}
                            onClick={
                              closeCart
                            }
                            className="relative h-[128px] w-[102px] flex-shrink-0 overflow-hidden bg-neutral-200"
                          >
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="h-full w-full object-cover transition duration-700 hover:scale-105"
                            />

                            {/* NUMBER */}
                            <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-[7px] font-bold tracking-[0.15em] text-white backdrop-blur">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                          </Link>

                          {/* INFO */}
                          <div className="flex min-w-0 flex-1 flex-col">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                                  {
                                    item.category
                                  }
                                </p>

                                <Link
                                  to={`/product/${item.id}`}
                                  onClick={
                                    closeCart
                                  }
                                  className="mt-2 block text-sm font-black leading-5 text-black transition hover:text-neutral-500"
                                >
                                  {
                                    item.name
                                  }
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
                                aria-label={`Largo ${item.name}`}
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                  strokeWidth={
                                    1.7
                                  }
                                />
                              </button>

                            </div>

                            {/* VARIANTS */}
                            {(item.size ||
                              item.color) && (
                              <div className="mt-3 flex flex-wrap gap-1.5">

                                {item.size && (
                                  <span className="border border-neutral-200 bg-white px-2 py-1 text-[8px] font-bold tracking-[0.08em] text-neutral-600">
                                    SIZE{" "}
                                    {
                                      item.size
                                    }
                                  </span>
                                )}

                                {item.color && (
                                  <span className="border border-neutral-200 bg-white px-2 py-1 text-[8px] font-bold tracking-[0.08em] text-neutral-600">
                                    {
                                      item.color
                                    }
                                  </span>
                                )}

                              </div>
                            )}

                            {/* PRICE */}
                            <div className="mt-3 flex items-center gap-2">

                              <span className="text-sm font-black">
                                {price.toFixed(
                                  2
                                )}{" "}
                                €
                              </span>

                              {oldPrice >
                                price && (
                                <span className="text-[10px] text-neutral-400 line-through">
                                  {oldPrice.toFixed(
                                    2
                                  )}{" "}
                                  €
                                </span>
                              )}

                              {discount && (
                                <span className="text-[9px] font-black text-[#CE2B37]">
                                  -
                                  {
                                    discount
                                  }
                                  %
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                        {/* ================================= */}
                        {/* QUANTITY + TOTAL */}
                        {/* ================================= */}

                        <div className="mt-5 flex items-end justify-between gap-4">

                          <div>

                            <p className="mb-2 text-[8px] font-bold tracking-[0.2em] text-neutral-400">
                              QUANTITY
                            </p>

                            <div className="flex h-10 items-center border border-neutral-300 bg-white">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.color,
                                    item.quantity -
                                      1
                                  )
                                }
                                disabled={
                                  item.quantity <=
                                  1
                                }
                                aria-label="Zvogëlo sasinë"
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
                                aria-label="Rrit sasinë"
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

                          {/* LINE TOTAL */}
                          <div className="text-right">

                            <p className="text-[8px] font-bold tracking-[0.18em] text-neutral-400">
                              TOTAL
                            </p>

                            <p className="mt-1 text-lg font-black tracking-[-0.03em]">
                              {(
                                price *
                                item.quantity
                              ).toFixed(
                                2
                              )}{" "}
                              €
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* ================================= */}
            {/* BOTTOM SUMMARY */}
            {/* ================================= */}

            <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-5 pb-6 pt-5 shadow-[0_-15px_50px_rgba(0,0,0,0.05)] sm:px-6">

              {/* ITEMS */}
              <div className="flex items-center justify-between text-xs">

                <span className="text-neutral-500">
                  Produkte
                </span>

                <span className="font-bold">
                  {cartCount}{" "}
                  {cartCount ===
                  1
                    ? "artikull"
                    : "artikuj"}
                </span>

              </div>

              {/* SUBTOTAL */}
              <div className="mt-4 flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-black tracking-[0.2em] text-neutral-400">
                    SUBTOTAL
                  </p>

                  <p className="mt-1 text-[10px] text-neutral-400">
                    Pa transport
                  </p>

                </div>

                <span className="text-[26px] font-black tracking-[-0.05em]">
                  {cartTotal.toFixed(
                    2
                  )}{" "}
                  €
                </span>

              </div>

              {/* DELIVERY INFO */}
              <div className="mt-5 border border-neutral-200 bg-[#f7f7f5] px-4 py-3">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />

                  <p className="text-[9px] font-bold tracking-[0.12em]">
                    DËRGESA DISPONIBLE
                  </p>

                </div>

                <p className="mt-2 text-[9px] leading-5 text-neutral-500">
                  Kosovë 2.50€ ·
                  Shqipëri 5€ ·
                  Maqedoni e Veriut
                  5€
                </p>

              </div>

              {/* CHECKOUT */}
              <Link
                to="/checkout"
                onClick={
                  closeCart
                }
                style={{
                  color:
                    "#ffffff",
                }}
                className="group mt-5 flex min-h-[58px] w-full items-center justify-between bg-black px-6 text-xs font-black tracking-[0.12em] text-white transition hover:bg-neutral-800"
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

              {/* FULL CART */}
              <Link
                to="/cart"
                onClick={
                  closeCart
                }
                className="mt-2 flex min-h-[50px] w-full items-center justify-center border border-neutral-300 bg-white text-[10px] font-black tracking-[0.12em] text-black transition hover:border-black"
              >
                SHIKO SHPORTËN
              </Link>

              {/* CONTINUE */}
              <button
                type="button"
                onClick={
                  closeCart
                }
                className="mt-4 w-full text-center text-[10px] font-semibold tracking-[0.08em] text-neutral-400 transition hover:text-black"
              >
                VAZHDO SHOPPING
              </button>

            </div>
          </>
        )}

      </aside>
    </>
  );
}