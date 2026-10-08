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
    if (!hasMultipleImages) return;

    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  }, [
    hasMultipleImages,
    safeImages.length,
  ]);

  const nextImage = useCallback(() => {
    if (!hasMultipleImages) return;

    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  }, [
    hasMultipleImages,
    safeImages.length,
  ]);

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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        oldOverflow;
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

    if (distance > 45) {
      previousImage();
    }

    if (distance < -45) {
      nextImage();
    }

    touchStartX.current = null;
  };

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-neutral-100">
        <p className="text-xs font-bold tracking-[0.25em] text-neutral-400">
          APAR
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid w-full gap-2 sm:gap-3 ${
          hasMultipleImages
            ? "lg:grid-cols-[72px_minmax(0,1fr)]"
            : "grid-cols-1"
        }`}
      >
        {hasMultipleImages && (
          <div className="order-2 lg:order-1">
            <div className="flex gap-2 overflow-x-auto py-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:py-0">
              {safeImages.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    className={`relative h-[72px] w-[58px] flex-none overflow-hidden border transition sm:h-20 sm:w-16 lg:h-[88px] lg:w-[72px] ${
                      activeIndex === index
                        ? "border-black"
                        : "border-neutral-200"
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
          </div>
        )}

        <div className="order-1 lg:order-2">
          <div className="group relative overflow-hidden bg-neutral-100">

            <button
              type="button"
              onClick={() =>
                setLightboxOpen(true)
              }
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative block w-full overflow-hidden"
            >
              <img
                src={activeImage}
                alt={productName}
                className="aspect-[4/5] w-full object-cover"
              />

              {hasMultipleImages && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                  {activeIndex + 1} /{" "}
                  {safeImages.length}
                </span>
              )}

              <span className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow-md sm:h-10 sm:w-10">
                <Maximize2
                  size={16}
                  strokeWidth={1.8}
                />
              </span>
            </button>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm md:h-10 md:w-10"
                >
                  <ChevronLeft
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm md:h-10 md:w-10"
                >
                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
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
            className="relative flex h-full w-full items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={() =>
                setLightboxOpen(false)
              }
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
            >
              <X size={19} />
            </button>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black sm:left-4"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black sm:right-4"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <img
              src={activeImage}
              alt={productName}
              draggable="false"
              className="max-h-full max-w-full select-none object-contain"
            />

            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black">
                {activeIndex + 1} /{" "}
                {safeImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}