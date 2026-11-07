
import {
  ArrowUpRight,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
  MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "38343977125";

const features = [
  {
    id: "01",
    icon: PackageCheck,
    title: "PAGESË NË DORËZIM",
    description:
      "Porosit online dhe paguaj kur ta pranosh porosinë.",
    label: "PAGESA",
  },
  {
    id: "02",
    icon: Truck,
    title: "DËRGESË NË KOSOVË",
    description:
      "Porosit produktet e tua dhe pranoji në adresën tënde.",
    label: "TRANSPORTI",
  },
  {
    id: "03",
    icon: ShieldCheck,
    title: "POROSI E SIGURT",
    description:
      "Informacionet e porosisë trajtohen me kujdes dhe përgjegjësi.",
    label: "SIGURIA",
  },
  {
    id: "04",
    icon: Headphones,
    title: "MBËSHTETJE DIREKTE",
    description:
      "Na kontakto për informacione rreth produkteve dhe porosive.",
    label: "KONTAKTI",
  },
];

export default function Features() {
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Përshëndetje ProteinFitness! Dua më shumë informacione rreth produkteve dhe porosive."
    )}`;

  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#080808] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* ================================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-[#FF7900]/[0.04] blur-[150px]" />

        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#FF7900]/[0.05] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================= */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        {/* ================================= */}
        {/* SECTION HEADER */}
        {/* ================================= */}

        <div className="mb-12 flex flex-col justify-between gap-7 lg:mb-14 lg:flex-row lg:items-end">

          <div className="max-w-[780px]">

            {/* EYEBROW */}

            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FF7900] sm:text-xs">
                PROTEINFITNESS SERVICES
              </p>
            </div>

            {/* TITLE */}

            <h2
              id="features-title"
              className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.055em]"
            >
              <span className="block text-white">
                BLERJE E
              </span>

              <span className="block text-[#FF7900]">
                THJESHTË.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-xl border-l-[3px] border-[#FF7900] pl-5 text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
              Nga zgjedhja e produktit deri te
              pranimi i porosisë, ProteinFitness
              synon të ofrojë një eksperiencë
              të thjeshtë dhe profesionale blerjeje.
            </p>

          </div>

          {/* RIGHT LABEL */}

          <div className="hidden items-center gap-3 lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#FF7900]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              SPORTS SUPPLEMENTS STORE
            </p>
          </div>

        </div>

        {/* DIVIDER */}

        <div className="mb-8 h-px w-full bg-gradient-to-r from-[#FF7900]/60 via-white/10 to-transparent" />

        {/* ================================= */}
        {/* FEATURES GRID */}
        {/* ================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

          {features.map(
            ({
              id,
              icon: Icon,
              title,
              description,
              label,
            }) => (
              <article
                key={id}
                className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#FF7900]/60 hover:bg-[#191919] hover:shadow-[0_22px_60px_rgba(255,121,0,0.08)] motion-reduce:transform-none lg:p-7"
              >

                {/* TOP BORDER */}

                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#FF7900] to-[#FFB15C] transition-transform duration-500 group-hover:scale-x-100" />

                {/* CARD TOP */}

                <div className="flex items-start justify-between gap-4">

                  {/* ICON */}

                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-xl border border-[#FF7900]/20 bg-[#FF7900]/10 transition-all duration-500 group-hover:border-[#FF7900]/60 group-hover:bg-[#FF7900]">

                    <Icon
                      size={27}
                      strokeWidth={1.6}
                      className="text-[#FF7900] transition-colors duration-500 group-hover:text-black"
                    />

                  </div>

                  {/* NUMBER */}

                  <span className="text-[12px] font-black tracking-[0.16em] text-white/20 transition-colors duration-500 group-hover:text-[#FF7900]/70">
                    {id}
                  </span>

                </div>

                {/* TEXT CONTENT */}

                <div className="mt-auto pt-10">

                  {/* SMALL CATEGORY */}

                  <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#FF7900]">
                    {label}
                  </p>

                  {/* TITLE */}

                  <h3 className="text-[17px] font-black uppercase leading-[1.3] tracking-[-0.02em] text-white lg:text-[18px]">
                    {title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="mt-3 text-[13px] leading-6 text-neutral-400">
                    {description}
                  </p>

                  {/* BOTTOM ACCENT */}

                  <div className="mt-6 h-[2px] w-9 bg-white/15 transition-all duration-500 group-hover:w-20 group-hover:bg-[#FF7900]" />

                </div>

              </article>
            )
          )}

        </div>

        {/* ================================= */}
        {/* CONTACT CTA */}
        {/* ================================= */}

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-gradient-to-r from-[#1D140D] via-[#151515] to-[#101010]">

          <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center lg:px-9 lg:py-10">

            {/* LEFT SIDE */}

            <div className="flex items-center gap-4">

              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10">

                <MessageCircle
                  size={26}
                  strokeWidth={1.7}
                  className="text-[#FF7900]"
                />

              </span>

              <div>

                <h3 className="text-base font-black uppercase tracking-[-0.02em] text-white sm:text-lg">
                  KE PYETJE RRETH PRODUKTEVE?
                </h3>

                <p className="mt-2 max-w-lg text-xs leading-6 text-neutral-400 sm:text-sm">
                  Kontakto ekipin ProteinFitness
                  për produkte, disponueshmëri
                  dhe porosi.
                </p>

              </div>

            </div>

            {/* WHATSAPP BUTTON */}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-3 rounded-lg bg-[#FF7900] px-6 text-xs font-extrabold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFA03D] sm:w-auto"
            >

              NA KONTAKTO

              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />

            </a>

          </div>

          {/* ORANGE BOTTOM LINE */}

          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF7900]/60 to-transparent" />

        </div>

      </div>

    </section>
  );
}
