
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  PackageCheck,
  Truck,
  MessageCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "38343977125";
const SLIDE_DURATION = 6000;

// Fotografitë janë ilustrative. Më vonë mund t'i zëvendësosh
// me fotografitë e produkteve nga Cloudinary.
const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=85",
    eyebrow: "PROTEINFITNESS • SPORTS SUPPLEMENTS",
    title: "ZGJEDHJA JOTE",
    highlight: "PËR ÇDO STËRVITJE.",
    description:
      "Zbulo proteina, kreatinë, vitamina dhe aksesorë sportivë në një dyqan të vetëm online.",
    position: "object-center",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=85",
    eyebrow: "KATEGORI PËR ÇDO RUTINË",
    title: "PRODUKTE",
    highlight: "PËR AKTIVITETIN TËND.",
    description:
      "Eksploro kategoritë, krahaso produktet dhe gjej informacionet që të duhen për zgjedhjen tënde.",
    position: "object-[65%_center]",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=2200&q=85",
    eyebrow: "PROTEINFITNESS ONLINE STORE",
    title: "GATI PËR",
    highlight: "ZGJEDHJEN E RADHËS?",
    description:
      "Shfleto produktet tona sportive dhe na kontakto drejtpërdrejt për pyetje ose porosi.",
    position: "object-center",
  },
];

const BENEFITS = [
  {
    icon: PackageCheck,
    title: "KATEGORI TË NDRYSHME",
    subtitle: "Proteina, kreatinë dhe më shumë",
  },
  {
    icon: Truck,
    title: "INFORMACION PËR DËRGESËN",
    subtitle: "Na kontakto për destinacionin tënd",
  },
  {
    icon: MessageCircle,
    title: "KONTAKT DIREKT",
    subtitle: "043 977 125",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = HERO_SLIDES[activeSlide];

  useEffect(() => {
    // Mos e ndrysho automatikisht fotografinë nëse përdoruesi
    // ka zgjedhur të reduktojë animacionet.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Përshëndetje ProteinFitness! Dua më shumë informacione për produktet tuaja."
  )}`;

  return (
    <section
      id="ballina"
      aria-label="ProteinFitness - ballina"
      className="relative isolate flex min-h-[730px] flex-col overflow-hidden bg-[#080808] text-white lg:min-h-[calc(100svh-88px)]"
    >
      {/* FOTOGRAFITË E SLIDER-IT */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out motion-reduce:transition-none ${
              index === activeSlide
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              className={`h-full w-full object-cover ${slide.position}`}
            />
          </div>
        ))}

        {/* NGJYRAT BLACK + ORANGE */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-black/85 to-black/30 lg:via-black/75 lg:to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/20 to-black/45" />
        <div className="absolute -bottom-56 -left-20 h-[440px] w-[440px] rounded-full bg-[#FF7900]/10 blur-[110px]" />
        <div className="absolute -right-32 top-0 h-[440px] w-[440px] rounded-full bg-[#FF7900]/10 blur-[140px]" />
      </div>

      {/* DEKORIMI ANËSOR */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/2 hidden -translate-y-1/2 rotate-90 text-[11px] font-extrabold tracking-[0.45em] text-white/20 xl:block"
      >
        PROTEINFITNESS — SPORTS SUPPLEMENTS
      </p>

      {/* PËRMBAJTJA */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-5 pb-14 pt-20 sm:px-8 lg:px-12 lg:pb-12 lg:pt-24">
        <div className="max-w-[850px]">
          {/* EYEBROW */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="h-[2px] w-9 bg-[#FF7900]" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FF9A31] sm:text-[11px]">
              {currentSlide.eyebrow}
            </span>
          </div>

          {/* TITULLI */}
          <h1 className="max-w-[820px] text-[clamp(2.8rem,7vw,6.7rem)] font-black uppercase leading-[0.99] tracking-[-0.055em]">
            <span className="block text-white">{currentSlide.title}</span>
            <span className="mt-2 block text-[#FF7900]">
              {currentSlide.highlight}
            </span>
          </h1>

          {/* PËRSHKRIMI */}
          <p className="mt-7 max-w-xl border-l-[3px] border-[#FF7900] pl-4 text-sm leading-7 text-neutral-200 sm:text-base sm:leading-8">
            {currentSlide.description}
          </p>

          {/* BUTONAT */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/shop"
              className="group inline-flex min-h-[58px] w-full items-center justify-between gap-5 rounded-lg bg-[#FF7900] px-6 text-sm font-extrabold tracking-[0.06em] text-black shadow-[0_12px_40px_rgba(255,121,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9933] sm:w-auto sm:min-w-[235px]"
            >
              SHIKO PRODUKTET
              <ArrowUpRight
                size={19}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-lg border border-white/25 bg-black/30 px-6 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF7900] hover:bg-white/10 sm:w-auto"
            >
              <FaWhatsapp size={20} className="text-[#FF7900]" />
              NA KONTAKTO
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        {/* KONTROLLET E SLIDER-IT */}
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Fotografia e kaluar"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white transition hover:border-[#FF7900] hover:text-[#FF7900]"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Fotografia tjetër"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white transition hover:border-[#FF7900] hover:text-[#FF7900]"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Shko te slide ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                className={`relative h-[4px] overflow-hidden rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "w-12 bg-white/30"
                    : "w-5 bg-white/20 hover:bg-white/50"
                }`}
              >
                {index === activeSlide && (
                  <span
                    key={activeSlide}
                    className="absolute inset-y-0 left-0 bg-[#FF7900] motion-reduce:hidden"
                    style={{ animation: `pfHeroProgress ${SLIDE_DURATION}ms linear forwards` }}
                  />
                )}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold tracking-[0.22em] text-neutral-400">
            <span className="text-[#FF7900]">
              {String(activeSlide + 1).padStart(2, "0")}
            </span>{" "}
            / {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* SHIRITI INFORMATIV */}
      <div className="relative z-10 border-t border-white/15 bg-[#0A0A0A]/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
          {BENEFITS.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 py-4 sm:px-4 sm:first:pl-0 lg:gap-4 lg:py-6"
            >
              <Icon size={22} strokeWidth={1.7} className="shrink-0 text-[#FF7900]" />
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.1em] text-white lg:text-[11px]">
                  {title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pfHeroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
