
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Info,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";
import ProductCard from "../components/ProductCard";

import {
  getProductById,
  getProducts,
} from "../services/api";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const WHATSAPP_NUMBER = "38343977125";

// ======================================
// HELPERS
// ======================================

function asNumber(value) {
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

function euro(number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}

function imageUrl(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return (
      value.secure_url ||
      value.url ||
      value.image_url ||
      ""
    );
  }

  return "";
}

function variants(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function categoryName(value) {
  return typeof value === "string"
    ? value
    : value?.name || "Suplemente";
}

function readable(value) {
  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(readable)
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

// ======================================
// ACCORDION
// ======================================

function Accordion({ title, children }) {
  return (
    <details className="group border-b border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold text-white marker:hidden [&::-webkit-details-marker]:hidden">
        {title}

        <Plus
          size={18}
          className="shrink-0 text-[#FF7900] transition-transform group-open:rotate-45"
        />
      </summary>

      <div className="pb-6 text-sm leading-7 text-neutral-400">
        {children}
      </div>
    </details>
  );
}

// ======================================
// PRODUCT PAGE
// ======================================

export default function Product() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWeight, setSelectedWeight] =
    useState(null);

  const [selectedFlavor, setSelectedFlavor] =
    useState(null);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  // ======================================
  // LOAD PRODUCT FROM API
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setRelatedProducts([]);
      setAdded(false);

      try {
        const response = await getProductById(id);

        const source =
          response?.product ||
          response?.data ||
          response;

        if (
          !source ||
          typeof source !== "object" ||
          source.id == null
        ) {
          throw new Error("Produkti nuk u gjet.");
        }

        // Lexon fushat e reja nëse ekzistojnë.
        // Ndryshe ruan kompatibilitetin
        // me sizes dhe colors të APAR.

        const weights = variants(
          source.weights ?? source.sizes
        );

        const flavors = variants(
          source.flavors ?? source.colors
        );

        const images = [
          source.image,
          ...(Array.isArray(source.images)
            ? source.images
            : []),
        ]
          .map(imageUrl)
          .filter(Boolean);

        const normalized = {
          ...source,

          price: asNumber(source.price),

          oldPrice: asNumber(
            source.oldPrice ?? source.old_price
          ),

          stock: asNumber(source.stock),

          sizes: weights,
          colors: flavors,

          images: [...new Set(images)],
          image: images[0] || "",
        };

        if (!cancelled) {
          setProduct(normalized);

          setSelectedWeight(
            weights[0] || null
          );

          setSelectedFlavor(
            flavors[0] || null
          );

          setQuantity(1);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Produkti nuk u ngarkua."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ======================================
  // RELATED PRODUCTS
  // ======================================

  useEffect(() => {
    if (!product) return undefined;

    let cancelled = false;

    async function loadRelated() {
      try {
        const response = await getProducts();

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : [];

        const currentCategory = categoryName(
          product.category
        ).toLocaleLowerCase("sq");

        const available = list.filter(
          (item) =>
            item &&
            item.active !== false &&
            String(item.id) !== String(product.id)
        );

        const related = available.filter(
          (item) =>
            categoryName(
              item.category
            ).toLocaleLowerCase("sq") ===
            currentCategory
        );

        if (!cancelled) {
          setRelatedProducts(
            related.slice(0, 4)
          );
        }
      } catch {
        if (!cancelled) {
          setRelatedProducts([]);
        }
      }
    }

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [product]);

  // ======================================
  // ADD TO CART MESSAGE TIMER
  // ======================================

  useEffect(() => {
    if (!added) return undefined;

    const timer = window.setTimeout(() => {
      setAdded(false);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [added]);

  // ======================================
  // PAGE TITLE
  // ======================================

  useEffect(() => {
    document.title = product?.name
      ? `${product.name} | ProteinFitness`
      : "Produktet | ProteinFitness";
  }, [product]);

  // ======================================
  // PRODUCT CALCULATIONS
  // ======================================

  const images = useMemo(
    () => product?.images || [],
    [product]
  );

  const favorite = product
    ? isInWishlist(product.id)
    : false;

  const stockKnown =
    product?.stock !== null &&
    product?.stock !== undefined;

  const outOfStock =
    stockKnown && product.stock <= 0;

  const maxQuantity = stockKnown
    ? Math.max(1, Math.floor(product.stock))
    : 99;

  const canAdd = Boolean(
    product &&
      product.price !== null &&
      product.price > 0 &&
      !outOfStock
  );

  const discounted =
    product &&
    product.oldPrice !== null &&
    product.price !== null &&
    product.oldPrice > product.price;

  const discountPercent = discounted
    ? Math.round(
        ((product.oldPrice - product.price) /
          product.oldPrice) *
          100
      )
    : 0;

  const savedAmount = discounted
    ? product.oldPrice - product.price
    : 0;

  const total =
    product?.price !== null && product
      ? product.price * quantity
      : null;

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      product
        ? `Përshëndetje ProteinFitness! Dua informacione për produktin: ${product.name} (PF-${product.id}).`
        : "Përshëndetje ProteinFitness! Dua informacione për produktet."
    )}`;

  // ======================================
  // ADD TO CART
  // ======================================

  function handleAddToCart() {
    if (!canAdd) return;

    // Ruajmë emrat size dhe color
    // për kompatibilitet me CartContext.

    addToCart(product, {
      size: selectedWeight,
      color: selectedFlavor,
      quantity,
    });

    setAdded(true);
  }

  // ======================================
  // VARIANT BUTTON STYLES
  // ======================================

  const selectedClass = (active) =>
    `min-h-11 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
      active
        ? "border-[#FF7900] bg-[#FF7900] text-black"
        : "border-white/15 bg-[#161616] text-neutral-300 hover:border-[#FF7900]/50"
    }`;

  // ======================================
  // RENDER
  // ======================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#080808] text-white">

        {/* ================================= */}
        {/* BREADCRUMB */}
        {/* ================================= */}

        <div className="border-b border-white/10 bg-[#0C0C0C]">
          <nav
            aria-label="Navigimi"
            className="mx-auto flex max-w-[1500px] items-center gap-2 px-5 py-5 text-xs sm:px-6 lg:px-10"
          >
            <Link
              to="/"
              className="text-neutral-500 hover:text-[#FF7900]"
            >
              Ballina
            </Link>

            <ChevronRight
              size={13}
              className="text-[#FF7900]"
            />

            <Link
              to="/shop"
              className="text-neutral-500 hover:text-[#FF7900]"
            >
              Produktet
            </Link>

            {product && (
              <>
                <ChevronRight
                  size={13}
                  className="text-[#FF7900]"
                />

                <span className="max-w-[210px] truncate font-semibold text-white sm:max-w-lg">
                  {product.name}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading ? (
          <div
            role="status"
            className="flex min-h-[580px] flex-col items-center justify-center gap-5"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#FF7900]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              Duke ngarkuar produktin...
            </p>
          </div>

        ) : !product ? (

          /* ================================= */
          /* PRODUCT NOT FOUND */
          /* ================================= */

          <div className="mx-auto flex min-h-[560px] max-w-xl flex-col items-center justify-center px-5 text-center">
            <Info
              size={36}
              className="text-[#FF7900]"
            />

            <h1 className="mt-6 text-3xl font-black sm:text-4xl">
              Produkti nuk u gjet
            </h1>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              {error ||
                "Produkti nuk është i disponueshëm."}
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FF7900] px-6 py-4 text-xs font-black text-black"
            >
              <ArrowLeft size={18} />
              KTHEHU TE PRODUKTET
            </Link>
          </div>

        ) : (
          <>
            {/* ================================= */}
            {/* PRODUCT CONTENT */}
            {/* ================================= */}

            <section className="relative mx-auto grid max-w-[1500px] gap-8 px-4 py-9 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-10 lg:py-16">

              {/* ================================= */}
              {/* LEFT — PRODUCT GALLERY */}
              {/* ================================= */}

              <div className="min-w-0">

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-2 sm:p-4">

                  {/* ORANGE LINE */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#FF7900] via-[#FFB162] to-transparent" />

                  {images.length ? (
                    <ProductGallery
                      images={images}
                      productName={product.name}
                    />
                  ) : (
                    <div className="flex aspect-[4/5] flex-col items-center justify-center text-neutral-500">
                      <ShoppingBag
                        size={44}
                        className="text-[#FF7900]/50"
                      />

                      <p className="mt-4 text-xs">
                        Fotoja e produktit po përgatitet
                      </p>
                    </div>
                  )}

                </div>

                <p className="mt-4 text-center text-xs text-neutral-500">
                  Fotografitë dhe përshkrimet e produktit
                  janë për qëllime informimi.
                </p>

              </div>

              {/* ================================= */}
              {/* RIGHT — PRODUCT INFO */}
              {/* ================================= */}

              <div className="min-w-0 lg:pt-2">

                {/* CATEGORY */}
                <div className="mb-5 flex flex-wrap items-center gap-2.5">

                  <span className="h-[2px] w-8 bg-[#FF7900]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#FF9C37]">
                    {categoryName(product.category)}
                  </span>

                  <span className="text-[10px] text-neutral-600">
                    PF-{product.id}
                  </span>

                </div>

                {/* ================================= */}
                {/* PRODUCT NAME + WISHLIST */}
                {/* ================================= */}

                <div className="flex items-start gap-3 sm:gap-5">

                  <h1 className="min-w-0 flex-1 break-words text-[clamp(2rem,4.5vw,4rem)] font-black uppercase leading-[1.06] tracking-[-0.045em]">
                    {product.name}
                  </h1>

                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
                    aria-label={
                      favorite
                        ? "Largo nga të preferuarat"
                        : "Shto te të preferuarat"
                    }
                    aria-pressed={favorite}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      favorite
                        ? "border-[#FF7900] bg-[#FF7900] text-black"
                        : "border-white/15 bg-[#151515] hover:border-[#FF7900] hover:text-[#FF7900]"
                    }`}
                  >
                    <Heart
                      size={21}
                      fill={
                        favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* ================================= */}
                {/* PRODUCT BADGES */}
                {/* ================================= */}

                <div className="mt-5 flex flex-wrap items-center gap-2">

                  {product.badge && (
                    <span className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}

                  {discounted && (
                    <span className="rounded-md bg-[#FF7900] px-3 py-2 text-[10px] font-black text-black">
                      −{discountPercent}% ZBRITJE
                    </span>
                  )}

                  {outOfStock && (
                    <span className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-400">
                      PA STOK
                    </span>
                  )}

                </div>

                {/* ================================= */}
                {/* PRICE */}
                {/* ================================= */}

                <div className="mt-7 rounded-2xl border border-white/10 bg-[#131313] p-5 sm:p-6">

                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.17em] text-neutral-500">
                    ÇMIMI I PRODUKTIT
                  </p>

                  <div className="flex flex-wrap items-baseline gap-3">

                    <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {product.price !== null
                        ? euro(product.price)
                        : "Çmimi në përgatitje"}
                    </span>

                    {discounted && (
                      <span className="text-base text-neutral-500 line-through">
                        {euro(product.oldPrice)}
                      </span>
                    )}

                  </div>

                  {discounted && (
                    <p className="mt-3 text-xs font-bold text-[#FF9C37]">
                      Kursen {euro(savedAmount)} në këtë produkt
                    </p>
                  )}

                </div>

                {/* ================================= */}
                {/* PRODUCT DESCRIPTION */}
                {/* ================================= */}

                {product.description && (
                  <p className="mt-6 border-l-[3px] border-[#FF7900] pl-4 text-sm leading-8 text-neutral-400">
                    {readable(product.description)}
                  </p>
                )}

                {/* ================================= */}
                {/* SUPPLEMENT INFORMATION */}
                {/* ================================= */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {product.brand && (
                    <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-neutral-300">
                      Marka:{" "}
                      <strong className="text-white">
                        {readable(product.brand)}
                      </strong>
                    </span>
                  )}

                  {product.weight && (
                    <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-neutral-300">
                      Pesha:{" "}
                      <strong className="text-white">
                        {readable(product.weight)}
                      </strong>
                    </span>
                  )}

                  {product.flavor && (
                    <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-neutral-300">
                      Shija:{" "}
                      <strong className="text-white">
                        {readable(product.flavor)}
                      </strong>
                    </span>
                  )}

                </div>

                {/* ================================= */}
                {/* STOCK STATUS */}
                {/* ================================= */}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-5">

                  <div className="flex items-center gap-3">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        outOfStock
                          ? "bg-red-500"
                          : stockKnown
                            ? "bg-green-500"
                            : "bg-amber-500"
                      }`}
                    />

                    <span className="text-sm font-semibold">
                      {outOfStock
                        ? "Jashtë stokut"
                        : stockKnown
                          ? "Në stok"
                          : "Stoku duhet konfirmuar"}
                    </span>

                  </div>

                  {stockKnown && !outOfStock && (
                    <span className="text-xs text-neutral-500">
                      {Math.floor(product.stock)} copë të disponueshme
                    </span>
                  )}

                </div>

                {/* ================================= */}
                {/* WEIGHT OPTIONS */}
                {/* ================================= */}

                {product.sizes.length > 0 && (
                  <div className="mt-7">

                    <p className="mb-3 text-sm font-bold">
                      Pesha / Paketimi
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {product.sizes.map((weight) => (
                        <button
                          key={weight}
                          type="button"
                          onClick={() => {
                            setSelectedWeight(weight);
                            setQuantity(1);
                          }}
                          aria-pressed={
                            selectedWeight === weight
                          }
                          className={selectedClass(
                            selectedWeight === weight
                          )}
                        >
                          {weight}
                        </button>
                      ))}

                    </div>

                  </div>
                )}

                {/* ================================= */}
                {/* FLAVOR OPTIONS */}
                {/* ================================= */}

                {product.colors.length > 0 && (
                  <div className="mt-7">

                    <p className="mb-3 text-sm font-bold">
                      Shija / Varianti
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {product.colors.map((flavor) => (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => {
                            setSelectedFlavor(flavor);
                            setQuantity(1);
                          }}
                          aria-pressed={
                            selectedFlavor === flavor
                          }
                          className={selectedClass(
                            selectedFlavor === flavor
                          )}
                        >
                          {flavor}
                        </button>
                      ))}

                    </div>

                  </div>
                )}

                {/* ================================= */}
                {/* QUANTITY */}
                {/* ================================= */}

                {canAdd && (
                  <div className="mt-7">

                    <div className="mb-3 flex items-center justify-between gap-3">

                      <p className="text-sm font-bold">
                        Sasia
                      </p>

                      {stockKnown && (
                        <span className="text-xs text-neutral-500">
                          Maksimumi {maxQuantity}
                        </span>
                      )}

                    </div>

                    <div className="inline-flex overflow-hidden rounded-xl border border-white/15 bg-[#141414]">

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((n) =>
                            Math.max(1, n - 1)
                          )
                        }
                        disabled={quantity <= 1}
                        aria-label="Zvogëlo sasinë"
                        className="flex h-12 w-12 items-center justify-center hover:bg-white/5 disabled:opacity-30"
                      >
                        <Minus size={17} />
                      </button>

                      <span className="flex h-12 w-14 items-center justify-center border-x border-white/15 text-sm font-black">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((n) =>
                            Math.min(maxQuantity, n + 1)
                          )
                        }
                        disabled={quantity >= maxQuantity}
                        aria-label="Rrit sasinë"
                        className="flex h-12 w-12 items-center justify-center hover:bg-white/5 disabled:opacity-30"
                      >
                        <Plus size={17} />
                      </button>

                    </div>

                  </div>
                )}

                {/* ================================= */}
                {/* ADD TO CART */}
                {/* ================================= */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className={`mt-8 flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-black uppercase tracking-[0.06em] transition-all ${
                    !canAdd
                      ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                      : added
                        ? "bg-green-600 text-white"
                        : "bg-[#FF7900] text-black hover:bg-[#FFA03D]"
                  }`}
                >
                  {!canAdd ? (
                    "NUK DISPONOHET PËR POROSI"
                  ) : added ? (
                    <>
                      <Check size={19} />
                      U SHTUA NË SHPORTË
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={19} />
                      SHTO NË SHPORTË
                    </>
                  )}
                </button>

                {canAdd && total !== null && (
                  <p className="mt-3 text-center text-xs text-neutral-500">
                    Totali i produkteve:{" "}
                    <strong className="text-white">
                      {euro(total)}
                    </strong>
                  </p>
                )}

                {/* ================================= */}
                {/* WHATSAPP CONTACT */}
                {/* ================================= */}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl border border-[#FF7900]/40 bg-[#FF7900]/5 px-5 text-xs font-extrabold text-[#FF9C37] transition hover:border-[#FF7900] hover:bg-[#FF7900]/10"
                >
                  <FaWhatsapp size={19} />

                  PYET PËR KËTË PRODUKT

                  <ArrowRight size={17} />
                </a>

                {/* ================================= */}
                {/* SERVICE CARDS */}
                {/* ================================= */}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#131313] p-4">

                    <PackageCheck
                      size={22}
                      className="shrink-0 text-[#FF7900]"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Porosi e thjeshtë
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Zgjidh produktin dhe sasinë.
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#131313] p-4">

                    <Truck
                      size={22}
                      className="shrink-0 text-[#FF7900]"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Informacion për dërgesën
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Kontakto për zonën dhe koston.
                      </p>
                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* PRODUCT DETAILS */}
                {/* ================================= */}

                <div className="mt-9 border-t border-white/10">

                  <Accordion title="Detajet e produktit">

                    {product.description && (
                      <p>
                        {readable(product.description)}
                      </p>
                    )}

                    <div className="mt-3 space-y-1">

                      <p>
                        <strong className="text-white">
                          Kategoria:
                        </strong>{" "}
                        {categoryName(product.category)}
                      </p>

                      {product.brand && (
                        <p>
                          <strong className="text-white">
                            Marka:
                          </strong>{" "}
                          {readable(product.brand)}
                        </p>
                      )}

                      {product.weight && (
                        <p>
                          <strong className="text-white">
                            Pesha:
                          </strong>{" "}
                          {readable(product.weight)}
                        </p>
                      )}

                      {product.flavor && (
                        <p>
                          <strong className="text-white">
                            Shija:
                          </strong>{" "}
                          {readable(product.flavor)}
                        </p>
                      )}

                    </div>

                  </Accordion>

                  {/* INGREDIENTS */}
                  {(product.ingredients ||
                    product.allergens) && (
                    <Accordion title="Përbërësit dhe alergjenët">

                      {product.ingredients && (
                        <p>
                          <strong className="text-white">
                            Përbërësit:
                          </strong>{" "}
                          {readable(product.ingredients)}
                        </p>
                      )}

                      {product.allergens && (
                        <p className="mt-2">
                          <strong className="text-white">
                            Alergjenët:
                          </strong>{" "}
                          {readable(product.allergens)}
                        </p>
                      )}

                    </Accordion>
                  )}

                  {/* NUTRITION INFO */}
                  {product.nutrition_info && (
                    <Accordion title="Vlerat ushqyese">

                      {typeof product.nutrition_info ===
                        "object" &&
                      !Array.isArray(
                        product.nutrition_info
                      ) ? (
                        <dl className="space-y-2">

                          {Object.entries(
                            product.nutrition_info
                          ).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between gap-4 border-b border-white/5 pb-2"
                            >
                              <dt>{key}</dt>

                              <dd className="text-right text-white">
                                {readable(value)}
                              </dd>
                            </div>
                          ))}

                        </dl>
                      ) : (
                        <p>
                          {readable(
                            product.nutrition_info
                          )}
                        </p>
                      )}

                    </Accordion>
                  )}

                  {/* PAYMENT AND DELIVERY */}
                  <Accordion title="Pagesa dhe dërgesa">

                    <div className="flex items-start gap-3">

                      <ShieldCheck
                        size={19}
                        className="mt-1 shrink-0 text-[#FF7900]"
                      />

                      <p>
                        Mundësia e pagesës në dorëzim,
                        zona e dërgesës dhe kostoja
                        konfirmohen gjatë porosisë.
                      </p>

                    </div>

                  </Accordion>

                </div>

              </div>

            </section>

            {/* ================================= */}
            {/* RELATED PRODUCTS */}
            {/* ================================= */}

            {relatedProducts.length > 0 && (
              <section className="border-t border-white/10 bg-[#0D0D0D] py-16 sm:py-20">

                <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

                  <div className="mb-9 flex flex-wrap items-end justify-between gap-6">

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
                        PROTEINFITNESS SELECTION
                      </p>

                      <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
                        PRODUKTE{" "}
                        <span className="text-[#FF7900]">
                          TË NGJASHME
                        </span>
                      </h2>

                    </div>

                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-[#FF9C37] hover:text-white"
                    >
                      SHIKO TË GJITHA

                      <ArrowRight size={17} />
                    </Link>

                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">

                    {relatedProducts.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item}
                      />
                    ))}

                  </div>

                </div>

              </section>
            )}

          </>
        )}

      </main>

      <Footer />
    </>
  );
}
