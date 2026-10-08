import AdminCategorySelect from "../components/AdminCategorySelect";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  PackagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createProduct,
  uploadProductImages,
} from "../../services/api";

const initialForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  oldPrice: "",
  badge: "",
  stock: "",
  sizes: "",
  colors: "",
  active: true,
};

export default function AddProduct() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState([]);

  const [
    previews,
    setPreviews,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview.url
          );
        }
      );
    };
  }, [previews]);

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

  function handleFiles(event) {
    setError("");

    const files =
      Array.from(
        event.target.files || []
      );

    if (!files.length) return;

    const remaining =
      6 - selectedFiles.length;

    if (remaining <= 0) {
      setError(
        "Mund të ngarkosh maksimum 6 foto."
      );
      return;
    }

    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const validFiles = [];

    for (const file of files) {
      if (
        !acceptedTypes.includes(
          file.type
        )
      ) {
        setError(
          "Lejohen vetëm JPG, PNG dhe WEBP."
        );
        continue;
      }

      if (
        file.size >
        12 * 1024 * 1024
      ) {
        setError(
          "Një foto nuk mund të jetë mbi 12 MB."
        );
        continue;
      }

      validFiles.push(file);
    }

    const filesToAdd =
      validFiles.slice(
        0,
        remaining
      );

    const newPreviews =
      filesToAdd.map(
        (file) => ({
          id:
            `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          url:
            URL.createObjectURL(
              file
            ),
        })
      );

    setSelectedFiles(
      (current) => [
        ...current,
        ...filesToAdd,
      ]
    );

    setPreviews(
      (current) => [
        ...current,
        ...newPreviews,
      ]
    );

    event.target.value = "";
  }

  function removeImage(index) {
    setPreviews(
      (current) => {
        const target =
          current[index];

        if (target) {
          URL.revokeObjectURL(
            target.url
          );
        }

        return current.filter(
          (_, i) =>
            i !== index
        );
      }
    );

    setSelectedFiles(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );
  }

  function parseCommaList(
    value
  ) {
    return value
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (
      !form.name.trim() ||
      !form.category ||
      !form.price
    ) {
      setError(
        "Emri, kategoria dhe çmimi janë të detyrueshme."
      );
      return;
    }

    const price =
      Number(form.price);

    const oldPrice =
      form.oldPrice === ""
        ? null
        : Number(
            form.oldPrice
          );

    const stock =
      Number(
        form.stock || 0
      );

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      setError(
        "Çmimi nuk është valid."
      );
      return;
    }

    if (
      oldPrice !== null &&
      (
        Number.isNaN(
          oldPrice
        ) ||
        oldPrice < 0
      )
    ) {
      setError(
        "Old Price nuk është valid."
      );
      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      setError(
        "Stoku nuk është valid."
      );
      return;
    }

    try {
      setLoading(true);

      let uploadedImages = [];

      if (
        selectedFiles.length
      ) {
        setUploadProgress(
          "Duke kompresuar dhe ngarkuar fotot..."
        );

        const uploadResult =
          await uploadProductImages(
            selectedFiles
          );

        uploadedImages =
          uploadResult.images || [];
      }

      setUploadProgress(
        "Duke ruajtur produktin..."
      );

      await createProduct({
        name:
          form.name.trim(),

        category:
          form.category,

        description:
          form.description.trim(),

        price,

        oldPrice,

        badge:
          form.badge ||
          null,

        stock,

        sizes:
          parseCommaList(
            form.sizes
          ),

        colors:
          parseCommaList(
            form.colors
          ),

        images:
          uploadedImages,

        active:
          form.active,
      });

      setSuccess(true);

      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview.url
          );
        }
      );

      setPreviews([]);
      setSelectedFiles([]);
      setForm(initialForm);

      setUploadProgress(
        "Produkti u ruajt."
      );

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 800);

    } catch (err) {
      setError(
        err.message ||
          "Ndodhi një gabim."
      );

      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px]">

      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">

        <div>

          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={15} />
            PRODUKTET
          </Link>

          <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
            APAR ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Shto Produkt
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Produkti ruhet në Neon,
            ndërsa fotot në Cloudinary.
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center bg-black text-white">
          <PackagePlus size={20} />
        </div>

      </div>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          <Check size={18} />
          Produkti u shtua me sukses.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]"
      >

        <div className="space-y-6">

          <section className="border border-neutral-200 bg-white p-5 sm:p-6">

            <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
              BASIC INFORMATION
            </p>

            <h2 className="mt-2 text-xl font-black">
              Produkti
            </h2>

            <div className="mt-6 grid gap-5">

              <label>

                <span className="mb-2 block text-xs font-bold">
                  Emri i produktit *
                </span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="p.sh. Duks APAR Classic"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none transition focus:border-black"
                />

              </label>

              <label>

                <span className="mb-2 block text-xs font-bold">
                  Përshkrimi
                </span>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={5}
                  placeholder="Përshkrimi i produktit..."
                  className="w-full resize-none border border-neutral-300 px-4 py-3.5 text-sm outline-none transition focus:border-black"
                />

              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-5 sm:p-6">

            <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
              PRICE & STOCK
            </p>

            <h2 className="mt-2 text-xl font-black">
              Çmimi & Stoku
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">

              <label>

                <span className="mb-2 block text-xs font-bold">
                  Çmimi *
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="34.99"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none focus:border-black"
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
                  placeholder="44.99"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none focus:border-black"
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
                  placeholder="10"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none focus:border-black"
                />

              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-5 sm:p-6">

            <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
              PRODUCT OPTIONS
            </p>

            <h2 className="mt-2 text-xl font-black">
              Variantet
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <label>

                <span className="mb-2 block text-xs font-bold">
                  Madhësitë
                </span>

                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none focus:border-black"
                />

              </label>

              <label>

                <span className="mb-2 block text-xs font-bold">
                  Ngjyrat
                </span>

                <input
                  type="text"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="E zezë, E bardhë"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-sm outline-none focus:border-black"
                />

              </label>

            </div>

          </section>

          <section className="border border-neutral-200 bg-white p-5 sm:p-6">

            <div className="flex items-center justify-between gap-5">

              <div>

                <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
                  PRODUCT MEDIA
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Fotot
                </h2>

              </div>

              <div className="text-right">

                <p className="text-xs font-bold">
                  {selectedFiles.length}/6
                </p>

                <p className="mt-1 text-[10px] text-neutral-400">
                  JPG · PNG · WEBP
                </p>

              </div>

            </div>

            <label className="mt-6 flex min-h-[170px] cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 px-5 text-center transition hover:border-black hover:bg-neutral-100">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                className="hidden"
              />

              <div className="flex h-12 w-12 items-center justify-center bg-black text-white">
                <UploadCloud size={20} />
              </div>

              <p className="mt-4 text-sm font-black">
                ZGJIDH FOTOT
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
                Maksimum 6 foto.
                Secila deri në 12 MB.
              </p>

              <p className="mt-1 text-[11px] text-neutral-400">
                Pas upload-it kompresohen
                dhe ruhen në Cloudinary.
              </p>

            </label>

            {previews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

                {previews.map(
                  (
                    preview,
                    index
                  ) => (
                    <div
                      key={
                        preview.id
                      }
                      className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
                    >

                      <img
                        src={
                          preview.url
                        }
                        alt={`Foto ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[8px] font-black tracking-[0.15em] text-white">
                          KRYESORE
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-white text-red-600 shadow transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>

        <div className="space-y-6">

          <section className="border border-neutral-200 bg-white p-5">

            <p className="text-[9px] font-black tracking-[0.25em] text-neutral-400">
              ORGANIZATION
            </p>

            <label className="mt-5 block">

              <span className="mb-2 block text-xs font-bold">
                Kategoria *
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
                className="w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-black"
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

            <label className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-bold">
                  Produkt aktiv
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  Shfaq produktin në website.
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

          <section className="bg-black p-5 text-white">

            <p className="text-[9px] font-black tracking-[0.25em] text-neutral-600">
              APAR DATABASE
            </p>

            <div className="mt-4 flex items-start gap-3">

              <ImagePlus
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p className="text-xs leading-6 text-neutral-400">
                Fotot kompresohen para
                ruajtjes në Cloudinary.
                Produkti ruhet në Neon.
              </p>

            </div>

            {uploadProgress && (
              <div className="mt-5 border border-white/10 bg-white/[0.04] p-4 text-xs text-neutral-300">
                {uploadProgress}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                color:
                  "#050505",
              }}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 bg-white px-5 text-xs font-black tracking-[0.1em] transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  DUKE RUAJTUR...
                </>
              ) : (
                <>
                  <PackagePlus
                    size={17}
                  />

                  RUAJ PRODUKTIN
                </>
              )}

            </button>

          </section>

        </div>

      </form>

    </div>
  );
}