import { ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const categoryData = {
  Veshje: {
    title: "VESHJE",
    number: "01",
    description:
      "Koleksione të përzgjedhura për një stil modern, të pastër dhe të dallueshëm.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=90",
  },

  Aksesorë: {
    title: "AKSESORË",
    number: "02",
    description:
      "Detajet që kompletojnë stilin. Aksesorë modernë të përzgjedhur nga APAR.",
    image:
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1600&q=90",
  },

  Kozmetikë: {
    title: "KOZMETIKË",
    number: "03",
    description:
      "Produkte të përzgjedhura për ta kompletuar identitetin dhe stilin tënd.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=90",
  },

  Personalizim: {
    title: "APAR CUSTOM",
    number: "04",
    description:
      "Krijo diçka vetëm për ty. Emër, foto, dizajn apo ide personale.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=90",
  },
};

const defaultData = {
  title: "SHOP",
  number: "00",
  description:
    "Zbulo koleksionin APAR — veshje, aksesorë dhe produkte të përzgjedhura për stilin tënd.",
  image:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=90",
};

export default function ShopHero() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const data =
    categoryData[category] || defaultData;

  const categories = [
    {
      name: "ALL",
      to: "/shop",
      category: null,
    },
    {
      name: "VESHJE",
      to: "/shop?category=Veshje",
      category: "Veshje",
    },
    {
      name: "AKSESORË",
      to: "/shop?category=Aksesorë",
      category: "Aksesorë",
    },
    {
      name: "KOZMETIKË",
      to: "/shop?category=Kozmetikë",
      category: "Kozmetikë",
    },
    {
      name: "CUSTOM",
      to: "/personalizim",
      category: "Personalizim",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-[150px]" />

        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[#CE2B37]/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px]">

        {/* HERO */}
        <div className="grid min-h-[390px] lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT */}
          <div className="relative z-10 flex items-center px-5 py-14 sm:px-6 md:py-16 lg:px-10 lg:py-20">

            <div className="w-full">

              {/* BREADCRUMB */}
              <div className="mb-8 flex items-center gap-3">

                <Link
                  to="/"
                  className="text-[9px] font-bold tracking-[0.3em] text-neutral-600 transition hover:text-white"
                >
                  HOME
                </Link>

                <span className="text-neutral-700">
                  /
                </span>

                <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
                  {data.title}
                </span>

              </div>

              {/* LABEL */}
              <div className="mb-5 flex items-center gap-4">

                <span className="text-[9px] font-black tracking-[0.45em] text-neutral-500">
                  APAR COLLECTION
                </span>

                <div className="flex">

                  <span className="h-[2px] w-5 bg-[#009246]" />

                  <span className="h-[2px] w-5 bg-white/70" />

                  <span className="h-[2px] w-5 bg-[#CE2B37]" />

                </div>

              </div>

              {/* TITLE */}
              <div className="flex items-end gap-5">

                <h1 className="text-[52px] font-black leading-none tracking-[-0.055em] sm:text-[68px] md:text-[78px] lg:text-[88px]">
                  {data.title}
                </h1>

                <span className="mb-2 hidden text-[10px] font-bold tracking-[0.3em] text-neutral-700 sm:block">
                  / {data.number}
                </span>

              </div>

              {/* DESCRIPTION */}
              <div className="mt-7 flex max-w-xl items-start gap-5">

                <span className="mt-2 hidden h-10 w-px bg-white/20 sm:block" />

                <p className="max-w-lg text-sm leading-7 text-neutral-400 sm:text-[15px]">
                  {data.description}
                </p>

              </div>

              {/* CTA */}
              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-3 text-[10px] font-black tracking-[0.25em] text-white"
              >
                EXPLORE COLLECTION

                <ArrowUpRight
                  size={15}
                  className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden min-h-[390px] overflow-hidden lg:block">

            <img
              src={data.image}
              alt={data.title}
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition duration-[1600ms] hover:scale-[1.05]"
            />

            {/* FADE LEFT */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/25 to-transparent" />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/15" />

            {/* IMAGE NUMBER */}
            <div className="absolute bottom-7 right-8">

              <p className="text-[9px] font-bold tracking-[0.4em] text-white/40">
                APAR / {data.number}
              </p>

            </div>

          </div>

        </div>

        {/* CATEGORY BAR */}
        <div className="hidden">

          <div className="flex overflow-x-auto px-5 sm:px-6 lg:px-10">

            {categories.map((item) => {
              const active =
                item.category === null
                  ? !category
                  : category === item.category;

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`relative flex-shrink-0 px-5 py-5 text-[9px] font-black tracking-[0.22em] transition duration-300 first:pl-0 ${
                    active
                      ? "text-white"
                      : "text-neutral-600 hover:text-white"
                  }`}
                >
                  {item.name}

                  {active && (
                    <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-white first:left-0" />
                  )}
                </Link>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}