
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SearchOverlay from "./SearchOverlay";

// PROTEINFITNESS CONFIG
// Logo duhet të jetë në public/proteinfitness-logo.png

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083572/Protein_Fitness_Goat_Logo_pt3o0t.png";
const WHATSAPP_NUMBER = "38343977125";

const NAV_LINKS = [
  {
    title: "Ballina",
    description: "Faqja kryesore",
    to: "/",
  },
  {
    title: "Produktet",
    description: "Proteina dhe suplemente",
    to: "/shop",
  },
  {
    title: "Kontakt",
    description: "Na kontakto",
    to: "/#kontakt",
  },
];

const formatCount = (count) =>
  count > 99 ? "99+" : count;

export default function Header() {
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const openShoppingCart = () => {
    setMenuOpen(false);
    openCart();
  };

  // WHATSAPP

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Përshëndetje ProteinFitness! Dua më shumë informacione për produktet tuaja."
  )}`;

  const isWishlist = location.pathname === "/wishlist";

  const isActive = (to) => {
    if (to === "/") {
      return location.pathname === "/" && !location.hash;
    }

    if (to === "/shop") {
      return location.pathname === "/shop";
    }

    if (to === "/#kontakt") {
      return location.hash === "#kontakt";
    }

    return false;
  };

  // SCROLL EFFECT

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // CLOSE MOBILE MENU ON ROUTE CHANGE

  useEffect(() => {
    setMenuOpen(false);
  }, [
    location.pathname,
    location.search,
    location.hash,
  ]);

  // LOCK SCROLL WHEN MOBILE MENU IS OPEN

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [menuOpen]);

  // SCROLL TO CONTACT SECTION

  useEffect(() => {
    if (location.hash !== "#kontakt") return;

    const timer = window.setTimeout(() => {
      document
        .getElementById("kontakt")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname, location.hash]);

  // BUTTON STYLES

  const iconButton = `
    relative
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    rounded-xl
    border
    border-white/10
    bg-white/[0.045]
    text-neutral-200
    transition-all
    duration-300
    hover:border-[#FF7900]/70
    hover:bg-[#FF7900]
    hover:text-black
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#FF7900]
  `;

  const countBadge = `
    absolute
    -right-1.5
    -top-1.5
    flex
    h-5
    min-w-5
    items-center
    justify-center
    rounded-full
    border-2
    border-[#080808]
    bg-[#FF7900]
    px-1
    text-[10px]
    font-black
    text-black
  `;

  return (
    <>
      {/* ===================================== */}
      {/* MAIN HEADER */}
      {/* ===================================== */}

      <div className="relative h-[76px] lg:h-[88px]">
        <header
          className={`z-[80] w-full ${
            scrolled
              ? "fixed inset-x-0 top-0"
              : "absolute inset-x-0 top-0"
          }`}
        >
          {/* ORANGE BRAND LINE */}

          <div className="h-[2px] bg-gradient-to-r from-[#FF7900] via-[#FFBA66] to-[#FF7900]" />

          {/* HEADER BACKGROUND */}

          <div
            className={`border-b border-white/10 text-white transition-all duration-300 ${
              scrolled
                ? "bg-[#080808]/90 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                : "bg-[#080808]/95 backdrop-blur-xl"
            }`}
          >
            {/* HEADER CONTENT */}

            <div
              className={`mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 transition-all duration-300 sm:gap-4 sm:px-6 lg:px-10 ${
                scrolled
                  ? "h-[64px] lg:h-[72px]"
                  : "h-[74px] lg:h-[86px]"
              }`}
            >
              {/* LOGO */}

              <Link
                to="/"
                aria-label="ProteinFitness - Ballina"
                className="group flex min-w-0 shrink-0 items-center"
              >
                <img
                  src={LOGO}
                  alt="ProteinFitness - Sports Supplements"
                  className={`w-[128px] object-contain transition-all duration-300 group-hover:opacity-80 sm:w-[158px] lg:w-[205px] ${
                    scrolled
                      ? "h-[57px] lg:h-[67px]"
                      : "h-[65px] lg:h-[80px]"
                  }`}
                />
              </Link>

              {/* ===================================== */}
              {/* DESKTOP NAVIGATION */}
              {/* ===================================== */}

              <nav
                className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/[0.035] p-1 lg:flex"
                aria-label="Navigimi kryesor"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={
                      isActive(link.to)
                        ? "page"
                        : undefined
                    }
                    className={`relative rounded-lg px-5 py-3 text-[13px] font-semibold tracking-wide transition-colors ${
                      isActive(link.to)
                        ? "bg-[#FF7900]/15 text-[#FF980F]"
                        : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.title}

                    {isActive(link.to) && (
                      <span className="absolute inset-x-5 bottom-0 h-[2px] rounded-full bg-[#FF7900]" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* ===================================== */}
              {/* HEADER ACTIONS */}
              {/* ===================================== */}

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                {/* SEARCH */}

                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Kërko produkte"
                  title="Kërko produkte"
                  className={iconButton}
                >
                  <Search
                    size={19}
                    strokeWidth={1.8}
                  />
                </button>

                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  aria-label="Produktet e preferuara"
                  title="Të preferuarat"
                  className={`${iconButton} hidden sm:flex ${
                    isWishlist
                      ? "border-[#FF7900] text-[#FF7900]"
                      : ""
                  }`}
                >
                  <Heart
                    size={19}
                    strokeWidth={1.8}
                    fill={
                      isWishlist
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {wishlistCount > 0 && (
                    <span className={countBadge}>
                      {formatCount(wishlistCount)}
                    </span>
                  )}
                </Link>

                {/* SHOPPING CART */}

                <button
                  type="button"
                  onClick={openShoppingCart}
                  aria-label="Hap shportën"
                  title="Shporta"
                  className={iconButton}
                >
                  <ShoppingBag
                    size={19}
                    strokeWidth={1.8}
                  />

                  {cartCount > 0 && (
                    <span className={countBadge}>
                      {formatCount(cartCount)}
                    </span>
                  )}
                </button>

                {/* MOBILE MENU BUTTON */}

                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Hap menunë"
                  aria-expanded={menuOpen}
                  aria-controls="proteinfitness-mobile-menu"
                  className={`${iconButton} lg:hidden`}
                >
                  <Menu
                    size={21}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ===================================== */}
      {/* MOBILE OVERLAY */}
      {/* ===================================== */}

      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* ===================================== */}
      {/* MOBILE DRAWER */}
      {/* ===================================== */}

      <aside
        id="proteinfitness-mobile-menu"
        aria-label="Menu mobile"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-[390px] flex-col border-l border-[#FF7900]/20 bg-[#090909] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen
            ? "translate-x-0"
            : "invisible pointer-events-none translate-x-full"
        }`}
      >
        {/* ORANGE LINE */}

        <div className="h-[3px] w-full bg-[#FF7900]" />

        {/* DRAWER HEADER */}

        <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="ProteinFitness - Ballina"
          >
            <img
              src={LOGO}
              alt="ProteinFitness"
              className="h-[75px] w-[158px] object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Mbyll menunë"
            className={iconButton}
          >
            <X size={21} />
          </button>
        </div>

        {/* ===================================== */}
        {/* BRAND MESSAGE */}
        {/* ===================================== */}

        <div className="shrink-0 border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-extrabold tracking-[0.27em] text-[#FF7900]">
            SPORTS SUPPLEMENTS
          </p>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Proteina, kreatinë, vitamina dhe aksesorë
            fitnesi. Zbulo produktet e ProteinFitness.
          </p>
        </div>

        {/* ===================================== */}
        {/* MOBILE NAVIGATION */}
        {/* ===================================== */}

        <nav
          className="min-h-0 flex-1 overflow-y-auto px-5 py-3"
          aria-label="Navigimi në telefon"
        >
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className="group flex items-center justify-between border-b border-white/10 py-5 transition-colors hover:border-[#FF7900]/60"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#FF7900]">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div>
                  <p className="text-base font-semibold text-white transition group-hover:text-[#FF970D]">
                    {link.title}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {link.description}
                  </p>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-[#FF7900]"
              />
            </Link>
          ))}
        </nav>

        {/* ===================================== */}
        {/* MOBILE DRAWER BOTTOM */}
        {/* ===================================== */}

        <div className="shrink-0 border-t border-white/10 bg-[#050505] px-5 py-4">
          {/* WHATSAPP BUTTON */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl bg-[#FF7900] px-4 py-4 text-[13px] font-extrabold text-black transition hover:bg-[#FF9D38]"
          >
            <span className="flex items-center gap-2">
              <FaWhatsapp size={21} />

              KONTAKTO PROTEINFITNESS
            </span>

            <ArrowUpRight size={19} />
          </a>

          {/* ===================================== */}
          {/* QUICK ACTIONS */}
          {/* ===================================== */}

          <div className="mt-3 grid grid-cols-3 gap-2">
            {/* SEARCH */}

            <button
              type="button"
              onClick={openSearch}
              className="flex min-h-[62px] flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 transition hover:border-[#FF7900]/60"
            >
              <Search size={17} />

              <span className="text-[10px] font-bold">
                KËRKO
              </span>
            </button>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="relative flex min-h-[62px] flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 transition hover:border-[#FF7900]/60"
            >
              <Heart size={17} />

              <span className="text-[9px] font-bold">
                TË PREFERUARAT
              </span>

              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 rounded-full bg-[#FF7900] px-1.5 text-[9px] font-extrabold text-black">
                  {formatCount(wishlistCount)}
                </span>
              )}
            </Link>

            {/* SHOPPING CART */}

            <button
              type="button"
              onClick={openShoppingCart}
              className="relative flex min-h-[62px] flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 transition hover:border-[#FF7900]/60"
            >
              <ShoppingBag size={17} />

              <span className="text-[10px] font-bold">
                SHPORTA
              </span>

              {cartCount > 0 && (
                <span className="absolute right-1 top-1 rounded-full bg-[#FF7900] px-1.5 text-[9px] font-extrabold text-black">
                  {formatCount(cartCount)}
                </span>
              )}
            </button>
          </div>

          {/* ===================================== */}
          {/* STORE STATUS */}
          {/* ===================================== */}

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[9px] font-semibold tracking-[0.16em] text-neutral-500">
              PROTEINFITNESS STORE
            </span>

            <span className="flex items-center gap-2 text-[9px] font-semibold tracking-wide text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7900]" />

              ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* ===================================== */}
      {/* SEARCH OVERLAY */}
      {/* ===================================== */}

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
