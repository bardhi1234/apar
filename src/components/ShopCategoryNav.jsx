
import { useSearchParams } from "react-router-dom";

import {
  LayoutGrid,
  ChevronRight,
  Dumbbell,
} from "lucide-react";

import { useCategories } from "../hooks/useCategories";

export default function ShopCategoryNav({
  dark = false,
}) {
  // =====================================
  // DATABASE CATEGORIES
  // =====================================

  const {
    categories = [],
    loading = false,
  } = useCategories();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const currentCategory =
    searchParams.get("category");

  // =====================================
  // VALID CATEGORIES
  // =====================================

  const validCategories = (
    Array.isArray(categories) ? categories : []
  ).filter(
    (category) =>
      typeof category?.name === "string" &&
      category.name.trim().length > 0
  );

  // =====================================
  // SELECT CATEGORY
  // =====================================

  function selectCategory(name) {
    const params = new URLSearchParams(
      searchParams
    );

    if (!name) {
      params.delete("category");
    } else {
      params.set("category", name);
    }

    // Kthehu në faqen e parë kur ndryshon filtri.
    params.delete("page");

    setSearchParams(params);
  }

  // =====================================
  // CHECK ACTIVE CATEGORY
  // =====================================

  function isActive(name) {
    if (!name) {
      return !currentCategory;
    }

    return (
      currentCategory?.toLocaleLowerCase("sq") ===
      name.toLocaleLowerCase("sq")
    );
  }

  // =====================================
  // THEME STYLES
  // =====================================

  const backgroundClass = dark
    ? "border-white/10 bg-[#0B0B0B] text-white"
    : "border-neutral-200 bg-white text-black";

  const inactiveClass = dark
    ? "border-white/10 bg-white/[0.035] text-neutral-400 hover:border-[#FF7900]/50 hover:bg-[#FF7900]/10 hover:text-white"
    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-[#FF7900]/50 hover:bg-[#FF7900]/10 hover:text-black";

  const activeClass =
    "border-[#FF7900] bg-[#FF7900] text-black shadow-[0_8px_25px_rgba(255,121,0,0.16)]";

  // =====================================
  // RENDER
  // =====================================

  return (
    <nav
      aria-label="Kategoritë e produkteve"
      className={`relative isolate border-y ${backgroundClass}`}
    >
      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-[150px] w-[350px] rounded-full bg-[#FF7900]/[0.035] blur-[90px]" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative mx-auto flex max-w-[1500px] items-center gap-5 px-4 sm:px-6 lg:px-10">

        {/* ================================= */}
        {/* DESKTOP CATEGORY LABEL */}
        {/* ================================= */}

        <div
          className={`hidden shrink-0 items-center gap-3 border-r py-5 pr-6 lg:flex ${
            dark
              ? "border-white/10"
              : "border-neutral-200"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10">
            <LayoutGrid
              size={19}
              strokeWidth={1.8}
              className="text-[#FF7900]"
            />
          </span>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">
              KATEGORITË
            </p>

            <p className="mt-1 text-[10px] font-medium text-neutral-500">
              Zgjedh produktet
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* CATEGORY SCROLL AREA */}
        {/* ================================= */}

        <div
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <div className="flex min-w-max items-center gap-2 py-4 sm:gap-3 sm:py-5">

            {/* ================================= */}
            {/* ALL PRODUCTS */}
            {/* ================================= */}

            <button
              type="button"
              onClick={() => selectCategory(null)}
              aria-pressed={isActive(null)}
              className={`group inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-[11px] font-extrabold uppercase tracking-[0.06em] transition-all duration-300 sm:px-5 ${
                isActive(null)
                  ? activeClass
                  : inactiveClass
              }`}
            >
              <LayoutGrid
                size={16}
                strokeWidth={1.8}
              />

              TË GJITHA
            </button>

            {/* ================================= */}
            {/* LOADING STATE */}
            {/* ================================= */}

            {loading ? (
              <div
                role="status"
                aria-label="Duke ngarkuar kategoritë"
                className="flex items-center gap-3"
              >
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-[44px] w-[120px] animate-pulse rounded-xl ${
                      dark
                        ? "bg-white/10"
                        : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* ================================= */}
                {/* DYNAMIC CATEGORIES */}
                {/* ================================= */}

                {validCategories.map(
                  (category, index) => {
                    const active = isActive(
                      category.name
                    );

                    return (
                      <button
                        key={
                          category.id ??
                          category.name
                        }
                        type="button"
                        onClick={() =>
                          selectCategory(
                            category.name
                          )
                        }
                        aria-pressed={active}
                        className={`group inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2.5 rounded-xl border px-4 text-[11px] font-extrabold uppercase tracking-[0.06em] transition-all duration-300 sm:px-5 ${
                          active
                            ? activeClass
                            : inactiveClass
                        }`}
                      >
                        {/* CATEGORY NUMBER */}
                        <span
                          className={`text-[9px] font-black ${
                            active
                              ? "text-black/50"
                              : "text-[#FF7900]"
                          }`}
                        >
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        {/* CATEGORY NAME */}
                        <span>
                          {category.name}
                        </span>

                        {/* ACTIVE ICON */}
                        {active && (
                          <ChevronRight
                            size={15}
                            strokeWidth={2}
                            className="text-black"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </>
            )}

          </div>
        </div>

        {/* ================================= */}
        {/* RIGHT BRAND ICON */}
        {/* ================================= */}

        <div
          aria-hidden="true"
          className={`hidden shrink-0 items-center border-l pl-5 xl:flex ${
            dark
              ? "border-white/10"
              : "border-neutral-200"
          }`}
        >
          <Dumbbell
            size={23}
            strokeWidth={1.5}
            className="text-[#FF7900]"
          />
        </div>

      </div>

      {/* ================================= */}
      {/* BOTTOM ORANGE LINE */}
      {/* ================================= */}

      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-[#FF7900]/35 to-transparent"
      />
    </nav>
  );
}
