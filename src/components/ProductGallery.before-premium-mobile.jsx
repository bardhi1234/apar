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
  Maximize2,
  X,
} from "lucide-react";

export default function ProductGallery({
  images = [],
  productName = "APAR Product",
}) {
  const safeImages = useMemo(() => {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .map((image) => {
        if (typeof image === "string") {
          return image;
        }

        if (
          image &&
          typeof image === "object"
        ) {
          return (
            image.url ||
            image.secure_url ||
            null
          );
        }

        return null;
      })
      .filter(Boolean);
  }, [images]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const touchStartX = useRef(null);

  const hasMultipleImages =
    safeImages.length > 1;

  const activeImage =
    safeImages[activeIndex] ||
    safeImages[0] ||
    null;

  useEffect(() => {
    setActiveIndex(0);
  }, [safeImages.length]);

  const previousImage = useCallback(() => {
    if (safeImages.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  }, [safeImages.length]);

  const nextImage = useCallback(() => {
    if (safeImages.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  }, [safeImages.length]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    lightboxOpen,
    previousImage,
    nextImage,
  ]);

  const handleTouchStart = (event) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (
      touchStartX.current === null ||
      !hasMultipleImages
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX;

    if (typeof endX !== "number") {
      return;
    }

    const distance =
      endX - touchStartX.current;

    const swipeThreshold = 45;

    if (distance > swipeThreshold) {
      previousImage();
    }

    if (distance < -swipeThreshold) {
      nextImage();
    }

    touchStartX.current = null;
  };

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-neutral-100">
        <div className="px-6 text-center">
          <p className="text-[10px] font-black tracking-[0.35em] text-neutral-400">
            APAR
          </p>

          <p className="mt-3 text-sm text-neutral-500">
            Nuk ka fotografi për këtë produkt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section
        className={`grid w-full gap-3 sm:gap-4 ${
          hasMultipleImages
            ? "lg:grid-cols-[82px_minmax(0,1fr)]"
            : "grid-cols-1"
        }`}
        aria-label={`Galeria e ${productName}`}
      >
        {hasMultipleImages && (
          <div className="order-2 overflow-hidden lg:order-1">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[720px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
              {safeImages.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Shfaq fotografinë ${
                      index + 1
                    }`}
                    aria-current={
                      activeIndex === index
                        ? "true"
                        : undefined
                    }
                    className={`relative h-[84px] w-[68px] flex-none overflow-hidden border bg-neutral-100 transition duration-200 sm:h-24 sm:w-20 lg:h-[104px] lg:w-[82px] ${
                      activeIndex === index
                        ? "border-black ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-500"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />

                    {activeIndex === index && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-black" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="order-1 lg:order-2">
          <div className="group relative overflow-hidden bg-[#f5f5f3]">
            <button
              type="button"
              onClick={() =>
                setLightboxOpen(true)
              }
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label="Zmadho fotografinë"
              className="relative block w-full cursor-zoom-in overflow-hidden"
            >
              <img
                src={activeImage}
                alt={productName}
                className="aspect-[4/5] w-full object-contain p-2 transition duration-500 ease-out group-hover:scale-[1.015] sm:p-4"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/20 via-transparent to-transparent p-3 sm:p-4">
                {hasMultipleImages ? (
                  <span className="rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                    {activeIndex + 1} /{" "}
                    {safeImages.length}
                  </span>
                ) : (
                  <span />
                )}

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg sm:h-12 sm:w-12">
                  <Maximize2
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>
              </div>
            </button>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Fotoja paraprake"
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-md transition hover:scale-105 md:flex"
                >
                  <ChevronLeft
                    size={22}
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Fotoja tjetër"
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-md transition hover:scale-105 md:flex"
                >
                  <ChevronRight
                    size={22}
                    strokeWidth={1.8}
                  />
                </button>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <p className="mt-2 text-center text-[11px] text-neutral-400 sm:hidden">
              Rrëshqit majtas ose djathtas për fotografitë tjera
            </p>
          )}
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografia e ${productName}`}
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setLightboxOpen(false);
            }
          }}
        >
          <div
            className="relative flex h-full w-full items-center justify-center px-3 pb-20 pt-16 sm:px-16 sm:pb-16 sm:pt-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={() =>
                setLightboxOpen(false)
              }
              aria-label="Mbyll fotografinë"
              className="absolute right-3 top-3 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl sm:right-6 sm:top-6"
            >
              <X
                size={23}
                strokeWidth={1.8}
              />
            </button>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Fotoja paraprake"
                  className="absolute left-3 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl sm:flex"
                >
                  <ChevronLeft
                    size={28}
                    strokeWidth={1.7}
                  />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Fotoja tjetër"
                  className="absolute right-3 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl sm:flex"
                >
                  <ChevronRight
                    size={28}
                    strokeWidth={1.7}
                  />
                </button>
              </>
            )}

            <img
              src={activeImage}
              alt={productName}
              className="max-h-full max-w-full select-none object-contain"
              draggable="false"
            />

            {hasMultipleImages && (
              <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-black shadow-xl">
                {activeIndex + 1}
                <span className="mx-2 text-neutral-400">
                  /
                </span>
                {safeImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}