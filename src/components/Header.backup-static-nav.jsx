import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import SearchOverlay from "./SearchOverlay";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

const WHATSAPP_NUMBER =
  "38343977125";

export default function Header() {
  const {
    cartCount,
    openCart,
  } = useCart();

  const {
    wishlistCount,
  } = useWishlist();

  const location =
    useLocation();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  /*
    SCROLL EFFECT
  */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 18
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
    LOCK PAGE WHEN MOBILE MENU IS OPEN
  */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);

  /*
    CLOSE MOBILE MENU AFTER ROUTE CHANGE
  */
  useEffect(() => {
    setMenuOpen(false);
  }, [
    location.pathname,
    location.search,
  ]);

  const searchParams =
    new URLSearchParams(
      location.search
    );

  const currentCategory =
    searchParams.get(
      "category"
    );

  const isHome =
    location.pathname === "/";

  const isShop =
    location.pathname ===
      "/shop" &&
    !currentCategory;

  const isCategory = (
    category
  ) =>
    location.pathname ===
      "/shop" &&
    currentCategory ===
      category;

  const isWishlist =
    location.pathname ===
    "/wishlist";

  const desktopLinkClass = (
    active
  ) =>
    `group relative py-3 text-[12px] font-semibold tracking-[0.04em] transition duration-300 ${
      active
        ? "text-white"
        : "text-neutral-400 hover:text-white"
    }`;

  const mobileLinks = [
    {
      name: "Home",
      subtitle:
        "Faqja kryesore",
      to: "/",
    },
    {
      name: "Shop",
      subtitle:
        "Të gjitha produktet",
      to: "/shop",
    },
    {
      name: "Veshje",
      subtitle:
        "Koleksioni i veshjeve",
      to: "/shop?category=Veshje",
    },
    {
      name: "Aksesorë",
      subtitle:
        "Detajet e stilit",
      to: "/shop?category=Aksesorë",
    },
    {
      name: "Kozmetikë",
      subtitle:
        "Produkte të përzgjedhura",
      to: "/shop?category=Kozmetikë",
    },
    {
      name: "Wishlist",
      subtitle:
        `${wishlistCount} produkte të ruajtura`,
      to: "/wishlist",
    },
  ];

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Përshëndetje APAR, dua më shumë informacione."
    )}`;

  return (
    <>
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="sticky top-0 z-[80]">

        {/* BRAND LINE */}
        <div
          className={`flex w-full transition-all duration-500 ${
            scrolled
              ? "h-px opacity-70"
              : "h-[2px] opacity-100"
          }`}
        >
          <span className="flex-1 bg-[#009246]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#CE2B37]" />
        </div>

        {/* MAIN BAR */}
        <div
          className={`relative overflow-hidden border-b text-white transition-all duration-500 ${
            scrolled
              ? "border-white/20 bg-black/30 shadow-[0_14px_45px_rgba(0,0,0,0.25)] backdrop-blur-[24px] backdrop-saturate-150"
              : "border-white/[0.07] bg-black/95 backdrop-blur-xl"
          }`}
        >
          {/* ICE GLASS */}
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
              scrolled
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.025] to-transparent" />

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="absolute -top-16 left-1/2 h-28 w-[70%] -translate-x-1/2 rounded-full bg-white/[0.05] blur-3xl" />
          </div>

          {/* CONTENT */}
          <div
            className={`relative mx-auto flex max-w-[1500px] items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-10 ${
              scrolled
                ? "h-[64px] lg:h-[70px]"
                : "h-[72px] lg:h-[82px]"
            }`}
          >
            {/* LOGO */}
            <Link
              to="/"
              aria-label="APAR Home"
              className="group relative flex flex-shrink-0 items-center"
            >
              <img
                src={APAR_LOGO}
                alt="APAR"
                className={`object-contain mix-blend-screen transition-all duration-500 group-hover:opacity-80 ${
                  scrolled
                    ? "w-[120px] sm:w-[135px] lg:w-[155px]"
                    : "w-[132px] sm:w-[145px] lg:w-[170px]"
                }`}
              />
            </Link>

            {/* ================================= */}
            {/* DESKTOP NAV */}
            {/* ================================= */}

            <nav className="hidden items-center lg:flex">

              <div
                className={`flex items-center gap-1 border px-3 transition-all duration-500 ${
                  scrolled
                    ? "border-white/15 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
                    : "border-white/[0.07] bg-white/[0.025]"
                }`}
              >

                {/* HOME */}
                <Link
                  to="/"
                  className={desktopLinkClass(
                    isHome
                  )}
                >
                  <span className="relative block px-3">
                    Home

                    <span
                      className={`absolute -bottom-[13px] left-3 right-3 h-[2px] transition-all duration-300 ${
                        isHome
                          ? "bg-white opacity-100"
                          : "bg-white opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </span>
                </Link>

                {/* SHOP */}
                <Link
                  to="/shop"
                  className={desktopLinkClass(
                    isShop
                  )}
                >
                  <span className="relative block px-3">
                    Shop

                    <span
                      className={`absolute -bottom-[13px] left-3 right-3 h-[2px] transition-all duration-300 ${
                        isShop
                          ? "bg-white opacity-100"
                          : "bg-white opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </span>
                </Link>

                {/* VESHJE */}
                <Link
                  to="/shop?category=Veshje"
                  className={desktopLinkClass(
                    isCategory(
                      "Veshje"
                    )
                  )}
                >
                  <span className="relative block px-3">
                    Veshje

                    <span
                      className={`absolute -bottom-[13px] left-3 right-3 h-[2px] transition-all duration-300 ${
                        isCategory(
                          "Veshje"
                        )
                          ? "bg-white opacity-100"
                          : "bg-white opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </span>
                </Link>

                {/* AKSESORË */}
                <Link
                  to="/shop?category=Aksesorë"
                  className={desktopLinkClass(
                    isCategory(
                      "Aksesorë"
                    )
                  )}
                >
                  <span className="relative block px-3">
                    Aksesorë

                    <span
                      className={`absolute -bottom-[13px] left-3 right-3 h-[2px] transition-all duration-300 ${
                        isCategory(
                          "Aksesorë"
                        )
                          ? "bg-white opacity-100"
                          : "bg-white opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </span>
                </Link>

                {/* KOZMETIKË */}
                <Link
                  to="/shop?category=Kozmetikë"
                  className={desktopLinkClass(
                    isCategory(
                      "Kozmetikë"
                    )
                  )}
                >
                  <span className="relative block px-3">
                    Kozmetikë

                    <span
                      className={`absolute -bottom-[13px] left-3 right-3 h-[2px] transition-all duration-300 ${
                        isCategory(
                          "Kozmetikë"
                        )
                          ? "bg-white opacity-100"
                          : "bg-white opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </span>
                </Link>

                {/* CONTACT */}
                <a
                  href="/#kontakt"
                  className="group relative py-3 text-[12px] font-semibold tracking-[0.04em] text-neutral-400 transition duration-300 hover:text-white"
                >
                  <span className="relative block px-3">
                    Kontakt
                  </span>
                </a>

              </div>

            </nav>

            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <div className="flex items-center gap-2">

              {/* SEARCH */}
              <button
                type="button"
                onClick={
                  openSearch
                }
                aria-label="Kërko produkte"
                title="Kërko"
                className={`group flex h-10 w-10 items-center justify-center border text-neutral-300 transition-all duration-500 hover:border-white/40 hover:bg-white hover:text-black lg:h-11 lg:w-11 ${
                  scrolled
                    ? "border-white/15 bg-white/[0.06] backdrop-blur-xl"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <Search
                  size={18}
                  className="transition duration-300 group-hover:scale-105"
                />
              </button>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                title="Wishlist"
                className={`group relative flex h-10 w-10 items-center justify-center border transition-all duration-500 lg:h-11 lg:w-11 ${
                  isWishlist
                    ? "border-white bg-white text-black"
                    : scrolled
                    ? "border-white/15 bg-white/[0.06] text-neutral-300 backdrop-blur-xl hover:border-white/40 hover:bg-white hover:text-black"
                    : "border-white/10 bg-white/[0.025] text-neutral-300 hover:border-white/40 hover:bg-white hover:text-black"
                }`}
              >
                <Heart
                  size={18}
                  strokeWidth={1.7}
                  fill={
                    isWishlist
                      ? "currentColor"
                      : "none"
                  }
                  className="transition duration-300 group-hover:scale-110"
                />

                {wishlistCount >
                  0 && (
                  <span className="absolute -right-2 -top-2 flex h-[21px] min-w-[21px] items-center justify-center rounded-full border-2 border-black bg-white px-1 text-[9px] font-black text-black shadow-xl">
                    {wishlistCount >
                    99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(
                    false
                  );

                  openCart();
                }}
                aria-label="Hap shportën"
                title="Shporta"
                className={`group relative flex h-10 w-10 items-center justify-center border text-neutral-300 transition-all duration-500 hover:border-white/40 hover:bg-white hover:text-black lg:h-11 lg:w-11 ${
                  scrolled
                    ? "border-white/15 bg-white/[0.06] backdrop-blur-xl"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <ShoppingBag
                  size={18}
                  className="transition duration-300 group-hover:scale-105"
                />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[21px] min-w-[21px] items-center justify-center rounded-full border-2 border-black bg-white px-1 text-[9px] font-black text-black shadow-xl">
                    {cartCount >
                    99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </button>

              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(true)
                }
                aria-label="Hap menunë"
                className={`group flex h-10 w-10 items-center justify-center border text-neutral-300 transition-all duration-500 hover:border-white/40 hover:bg-white hover:text-black lg:hidden ${
                  scrolled
                    ? "border-white/15 bg-white/[0.06] backdrop-blur-xl"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <Menu
                  size={20}
                />
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================= */}

      <div
        onClick={
          closeMobileMenu
        }
        className={`fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ================================= */}
      {/* MOBILE DRAWER */}
      {/* ================================= */}

      <aside
        className={`fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-[390px] flex-col border-l border-white/10 bg-[#070707] text-white shadow-[-30px_0_80px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out lg:hidden ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* BRAND LINE */}
        <div className="flex h-[2px] w-full">

          <span className="flex-1 bg-[#009246]" />

          <span className="flex-1 bg-white" />

          <span className="flex-1 bg-[#CE2B37]" />

        </div>

        {/* DRAWER HEADER */}
        <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-5">

          <Link
            to="/"
            onClick={
              closeMobileMenu
            }
          >
            <img
              src={APAR_LOGO}
              alt="APAR"
              className="w-[145px] object-contain mix-blend-screen"
            />
          </Link>

          <button
            type="button"
            onClick={
              closeMobileMenu
            }
            aria-label="Mbyll menunë"
            className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-white transition hover:bg-white hover:text-black"
          >
            <X size={19} />
          </button>

        </div>

        {/* BRAND MESSAGE */}
        <div className="border-b border-white/10 px-5 py-5">

          <div className="flex items-center gap-3">

            <span className="h-[2px] w-7 bg-[#009246]" />

            <p className="text-[9px] font-bold tracking-[0.4em] text-neutral-500">
              WEAR YOUR STORY
            </p>

            <span className="h-[2px] w-7 bg-[#CE2B37]" />

          </div>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Zbulo koleksionin APAR
            dhe krijo stilin tënd.
          </p>

        </div>

        {/* MENU LINKS */}
        <div className="flex-1 overflow-y-auto px-5 py-3">

          <nav>

            {mobileLinks.map(
              (
                item,
                index
              ) => {
                const wishlistItem =
                  item.to ===
                  "/wishlist";

                return (
                  <Link
                    key={
                      item.name
                    }
                    to={
                      item.to
                    }
                    onClick={
                      closeMobileMenu
                    }
                    className={`group flex items-center justify-between border-b py-4 transition ${
                      wishlistItem &&
                      isWishlist
                        ? "border-white/15 bg-white/[0.025]"
                        : "border-white/[0.07]"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <span className="mt-1 text-[9px] font-semibold text-neutral-700">
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>

                        <div className="flex items-center gap-2">

                          {wishlistItem && (
                            <Heart
                              size={14}
                              fill={
                                wishlistCount >
                                0
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                wishlistCount >
                                0
                                  ? "text-white"
                                  : "text-neutral-500"
                              }
                            />
                          )}

                          <p className="text-[15px] font-semibold text-neutral-200 transition group-hover:text-white">
                            {
                              item.name
                            }
                          </p>

                          {wishlistItem &&
                            wishlistCount >
                              0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-black text-black">
                                {
                                  wishlistCount
                                }
                              </span>
                            )}

                        </div>

                        <p className="mt-1 text-[11px] text-neutral-600">
                          {
                            item.subtitle
                          }
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-neutral-700 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
                    />

                  </Link>
                );
              }
            )}

          </nav>

        </div>

        {/* ================================= */}
        {/* DRAWER BOTTOM */}
        {/* ================================= */}

        <div className="border-t border-white/10 bg-black px-5 py-5">

          {/* WHATSAPP */}
          <a
            href={
              whatsappUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color:
                "#050505",
            }}
            className="flex w-full items-center justify-between bg-white px-5 py-4 text-sm font-black transition hover:bg-neutral-200"
          >
            <div className="flex items-center gap-3">

              <span
                className="flex h-8 w-8 items-center justify-center bg-black"
                style={{
                  color:
                    "#ffffff",
                }}
              >
                <FaWhatsapp
                  size={16}
                />
              </span>

              <span
                style={{
                  color:
                    "#050505",
                }}
              >
                KONTAKTO APAR
              </span>

            </div>

            <ArrowUpRight
              size={17}
              style={{
                color:
                  "#050505",
              }}
            />

          </a>

          {/* QUICK ACTIONS */}
          <div className="mt-3 grid grid-cols-3 gap-2">

            {/* SEARCH */}
            <button
              type="button"
              onClick={
                openSearch
              }
              className="flex min-h-[54px] flex-col items-center justify-center gap-1.5 border border-white/10 bg-white/[0.02] text-neutral-400 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
            >
              <Search
                size={15}
              />

              <span className="text-[9px] font-bold tracking-[0.08em]">
                KËRKO
              </span>
            </button>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              onClick={
                closeMobileMenu
              }
              className={`relative flex min-h-[54px] flex-col items-center justify-center gap-1.5 border transition ${
                isWishlist
                  ? "border-white/35 bg-white text-black"
                  : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Heart
                size={15}
                fill={
                  wishlistCount >
                  0
                    ? "currentColor"
                    : "none"
                }
              />

              <span className="text-[9px] font-bold tracking-[0.08em]">
                WISHLIST
              </span>

              {wishlistCount >
                0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-black shadow-lg ${
                    isWishlist
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {
                    wishlistCount
                  }
                </span>
              )}
            </Link>

            {/* CART */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();

                openCart();
              }}
              className="relative flex min-h-[54px] flex-col items-center justify-center gap-1.5 border border-white/10 bg-white/[0.02] text-neutral-400 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
            >
              <ShoppingBag
                size={15}
              />

              <span className="text-[9px] font-bold tracking-[0.08em]">
                SHPORTA
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-black text-black shadow-lg">
                  {
                    cartCount
                  }
                </span>
              )}
            </button>

          </div>

          {/* MINI STATUS */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">

            <p className="text-[8px] font-semibold tracking-[0.25em] text-neutral-700">
              APAR STORE
            </p>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <p className="text-[8px] font-semibold tracking-[0.16em] text-neutral-600">
                ONLINE
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        open={
          searchOpen
        }
        onClose={() =>
          setSearchOpen(
            false
          )
        }
      />

    </>
  );
}