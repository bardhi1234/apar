import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
} from "../services/api";

export function useProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProducts();

        if (cancelled) return;

        const activeProducts =
          (data.products || [])
            .filter(
              (product) =>
                product.active !== false
            );

        setProducts(
          activeProducts
        );
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Products error:",
            err
          );

          setError(
            err.message ||
              "Produktet nuk u ngarkuan."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    products,
    loading,
    error,
  };
}
