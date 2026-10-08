import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  PackageCheck,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=95",
    position: "object-[67%_center] lg:object-[70%_center]",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=95",
    position: "object-center",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=95",
    position: "object-center",
  },

  // BOUTIQUE
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=2200&q=95",
    position: "object-center",
  },

  // BOUTIQUE / CLOTHING STORE
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=2200&q=95",
    position: "object-center",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] =
    useState(0);

  /*
    AUTO SLIDE
    Ndryshon fotografinë çdo 5 sekonda
  */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) =>
        current === HERO_SLIDES.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const nextSlide = () => {
    setActiveSlide((current) =>
      current === HERO_SLIDES.length - 1
        ? 0
        : current + 1
    );
  };

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0
        ? HERO_SLIDES.length - 1
        : current - 1
    );
  };

  return (
    <section className="relative isolate min-h-[calc(100svh-74px)] overflow-hidden bg-black text-white">

      {/* ========================================= */}
      {/* SLIDER BACKGROUND */}
      {/* ========================================= */}

      <div className="absolute inset-0">

        {HERO_SLIDES.map(
          (slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[1400ms] ease-out ${
                index === activeSlide
                  ? "scale-100 opacity-100"
                  : "scale-[1.035] opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={`APAR Collection ${index + 1}`}
                className={`h-full w-full object-cover ${slide.position}`}
              />
            </div>
          )
        )}

        {/* CINEMATIC OVERLAYS */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/5 lg:from-black lg:via-black/65 lg:to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* MOBILE DARKER */}
        <div className="absolute inset-0 bg-black/25 lg:hidden" />

      </div>

      {/* ========================================= */}
      {/* PREMIUM LIGHT EFFECTS */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-48 top-[10%] h-[600px] w-[600px] rounded-full bg-white/[0.035] blur-[170px]" />

        <div className="absolute bottom-[-180px] left-[22%] h-[400px] w-[400px] rounded-full bg-[#009246]/[0.04] blur-[160px]" />

        <div className="absolute right-[-180px] top-[15%] h-[400px] w-[400px] rounded-full bg-[#CE2B37]/[0.04] blur-[160px]" />

      </div>

      {/* ========================================= */}
      {/* SIDE BRAND */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute inset-0 hidden lg:block">

        <p className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-[11px] font-semibold tracking-[0.7em] text-white/20">
          APAR — WEAR YOUR STORY
        </p>

      </div>

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-74px)] max-w-[1500px] flex-col justify-between px-5 sm:px-6 lg:px-10">

        <div className="flex flex-1 items-center py-16 sm:py-20 lg:py-24">

          <div className="w-full max-w-[850px]">

            {/* EYEBROW */}
            <div className="mb-8 flex items-center gap-4">

              <span className="text-[10px] font-black tracking-[0.45em] text-white/50">
                APAR
              </span>

              <div className="flex items-center">
                <span className="h-[2px] w-6 bg-[#009246]" />
                <span className="h-[2px] w-6 bg-white/80" />
                <span className="h-[2px] w-6 bg-[#CE2B37]" />
              </div>

              <span className="hidden text-[9px] font-semibold tracking-[0.35em] text-white/35 sm:block">
                COLLECTION 2026
              </span>

            </div>

            {/* HEADLINE */}
            <h1 className="max-w-[820px] text-[58px] font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-[78px] md:text-[96px] lg:text-[112px] xl:text-[124px]">

              <span className="block">
                WEAR
              </span>

              <span className="block text-white/45">
                YOUR
              </span>

              <span className="relative inline-block">
                STORY.

                <span className="absolute -bottom-4 left-1 flex h-[3px] w-[46%]">
                  <span className="flex-1 bg-[#009246]" />
                  <span className="flex-1 bg-white" />
                  <span className="flex-1 bg-[#CE2B37]" />
                </span>

              </span>

            </h1>

            {/* DESCRIPTION */}
            <div className="mt-10 flex max-w-2xl items-start gap-5">

              <span className="mt-2 hidden h-[42px] w-px bg-white/25 sm:block" />

              <p className="max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8 lg:text-[17px]">
                Stil që nuk ka nevojë për shpjegim.
                Koleksione të përzgjedhura dhe personalizime
                që e bëjnë çdo detaj pjesë të historisë tënde.
              </p>

            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/shop"
                style={{ color: "#050505" }}
                className="group flex min-h-[62px] w-full items-center justify-between bg-white px-6 text-sm font-black tracking-[0.12em] shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:bg-neutral-200 sm:w-[230px]"
              >
                <span
                  style={{ color: "#050505" }}
                >
                  SHOP COLLECTION
                </span>

                <ArrowUpRight
                  size={18}
                  style={{ color: "#050505" }}
                  className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/personalizim"
                className="group flex min-h-[62px] w-full items-center justify-between border border-white/20 bg-white/[0.06] px-6 text-sm font-bold tracking-[0.1em] text-white backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.12] sm:w-[220px]"
              >
                <span>
                  APAR CUSTOM
                </span>

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* BOTTOM AREA */}
        {/* ========================================= */}

        <div className="relative border-t border-white/15">

          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* PAYMENT */}
            <div className="flex items-center gap-4 py-5 sm:px-5 sm:first:pl-0 lg:py-6">

              <PackageCheck
                size={20}
                strokeWidth={1.5}
                className="flex-shrink-0 text-white/60"
              />

              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-white/80">
                  PAGESË NË DORËZIM
                </p>

                <p className="mt-1 text-[11px] text-white/35">
                  Paguaj kur e merr porosinë
                </p>
              </div>

            </div>

            {/* DELIVERY */}
            <div className="flex items-center gap-4 py-5 sm:px-5 lg:py-6">

              <Truck
                size={20}
                strokeWidth={1.5}
                className="flex-shrink-0 text-white/60"
              />

              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-white/80">
                  DËRGESA
                </p>

                <p className="mt-1 text-[11px] text-white/35">
                  Kosovë · Shqipëri · Maqedoni
                </p>
              </div>

            </div>

            {/* BRAND */}
            <div className="hidden items-center justify-end py-5 sm:flex sm:px-5 sm:pr-0 lg:py-6">

              <div className="text-right">

                <p className="text-[9px] font-bold tracking-[0.4em] text-white/30">
                  APAR
                </p>

                <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-white/55">
                  STYLE / IDENTITY / STORY
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* SLIDER CONTROLS */}
      {/* ========================================= */}

      <div className="absolute bottom-[160px] right-5 z-30 flex items-center gap-2 sm:right-6 lg:bottom-[115px] lg:right-10">

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Foto e kaluar"
          className="group flex h-11 w-11 items-center justify-center border border-white/15 bg-black/20 text-white backdrop-blur-xl transition duration-300 hover:border-white/40 hover:bg-white hover:text-black"
        >
          <ArrowLeft
            size={17}
            className="transition duration-300 group-hover:-translate-x-0.5"
          />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Foto tjetër"
          className="group flex h-11 w-11 items-center justify-center border border-white/15 bg-black/20 text-white backdrop-blur-xl transition duration-300 hover:border-white/40 hover:bg-white hover:text-black"
        >
          <ArrowRight
            size={17}
            className="transition duration-300 group-hover:translate-x-0.5"
          />
        </button>

      </div>

      {/* ========================================= */}
      {/* SLIDE INDICATORS */}
      {/* ========================================= */}

      <div className="absolute bottom-[218px] right-5 z-30 flex items-center gap-2 sm:right-6 lg:bottom-[174px] lg:right-10">

        {HERO_SLIDES.map(
          (slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() =>
                setActiveSlide(index)
              }
              aria-label={`Shko te fotografia ${index + 1}`}
              className={`relative h-[3px] overflow-hidden transition-all duration-500 ${
                activeSlide === index
                  ? "w-12 bg-white/30"
                  : "w-5 bg-white/20 hover:bg-white/40"
              }`}
            >
              {activeSlide === index && (
                <span
                  key={activeSlide}
                  className="absolute inset-y-0 left-0 animate-[heroProgress_5s_linear_forwards] bg-white"
                />
              )}
            </button>
          )
        )}

      </div>

      {/* SLIDE NUMBER */}
      <div className="absolute right-5 top-6 z-30 hidden items-center gap-2 text-[9px] font-bold tracking-[0.28em] text-white/40 sm:right-6 lg:right-10 lg:top-8 lg:flex">

        <span className="text-white/80">
          {String(activeSlide + 1).padStart(2, "0")}
        </span>

        <span>/</span>

        <span>
          {String(HERO_SLIDES.length).padStart(2, "0")}
        </span>

      </div>

      {/* PROGRESS ANIMATION */}
      <style>
        {`
          @keyframes heroProgress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }
        `}
      </style>

    </section>
  );
}