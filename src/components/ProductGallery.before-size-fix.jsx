import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  useEffect(() => {
    setActiveIndex(0);
  }, [safeImages.length]);

  const activeImage =
    safeImages[activeIndex] ||
    safeImages[0] ||
    null;

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-neutral-100">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.25em] text-neutral-400">
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
    <div className="grid gap-4 lg:grid-cols-[80px_1fr]">

      {safeImages.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">

          {safeImages.map(
            (image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border bg-neutral-100 transition lg:h-24 lg:w-20 ${
                  activeIndex === index
                    ? "border-black"
                    : "border-neutral-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            )
          )}

        </div>
      )}

      <div className="order-1 relative overflow-hidden bg-neutral-100 lg:order-2">

        <img
          src={activeImage}
          alt={productName}
          className="aspect-[4/5] h-full w-full object-contain"
        />

      </div>

    </div>
  );
}