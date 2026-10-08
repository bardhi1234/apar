import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  PackagePlus,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  deleteProduct,
  getProducts,
} from "../../services/api";

export default function Products() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  async function loadProducts() {
    try {
      setError("");

      const data =
        await getProducts();

      setProducts(
        data.products || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product) {
    const confirmed =
      window.confirm(
        `A dëshiron ta fshish "${product.name}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);

      await deleteProduct(
        product.id
      );

      setProducts(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              product.id
          )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>

          <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
            APAR ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Produktet
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Produktet nga Neon Database.
          </p>

        </div>

        <Link
          to="/admin/products/new"
          style={{
            color: "#ffffff",
          }}
          className="flex min-h-[52px] items-center gap-3 bg-black px-6 text-xs font-black text-white"
        >
          <PackagePlus size={17} />

          SHTO PRODUKT
        </Link>

      </div>

      {loading && (
        <div className="mt-10 flex items-center gap-3 text-sm text-neutral-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Duke ngarkuar...
        </div>
      )}

      {error && (
        <div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading &&
        !error && (
        <div className="mt-8 overflow-x-auto border border-neutral-200 bg-white">

          <table className="w-full min-w-[950px]">

            <thead className="border-b border-neutral-200 bg-neutral-50">

              <tr className="text-left text-[9px] font-black tracking-[0.18em] text-neutral-400">

                <th className="px-5 py-4">
                  PRODUKTI
                </th>

                <th className="px-5 py-4">
                  KATEGORIA
                </th>

                <th className="px-5 py-4">
                  ÇMIMI
                </th>

                <th className="px-5 py-4">
                  STOKU
                </th>

                <th className="px-5 py-4">
                  STATUS
                </th>

                <th className="px-5 py-4 text-right">
                  VEPRIME
                </th>

              </tr>

            </thead>

            <tbody>

              {products.map(
                (product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-100 transition hover:bg-neutral-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-4">

                        <div className="h-14 w-12 overflow-hidden bg-neutral-100">

                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}

                        </div>

                        <div>

                          <p className="text-sm font-bold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] text-neutral-400">
                            ID #{product.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold">
                      {Number(product.price).toFixed(2)} {"\u20AC"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {product.stock}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`px-3 py-2 text-[9px] font-black ${
                          product.active
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {product.active
                          ? "AKTIV"
                          : "JO AKTIV"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="flex h-10 w-10 items-center justify-center border border-neutral-200 bg-white transition hover:border-black hover:bg-black hover:text-white"
                          title="Edito"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product)
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          className="flex h-10 w-10 items-center justify-center border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-40"
                          title="Fshi"
                        >
                          {deletingId ===
                          product.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={16}
                            />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          {products.length === 0 && (
            <div className="p-10 text-center text-sm text-neutral-400">
              Nuk ka produkte.
            </div>
          )}

        </div>
      )}

    </div>
  );
}