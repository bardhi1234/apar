import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ShopHero from "../components/ShopHero";
import ShopCategoryNav from "../components/ShopCategoryNav";

import { getProducts } from "../services/api";

/*
  ========================================
  SHOP CATEGORIES
  ========================================
*/

const categories = [];

const allowedCategories = [
  "Veshje",
  "Aksesorë",
  "Kozmetikë",
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError("");

        const data = await getProducts();

        if (cancelled) return;

        const activeProducts = (data.products || []).filter(
          (product) => product.active !== false
        );

        setProducts(activeProducts);
      } catch (error) {
        if (!cancelled) {
          console.error("Shop products error:", error);
          setProductsError(error.message);
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const categoryFromUrl =
    searchParams.get(
      "category"
    );

  const searchFromUrl =
    searchParams.get(
      "search"
    ) || "";

  /*
    Nëse URL ka kategori që nuk
    ekziston më, përdor Të gjitha.
  */
  const selectedCategory =
    allowedCategories.includes(
      categoryFromUrl
    )
      ? categoryFromUrl
      : "Të gjitha";

  const [
    search,
    setSearch,
  ] = useState(
    searchFromUrl
  );

  const [
    sort,
    setSort,
  ] = useState(
    "default"
  );

  const [
    priceFilter,
    setPriceFilter,
  ] = useState(
    "all"
  );

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  /*
    ========================================
    REMOVE OLD PERSONALIZIM URL
    ========================================
  */

  useEffect(() => {
    if (
      categoryFromUrl &&
      !allowedCategories.includes(
        categoryFromUrl
      )
    ) {
      const params =
        new URLSearchParams(
          searchParams
        );

      params.delete(
        "category"
      );

      setSearchParams(
        params,
        {
          replace: true,
        }
      );
    }
  }, [
    categoryFromUrl,
    searchParams,
    setSearchParams,
  ]);

  /*
    ========================================
    SYNC SEARCH FROM URL
    ========================================
  */

  useEffect(() => {
    setSearch(
      searchFromUrl
    );
  }, [
    searchFromUrl,
  ]);

  /*
    ========================================
    CATEGORY
    ========================================
  */

  const handleCategoryChange = (
    category
  ) => {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (
      category ===
      "Të gjitha"
    ) {
      params.delete(
        "category"
      );
    } else {
      params.set(
        "category",
        category
      );
    }

    setSearchParams(
      params
    );
  };

  /*
    ========================================
    SEARCH
    ========================================
  */

  const handleSearchChange = (
    value
  ) => {
    setSearch(
      value
    );

    const params =
      new URLSearchParams(
        searchParams
      );

    if (
      value.trim()
    ) {
      params.set(
        "search",
        value
      );
    } else {
      params.delete(
        "search"
      );
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  };

  /*
    ========================================
    FILTER PRODUCTS
    ========================================
  */

  const filteredProducts =
    useMemo(() => {
      /*
        Personalizimi hiqet
        plotësisht nga Shop.
      */
      let result =
        products.filter(
          (product) =>
            product.category !==
            "Personalizim"
        );

      /*
        CATEGORY
      */
      if (
        selectedCategory !==
        "Të gjitha"
      ) {
        result =
          result.filter(
            (product) =>
              product.category ===
              selectedCategory
          );
      }

      /*
        SEARCH
      */
      if (
        search.trim()
      ) {
        const searchValue =
          search
            .trim()
            .toLowerCase();

        result =
          result.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              product.category
                .toLowerCase()
                .includes(
                  searchValue
                )
          );
      }

      /*
        PRICE
      */
      if (
        priceFilter ===
        "under25"
      ) {
        result =
          result.filter(
            (product) =>
              product.price <
              25
          );
      }

      if (
        priceFilter ===
        "25to40"
      ) {
        result =
          result.filter(
            (product) =>
              product.price >=
                25 &&
              product.price <=
                40
          );
      }

      if (
        priceFilter ===
        "over40"
      ) {
        result =
          result.filter(
            (product) =>
              product.price >
              40
          );
      }

      /*
        SORT
      */
      if (
        sort ===
        "low-high"
      ) {
        result.sort(
          (a, b) =>
            a.price -
            b.price
        );
      }

      if (
        sort ===
        "high-low"
      ) {
        result.sort(
          (a, b) =>
            b.price -
            a.price
        );
      }

      if (
        sort ===
        "newest"
      ) {
        result.sort(
          (a, b) =>
            b.id - a.id
        );
      }

      return result;
    }, [
      selectedCategory,
      search,
      sort,
      priceFilter,
    products,
  ]);

  /*
    ========================================
    RESET FILTERS
    ========================================
  */

  const resetFilters = () => {
    setSearch("");
    setSort(
      "default"
    );
    setPriceFilter(
      "all"
    );
    setShowFilters(
      false
    );

    setSearchParams({});
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">

        {/* ================================= */}
        {/* SHOP HERO */}
        {/* ================================= */}

        <ShopHero />

        <ShopCategoryNav />

        {/* ================================= */}
        {/* SHOP */}
        {/* ================================= */}

        <section className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-12 lg:px-10 lg:py-14">

          {/* ================================= */}
          {/* CATEGORY + SEARCH */}
          {/* ================================= */}

          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:gap-6 sm:pb-7 xl:flex-row xl:items-center xl:justify-between">


            {/* SEARCH */}
            <div className="flex h-11 w-full min-w-0 items-center border border-neutral-300 bg-white px-3 transition duration-300 focus-within:border-black sm:h-auto sm:px-4 xl:w-[350px]">

              <Search
                size={18}
                className="flex-shrink-0 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Kërko produkt..."
                value={
                  search
                }
                onChange={(
                  e
                ) =>
                  handleSearchChange(
                    e.target
                      .value
                  )
                }
                className="w-full bg-transparent px-3 py-2.5 text-[13px] text-black outline-none placeholder:text-neutral-400 sm:py-3.5 sm:text-sm"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    handleSearchChange(
                      ""
                    )
                  }
                  aria-label="Pastro kërkimin"
                  className="text-neutral-400 transition hover:text-black"
                >
                  <X
                    size={
                      17
                    }
                  />
                </button>
              )}

            </div>

          </div>

          {/* ================================= */}
          {/* RESULTS + CONTROLS */}
          {/* ================================= */}

          <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400">
                APAR PRODUCTS
              </p>

              <p className="mt-2 text-sm text-neutral-500">

                <span className="font-bold text-black">
                  {
                    filteredProducts.length
                  }
                </span>{" "}

                {filteredProducts.length ===
                1
                  ? "produkt"
                  : "produkte"}

              </p>

            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* FILTER */}
              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className={`flex h-10 items-center gap-2 border px-3 text-[12px] font-semibold transition duration-300 sm:h-[46px] sm:px-5 sm:text-sm ${
                  showFilters
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-black hover:border-black"
                }`}
              >
                <SlidersHorizontal
                  size={16}
                />

                Filter
              </button>

              {/* SORT */}
              <div className="relative">

                <select
                  value={
                    sort
                  }
                  onChange={(
                    e
                  ) =>
                    setSort(
                      e.target
                        .value
                    )
                  }
                  className="h-10 appearance-none border border-neutral-300 bg-white py-0 pl-3 pr-9 text-[12px] text-black outline-none transition hover:border-black focus:border-black sm:h-[46px] sm:pl-4 sm:pr-10 sm:text-sm"
                >
                  <option value="default">
                    Renditja
                  </option>

                  <option value="newest">
                    Më të rejat
                  </option>

                  <option value="low-high">
                    Çmimi: ulët → lartë
                  </option>

                  <option value="high-low">
                    Çmimi: lartë → ulët
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* FILTER PANEL */}
          {/* ================================= */}

          {showFilters && (
            <div className="mt-4 border border-neutral-200 bg-[#f7f7f7] p-4 sm:mt-6 sm:p-6">

              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                <div>

                  <p className="text-[10px] font-bold tracking-[0.3em] text-neutral-400">
                    FILTRO SIPAS ÇMIMIT
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setPriceFilter(
                          "all"
                        )
                      }
                      className={`border px-3 py-2 text-[12px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                        priceFilter ===
                        "all"
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                      }`}
                    >
                      Të gjitha
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPriceFilter(
                          "under25"
                        )
                      }
                      className={`border px-3 py-2 text-[12px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                        priceFilter ===
                        "under25"
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                      }`}
                    >
                      Nën 25 €
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPriceFilter(
                          "25to40"
                        )
                      }
                      className={`border px-3 py-2 text-[12px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                        priceFilter ===
                        "25to40"
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                      }`}
                    >
                      25 € – 40 €
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPriceFilter(
                          "over40"
                        )
                      }
                      className={`border px-3 py-2 text-[12px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                        priceFilter ===
                        "over40"
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                      }`}
                    >
                      Mbi 40 €
                    </button>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="w-fit text-sm font-semibold text-black underline underline-offset-4"
                >
                  Pastro filtrat
                </button>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* PRODUCTS */}
          {/* ================================= */}

          {filteredProducts.length >
          0 ? (
            <div className="mt-7 grid grid-cols-2 gap-x-2.5 gap-y-8 sm:mt-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

              {filteredProducts.map(
                (
                  product
                ) => (
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
          ) : (
            /* EMPTY STATE */

            <div className="flex min-h-[320px] flex-col items-center justify-center px-4 text-center sm:min-h-[420px] sm:px-5">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-6 bg-[#009246]" />

                <span className="h-[2px] w-6 bg-neutral-300" />

                <span className="h-[2px] w-6 bg-[#CE2B37]" />

              </div>

              <p className="mt-6 text-[10px] font-bold tracking-[0.35em] text-neutral-400">
                APAR
              </p>

              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-black sm:text-4xl">
                Nuk u gjet asnjë produkt.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
                Ndrysho kategorinë,
                kërkimin ose filtrin e
                çmimit dhe provo përsëri.
              </p>

              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="mt-6 flex h-11 items-center justify-center bg-black px-5 text-[12px] font-black tracking-[0.05em] text-white transition hover:bg-neutral-800 sm:mt-7 sm:h-auto sm:px-7 sm:py-4 sm:text-sm"
              >
                PASTRO FILTRAT
              </button>

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}