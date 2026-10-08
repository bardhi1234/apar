import {
  useEffect,
  useState,
} from "react";

import {
  getAdminCategories,
} from "../../services/api";

export default function AdminCategorySelect({
  name = "category",
  value,
  onChange,
}) {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getAdminCategories();

        setCategories(
          (data.categories || [])
            .filter(
              (category) =>
                category.active
            )
        );
      } catch (error) {
        console.error(
          "Category select:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={loading}
      className="w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-black disabled:opacity-60"
    >
      <option value="">
        {loading
          ? "Duke ngarkuar..."
          : "Zgjidh kategorinë"}
      </option>

      {categories.map(
        (category) => (
          <option
            key={category.id}
            value={category.name}
          >
            {category.name}
          </option>
        )
      )}
    </select>
  );
}