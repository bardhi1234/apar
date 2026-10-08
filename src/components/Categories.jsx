import {
  ArrowUpRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCategories,
} from "../hooks/useCategories";

export default function Categories() {
  const {
    categories,
    loading,
  } = useCategories();

  if (loading) {
    return null;
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="bg-white py-20 lg:py-24">

      <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        <p className="text-[11px] font-bold tracking-[0.4em] text-neutral-400">
          APAR
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          SHOP BY CATEGORY
        </h2>

        <p className="mt-4 text-sm text-neutral-500">
          Zgjidh kategorinë dhe gjej produktet që i përshtaten stilit tënd.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map(
            (category) => (
              <Link
                key={category.id}
                to={`/shop?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
              >

                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-900 to-black" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">

                  <div>

                    <p className="max-w-[220px] text-[11px] leading-5 text-white/70">
                      {category.description ||
                        "Shiko produktet e kësaj kategorie"}
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      {category.name}
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-white text-black transition duration-300 group-hover:-translate-y-1">
                    <ArrowUpRight
                      size={18}
                    />
                  </div>

                </div>

              </Link>
            )
          )}

        </div>

      </div>

    </section>
  );
}