
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BadgePercent,
  Loader2,
  PackageCheck,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminCategorySelect from "../components/AdminCategorySelect";

import {
  getProductById,
  updateProduct,
  uploadProductImages,
} from "../../services/api";

// ======================================
// PROTEINFITNESS SETTINGS
// ======================================

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const inputClass =
  "w-full rounded-xl border border-white/15 bg-[#0D0D0D] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-[#FF7900]";

// ======================================
// HELPERS
// ======================================

function imageUrl(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  return (
    value?.secure_url ||
    value?.url ||
    value?.image_url ||
    ""
  );
}

function listText(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return typeof value === "string" ? value : "";
}

function parseList(value) {
  return [
    ...new Set(
      value
        .split(/[,;\n]/)
        .map((part) => part.trim())
        .filter(Boolean)
    ),
  ];
}

function euro(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function SectionTitle({ number, label, title }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900]">
        {number} / {label}
      </p>

      <h2 className="mt-2 text-xl font-black sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

// ======================================
// EDIT PRODUCT COMPONENT
// ======================================

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const blobUrlsRef = useRef(new Set());
  const savingRef = useRef(false);
  const imageCounterRef = useRef(0);

  // ======================================
  // CLEAN UP TEMPORARY IMAGE URLS
  // ======================================

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;

    return () => {
      blobUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      blobUrls.clear();
    };
  }, []);

  // ======================================
  // LOAD PRODUCT
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await getProductById(id);

        const product =
          response?.product ?? response;

        if (
          !product ||
          typeof product !== "object" ||
          !product.name
        ) {
          throw new Error("Produkti nuk u gjet.");
        }

        const savedImages = Array.isArray(product.images)
          ? product.images
          : product.image
            ? [product.image]
            : [];

        if (cancelled) return;

        setForm({
          name: product.name || "",
          brand: product.brand || "",

          category:
            typeof product.category === "string"
              ? product.category
              : product.category?.name || "",

          description: product.description || "",

          price: product.price ?? "",

          oldPrice:
            product.oldPrice ??
            product.old_price ??
            "",

          badge: product.badge || "",

          stock: product.stock ?? 0,

          sizes: listText(
            product.sizes ?? product.weights
          ),

          colors: listText(
            product.colors ?? product.flavors
          ),

          active: product.active ?? true,
        });

        setImages(
          savedImages
            .map(imageUrl)
            .filter(Boolean)
            .map((url, index) => ({
              id: `saved-${index}`,
              type: "saved",
              url,
            }))
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Gabim gjatë ngarkimit të produktit."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ======================================
  // DISCOUNT CALCULATION
  // ======================================

  const currentPrice = Number(form?.price);
  const previousPrice = Number(form?.oldPrice);

  const discount = useMemo(() => {
    if (
      !form?.price ||
      !form?.oldPrice ||
      !Number.isFinite(currentPrice) ||
      !Number.isFinite(previousPrice) ||
      previousPrice <= currentPrice
    ) {
      return null;
    }

    return Math.round(
      ((previousPrice - currentPrice) /
        previousPrice) *
        100
    );
  }, [
    form?.price,
    form?.oldPrice,
    currentPrice,
    previousPrice,
  ]);

  // ======================================
  // FORM CHANGE
  // ======================================

  function handleChange(event) {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  }

  // ======================================
  // ADD PHOTOS
  // ======================================

  function handleFiles(event) {
    const files = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (!files.length) return;

    const remaining = Math.max(
      0,
      MAX_IMAGES - images.length
    );

    const validFiles = files.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) &&
        file.size <= MAX_FILE_SIZE
    );

    if (remaining === 0) {
      setError(
        `Lejohen maksimum ${MAX_IMAGES} fotografi. Largo një foto më parë.`
      );

      return;
    }

    const added = validFiles
      .slice(0, remaining)
      .map((file) => {
        const url = URL.createObjectURL(file);

        blobUrlsRef.current.add(url);

        imageCounterRef.current += 1;

        return {
          id: `new-${imageCounterRef.current}`,
          type: "new",
          file,
          url,
        };
      });

    setImages((current) => [
      ...current,
      ...added,
    ]);

    setError(
      files.length !== added.length
        ? "Disa fotografi u anashkaluan. Lejohen JPG, PNG dhe WEBP deri në 12 MB, maksimum 6 foto."
        : ""
    );
  }

  // ======================================
  // REMOVE PHOTO
  // ======================================

  function removeImage(imageId) {
    const target = images.find(
      (item) => item.id === imageId
    );

    if (target?.type === "new") {
      URL.revokeObjectURL(target.url);
      blobUrlsRef.current.delete(target.url);
    }

    setImages((current) =>
      current.filter(
        (item) => item.id !== imageId
      )
    );
  }

  // ======================================
  // SET PRIMARY IMAGE
  // ======================================

  function setMainImage(imageId) {
    setImages((current) => {
      const selected = current.find(
        (item) => item.id === imageId
      );

      if (!selected) {
        return current;
      }

      return [
        selected,
        ...current.filter(
          (item) => item.id !== imageId
        ),
      ];
    });
  }

  // ======================================
  // VALIDATION
  // ======================================

  function validateForm() {
    if (!form.name.trim()) {
      return "Shkruaj emrin e produktit.";
    }

    if (!form.category) {
      return "Zgjidh kategorinë.";
    }

    if (
      !form.price ||
      !Number.isFinite(currentPrice) ||
      currentPrice <= 0
    ) {
      return "Çmimi duhet të jetë më i madh se 0 €.";
    }

    if (
      form.oldPrice !== "" &&
      (
        !Number.isFinite(previousPrice) ||
        previousPrice <= currentPrice
      )
    ) {
      return "Çmimi i vjetër duhet të jetë më i madh se çmimi aktual.";
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      return "Stoku duhet të jetë numër i plotë, 0 ose më shumë.";
    }

    if (images.length > MAX_IMAGES) {
      return `Produkti mund të ketë maksimum ${MAX_IMAGES} fotografi.`;
    }

    return "";
  }

  // ======================================
  // UPDATE PRODUCT IN DATABASE
  // ======================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form || savingRef.current) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError("");

    try {
      const newImages = images.filter(
        (item) => item.type === "new"
      );

      let uploadedUrls = [];

      // UPLOAD NEW PHOTOS
      if (newImages.length) {
        setProgress(
          "Duke ngarkuar fotografitë e reja..."
        );

        const result = await uploadProductImages(
          newImages.map((item) => item.file)
        );

        const uploaded = Array.isArray(result)
          ? result
          : result?.images;

        if (
          !Array.isArray(uploaded) ||
          uploaded.length !== newImages.length
        ) {
          throw new Error(
            "Fotografitë nuk u ngarkuan të gjitha. Provo përsëri."
          );
        }

        uploadedUrls = uploaded.map(imageUrl);

        if (
          uploadedUrls.some((url) => !url)
        ) {
          throw new Error(
            "Serveri nuk ktheu URL të vlefshme për fotografitë."
          );
        }
      }

      // KEEP EXISTING PHOTO ORDER
      let uploadedIndex = 0;

      const finalImages = images.map((item) => {
        if (item.type === "saved") {
          return item.url;
        }

        return uploadedUrls[uploadedIndex++];
      });

      // SAVE CHANGES
      setProgress(
        "Duke ruajtur ndryshimet..."
      );

      await updateProduct(id, {
        name: form.name.trim(),

        brand: form.brand.trim() || null,

        category: form.category,

        description: form.description.trim(),

        price: currentPrice,

        oldPrice:
          form.oldPrice === ""
            ? null
            : previousPrice,

        badge: form.badge || null,

        stock: Number(form.stock),

        // ProteinFitness:
        // sizes = peshat
        // colors = shijet

        sizes: parseList(form.sizes),

        colors: parseList(form.colors),

        images: finalImages,

        active: form.active,
      });

      navigate("/admin/products", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Produkti nuk u përditësua. Provo përsëri."
      );

      setProgress("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center gap-3 bg-[#090909] text-neutral-300">
        <Loader2
          size={22}
          className="animate-spin text-[#FF7900]"
        />

        Duke ngarkuar produktin...
      </div>
    );
  }

  // ======================================
  // PRODUCT NOT FOUND
  // ======================================

  if (!form) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#151515] p-8 text-white">
        <p
          role="alert"
          className="text-sm text-red-400"
        >
          {error || "Produkti nuk u gjet."}
        </p>

        <Link
          to="/admin/products"
          className="mt-5 inline-flex gap-2 text-sm text-[#FF7900]"
        >
          <ArrowLeft size={16} />
          Kthehu te produktet
        </Link>
      </div>
    );
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="mx-auto min-h-screen max-w-[1250px] rounded-2xl bg-[#090909] px-4 py-8 pb-12 text-white sm:px-6 lg:px-8">

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">

        <div>
          <Link
            to="/admin/products"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-[#FF7900]"
          >
            <ArrowLeft size={16} />
            KTHEHU TE PRODUKTET
          </Link>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
            PROTEINFITNESS / ADMIN
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            EDITO{" "}
            <span className="text-[#FF7900]">
              PRODUKTIN.
            </span>
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            ID #{id} · Përditëso informacionin dhe fotografitë.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF7900]/10 text-[#FF7900]">
          <PackageCheck size={27} />
        </div>

      </div>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* ================================= */}
      {/* EDIT FORM */}
      {/* ================================= */}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]"
      >

        {/* ================================= */}
        {/* LEFT COLUMN */}
        {/* ================================= */}

        <div className="space-y-6">

          {/* BASIC INFORMATION */}
          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <SectionTitle
              number="01"
              label="INFORMACIONI"
              title="Të dhënat e produktit"
            />

            <div className="space-y-5">

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Emri i produktit *
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={180}
                  required
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Marka
                </span>

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="p.sh. Optimum Nutrition"
                  className={inputClass}
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
                  className={`${inputClass} resize-y`}
                />
              </label>

            </div>
          </section>

          {/* ================================= */}
          {/* PRICE AND STOCK */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <SectionTitle
              number="02"
              label="ÇMIMI DHE STOKU"
              title="Çmimet dhe disponueshmëria"
            />

            <div className="grid gap-5 sm:grid-cols-3">

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Çmimi (€) *
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Çmimi i vjetër (€)
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Stoku (copë) *
                </span>

                <input
                  type="number"
                  step="1"
                  min="0"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </label>

            </div>

            {discount !== null && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10 p-4 text-sm">

                <BadgePercent
                  size={20}
                  className="text-[#FF7900]"
                />

                <span>Zbritja:</span>

                <strong className="text-[#FF7900]">
                  −{discount}%
                </strong>

                <span className="ml-auto text-neutral-300">
                  {euro(currentPrice)}
                </span>

              </div>
            )}
          </section>

          {/* ================================= */}
          {/* VARIANTS */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <SectionTitle
              number="03"
              label="VARIANTET"
              title="Peshat dhe shijet"
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Pesha / Paketimi
                </span>

                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="500 g, 1 kg, 2 kg"
                  className={inputClass}
                />

                <span className="mt-2 block text-[11px] text-neutral-500">
                  Ndaji me presje · ruhen si sizes.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Shijet / Variantet
                </span>

                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Chocolate, Vanilla, Strawberry"
                  className={inputClass}
                />

                <span className="mt-2 block text-[11px] text-neutral-500">
                  Ndaji me presje · ruhen si colors.
                </span>
              </label>

            </div>
          </section>

          {/* ================================= */}
          {/* PRODUCT PHOTOS */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">

            <div className="flex items-start justify-between gap-4">
              <SectionTitle
                number="04"
                label="MEDIA"
                title="Fotografitë e produktit"
              />

              <span className="shrink-0 text-xs font-bold text-[#FF7900]">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            {/* UPLOAD */}
            <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#FF7900]/40 bg-[#FF7900]/[0.04] px-4 text-center hover:bg-[#FF7900]/10">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                disabled={
                  saving ||
                  images.length >= MAX_IMAGES
                }
                className="sr-only"
              />

              <UploadCloud
                size={30}
                className="text-[#FF7900]"
              />

              <span className="mt-3 text-sm font-black">
                SHTO FOTOGRAFI
              </span>

              <span className="mt-2 text-xs text-neutral-400">
                JPG, PNG, WEBP · deri 12 MB · maksimum 6 foto
              </span>

            </label>

            {/* EXISTING AND NEW IMAGES */}
            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-[#222222]"
                  >

                    <img
                      src={image.url}
                      alt={`Foto ${index + 1}`}
                      className="aspect-[4/5] w-full object-contain p-2"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-[#FF7900] px-2 py-1 text-[9px] font-black text-black">
                        KRYESORE
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-1 border-t border-white/10 p-2">

                      <button
                        type="button"
                        disabled={saving || index === 0}
                        onClick={() => setMainImage(image.id)}
                        title="Vendose foton kryesore"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF7900] disabled:opacity-40"
                      >
                        <Star size={13} />
                        Kryesore
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => removeImage(image.id)}
                        aria-label={`Largo foton ${index + 1}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              Fotografitë e hequra nuk do të jenë më
              pjesë e produktit pas ruajtjes.
              Kjo nuk i fshin automatikisht nga Cloudinary.
            </p>

          </section>

        </div>

        {/* ================================= */}
        {/* RIGHT COLUMN */}
        {/* ================================= */}

        <div className="space-y-6 lg:sticky lg:top-24">

          {/* ORGANIZATION */}
          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-6">
            <SectionTitle
              number="05"
              label="ORGANIZIMI"
              title="Kategoria dhe etiketa"
            />

            <label className="block">
              <span className="mb-2 block text-xs font-bold">
                Kategoria *
              </span>

              <div className="rounded-xl border border-white/15 bg-[#0D0D0D] text-white">
                <AdminCategorySelect
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-bold">
                Etiketa
              </span>

              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Pa etiketë</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">
                  BESTSELLER
                </option>
              </select>
            </label>
          </section>

          {/* ACTIVE STATUS */}
          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-6">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">
                  Produkt aktiv
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Shfaq produktin në dyqan.
                </p>
              </div>

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-5 w-5 accent-[#FF7900]"
              />
            </label>
          </section>

          {/* SAVE CHANGES */}
          <section className="overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-[#151515]">

            <div className="border-b border-white/10 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#FF7900]">
                PROTEINFITNESS DATABASE
              </p>

              <p className="mt-3 text-xs leading-6 text-neutral-400">
                Përditësimi kryhet përmes updateProduct.
                Fotografitë e reja ngarkohen përmes
                uploadProductImages.
              </p>

              {progress && (
                <p
                  role="status"
                  className="mt-4 text-xs text-[#FF7900]"
                >
                  {progress}
                </p>
              )}
            </div>

            <div className="p-5">
              <button
                type="submit"
                disabled={saving}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-5 text-xs font-black uppercase tracking-wide text-black hover:bg-[#FFA33E] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    DUKE RUAJTUR...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    RUAJ NDRYSHIMET
                  </>
                )}
              </button>

              <Link
                to="/admin/products"
                className="mt-4 block text-center text-xs font-bold text-neutral-400 hover:text-white"
              >
                ANULO DHE KTHEHU
              </Link>
            </div>

            <div className="h-[3px] bg-gradient-to-r from-[#FF7900] via-[#FFB45E] to-[#FF7900]" />

          </section>

        </div>
      </form>
    </div>
  );
}
