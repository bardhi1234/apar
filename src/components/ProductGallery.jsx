
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageOff,
  Images,
  X,
} from "lucide-react";

const ORANGE = "#FF7900";

// =====================================
// IMAGE NORMALIZATION
// =====================================

function getImageUrl(image) {
  if (typeof image === "string") {
    return image.trim();
  }

  if (image && typeof image === "object") {
    return (
      image.secure_url ||
      image.url ||
      image.image_url ||
      ""
    );
  }

  return "";
}

// =====================================
// PRODUCT GALLERY
// =====================================

export default function ProductGallery({
  images = [],
  productName = "Produkt ProteinFitness",
}) {
  // NORMALIZE IMAGES
  const safeImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    const urls = images
      .map(getImageUrl)
      .filter(Boolean);

    return [...new Set(urls)];
  }, [images]);

  const imagesKey = safeImages.join("|");

  // STATES
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // REFS
  const touchStartX = useRef(null);
  const closeButtonRef = useRef(null);

  const hasMultipleImages = safeImages.length > 1;

  const activeImage =
    safeImages[activeIndex] ||
    safeImages[0] ||
    null;

  // =====================================
  // RESET WHEN PRODUCT CHANGES
  // =====================================

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [imagesKey]);

  // =====================================
  // PREVIOUS IMAGE
  // =====================================

  const previousImage = useCallback(() => {
    if (safeImages.length <= 1) return;

    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  }, [safeImages.length]);

  // =====================================
  // NEXT IMAGE
  // =====================================

  const nextImage = useCallback(() => {
    if (safeImages.length <= 1) return;

    setActiveIndex((current) =>
      (current + 1) % safeImages.length
    );
  }, [safeImages.length]);

  // =====================================
  // LIGHTBOX KEYBOARD + SCROLL LOCK
  // =====================================

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousImage();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextImage();
      }

      if (event.key === "Tab") {
        const buttons = Array.from(
          document.querySelectorAll(
            '[data-pf-lightbox] button:not(:disabled)'
          )
        );

        if (!buttons.length) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousFocus?.focus?.();
    };
  }, [lightboxOpen, previousImage, nextImage]);

  // =====================================
  // TOUCH / SWIPE
  // =====================================

  function handleTouchStart(event) {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (
      touchStartX.current === null ||
      !hasMultipleImages
    ) {
      touchStartX.current = null;
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX;

    if (typeof endX !== "number") {
      touchStartX.current = null;
      return;
    }

    const distance = endX - touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;

    // Prevent a swipe from also opening the lightbox.
    event.preventDefault();

    if (distance > 0) {
      previousImage();
    } else {
      nextImage();
    }
  }

  // =====================================
  // EMPTY GALLERY
  // =====================================

  if (!activeImage) {
    return (
      <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#222222] via-[#141414] to-[#090909] text-white">

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#FF7900]/20 bg-[#FF7900]/10">
          <ImageOff
            size={34}
            strokeWidth={1.4}
            className="text-[#FF7900]"
          />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em]">
          PROTEINFITNESS
        </p>

        <p className="mt-2 text-xs text-neutral-500">
          Fotografia po përgatitet
        </p>

        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7900] to-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* ===================================== */}
      {/* MAIN GALLERY */}
      {/* ===================================== */}

      <div className="w-full">

        <div
          className={`grid w-full gap-3 ${
            hasMultipleImages
              ? "lg:grid-cols-[82px_minmax(0,1fr)]"
              : "grid-cols-1"
          }`}
        >

          {/* ===================================== */}
          {/* THUMBNAILS */}
          {/* ===================================== */}

          {hasMultipleImages && (
            <div className="order-2 min-w-0 lg:order-1">

              <div
                className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[650px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
                style={{
                  scrollbarWidth: "none",
                }}
              >

                {safeImages.map((image, index) => {
                  const active = activeIndex === index;

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Shfaq fotografinë ${index + 1}`}
                      aria-pressed={active}
                      className={`group/thumb relative h-[79px] w-[67px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#171717] p-1 transition-all duration-300 sm:h-[88px] sm:w-[76px] lg:h-[96px] lg:w-[82px] ${
                        active
                          ? "border-[#FF7900] shadow-[0_0_20px_rgba(255,121,0,0.15)]"
                          : "border-white/10 hover:border-[#FF7900]/50"
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${productName} - fotografia ${index + 1}`}
                        loading="lazy"
                        className={`h-full w-full rounded-lg object-contain transition-all duration-300 ${
                          active
                            ? "scale-100 opacity-100"
                            : "opacity-65 group-hover/thumb:opacity-100"
                        }`}
                      />

                      {active && (
                        <span className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-[#FF7900]" />
                      )}

                    </button>
                  );
                })}

              </div>

            </div>
          )}

          {/* ===================================== */}
          {/* MAIN IMAGE */}
          {/* ===================================== */}

          <div className="order-1 min-w-0 lg:order-2">

            <div className="group relative isolate overflow-hidden rounded-xl border border-white/10 bg-[#111111]">

              {/* BACKGROUND */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#222222] via-[#151515] to-[#090909]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-10 h-[280px] w-[280px] rounded-full bg-[#FF7900]/[0.07] blur-[90px]"
              />

              {/* MAIN PHOTO BUTTON */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-label={`Zmadho fotografinë e produktit ${productName}`}
                className="relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7900]"
              >

                <img
                  key={activeImage}
                  src={activeImage}
                  alt={productName}
                  draggable={false}
                  className="aspect-[4/5] w-full select-none object-contain p-5 transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transform-none sm:p-9 lg:p-10"
                />

              </button>

              {/* TOP BRAND LABEL */}
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md sm:left-5 sm:top-5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#FF7900]" />

                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white">
                  PROTEINFITNESS
                </span>

              </div>

              {/* IMAGE COUNTER */}
              {hasMultipleImages && (
                <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md sm:right-5 sm:top-5">

                  <span className="text-xs font-black text-[#FF7900]">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  <span className="mx-1.5 text-neutral-500">
                    /
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {String(safeImages.length).padStart(2, "0")}
                  </span>

                </div>
              )}

              {/* FULL SCREEN BUTTON */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Hap fotografinë në ekran të plotë"
                title="Zmadho fotografinë"
                className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/70 text-white backdrop-blur-md transition-all duration-300 hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black sm:bottom-5 sm:right-5"
              >
                <Expand size={18} />
              </button>

              {/* NAVIGATION ARROWS */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Fotografia e mëparshme"
                    className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-black/70 text-white backdrop-blur-md transition-all duration-300 hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black sm:left-4 sm:h-11 sm:w-11"
                  >
                    <ChevronLeft size={21} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Fotografia tjetër"
                    className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-black/70 text-white backdrop-blur-md transition-all duration-300 hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black sm:right-4 sm:h-11 sm:w-11"
                  >
                    <ChevronRight size={21} />
                  </button>
                </>
              )}

              {/* BOTTOM ACCENT */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7900]/70 to-transparent" />

            </div>

            {/* IMAGE INFORMATION */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">

              <div className="flex items-center gap-2">
                <Images
                  size={17}
                  className="text-[#FF7900]"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  GALERIA E PRODUKTIT
                </span>
              </div>

              <span className="text-[10px] text-neutral-500">
                Kliko fotografinë për ta zmadhuar
              </span>

            </div>

          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* FULL SCREEN LIGHTBOX */}
      {/* ===================================== */}

      {lightboxOpen && (
        <div
          data-pf-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria e fotografive për ${productName}`}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050505]/[0.98] text-white backdrop-blur-2xl"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxOpen(false);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* BACKGROUND GLOW */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF7900]/[0.045] blur-[150px]" />
          </div>

          {/* TOP BAR */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#080808]/80 px-4 py-4 backdrop-blur-xl sm:px-8">

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF7900]">
                PROTEINFITNESS
              </p>

              <p className="mt-1 max-w-[240px] truncate text-xs text-neutral-400 sm:max-w-md">
                {productName}
              </p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Mbyll galerinë"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-[#1B1B1B] text-white transition-colors hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black"
            >
              <X size={21} />
            </button>

          </div>

          {/* FULL IMAGE */}
          <img
            key={activeImage}
            src={activeImage}
            alt={productName}
            draggable={false}
            className="relative z-10 max-h-[calc(100dvh-180px)] max-w-[calc(100vw-32px)] select-none object-contain sm:max-w-[85vw]"
          />

          {/* LIGHTBOX NAVIGATION */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Fotografia e mëparshme"
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-black/80 text-white transition-colors hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black sm:left-8 sm:h-12 sm:w-12"
              >
                <ChevronLeft size={23} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Fotografia tjetër"
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-black/80 text-white transition-colors hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black sm:right-8 sm:h-12 sm:w-12"
              >
                <ChevronRight size={23} />
              </button>
            </>
          )}

          {/* LIGHTBOX BOTTOM COUNTER */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center border-t border-white/10 bg-[#080808]/85 px-4 py-5 backdrop-blur-xl">

            <span className="text-xs font-black tracking-[0.15em] text-white">
              <span className="text-[#FF7900]">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>

              <span className="mx-3 text-neutral-600">
                /
              </span>

              {String(safeImages.length).padStart(2, "0")}
            </span>

          </div>

        </div>
      )}
    </>
  );
}
