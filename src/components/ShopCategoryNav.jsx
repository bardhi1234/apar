import {
  useSearchParams,
} from "react-router-dom";

import {
  useCategories,
} from "../hooks/useCategories";

export default function ShopCategoryNav({
  dark = false,
}) {
  const {
    categories,
    loading,
  } = useCategories();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const currentCategory =
    searchParams.get("category");

  if (
    loading ||
    categories.length === 0
  ) {
    return null;
  }

  function selectCategory(name) {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (!name) {
      params.delete("category");
    } else {
      params.set(
        "category",
        name
      );
    }

    setSearchParams(params);
  }

  return (
    <div
      className={
        dark
          ? "border-t border-white/10 bg-[#050505]"
          : "border-b border-neutral-200 bg-white"
      }
    >
      <div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-5 sm:px-6 lg:px-10">

        <button
          type="button"
          onClick={() =>
            selectCategory(null)
          }
          className={`flex-shrink-0 border-b-2 px-3 py-5 text-[10px] font-black tracking-[0.18em] transition ${
            !currentCategory
              ? dark
                ? "border-white text-white"
                : "border-black text-black"
              : dark
                ? "border-transparent text-neutral-500 hover:text-white"
                : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          ALL
        </button>

        {categories.map(
          (category) => {
            const active =
              currentCategory ===
              category.name;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  selectCategory(
                    category.name
                  )
                }
                className={`flex-shrink-0 border-b-2 px-3 py-5 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                  active
                    ? dark
                      ? "border-white text-white"
                      : "border-black text-black"
                    : dark
                      ? "border-transparent text-neutral-500 hover:text-white"
                      : "border-transparent text-neutral-400 hover:text-black"
                }`}
              >
                {category.name}
              </button>
            );
          }
        )}

      </div>
    </div>
  );
}