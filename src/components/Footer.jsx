
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardCheck,
  CreditCard,
  FlaskConical,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { useCategories } from "../hooks/useCategories";

// =======================================
// PROTEINFITNESS - FOOTER
// =======================================

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

const WHATSAPP_NUMBER = "38343977125";
const PHONE_DISPLAY = "+383 43 977 125";

// Vendos linket reale te rrjeteve sociale
const SOCIAL_LINKS = [
  { name: "Instagram", url: "", icon: FaInstagram },
  { name: "Facebook", url: "", icon: FaFacebookF },
  { name: "TikTok", url: "", icon: FaTiktok },
];

// Informacion rreth standardeve
// Jo pretendim per certifikim te dyqanit
const STANDARDS = [
  {
    name: "GMP",
    subtitle: "Good Manufacturing Practice",
    detail:
      "Praktika të mira të prodhimit për procese dhe kontroll cilësie.",
    icon: BadgeCheck,
  },
  {
    name: "HACCP",
    subtitle: "Siguria ushqimore",
    detail:
      "Sistem për identifikimin dhe kontrollin e rreziqeve ushqimore.",
    icon: ShieldCheck,
  },
  {
    name: "ISO 22000",
    subtitle: "Menaxhimi i sigurisë ushqimore",
    detail:
      "Standard ndërkombëtar për sistemet e sigurisë ushqimore.",
    icon: ClipboardCheck,
  },
  {
    name: "COA",
    subtitle: "Certificate of Analysis",
    detail:
      "Dokument që paraqet rezultatet e analizave për produktin ose serinë.",
    icon: FlaskConical,
  },
];

// =======================================
// FOOTER HEADING
// =======================================

function FooterHeading({ children }) {
  return (
    <h3 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.17em] text-white">
      <span className="h-[2px] w-5 bg-[#FF7900]" />
      {children}
    </h3>
  );
}

// =======================================
// FOOTER NAVIGATION LINK
// =======================================

function FooterNavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="w-fit text-sm text-neutral-400 transition-colors hover:text-[#FF7900]"
    >
      {children}
    </Link>
  );
}

// =======================================
// MUSCULAR GOAT MASCOT - SVG
// Nuk kerkon imazh te jashtem
// =======================================

function MuscularGoat() {
  return (
    <svg
      viewBox="0 0 520 460"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Maskota GOAT e ProteinFitness me muskuj"
      className="relative mx-auto w-full max-w-[350px] drop-shadow-[0_0_32px_rgba(255,121,0,0.12)]"
    >
      <defs>
        <linearGradient
          id="goat-body"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#535353" />
          <stop offset="0.45" stopColor="#242424" />
          <stop offset="1" stopColor="#101010" />
        </linearGradient>

        <linearGradient
          id="goat-head"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#F5F0E8" />
          <stop offset="0.55" stopColor="#A7A3A0" />
          <stop offset="1" stopColor="#535353" />
        </linearGradient>

        <linearGradient
          id="goat-horns"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#FFB35B" />
          <stop offset="1" stopColor="#A94B00" />
        </linearGradient>
      </defs>

      {/* BACKGROUND */}
      <circle
        cx="260"
        cy="252"
        r="188"
        fill="#FF7900"
        opacity=".055"
      />

      <circle
        cx="260"
        cy="252"
        r="161"
        fill="none"
        stroke="#FF7900"
        strokeOpacity=".22"
        strokeWidth="2"
      />

      <path
        d="M74 397H446"
        stroke="#FF7900"
        strokeOpacity=".35"
        strokeWidth="2"
      />

      {/* MUSCULAR ARMS */}
      <g
        fill="url(#goat-body)"
        stroke="#FF7900"
        strokeOpacity=".8"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        <path d="M207 239C176 206 132 209 107 231C87 249 81 277 94 295C70 307 70 342 88 362C106 382 143 377 160 359L210 308Z" />
        <path d="M313 239C344 206 388 209 413 231C433 249 439 277 426 295C450 307 450 342 432 362C414 382 377 377 360 359L310 308Z" />
      </g>

      <g
        fill="none"
        stroke="#A7A7A7"
        strokeWidth="6"
        strokeLinecap="round"
        opacity=".65"
      >
        <path d="M119 284C141 248 171 244 196 264M109 323C136 304 155 311 166 324M149 358L166 331" />
        <path d="M401 284C379 248 349 244 324 264M411 323C384 304 365 311 354 324M371 358L354 331" />
      </g>

      {/* CHEST AND TORSO */}
      <path
        d="M216 218C229 208 242 204 260 204C278 204 291 208 304 218C330 238 340 263 349 303L366 398H154L171 303C180 263 190 238 216 218Z"
        fill="url(#goat-body)"
        stroke="#FF7900"
        strokeOpacity=".65"
        strokeWidth="4"
      />

      <path
        d="M260 244V388M193 263C212 250 236 253 256 275M327 263C308 250 284 253 264 275M191 283C213 302 238 299 259 284M329 283C307 302 282 299 261 284"
        stroke="#B8B8B8"
        strokeOpacity=".75"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M213 325H250M270 325H307M215 353H249M271 353H305M223 382H248M272 382H298"
        stroke="#8F8F8F"
        strokeOpacity=".55"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* EARS */}
      <path
        d="M221 143L166 121L184 176L216 176ZM299 143L354 121L336 176L304 176Z"
        fill="#888888"
        stroke="#E0E0E0"
        strokeWidth="3"
      />

      <path
        d="M208 154L183 141M312 154L337 141"
        stroke="#FF7900"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* HORNS */}
      <path
        d="M227 138C195 105 197 68 211 43C188 56 170 92 183 123C192 146 207 156 220 163Z"
        fill="url(#goat-horns)"
        stroke="#FFCA89"
        strokeWidth="3"
      />

      <path
        d="M293 138C325 105 323 68 309 43C332 56 350 92 337 123C328 146 313 156 300 163Z"
        fill="url(#goat-horns)"
        stroke="#FFCA89"
        strokeWidth="3"
      />

      {/* GOAT HEAD */}
      <path
        d="M220 129C231 115 248 109 260 109C272 109 289 115 300 129L311 173L302 211L281 234H239L218 211L209 173Z"
        fill="url(#goat-head)"
        stroke="#E7E7E7"
        strokeWidth="3"
      />

      <path
        d="M233 153L246 160M287 153L274 160"
        fill="none"
        stroke="#252525"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M229 181L260 171L291 181L284 211L260 221L236 211Z"
        fill="#CECAC5"
        stroke="#414141"
        strokeWidth="3"
      />

      <path
        d="M246 193L255 196M274 193L265 196"
        stroke="#383838"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M249 212Q260 219 271 212"
        fill="none"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* BEARD */}
      <path
        d="M243 221L260 257L277 221L270 241L260 264L250 241Z"
        fill="#E9E6E1"
        stroke="#B8B8B8"
        strokeWidth="2"
      />

      <path
        d="M202 395H318"
        stroke="#FF7900"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// =======================================
// MAIN FOOTER
// =======================================

export default function Footer() {
  const year = new Date().getFullYear();

  const { categories = [] } = useCategories();

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Përshëndetje ProteinFitness! Dua më shumë informacione për produktet dhe porositë."
    )}`;

  const activeSocials = SOCIAL_LINKS.filter(
    (social) => social.url.trim()
  );

  return (
    <footer
      id="kontakt"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#060606] text-white"
    >
      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,121,0,0.08),transparent_55%)]"
      />

      <div className="relative h-[3px] bg-gradient-to-r from-[#FF7900] via-[#FFBD72] to-[#FF7900]" />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        {/* ================================= */}
        {/* BRAND + GOAT + WHATSAPP */}
        {/* ================================= */}

        <div className="grid items-center gap-8 border-b border-white/10 py-12 lg:grid-cols-[minmax(0,1fr)_300px_minmax(0,1fr)] lg:gap-10 lg:py-16">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              aria-label="ProteinFitness - Ballina"
              className="inline-block"
            >
              <img
                src={LOGO}
                alt="ProteinFitness logo"
                loading="lazy"
                className="w-[210px] object-contain sm:w-[245px]"
              />
            </Link>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#FF7900]">
              SPORTS SUPPLEMENTS
            </p>

            <h2 className="mt-4 max-w-sm text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl">
              PRODUKTET E TUA.{" "}
              <span className="text-[#FF7900]">
                ZGJEDHJA JOTE.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-400">
              Proteina, kreatinë, vitamina dhe
              aksesorë sportivë. Zbulo produktet
              tona dhe porosit lehtësisht online.
            </p>
          </div>

          {/* MUSCULAR GOAT */}
          <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-gradient-to-b from-[#1C140F] to-[#0B0B0B] px-3 pt-3">
            <MuscularGoat />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0B0B] to-transparent px-4 pb-4 pt-10 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#FF7900]">
                PROTEINFITNESS GOAT
              </span>
            </div>
          </div>

          {/* WHATSAPP */}
          <div className="lg:justify-self-end">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
              KE PYETJE?
            </p>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              KONSULTOHU{" "}
              <span className="text-[#FF7900]">
                NË WHATSAPP
              </span>
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
              Kontakto ekipin tonë për informacione
              rreth produkteve, porosive dhe dërgesave.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex min-h-[58px] w-full items-center justify-between gap-3 rounded-xl bg-[#FF7900] px-5 text-xs font-black uppercase text-black transition-all hover:-translate-y-1 hover:bg-[#FFA33E] sm:w-auto"
            >
              <FaWhatsapp size={22} />

              NA SHKRUAJ NË WHATSAPP

              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>

            <p className="mt-3 text-xs text-neutral-500">
              {PHONE_DISPLAY}
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* STANDARDS / CERTIFICATIONS INFO */}
        {/* ================================= */}

        <section
          aria-labelledby="footer-standards-title"
          className="border-b border-white/10 py-12 lg:py-14"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
                INFORMOHU PËR CILËSINË
              </p>

              <h2
                id="footer-standards-title"
                className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl"
              >
                ÇFARË NËNKUPTOJNË STANDARDET?
              </h2>
            </div>

            <p className="max-w-md text-xs leading-6 text-neutral-400">
              Këto janë terma që mund t'i hasësh
              te prodhuesit e suplementeve.
              Çdo certifikim duhet verifikuar
              për produktin ose prodhuesin përkatës.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STANDARDS.map(
              ({
                name,
                subtitle,
                detail,
                icon: Icon,
              }) => (
                <article
                  key={name}
                  className="rounded-2xl border border-white/10 bg-[#141414] p-5 transition-colors hover:border-[#FF7900]/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7900]/10 text-[#FF7900]">
                      <Icon size={22} />
                    </span>

                    <span className="text-lg font-black text-white">
                      {name}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold text-neutral-200">
                    {subtitle}
                  </p>

                  <p className="mt-2 text-xs leading-6 text-neutral-400">
                    {detail}
                  </p>
                </article>
              )
            )}
          </div>

          <p className="mt-5 text-[11px] leading-6 text-neutral-500">
            Shënim: Ky seksion është informues,
            jo dëshmi që ProteinFitness ose secili
            produkt mban këto certifikime.
          </p>
        </section>

        {/* ================================= */}
        {/* FOOTER NAVIGATION */}
        {/* ================================= */}

        <div className="grid gap-10 border-b border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* SHOP */}
          <div>
            <FooterHeading>
              DYQANI
            </FooterHeading>

            <nav
              aria-label="Lidhjet e dyqanit"
              className="mt-6 flex flex-col gap-4"
            >
              <FooterNavLink to="/">
                Ballina
              </FooterNavLink>

              <FooterNavLink to="/shop">
                Të gjitha produktet
              </FooterNavLink>

              <FooterNavLink to="/wishlist">
                Të preferuarat
              </FooterNavLink>

              <FooterNavLink to="/cart">
                Shporta ime
              </FooterNavLink>

              <FooterNavLink to="/checkout">
                Përfundo porosinë
              </FooterNavLink>
            </nav>
          </div>

          {/* CATEGORIES */}
          <div>
            <FooterHeading>
              KATEGORITË
            </FooterHeading>

            <nav
              aria-label="Kategoritë e produkteve"
              className="mt-6 flex flex-col gap-4"
            >
              {Array.isArray(categories) &&
              categories.length > 0 ? (
                categories.slice(0, 6).map(
                  (category) => (
                    <FooterNavLink
                      key={
                        category.id ??
                        category.name
                      }
                      to={`/shop?category=${encodeURIComponent(
                        category.name
                      )}`}
                    >
                      {category.name}
                    </FooterNavLink>
                  )
                )
              ) : (
                <FooterNavLink to="/shop">
                  Shiko kategoritë
                </FooterNavLink>
              )}
            </nav>
          </div>

          {/* INFORMATION */}
          <div>
            <FooterHeading>
              INFORMACIONE
            </FooterHeading>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <Truck
                  size={20}
                  className="mt-1 shrink-0 text-[#FF7900]"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Dërgesat
                  </p>

                  <p className="mt-1 text-xs leading-6 text-neutral-400">
                    Kosovë, Shqipëri dhe
                    Maqedoni e Veriut
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CreditCard
                  size={20}
                  className="mt-1 shrink-0 text-[#FF7900]"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Pagesa
                  </p>

                  <p className="mt-1 text-xs leading-6 text-neutral-400">
                    Pagesë në dorëzim
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-1 shrink-0 text-[#FF7900]"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Porositë
                  </p>

                  <p className="mt-1 text-xs leading-6 text-neutral-400">
                    Regjistrohen në sistem dhe
                    presin konfirmim.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <FooterHeading>
              KONTAKT
            </FooterHeading>

            <div className="mt-6 space-y-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-[#FF7900]"
              >
                <FaWhatsapp
                  size={19}
                  className="text-[#FF7900]"
                />

                {PHONE_DISPLAY}
              </a>

              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-[#FF7900]"
              >
                <Phone
                  size={19}
                  className="text-[#FF7900]"
                />

                Na telefono
              </a>

              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <MapPin
                  size={19}
                  className="text-[#FF7900]"
                />

                Kosovë
              </div>

              {activeSocials.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  {activeSocials.map(
                    ({
                      name,
                      url,
                      icon: Icon,
                    }) => (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={name}
                        aria-label={`ProteinFitness ${name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#141414] text-neutral-300 transition-colors hover:border-[#FF7900] hover:text-[#FF7900]"
                      >
                        <Icon size={18} />
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* FINAL CTA */}
        {/* ================================= */}

        <div className="my-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#FF7900]/20 bg-gradient-to-r from-[#21150D] via-[#171717] to-[#101010] p-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900]">
              PROTEINFITNESS
            </p>

            <p className="mt-2 text-sm text-neutral-300">
              Eksploro proteinat dhe suplementet
              që kemi në dyqan.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-[#FF7900]/50 px-5 text-xs font-black uppercase text-white transition-colors hover:bg-[#FF7900] hover:text-black sm:w-auto"
          >
            SHIKO PRODUKTET

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 py-7 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <span>
            © {year} ProteinFitness.
            Të gjitha të drejtat e rezervuara.
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
            SPORTS SUPPLEMENTS STORE
          </span>
        </div>

      </div>
    </footer>
  );
}
