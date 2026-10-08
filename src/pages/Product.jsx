import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  PackageCheck,
  ShieldCheck,
  Heart,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";

import {
  getProductById,
} from "../services/api";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";

export default function Product() {
  const { id } = useParams();

  const { addToCart } =
    useCart();

  const [product, setProduct] =
    useState(null);

  const [
    productLoading,
    setProductLoading,
  ] = useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");

  const [
    selectedSize,
    setSelectedSize,
  ] = useState(null);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(null);

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    added,
    setAdded,
  ] = useState(false);

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const favorite =
    product
      ? isInWishlist(product.id)
      : false;

  const relatedProducts = [];

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setProductLoading(true);
        setProductError("");

        const response =
          await getProductById(id);

        const source =
          response.product ||
          response.data ||
          response;

        const normalized = {
          ...source,

          price:
            Number(
              source.price
            ) || 0,

          oldPrice:
            source.oldPrice != null
              ? Number(
                  source.oldPrice
                )
              : source.old_price != null
                ? Number(
                    source.old_price
                  )
                : null,

          stock:
            Number(
              source.stock
            ) || 0,

          sizes:
            Array.isArray(
              source.sizes
            )
              ? source.sizes
              : [],

          colors:
            Array.isArray(
              source.colors
            )
              ? source.colors
              : [],

          images:
            Array.isArray(
              source.images
            )
              ? source.images
              : source.image
                ? [source.image]
                : [],
        };

        if (!cancelled) {
          setProduct(
            normalized
          );

          setSelectedSize(
            normalized.sizes?.[0] ||
              null
          );

          setSelectedColor(
            normalized.colors?.[0] ||
              null
          );

          setQuantity(1);
          setAdded(false);
        }
      } catch (error) {
        console.error(
          "PRODUCT LOAD ERROR:",
          error
        );

        if (!cancelled) {
          setProduct(null);

          setProductError(
            error.message ||
              "Produkti nuk u ngarkua."
          );
        }
      } finally {
        if (!cancelled) {
          setProductLoading(
            false
          );
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const productImages =
    useMemo(() => {
      if (!product) return [];

      if (
        Array.isArray(
          product.images
        ) &&
        product.images.length > 0
      ) {
        return product.images;
      }

      return product.image
        ? [product.image]
        : [];
    }, [product]);

  if (productLoading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[650px] items-center justify-center bg-white">
          <div className="text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />

            <p className="mt-5 text-xs font-bold tracking-[0.2em] text-neutral-500">
              DUKE NGARKUAR PRODUKTIN...
            </p>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />

        <main className="flex min-h-[650px] items-center justify-center bg-white px-6">

          <div className="max-w-xl text-center">

            <p className="text-[10px] font-bold tracking-[0.4em] text-neutral-400">
              APAR
            </p>

            <h1 className="mt-4 text-4xl font-black">
              Produkti nuk u gjet.
            </h1>

            <p className="mt-4 text-sm text-neutral-500">
              {productError ||
                "Produkti nuk është më i disponueshëm."}
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex bg-black px-8 py-4 text-sm font-black text-white"
              style={{
                color: "#ffffff",
              }}
            >
              KTHEHU NË SHOP
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  const stock =
    Math.max(
      0,
      Number(product.stock) || 0
    );

  const isOutOfStock =
    stock <= 0;

  const maxQuantity =
    Math.max(1, stock);

  const discountPercent =
    product.oldPrice &&
    product.oldPrice >
      product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : null;

  const savedAmount =
    product.oldPrice &&
    product.oldPrice >
      product.price
      ? product.oldPrice -
        product.price
      : 0;

  /*
    ========================================
    QUANTITY
    ========================================
  */

  const handleDecrease = () => {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const handleIncrease = () => {
    setQuantity(
      (current) =>
        Math.min(
          maxQuantity,
          current + 1
        )
    );
  };

  /*
    ========================================
    ADD TO CART
    ========================================
  */

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addToCart(product, {
      size:
        selectedSize,

      color:
        selectedColor,

      quantity,
    });

    setAdded(true);

    window.setTimeout(
      () => {
        setAdded(false);
      },
      1800
    );
  };

  return (
    <>
      <Header />

      <main className="bg-white">

        {/* ================================= */}
        {/* BREADCRUMB */}
        {/* ================================= */}

        <div className="border-b border-neutral-100">

          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-6 lg:px-10">

            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.04em] text-neutral-500 transition hover:text-black"
            >
              <ArrowLeft
                size={16}
                className="transition group-hover:-translate-x-1"
              />

              KTHEHU NË SHOP
            </Link>

            <p className="hidden text-[9px] font-bold tracking-[0.3em] text-neutral-400 sm:block">
              APAR / PRODUKT
            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* PRODUCT */}
        {/* ================================= */}

        <section className="mx-auto grid max-w-[1500px] gap-7 px-4 py-6 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-16">

          {/* =============================== */}
          {/* LEFT — GALLERY */}
          {/* =============================== */}

          <div className="relative">

            {/* DESKTOP BADGES */}
            <div className="pointer-events-none absolute left-[105px] top-4 z-20 hidden flex-wrap gap-2 lg:flex">

              {product.badge && (
                <span className="bg-black px-4 py-2 text-[9px] font-black tracking-[0.2em] text-white">
                  {
                    product.badge
                  }
                </span>
              )}

              {discountPercent && (
                <span className="bg-[#CE2B37] px-4 py-2 text-[9px] font-black tracking-[0.2em] text-white">
                  -
                  {
                    discountPercent
                  }
                  %
                </span>
              )}

            </div>

            <ProductGallery
              images={
                productImages
              }
              productName={
                product.name
              }
            />

          </div>

          {/* =============================== */}
          {/* RIGHT — INFO */}
          {/* =============================== */}

          <div className="flex flex-col pt-1 sm:pt-2 lg:py-3">

            {/* CATEGORY */}
            <div className="flex items-center gap-4">

              <p className="text-[9px] font-black tracking-[0.4em] text-neutral-400">
                {product.category?.toUpperCase()}
              </p>

              <div className="flex">

                <span className="h-[2px] w-5 bg-[#009246]" />

                <span className="h-[2px] w-5 bg-neutral-300" />

                <span className="h-[2px] w-5 bg-[#CE2B37]" />

              </div>

            </div>

            {/* MOBILE BADGES */}
            <div className="mt-4 flex flex-wrap gap-2 lg:hidden">

              {product.badge && (
                <span className="bg-black px-3 py-2 text-[9px] font-black tracking-[0.16em] text-white">
                  {
                    product.badge
                  }
                </span>
              )}

              {discountPercent && (
                <span className="bg-[#CE2B37] px-3 py-2 text-[9px] font-black tracking-[0.16em] text-white">
                  -
                  {
                    discountPercent
                  }
                  %
                </span>
              )}

            </div>

            {/* ================================= */}
            {/* NAME + WISHLIST */}
            {/* ================================= */}

            <div className="mt-5 flex items-start justify-between gap-5">

              <h1 className="max-w-[650px] text-[31px] font-black leading-[1] tracking-[-0.04em] text-black sm:text-5xl lg:text-[58px]">
                {product.name}
              </h1>

              <button
                type="button"
                onClick={() =>
                  toggleWishlist(
                    product.id
                  )
                }
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
                className={`group flex h-12 w-12 flex-shrink-0 items-center justify-center border transition-all duration-300 sm:h-14 sm:w-14 ${
                  favorite
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-black hover:border-black hover:bg-black hover:text-white"
                }`}
              >
                <Heart
                  size={20}
                  strokeWidth={
                    1.6
                  }
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                  className="transition duration-300 group-hover:scale-110"
                />
              </button>

            </div>

            {favorite && (
              <div className="mt-3 flex items-center gap-2">

                <Heart
                  size={11}
                  fill="currentColor"
                />

                <p className="text-[9px] font-black tracking-[0.16em] text-neutral-400">
                  RUAJTUR NË WISHLIST
                </p>

              </div>
            )}

            {/* ================================= */}
            {/* PRICE */}
            {/* ================================= */}

            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">

              <span className="text-[23px] font-black tracking-[-0.02em] text-black sm:text-3xl">
                {product.price.toFixed(
                  2
                )}{" "}
                €
              </span>

              {product.oldPrice && (
                <span className="text-base font-medium text-neutral-400 line-through sm:text-lg">
                  {product.oldPrice.toFixed(
                    2
                  )}{" "}
                  €
                </span>
              )}

              {discountPercent && (
                <span className="text-xs font-bold text-[#CE2B37]">
                  Kursen{" "}
                  {savedAmount.toFixed(
                    2
                  )}{" "}
                  €
                </span>
              )}

            </div>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-600 sm:mt-7 sm:text-[15px] sm:leading-8">
              {
                product.description
              }
            </p>

            {/* ================================= */}
            {/* STOCK */}
            {/* ================================= */}

            <div className="mt-5 border-y border-neutral-200 py-4 sm:mt-6 sm:py-5">

              {isOutOfStock ? (
                <div className="flex items-center gap-3">

                  <span className="h-2 w-2 rounded-full bg-red-600" />

                  <span className="text-sm font-semibold text-red-600">
                    Jashtë stokut
                  </span>

                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <span className="relative flex h-2.5 w-2.5">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />

                    </span>

                    <span className="text-sm font-semibold text-neutral-700">
                      Në stok
                    </span>

                  </div>

                  <span className="text-xs text-neutral-400">
                    {stock} copë të
                    disponueshme
                  </span>

                </div>
              )}

            </div>

            {/* ================================= */}
            {/* SIZE */}
            {/* ================================= */}

            {product.sizes?.length >
              0 && (
              <div className="mt-6 sm:mt-8">

                <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">

                  <div>

                    <p className="text-sm font-bold">
                      Madhësia
                    </p>

                    {selectedSize && (
                      <p className="mt-1 text-xs text-neutral-400">
                        Zgjedhur:{" "}
                        {
                          selectedSize
                        }
                      </p>
                    )}

                  </div>

                  <span className="hidden text-[10px] font-semibold tracking-[0.08em] text-neutral-400 sm:block">
                    ZGJIDH MADHËSINË
                  </span>

                </div>

                <div className="flex flex-wrap gap-2">

                  {product.sizes.map(
                    (
                      size
                    ) => (
                      <button
                        key={
                          size
                        }
                        type="button"
                        onClick={() => {
                          setSelectedSize(
                            size
                          );

                          setQuantity(
                            1
                          );
                        }}
                        className={`flex h-11 min-w-[48px] items-center justify-center border px-3 text-sm font-bold sm:h-12 sm:min-w-[54px] sm:px-4 transition duration-300 ${
                          selectedSize ===
                          size
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        {
                          size
                        }
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ================================= */}
            {/* COLOR */}
            {/* ================================= */}

            {product.colors?.length >
              0 && (
              <div className="mt-6 sm:mt-8">

                <div className="mb-4">

                  <p className="text-sm font-bold">
                    Ngjyra
                  </p>

                  {selectedColor && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Zgjedhur:{" "}
                      {
                        selectedColor
                      }
                    </p>
                  )}

                </div>

                <div className="flex flex-wrap gap-2">

                  {product.colors.map(
                    (
                      color
                    ) => (
                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() => {
                          setSelectedColor(
                            color
                          );

                          setQuantity(
                            1
                          );
                        }}
                        className={`border px-5 py-3 text-sm font-semibold transition duration-300 ${
                          selectedColor ===
                          color
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        {
                          color
                        }
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ================================= */}
            {/* QUANTITY */}
            {/* ================================= */}

            {!isOutOfStock && (
              <div className="mt-6 sm:mt-8">

                <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">

                  <p className="text-sm font-bold">
                    Sasia
                  </p>

                  <span className="text-xs text-neutral-400">
                    Maksimum{" "}
                    {
                      stock
                    }
                  </span>

                </div>

                <div className="flex w-fit items-center border border-neutral-300">

                  <button
                    type="button"
                    aria-label="Zvogëlo sasinë"
                    disabled={
                      quantity <= 1
                    }
                    onClick={
                      handleDecrease
                    }
                    className="flex h-11 w-11 items-center justify-center transition hover:bg-neutral-100 sm:h-12 sm:w-12 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus
                      size={16}
                    />
                  </button>

                  <span className="flex h-11 w-12 items-center justify-center border-x border-neutral-300 text-sm font-bold sm:h-12 sm:w-14">
                    {
                      quantity
                    }
                  </span>

                  <button
                    type="button"
                    aria-label="Rrit sasinë"
                    disabled={
                      quantity >= stock
                    }
                    onClick={
                      handleIncrease
                    }
                    className="flex h-11 w-11 items-center justify-center transition hover:bg-neutral-100 sm:h-12 sm:w-12 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus
                      size={16}
                    />
                  </button>

                </div>

              </div>
            )}

            {/* ================================= */}
            {/* ADD TO CART */}
            {/* ================================= */}

            <button
              type="button"
              disabled={
                isOutOfStock
              }
              onClick={
                handleAddToCart
              }
              className={`mt-7 flex min-h-[54px] w-full items-center justify-center gap-2.5 px-5 text-[13px] font-black tracking-[0.06em] sm:mt-9 sm:min-h-[60px] sm:gap-3 sm:px-8 sm:text-sm sm:tracking-[0.08em] transition duration-300 ${
                isOutOfStock
                  ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                  : added
                  ? "bg-green-700 text-white"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              {isOutOfStock ? (
                "JASHTË STOKUT"
              ) : added ? (
                <>
                  <Check
                    size={19}
                  />

                  U SHTUA NË SHPORTË
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={19}
                  />

                  SHTO NË SHPORTË
                </>
              )}
            </button>

            {!isOutOfStock && (
              <p className="mt-3 text-center text-[11px] leading-5 text-neutral-400">
                Madhësia, ngjyra dhe
                sasia e zgjedhur ruhen
                në shportë.
              </p>
            )}

            {/* ================================= */}
            {/* SERVICES */}
            {/* ================================= */}

            <div className="mt-7 grid gap-4 border-t border-neutral-200 pt-6 sm:mt-9 sm:grid-cols-2 sm:gap-5 sm:pt-8">

              {/* PAYMENT */}
              <div className="flex gap-4">

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-neutral-100 sm:h-11 sm:w-11">

                  <PackageCheck
                    size={20}
                    strokeWidth={
                      1.6
                    }
                  />

                </div>

                <div>

                  <p className="text-sm font-bold">
                    Pagesë në dorëzim
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Paguaj kur ta pranosh
                    porosinë.
                  </p>

                </div>

              </div>

              {/* DELIVERY */}
              <div className="flex gap-4">

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-neutral-100 sm:h-11 sm:w-11">

                  <Truck
                    size={20}
                    strokeWidth={
                      1.6
                    }
                  />

                </div>

                <div>

                  <p className="text-sm font-bold">
                    Dërgesë
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Kosovë · Shqipëri ·
                    Maqedoni e Veriut
                  </p>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* DETAILS */}
            {/* ================================= */}

            <div className="mt-8 border-t border-neutral-200">

              <details className="group border-b border-neutral-200">

                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-bold">

                  Detajet e produktit

                  <Plus
                    size={17}
                    className="transition duration-300 group-open:rotate-45"
                  />

                </summary>

                <div className="pb-6 text-sm leading-7 text-neutral-500">

                  {
                    product.description
                  }

                  <div className="mt-4 space-y-2">

                    <p>
                      <span className="font-semibold text-black">
                        Kategoria:
                      </span>{" "}
                      {
                        product.category
                      }
                    </p>

                    <p>
                      <span className="font-semibold text-black">
                        Stoku:
                      </span>{" "}
                      {stock} copë
                    </p>

                  </div>

                </div>

              </details>

              <details className="group border-b border-neutral-200">

                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-bold">

                  Pagesa & dërgesa

                  <Plus
                    size={17}
                    className="transition duration-300 group-open:rotate-45"
                  />

                </summary>

                <div className="pb-6 text-sm leading-7 text-neutral-500">

                  <div className="flex gap-3">

                    <ShieldCheck
                      size={19}
                      className="mt-1 flex-shrink-0 text-black"
                    />

                    <p>
                      Pagesa bëhet në
                      dorëzim. Dërgesa
                      është e disponueshme
                      në Kosovë, Shqipëri
                      dhe Maqedoni të
                      Veriut. Kostoja
                      finale llogaritet
                      gjatë checkout-it.
                    </p>

                  </div>

                </div>

              </details>

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* RELATED PRODUCTS */}
        {/* ================================= */}

        {relatedProducts.length >
          0 && (
          <section className="border-t border-neutral-200 bg-[#f7f7f5]">

            <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">

              <div className="mb-10 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-7 sm:flex-row sm:items-end">

                <div>

                  <div className="flex items-center gap-3">

                    <span className="h-[2px] w-7 bg-[#009246]" />

                    <p className="text-[9px] font-black tracking-[0.35em] text-neutral-400">
                      APAR SELECTION
                    </p>

                    <span className="h-[2px] w-7 bg-[#CE2B37]" />

                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                    MUND TË TË
                    PËLQEJNË
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500">
                    Produkte të tjera
                    të zgjedhura nga
                    koleksioni APAR.
                  </p>

                </div>

                <Link
                  to="/shop"
                  className="group flex items-center gap-3 text-[10px] font-black tracking-[0.14em] text-black"
                >
                  SHIKO TË GJITHA

                  <ArrowLeft
                    size={15}
                    className="rotate-180 transition duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

                {relatedProducts.map(
                  (
                    relatedProduct
                  ) => (
                    <ProductCard
                      key={
                        relatedProduct.id
                      }
                      product={
                        relatedProduct
                      }
                    />
                  )
                )}

              </div>

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}