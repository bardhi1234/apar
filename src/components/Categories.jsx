
import { ArrowRight, ArrowUpRight, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export default function Categories() {
  const { categories = [], loading } = useCategories();

  const validCategories = categories.filter(
    (category) =>
      typeof category?.name === "string" &&
      category.name.trim().length > 0
  );

  return (
    <section
      id="categories"
      className="relative isolate overflow-hidden bg-[#080808] py-20 text-white sm:py-24 lg:py-32"
    >
      {/* BACKGROUND EFFECTS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-44 top-0 h-[550px] w-[550px] rounded-full bg-[#FF7900]/[0.06] blur-[160px]" />

        <div className="absolute -left-48 bottom-0 h-[450px] w-[450px] rounded-full bg-[#FF7900]/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">
        {/* SECTION INTRO */}
        <div className="mb-12 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-[780px]">
            {/* EYEBROW */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FF7900] sm:text-xs">
                PROTEINFITNESS COLLECTION
              </span>
            </div>

            {/* HEADLINE */}
            <h2 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.055em]">
              <span className="block text-white">
                EKSPLORO
              </span>

              <span className="block text-[#FF7900]">
                KATEGORITË.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl border-l-2 border-[#FF7900] pl-5 text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
              Nga proteinat dhe kreatina te vitaminat
              dhe aksesorët sportivë. Zbulo kategoritë
              dhe gjej produktet që kërkon.
            </p>
          </div>

          {/* ALL PRODUCTS */}
          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-4 border-b border-[#FF7900]/50 pb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-[#FF7900] hover:text-[#FF7900]"
          >
            TË GJITHA PRODUKTET

            <ArrowUpRight
              size={19}
              className="text-[#FF7900] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* THIN DIVIDER */}
        <div className="mb-8 h-px w-full bg-gradient-to-r from-[#FF7900]/60 via-white/10 to-transparent" />

        {/* LOADING SKELETON */}
        {loading ? (
          <div
            role="status"
            aria-label="Duke ngarkuar kategoritë"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#151515]"
              >
                <div className="h-full w-full bg-gradient-to-br from-[#202020] via-[#141414] to-[#080808]" />
              </div>
            ))}
          </div>
        ) : validCategories.length > 0 ? (
          <>
            {/* CATEGORY CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {validCategories.map((category, index) => (
                <Link
                  key={category.id ?? category.name}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  aria-label={`Shiko produktet: ${category.name}`}
                  className="group relative isolate block aspect-[4/5] min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.10] bg-[#151515] transition-all duration-500 hover:-translate-y-2 hover:border-[#FF7900]/70 hover:shadow-[0_25px_70px_rgba(255,121,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7900] motion-reduce:transform-none"
                >
                  {/* FALLBACK BACKGROUND */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#242424] via-[#161616] to-[#090909]" />

                  {/* FALLBACK ICON */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Dumbbell
                      size={100}
                      strokeWidth={0.7}
                      className="text-[#FF7900]/20"
                    />
                  </div>

                  {/* CATEGORY PHOTO */}
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transform-none"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  {/* IMAGE OVERLAYS */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15" />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

                  <div className="absolute inset-0 bg-[#FF7900]/0 transition-colors duration-500 group-hover:bg-[#FF7900]/[0.07]" />

                  {/* TOP CONTENT */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF7900]" />

                      <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-white">
                        KATEGORIA
                      </span>
                    </div>

                    <span className="text-[13px] font-black tracking-[0.15em] text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* BOTTOM CONTENT */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    {/* ORANGE ACCENT */}
                    <div className="mb-5 h-[3px] w-10 rounded-full bg-[#FF7900] transition-all duration-500 group-hover:w-20" />

                    {/* CATEGORY NAME */}
                    <h3 className="max-w-[260px] break-words text-[clamp(1.5rem,2vw,2.2rem)] font-black uppercase leading-[1.08] tracking-[-0.035em] text-white">
                      {category.name}
                    </h3>

                    {/* CATEGORY DESCRIPTION */}
                    <p className="mt-3 line-clamp-2 max-w-[260px] text-xs leading-6 text-neutral-300">
                      {category.description ||
                        "Eksploro produktet e kësaj kategorie në ProteinFitness."}
                    </p>

                    {/* BOTTOM ACTION */}
                    <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/90 transition-colors duration-300 group-hover:text-[#FF7900]">
                        EKSPLORO
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF7900] text-black shadow-[0_8px_25px_rgba(255,121,0,0.25)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                        <ArrowUpRight size={20} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* BOTTOM CATEGORY STRIP */}
            <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#121212] px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10">
                  <Dumbbell
                    size={23}
                    strokeWidth={1.7}
                    className="text-[#FF7900]"
                  />
                </span>

                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.04em] text-white">
                    PROTEINFITNESS STORE
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-400">
                    Zbulo katalogun tonë të produkteve sportive.
                  </p>
                </div>
              </div>

              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:bg-[#FFA03D]"
              >
                SHIKO KATALOGUN

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-white/10 bg-[#121212] px-6 py-16 text-center">
            <Dumbbell
              size={34}
              className="mx-auto text-[#FF7900]"
            />

            <h3 className="mt-5 text-xl font-bold text-white">
              Kategoritë po përgatiten
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-400">
              Aktualisht nuk ka kategori të publikuara.
              Shiko katalogun për produktet e disponueshme.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF7900] px-6 py-3 font-bold text-black transition hover:bg-[#FFA03D]"
            >
              Shiko produktet
              <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
