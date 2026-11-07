
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopHero from "../components/ShopHero";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

// Çmimet mund të vijnë nga API si numër ose si tekst.
function toPrice(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const raw = String(value).trim().replace(/[\s€]/g, "");
  const normalized = raw.includes(",") && raw.includes(".")
    ? raw.lastIndexOf(",") > raw.lastIndexOf(".")
      ? raw.replace(/\./g, "").replace(",", ".")
      : raw.replace(/,/g, "")
    : raw.replace(",", ".");
  const price = Number(normalized);
  return Number.isFinite(price) ? price : null;
}

function getCategoryName(product) {
  return typeof product.category === "string"
    ? product.category
    : product.category?.name || "";
}

function normalize(text) {
  return String(text || "").trim().toLocaleLowerCase("sq");
}

const PRICE_OPTIONS = [
  { value: "all", label: "Të gjitha" },
  { value: "under30", label: "Nën 30 €" },
  { value: "30to60", label: "30 € – 60 €" },
  { value: "60to100", label: "60 € – 100 €" },
  { value: "over100", label: "Mbi 100 €" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);

  // Merr produktet nga backend-i ekzistues.
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await getProducts();
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : [];

        if (!cancelled) {
          setProducts(list.filter((product) => product && product.active !== false));
        }
      } catch (err) {
        if (!cancelled) {
          setProducts([]);
          setError(err?.message || "Nuk arritëm t'i ngarkojmë produktet.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => { cancelled = true; };
  }, [reloadKey]);

  useEffect(() => {
    document.title = "Produktet | ProteinFitness";
  }, []);

  // Përditëso kërkimin në URL pa humbur kategorinë e zgjedhur.
  function handleSearchChange(value) {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    setSearchParams(params, { replace: true });
  }

  function resetFilters() {
    setPriceFilter("all");
    setSort("default");
    setOnlyDiscounts(false);
    setShowFilters(false);
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("search");
    params.delete("page");
    setSearchParams(params);
  }

  // Kategoria nga ShopCategoryNav lexohet direkt prej URL-së.
  const filteredProducts = useMemo(() => {
    const query = normalize(search);
    const selectedCategory = normalize(category);

    const result = products.filter((product) => {
      const productCategory = getCategoryName(product);
      const price = toPrice(product.price);
      const oldPrice = toPrice(product.oldPrice ?? product.old_price);
      const discounted = price !== null && oldPrice !== null && oldPrice > price;

      if (selectedCategory && normalize(productCategory) !== selectedCategory) {
        return false;
      }

      if (query) {
        const haystack = normalize([
          product.name,
          productCategory,
          product.brand,
          product.description,
        ].filter(Boolean).join(" "));
        if (!haystack.includes(query)) return false;
      }

      if (onlyDiscounts && !discounted) return false;

      if (priceFilter !== "all") {
        if (price === null) return false;
        if (priceFilter === "under30" && price >= 30) return false;
        if (priceFilter === "30to60" && (price < 30 || price > 60)) return false;
        if (priceFilter === "60to100" && (price <= 60 || price > 100)) return false;
        if (priceFilter === "over100" && price <= 100) return false;
      }

      return true;
    });

    if (sort === "low-high") {
      result.sort((a, b) => (toPrice(a.price) ?? Infinity) - (toPrice(b.price) ?? Infinity));
    } else if (sort === "high-low") {
      result.sort((a, b) => (toPrice(b.price) ?? -Infinity) - (toPrice(a.price) ?? -Infinity));
    } else if (sort === "newest") {
      result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    } else if (sort === "discount") {
      const percentage = (product) => {
        const price = toPrice(product.price);
        const oldPrice = toPrice(product.oldPrice ?? product.old_price);
        return price !== null && oldPrice > price
          ? (oldPrice - price) / oldPrice
          : 0;
      };
      result.sort((a, b) => percentage(b) - percentage(a));
    }

    return result;
  }, [products, category, search, priceFilter, onlyDiscounts, sort]);

  const filterCount = [
    Boolean(category),
    Boolean(search.trim()),
    priceFilter !== "all",
    onlyDiscounts,
  ].filter(Boolean).length;

  const pillClass = (active) =>
    `rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
      active
        ? "border-[#FF7900] bg-[#FF7900] text-black"
        : "border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#FF7900]/50 hover:text-white"
    }`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#080808] text-white">
        {/* ShopHero përmban tashmë ShopCategoryNav. */}
        <ShopHero />

        <section
          id="shop-products"
          className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-48 top-12 h-[500px] w-[500px] rounded-full bg-[#FF7900]/[0.05] blur-[150px]" />
            <div className="absolute -left-52 bottom-0 h-[500px] w-[500px] rounded-full bg-[#FF7900]/[0.035] blur-[150px]" />
          </div>

          <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
            {/* HEADING */}
            <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-[2px] w-9 bg-[#FF7900]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FF7900]">
                    PROTEINFITNESS STORE
                  </span>
                </div>
                <h2 className="text-[clamp(2.2rem,5vw,4.6rem)] font-black uppercase leading-[1.05] tracking-[-0.05em]">
                  KATALOGU <span className="text-[#FF7900]">I PRODUKTEVE.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base">
                  Eksploro suplementet dhe aksesorët sportivë. Kërko, filtro dhe krahaso produktet në një vend.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#FF7900]/20 bg-[#FF7900]/10 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF7900]" />
                <span className="text-[11px] font-bold text-[#FF9D3C]">
                  {loading ? "Duke ngarkuar..." : `${filteredProducts.length} produkte`}
                </span>
              </div>
            </div>

            {/* SEARCH + SORT + FILTER */}
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-3 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex min-h-[52px] min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-[#090909] px-4 focus-within:border-[#FF7900]">
                  <Search size={19} className="shrink-0 text-[#FF7900]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Kërko proteina, kreatinë, marka..."
                    aria-label="Kërko produkte"
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      aria-label="Pastro kërkimin"
                      className="text-neutral-400 hover:text-[#FF7900]"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFilters((open) => !open)}
                    aria-expanded={showFilters}
                    aria-controls="shop-filter-panel"
                    className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-extrabold uppercase tracking-wide transition lg:flex-none ${
                      showFilters
                        ? "border-[#FF7900] bg-[#FF7900] text-black"
                        : "border-white/15 bg-[#090909] text-white hover:border-[#FF7900]"
                    }`}
                  >
                    <SlidersHorizontal size={17} />
                    FILTRAT
                    {filterCount > 0 && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${showFilters ? "bg-black text-white" : "bg-[#FF7900] text-black"}`}>
                        {filterCount}
                      </span>
                    )}
                  </button>

                  <div className="relative min-w-0 flex-[1.4] lg:w-[235px] lg:flex-none">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      aria-label="Rendit produktet"
                      className="h-[52px] w-full appearance-none rounded-xl border border-white/15 bg-[#090909] py-3 pl-3 pr-9 text-xs font-semibold text-white outline-none transition hover:border-[#FF7900] focus:border-[#FF7900] sm:pl-4"
                    >
                      <option value="default">Renditja</option>
                      <option value="newest">Më të rejat</option>
                      <option value="low-high">Çmimi: ulët – lartë</option>
                      <option value="high-low">Çmimi: lartë – ulët</option>
                      <option value="discount">Zbritja më e madhe</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#FF7900]" />
                  </div>
                </div>
              </div>

              {/* EXPANDABLE FILTERS */}
              {showFilters && (
                <div id="shop-filter-panel" className="mt-5 border-t border-white/10 pt-5">
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-neutral-300">
                    FILTRO SIPAS ÇMIMIT
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriceFilter(option.value)}
                        aria-pressed={priceFilter === option.value}
                        className={pillClass(priceFilter === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
                      <input
                        type="checkbox"
                        checked={onlyDiscounts}
                        onChange={(event) => setOnlyDiscounts(event.target.checked)}
                        className="h-4 w-4 accent-[#FF7900]"
                      />
                      <BadgePercent size={18} className="text-[#FF7900]" />
                      Vetëm produktet në zbritje
                    </label>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 transition hover:text-[#FF7900]"
                    >
                      <RotateCcw size={16} /> PASTRO FILTRAT
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RESULT STATUS */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <p className="text-sm text-neutral-400" aria-live="polite">
                {loading ? "Duke ngarkuar produktet..." : (
                  <>U gjetën <strong className="text-white">{filteredProducts.length}</strong> produkte</>
                )}
                {category && <span className="text-[#FF9D3C]"> · {category}</span>}
              </p>
              {filterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7900] hover:text-[#FFB568]"
                >
                  <X size={15} /> HIQ FILTRAT
                </button>
              )}
            </div>

            {/* PRODUCTS / LOADING / ERROR / EMPTY */}
            {loading ? (
              <div role="status" aria-label="Duke ngarkuar produktet" className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
                    <div className="aspect-[4/5] bg-white/5" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/2 rounded bg-white/10" />
                      <div className="h-4 w-4/5 rounded bg-white/10" />
                      <div className="h-5 w-1/3 rounded bg-white/10" />
                      <div className="h-10 rounded-lg bg-[#FF7900]/15" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div role="alert" className="mt-10 rounded-2xl border border-red-500/20 bg-[#170E0E] px-6 py-16 text-center">
                <h3 className="text-2xl font-black text-white">Gabim gjatë ngarkimit</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-neutral-400">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF7900] px-6 py-3 text-sm font-black text-black hover:bg-[#FFA23D]"
                >
                  PROVO PËRSËRI <ArrowRight size={18} />
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-10 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-5 py-14 text-center">
                <Search size={34} className="text-[#FF7900]" />
                <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                  Nuk u gjet asnjë produkt
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-neutral-400">
                  Provo një kategori, kërkim ose interval tjetër çmimi.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF7900] px-6 py-3 text-xs font-extrabold text-black hover:bg-[#FFA23D]"
                >
                  PASTRO FILTRAT <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
