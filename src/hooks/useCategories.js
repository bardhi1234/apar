import {
  useEffect,
  useState,
} from "react";

import {
  getCategories,
} from "../services/api";

export function useCategories() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data =
          await getCategories();

        if (!cancelled) {
          setCategories(
            data.categories || []
          );
        }
      } catch (error) {
        console.error(
          "Categories error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    categories,
    loading,
  };
}
