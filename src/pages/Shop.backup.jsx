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

import products from "../data/products";

/*
  ========================================
  SHOP CATEGORIES
  ========================================
*/

const categories = [
  "Të gjitha",
  "Veshje",
  "Aksesorë",
  "Kozmetikë",
];

const allowedCategories = [
  "Veshje",
  "Aksesorë",
  "Kozmetikë",
];

export default function Shop() {
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

        {/* ================================= */}
        {/* SHOP */}
        {/* ================================= */}

        <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">

          {/* ================================= */}
          {/* CATEGORY + SEARCH */}
          {/* ================================= */}

          <div className="flex flex-col gap-6 border-b border-neutral-200 pb-7 xl:flex-row xl:items-center xl:justify-between">

            {/* CATEGORIES */}
            <div className="flex gap-2 overflow-x-auto pb-1">

              {categories.map(
                (
                  category
                ) => (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                    className={`flex-shrink-0 border px-4 py-3 text-xs font-semibold tracking-[0.04em] transition duration-300 sm:px-5 sm:text-sm ${
                      selectedCategory ===
                      category
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black"
                    }`}
                  >
                    {
                      category
                    }
                  </button>
                )
              )}

            </div>

            {/* SEARCH */}
            <div className="flex w-full min-w-0 items-center border border-neutral-300 bg-white px-4 transition duration-300 focus-within:border-black xl:w-[350px]">

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
                className="w-full bg-transparent px-3 py-3.5 text-sm text-black outline-none placeholder:text-neutral-400"
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

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

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
                className={`flex h-[46px] items-center gap-2 border px-4 text-sm font-semibold transition duration-300 sm:px-5 ${
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
                  className="h-[46px] appearance-none border border-neutral-300 bg-white py-0 pl-4 pr-10 text-sm text-black outline-none transition hover:border-black focus:border-black"
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
            <div className="mt-6 border border-neutral-200 bg-[#f7f7f7] p-5 sm:p-6">

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
                      className={`border px-4 py-2.5 text-sm transition ${
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
                      className={`border px-4 py-2.5 text-sm transition ${
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
                      className={`border px-4 py-2.5 text-sm transition ${
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
                      className={`border px-4 py-2.5 text-sm transition ${
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
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

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

            <div className="flex min-h-[420px] flex-col items-center justify-center px-5 text-center">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-6 bg-[#009246]" />

                <span className="h-[2px] w-6 bg-neutral-300" />

                <span className="h-[2px] w-6 bg-[#CE2B37]" />

              </div>

              <p className="mt-6 text-[10px] font-bold tracking-[0.35em] text-neutral-400">
                APAR
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">
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
                className="mt-7 bg-black px-7 py-4 text-sm font-black tracking-[0.05em] text-white transition hover:bg-neutral-800"
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