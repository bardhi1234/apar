import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "apar-wishlist";

export function WishlistProvider({
  children,
}) {
  const [wishlist, setWishlist] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const isInWishlist = (productId) =>
    wishlist.some(
      (id) =>
        String(id) ===
        String(productId)
    );

  const addToWishlist = (
    productId
  ) => {
    setWishlist((current) => {
      const exists =
        current.some(
          (id) =>
            String(id) ===
            String(productId)
        );

      if (exists) {
        return current;
      }

      return [
        ...current,
        productId,
      ];
    });
  };

  const removeFromWishlist = (
    productId
  ) => {
    setWishlist((current) =>
      current.filter(
        (id) =>
          String(id) !==
          String(productId)
      )
    );
  };

  const toggleWishlist = (
    productId
  ) => {
    setWishlist((current) => {
      const exists =
        current.some(
          (id) =>
            String(id) ===
            String(productId)
        );

      if (exists) {
        return current.filter(
          (id) =>
            String(id) !==
            String(productId)
        );
      }

      return [
        ...current,
        productId,
      ];
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount =
    wishlist.length;

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(
      WishlistContext
    );

  if (!context) {
    throw new Error(
      "useWishlist duhet të përdoret brenda WishlistProvider."
    );
  }

  return context;
}