import AdminCategorySelect from "../components/AdminCategorySelect";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data =
          await getProductById(id);

        const product =
          data.product;

        setForm({
          name: product.name || "",
          category:
            product.category || "Veshje",
          description:
            product.description || "",
          price:
            product.price ?? "",
          oldPrice:
            product.oldPrice ?? "",
          badge:
            product.badge || "",
          stock:
            product.stock ?? 0,
          sizes:
            (product.sizes || []).join(", "),
          colors:
            (product.colors || []).join(", "),
          images:
            (product.images || []).join("\n"),
          active:
            product.active ?? true,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function commaList(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function imageList(value) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      setSaving(true);

      await updateProduct(id, {
        name: form.name.trim(),
        category: form.category,
        description:
          form.description.trim(),
        price: Number(form.price),
        oldPrice:
          form.oldPrice === ""
            ? null
            : Number(form.oldPrice),
        badge:
          form.badge || null,
        stock:
          Number(form.stock),
        sizes:
          commaList(form.sizes),
        colors:
          commaList(form.colors),
        images:
          imageList(form.images),
        active:
          form.active,
      });

      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <Loader2
          size={18}
          className="animate-spin"
        />
        Duke ngarkuar produktin...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error || "Produkti nuk u gjet."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px]">

      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black"
      >
        <ArrowLeft size={15} />
        PRODUKTET
      </Link>

      <div className="mt-5 border-b border-neutral-200 pb-6">

        <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
          APAR ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Edito Produktin
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          ID #{id}
        </p>

      </div>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]"
      >

        <div className="space-y-6">

          <section className="border border-neutral-200 bg-white p-6">

            <h2 className="text-xl font-black">
              Informacionet
            </h2>

            <div className="mt-6 space-y-5">

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Emri
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Përshkrimi
                </span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-6">

            <h2 className="text-xl font-black">
              Çmimi & Stoku
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">

              <label>
                <span className="mb-2 block text-xs font-bold">
                  Çmimi
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold">
                  Old Price
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold">
                  Stoku
                </span>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-6">

            <h2 className="text-xl font-black">
              Variantet
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <label>
                <span className="mb-2 block text-xs font-bold">
                  Madhësitë
                </span>

                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-bold">
                  Ngjyrat
                </span>

                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="E zezë, E bardhë"
                  className="w-full border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
                />
              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-6">

            <h2 className="text-xl font-black">
              Fotot
            </h2>

            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              rows={7}
              className="mt-5 w-full resize-none border border-neutral-300 px-4 py-3.5 outline-none focus:border-black"
            />

          </section>

        </div>

        <div className="space-y-6">

          <section className="border border-neutral-200 bg-white p-5">

            <h2 className="text-lg font-black">
              Organizimi
            </h2>

            <label className="mt-5 block">

              <span className="mb-2 block text-xs font-bold">
                Kategoria
              </span>

              <AdminCategorySelect
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />

            </label>

            <label className="mt-5 block">

              <span className="mb-2 block text-xs font-bold">
                Badge
              </span>

              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className="w-full border border-neutral-300 bg-white px-4 py-3.5"
              >
                <option value="">
                  Pa badge
                </option>
                <option value="NEW">
                  NEW
                </option>
                <option value="SALE">
                  SALE
                </option>
                <option value="BESTSELLER">
                  BESTSELLER
                </option>
              </select>

            </label>

          </section>

          <section className="border border-neutral-200 bg-white p-5">

            <label className="flex items-center justify-between gap-5">

              <div>
                <p className="text-sm font-bold">
                  Produkt aktiv
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  Shfaqet në website.
                </p>
              </div>

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-5 w-5 accent-black"
              />

            </label>

          </section>

          <button
            type="submit"
            disabled={saving}
            style={{
              color: "#ffffff",
            }}
            className="flex min-h-[56px] w-full items-center justify-center gap-3 bg-black px-5 text-xs font-black text-white disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                DUKE RUAJTUR...
              </>
            ) : (
              <>
                <Save size={17} />
                RUAJ NDRYSHIMET
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}