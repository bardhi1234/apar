
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Dumbbell,
} from "lucide-react";

import ShopCategoryNav from "./ShopCategoryNav";

// ======================================
// PROTEINFITNESS - SHOP HERO CONFIG
// ======================================

// Fotografitë janë ilustrative.
// Mund t'i zëvendësojmë me foto nga Cloudinary.

const categoryData = {
  Proteina: {
    title: "PROTEINA",
    number: "01",
    label: "PROTEINFITNESS / PROTEINS",
    description:
      "Eksploro koleksionin e proteinave dhe gjej produktet që i përshtaten preferencave dhe rutinës tënde sportive.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85",
  },

  Kreatinë: {
    title: "KREATINË",
    number: "02",
    label: "PROTEINFITNESS / CREATINE",
    description:
      "Zbulo produktet e kreatinës dhe krahaso variantet e disponueshme në katalogun tonë.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=85",
  },

  "Vitamina & Minerale": {
    title: "VITAMINA & MINERALE",
    number: "03",
    label: "PROTEINFITNESS / VITAMINS",
    description:
      "Eksploro vitaminat dhe mineralet në katalogun tonë, me informacione të qarta për secilin produkt.",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1800&q=85",
  },

  "Aksesorë Sportivë": {
    title: "AKSESORË SPORTIVË",
    number: "04",
    label: "PROTEINFITNESS / ACCESSORIES",
    description:
      "Shaker, çanta dhe aksesorë praktikë për palestër dhe aktivitetet e tua sportive.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=85",
  },
};

// ALIASET E KATEGORIVE
// Ndihmojnë nëse emrat në databazë ndryshojnë pak.

const categoryAliases = {
  kreatina: "Kreatinë",
  creatine: "Kreatinë",
  vitamins: "Vitamina & Minerale",
  vitamina: "Vitamina & Minerale",
  "vitamina dhe minerale": "Vitamina & Minerale",
  aksesorë: "Aksesorë Sportivë",
  aksesore: "Aksesorë Sportivë",
};

const defaultData = {
  title: "PRODUKTET",
  number: "00",
  label: "PROTEINFITNESS / ONLINE STORE",
  description:
    "Zbulo proteina, kreatinë, vitamina, minerale dhe aksesorë sportivë. Eksploro katalogun dhe gjej produktet që kërkon.",
  image:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85",
};

export default function ShopHero() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const normalizedCategory = category?.trim() || "";

  const matchingCategory = normalizedCategory
    ? Object.keys(categoryData).find(
        (name) =>
          name.toLocaleLowerCase("sq") ===
          normalizedCategory.toLocaleLowerCase("sq")
      )
    : null;

  const alias =
    categoryAliases[
      normalizedCategory.toLocaleLowerCase("sq")
    ];

  const selectedData =
    categoryData[matchingCategory] ||
    categoryData[alias] ||
    null;

  const data = selectedData
    ? {
        ...selectedData,
        title: normalizedCategory.toUpperCase(),
      }
    : normalizedCategory
    ? {
        ...defaultData,
        title: normalizedCategory.toUpperCase(),
        number: "05",
        description: `Eksploro produktet e kategorisë ${normalizedCategory} në ProteinFitness.`,
      }
    : defaultData;

  const isCategory = Boolean(normalizedCategory);

  return (
    <section
      id="shop-hero"
      className="relative isolate overflow-hidden bg-[#080808] text-white"
    >
      {/* ====================================== */}
      {/* TOP ORANGE ACCENT */}
      {/* ====================================== */}

      <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#FF7900]/70 to-transparent" />

      {/* ====================================== */}
      {/* MAIN HERO */}
      {/* ====================================== */}

      <div className="relative mx-auto max-w-[1600px]">

        <div className="relative grid min-h-[470px] items-stretch lg:min-h-[500px] lg:grid-cols-[1.08fr_0.92fr]">

          {/* ====================================== */}
          {/* BACKGROUND ON MOBILE */}
          {/* ====================================== */}

          <div className="pointer-events-none absolute inset-0 lg:hidden">

            <img
              src={data.image}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-35"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/50" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/30" />

          </div>

          {/* ====================================== */}
          {/* LEFT CONTENT */}
          {/* ====================================== */}

          <div className="relative z-10 flex items-center px-5 py-16 sm:px-8 lg:py-20 lg:pl-12 lg:pr-8 xl:pl-16">

            <div className="w-full max-w-[760px]">

              {/* BREADCRUMB */}

              <nav
                aria-label="Navigimi i faqes"
                className="mb-10 flex flex-wrap items-center gap-3"
              >

                <Link
                  to="/"
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-[#FF7900]"
                >
                  BALLINA
                </Link>

                <ChevronRight
                  size={13}
                  className="text-[#FF7900]"
                />

                {isCategory ? (
                  <>
                    <Link
                      to="/shop"
                      className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-[#FF7900]"
                    >
                      PRODUKTET
                    </Link>

                    <ChevronRight
                      size={13}
                      className="text-[#FF7900]"
                    />

                    <span className="max-w-[180px] truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white sm:max-w-none">
                      {normalizedCategory}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    PRODUKTET
                  </span>
                )}

              </nav>

              {/* EYEBROW */}

              <div className="mb-6 flex items-center gap-3">

                <span className="h-[2px] w-10 bg-[#FF7900]" />

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900] sm:text-[11px]">
                  {data.label}
                </p>

              </div>

              {/* TITLE */}

              <h1 className="max-w-[800px] break-words text-[clamp(2.8rem,6vw,5.9rem)] font-black uppercase leading-[1.02] tracking-[-0.055em]">

                <span className="text-white">
                  {data.title}
                </span>

                <span className="ml-3 inline-block align-top text-[12px] font-black tracking-normal text-[#FF7900] sm:text-base">
                  / {data.number}
                </span>

              </h1>

              {/* ORANGE LINE */}

              <div className="mt-7 flex items-center gap-2">

                <div className="h-[3px] w-16 bg-[#FF7900]" />

                <div className="h-[3px] w-5 bg-[#FF7900]/30" />

              </div>

              {/* DESCRIPTION */}

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base sm:leading-8">
                {data.description}
              </p>

              {/* ACTIONS */}

              <div className="mt-9 flex flex-wrap items-center gap-4">

                <a
                  href="#shop-category-navigation"
                  className="group inline-flex min-h-[54px] items-center justify-center gap-4 rounded-lg bg-[#FF7900] px-6 text-[12px] font-black uppercase tracking-[0.08em] text-black shadow-[0_12px_45px_rgba(255,121,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFA039]"
                >
                  SHIKO KATEGORITË

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                {isCategory && (
                  <Link
                    to="/shop"
                    className="group inline-flex min-h-[54px] items-center gap-3 border-b border-white/25 px-2 text-[11px] font-black uppercase tracking-[0.08em] text-white transition-colors hover:border-[#FF7900] hover:text-[#FF7900]"
                  >
                    TË GJITHA PRODUKTET

                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                )}

              </div>

            </div>

          </div>

          {/* ====================================== */}
          {/* RIGHT IMAGE - DESKTOP */}
          {/* ====================================== */}

          <div className="relative hidden min-h-[500px] overflow-hidden lg:block">

            {/* IMAGE */}
            <img
              key={data.image}
              src={data.image}
              alt="Ambienti sportiv - ProteinFitness"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            />

            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-black/25" />

            {/* LEFT FADE */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/50 to-transparent" />

            {/* BOTTOM FADE */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/85 via-transparent to-transparent" />

            {/* ORANGE GLOW */}
            <div className="pointer-events-none absolute -bottom-36 right-0 h-[350px] w-[350px] rounded-full bg-[#FF7900]/10 blur-[100px]" />

            {/* BRAND LABEL */}
            <div className="absolute bottom-9 right-10">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-7 bg-[#FF7900]" />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/80">
                  PROTEINFITNESS
                </span>

              </div>

              <p className="mt-2 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                SPORTS SUPPLEMENTS
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* BOTTOM INFORMATION STRIP */}
      {/* ====================================== */}

      <div className="relative border-y border-white/10 bg-[#101010]">

        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-10">

          <div className="flex items-center gap-3">

            <Dumbbell
              size={18}
              strokeWidth={1.8}
              className="text-[#FF7900]"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-300">
              SPORTS SUPPLEMENTS STORE
            </span>

          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            PROTEINFITNESS
            <span className="mx-2 text-[#FF7900]">/</span>
            KOSOVË
          </span>

        </div>

      </div>

      {/* ====================================== */}
      {/* CATEGORY NAVIGATION */}
      {/* ====================================== */}

      <div
        id="shop-category-navigation"
        className="scroll-mt-24"
      >
        <ShopCategoryNav dark />
      </div>

    </section>
  );
}
