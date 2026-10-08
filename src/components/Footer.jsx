import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUMBER =
  "38343977125";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61584463366708";

const INSTAGRAM_URL =
  "https://www.instagram.com/apar_fashion__custom__store/";

const TIKTOK_URL =
  "https://www.tiktok.com/@apar_store";

export default function Footer() {
  const year =
    new Date().getFullYear();

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Përshëndetje APAR, dua më shumë informacione."
    )}`;

  return (
    <footer
      id="kontakt"
      className="relative overflow-hidden bg-[#050505] text-white"
    >
      {/* ================================= */}
      {/* BACKGROUND */}
      {/* ================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* LOGO WATERMARK */}
        <img
          src={APAR_LOGO}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-0 w-[650px] max-w-none -translate-x-1/2 opacity-[0.025] mix-blend-screen md:w-[900px]"
        />

        {/* GREEN GLOW */}
        <div className="absolute -left-40 top-0 h-[320px] w-[320px] rounded-full bg-[#009246]/10 blur-[130px]" />

        {/* RED GLOW */}
        <div className="absolute -right-40 top-20 h-[320px] w-[320px] rounded-full bg-[#CE2B37]/10 blur-[130px]" />

        {/* CENTER LIGHT */}
        <div className="absolute left-1/2 top-0 h-[180px] w-[500px] -translate-x-1/2 bg-white/[0.025] blur-[100px]" />

      </div>

      {/* ================================= */}
      {/* ITALIAN LINE */}
      {/* ================================= */}

      <div className="relative flex h-[3px]">

        <span className="flex-1 bg-[#009246]" />

        <span className="flex-1 bg-white" />

        <span className="flex-1 bg-[#CE2B37]" />

      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10">

        {/* ================================= */}
        {/* TOP */}
        {/* ================================= */}

        <div className="flex flex-col gap-8 border-b border-white/10 py-9 md:flex-row md:items-center md:justify-between md:py-11">

          {/* BRAND */}
          <div>

            <Link
              to="/"
              aria-label="APAR Home"
              className="inline-block"
            >
              <img
                src={APAR_LOGO}
                alt="APAR"
                className="w-[190px] object-contain mix-blend-screen sm:w-[220px]"
              />
            </Link>

            <div className="mt-3 flex items-center gap-3">

              <span className="h-[2px] w-7 bg-[#009246]" />

              <p className="text-[8px] font-bold tracking-[0.42em] text-neutral-500 sm:text-[9px]">
                WEAR YOUR STORY
              </p>

              <span className="h-[2px] w-7 bg-[#CE2B37]" />

            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
              Produkte moderne, stil unik
              dhe zgjedhje të përzgjedhura
              për stilin tënd.
            </p>

          </div>

          {/* WHATSAPP */}
          <div className="w-full md:w-auto">

            <p className="mb-3 text-xs text-neutral-500">
              Ke pyetje ose dëshiron të
              porosisësh?
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color:
                  "#050505",
              }}
              className="group flex w-full items-center justify-between gap-5 border border-white bg-white px-5 py-4 text-sm font-black tracking-[0.06em] shadow-[0_10px_40px_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 sm:px-6 md:w-auto md:justify-center"
            >
              <div className="flex items-center gap-3">

                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#050505]"
                  style={{
                    color:
                      "#ffffff",
                  }}
                >
                  <FaWhatsapp
                    size={18}
                  />
                </span>

                <span
                  className="whitespace-nowrap"
                  style={{
                    color:
                      "#050505",
                  }}
                >
                  NA SHKRUAJ NË WHATSAPP
                </span>

              </div>

              <ArrowUpRight
                size={17}
                style={{
                  color:
                    "#050505",
                }}
                className="flex-shrink-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />

            </a>

          </div>

        </div>

        {/* ================================= */}
        {/* MAIN FOOTER */}
        {/* ================================= */}

        <div className="grid grid-cols-2 gap-x-5 gap-y-9 py-9 md:grid-cols-4 md:gap-10 md:py-11">

          {/* ================================= */}
          {/* SHOP */}
          {/* ================================= */}

          <div>

            <p className="text-[10px] font-black tracking-[0.3em] text-neutral-500">
              SHOP
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">

              <Link
                to="/shop"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Produktet
              </Link>

              <Link
                to="/shop?category=Veshje"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Veshje
              </Link>

              <Link
                to="/shop?category=Aksesorë"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Aksesorë
              </Link>

              <Link
                to="/shop?category=Kozmetikë"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Kozmetikë
              </Link>

            </div>

          </div>

          {/* ================================= */}
          {/* APAR */}
          {/* ================================= */}

          <div>

            <p className="text-[10px] font-black tracking-[0.3em] text-neutral-500">
              APAR
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">

              <Link
                to="/wishlist"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Shporta
              </Link>

              <Link
                to="/checkout"
                className="w-fit text-neutral-400 transition hover:translate-x-1 hover:text-white"
              >
                Checkout
              </Link>

            </div>

          </div>

          {/* ================================= */}
          {/* DELIVERY */}
          {/* ================================= */}

          <div className="col-span-2 md:col-span-1">

            <p className="text-[10px] font-black tracking-[0.3em] text-neutral-500">
              DËRGESA
            </p>

            <div className="mt-5 space-y-3">

              <div className="flex items-center gap-3">

                <Truck
                  size={17}
                  className="flex-shrink-0 text-neutral-600"
                />

                <span className="text-sm text-neutral-300">
                  Kosovë
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Truck
                  size={17}
                  className="flex-shrink-0 text-neutral-600"
                />

                <span className="text-sm text-neutral-300">
                  Shqipëri
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Truck
                  size={17}
                  className="flex-shrink-0 text-neutral-600"
                />

                <span className="text-sm text-neutral-300">
                  Maqedoni e Veriut
                </span>

              </div>

              <p className="pt-1 text-xs leading-5 text-neutral-600">
                Pagesë në dorëzim sipas
                mundësisë së dërgesës.
              </p>

            </div>

          </div>

          {/* ================================= */}
          {/* CONTACT */}
          {/* ================================= */}

          <div className="col-span-2 md:col-span-1">

            <p className="text-[10px] font-black tracking-[0.3em] text-neutral-500">
              KONTAKT
            </p>

            <div className="mt-5 space-y-4">

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-neutral-400 transition hover:text-white"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] transition group-hover:border-[#009246]/50">

                  <FaWhatsapp
                    size={17}
                  />

                </span>

                <span>
                  +383 43 977 125
                </span>

              </a>

              <a
                href="tel:+38343977125"
                className="group flex items-center gap-3 text-sm text-neutral-400 transition hover:text-white"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 bg-white/[0.03]">

                  <Phone
                    size={16}
                  />

                </span>

                <span>
                  Telefono APAR
                </span>

              </a>

              <div className="flex items-center gap-3 text-sm text-neutral-400">

                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 bg-white/[0.03]">

                  <MapPin
                    size={16}
                  />

                </span>

                <span>
                  Kosovë
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* BOTTOM */}
        {/* ================================= */}

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">

          {/* COPYRIGHT */}
          <div>

            <p className="text-xs text-neutral-600">
              © {year} APAR. Të gjitha
              të drejtat e rezervuara.
            </p>

            <p className="mt-1 text-[8px] tracking-[0.3em] text-neutral-700 sm:hidden">
              WEAR YOUR STORY
            </p>

          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-2">

            {/* INSTAGRAM */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APAR Instagram"
              title="Instagram"
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-neutral-500 transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black"
            >
              <FaInstagram
                size={17}
              />
            </a>

            {/* FACEBOOK */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APAR Facebook"
              title="Facebook"
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-neutral-500 transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black"
            >
              <FaFacebookF
                size={15}
              />
            </a>

            {/* TIKTOK */}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="APAR TikTok"
              title="TikTok"
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-neutral-500 transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black"
            >
              <FaTiktok
                size={16}
              />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}