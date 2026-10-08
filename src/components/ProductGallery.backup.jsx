import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

export default function ProductGallery({
  images = [],
  productName = "APAR Product",
}) {
  const safeImages =
    images.filter(Boolean).length > 0
      ? images.filter(Boolean)
      : [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=90",
        ];

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const activeImage =
    safeImages[activeIndex];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  };

  /*
    KEYBOARD CONTROLS
  */
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [lightboxOpen, safeImages.length]);

  /*
    SWIPE MOBILE
  */
  const handleTouchStart = (event) => {
    touchStartX.current =
      event.targetTouches[0].clientX;

    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current =
      event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    const minimumSwipe = 45;

    if (distance > minimumSwipe) {
      nextImage();
    }

    if (distance < -minimumSwipe) {
      previousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div className="w-full">

        {/* MAIN AREA */}
        <div className="grid gap-3 lg:grid-cols-[88px_1fr]">

          {/* ================================= */}
          {/* DESKTOP THUMBNAILS */}
          {/* ================================= */}

          <div className="order-2 hidden flex-col gap-3 lg:order-1 lg:flex">

            {safeImages.map(
              (image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  className={`relative aspect-[4/5] overflow-hidden border bg-[#f5f5f5] transition duration-300 ${
                    activeIndex === index
                      ? "border-black"
                      : "border-transparent hover:border-neutral-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />

                  {activeIndex === index && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-black" />
                  )}
                </button>
              )
            )}

          </div>

          {/* ================================= */}
          {/* MAIN IMAGE */}
          {/* ================================= */}

          <div
            className="group relative order-1 overflow-hidden bg-[#f4f4f4] lg:order-2"
            onTouchStart={
              handleTouchStart
            }
            onTouchMove={
              handleTouchMove
            }
            onTouchEnd={handleTouchEnd}
          >

            <button
              type="button"
              onClick={() =>
                setLightboxOpen(true)
              }
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden"
              aria-label="Zmadho fotografinë"
            >
              <img
                key={activeImage}
                src={activeImage}
                alt={`${productName} - ${
                  activeIndex + 1
                }`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
              />
            </button>

            {/* IMAGE COUNTER */}
            <div className="absolute left-4 top-4 flex h-9 items-center bg-black/75 px-3 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
              {String(
                activeIndex + 1
              ).padStart(2, "0")}
              <span className="mx-2 text-white/40">
                /
              </span>
              {String(
                safeImages.length
              ).padStart(2, "0")}
            </div>

            {/* ZOOM */}
            <button
              type="button"
              onClick={() =>
                setLightboxOpen(true)
              }
              aria-label="Hap fotografinë"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-white text-black shadow-lg transition duration-300 hover:bg-black hover:text-white"
            >
              <Maximize2 size={17} />
            </button>

            {/* PREVIOUS */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Foto e kaluar"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-black shadow-lg backdrop-blur-md transition duration-300 hover:bg-black hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
              >
                <ChevronLeft
                  size={21}
                />
              </button>
            )}

            {/* NEXT */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Foto tjetër"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-black shadow-lg backdrop-blur-md transition duration-300 hover:bg-black hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
              >
                <ChevronRight
                  size={21}
                />
              </button>
            )}

            {/* MOBILE SWIPE MESSAGE */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 text-[9px] font-bold tracking-[0.18em] text-white/80 backdrop-blur-md sm:hidden">
                SWIPE
              </div>
            )}

          </div>

        </div>

        {/* ================================= */}
        {/* MOBILE THUMBNAILS */}
        {/* ================================= */}

        {safeImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">

            {safeImages.map(
              (image, index) => (
                <button
                  key={`${image}-mobile-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  className={`relative h-[86px] w-[70px] flex-shrink-0 overflow-hidden border transition ${
                    activeIndex === index
                      ? "border-black"
                      : "border-neutral-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />

                  {activeIndex === index && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-black" />
                  )}
                </button>
              )
            )}

          </div>
        )}

      </div>

      {/* ================================= */}
      {/* FULLSCREEN LIGHTBOX */}
      {/* ================================= */}

      {lightboxOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black">

          {/* CLOSE */}
          <button
            type="button"
            onClick={() =>
              setLightboxOpen(false)
            }
            aria-label="Mbyll fotografinë"
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white hover:text-black sm:right-7 sm:top-7"
          >
            <X size={22} />
          </button>

          {/* COUNTER */}
          <div className="absolute left-4 top-4 z-20 text-[10px] font-bold tracking-[0.3em] text-white/55 sm:left-7 sm:top-7">
            APAR&nbsp;&nbsp;
            {String(
              activeIndex + 1
            ).padStart(2, "0")}
            &nbsp;/&nbsp;
            {String(
              safeImages.length
            ).padStart(2, "0")}
          </div>

          {/* MAIN FULLSCREEN IMAGE */}
          <div
            className="flex h-full w-full items-center justify-center px-4 py-20 sm:px-20"
            onTouchStart={
              handleTouchStart
            }
            onTouchMove={
              handleTouchMove
            }
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={`lightbox-${activeImage}`}
              src={activeImage}
              alt={`${productName} fullscreen`}
              className="max-h-full max-w-full select-none object-contain"
            />
          </div>

          {/* PREVIOUS FULLSCREEN */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              aria-label="Foto e kaluar"
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white hover:text-black sm:left-7 sm:h-14 sm:w-14"
            >
              <ChevronLeft
                size={24}
              />
            </button>
          )}

          {/* NEXT FULLSCREEN */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Foto tjetër"
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white hover:text-black sm:right-7 sm:h-14 sm:w-14"
            >
              <ChevronRight
                size={24}
              />
            </button>
          )}

          {/* BOTTOM THUMBNAILS */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 z-20 flex max-w-[85vw] -translate-x-1/2 gap-2 overflow-x-auto">

              {safeImages.map(
                (image, index) => (
                  <button
                    key={`${image}-lightbox-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    className={`h-[62px] w-[50px] flex-shrink-0 overflow-hidden border transition sm:h-[72px] sm:w-[58px] ${
                      activeIndex ===
                      index
                        ? "border-white opacity-100"
                        : "border-white/15 opacity-45 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              )}

            </div>
          )}

        </div>
      )}
    </>
  );
}