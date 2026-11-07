
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BadgePercent,
  ImagePlus,
  Info,
  Loader2,
  PackagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminCategorySelect from "../components/AdminCategorySelect";

import {
  createProduct,
  uploadProductImages,
} from "../../services/api";

// ======================================
// PROTEINFITNESS CONFIGURATION
// ======================================

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const initialForm = {
  name: "",
  brand: "",
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

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-[#FF7900]";

// ======================================
// HELPERS
// ======================================

function parseList(value) {
  return [
    ...new Set(
      value
        .split(/[,\n;]/)
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

function SectionHeading({ number, eyebrow, title }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#FF7900]">
        {number} / {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

// ======================================
// ADD PRODUCT COMPONENT
// ======================================

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [fileEntries, setFileEntries] = useState([]);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState("");

  const [error, setError] = useState("");

  const previewUrlsRef = useRef(new Set());

  const savingRef = useRef(false);

  // ======================================
  // CLEAN UP PREVIEW URLS
  // ======================================

  useEffect(() => {
    const urls = previewUrlsRef.current;

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      urls.clear();
    };
  }, []);

  // ======================================
  // DISCOUNT
  // ======================================

  const currentPrice = Number(form.price);
  const previousPrice = Number(form.oldPrice);

  const discount = useMemo(() => {
    if (
      !form.price ||
      !form.oldPrice ||
      !Number.isFinite(currentPrice) ||
      !Number.isFinite(previousPrice) ||
      previousPrice <= currentPrice ||
      previousPrice <= 0
    ) {
      return null;
    }

    return Math.round(
      ((previousPrice - currentPrice) / previousPrice) * 100
    );
  }, [
    form.price,
    form.oldPrice,
    currentPrice,
    previousPrice,
  ]);

  // ======================================
  // HANDLE INPUT CHANGE
  // ======================================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  // ======================================
  // HANDLE IMAGE FILES
  // ======================================

  function handleFiles(event) {
    const incoming = Array.from(event.target.files || []);

    event.target.value = "";

    if (!incoming.length) return;

    const remaining = MAX_IMAGES - fileEntries.length;

    if (remaining <= 0) {
      setError(
        `Mund të shtosh maksimum ${MAX_IMAGES} fotografi.`
      );
      return;
    }

    const valid = [];
    let rejected = 0;

    for (const file of incoming) {
      if (
        !IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_FILE_SIZE
      ) {
        rejected += 1;
        continue;
      }

      valid.push(file);
    }

    const accepted = valid
      .slice(0, remaining)
      .map((file) => {
        const url = URL.createObjectURL(file);

        previewUrlsRef.current.add(url);

        return {
          id: `${Date.now()}-${Math.random()}`,
          file,
          url,
        };
      });

    setFileEntries((current) => [
      ...current,
      ...accepted,
    ]);

    if (rejected || valid.length > remaining) {
      setError(
        `Disa fotografi nuk u shtuan. Lejohen JPG, PNG ose WEBP, deri 12 MB secila dhe maksimum ${MAX_IMAGES} fotografi.`
      );
    } else {
      setError("");
    }
  }

  // ======================================
  // REMOVE IMAGE
  // ======================================

  function removeImage(id) {
    const entry = fileEntries.find(
      (item) => item.id === id
    );

    if (entry) {
      URL.revokeObjectURL(entry.url);
      previewUrlsRef.current.delete(entry.url);
    }

    setFileEntries((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  // ======================================
  // FORM VALIDATION
  // ======================================

  function validate() {
    if (!form.name.trim()) {
      return "Shkruaj emrin e produktit.";
    }

    if (!form.category) {
      return "Zgjidh kategorinë e produktit.";
    }

    if (
      form.price === "" ||
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

    const stock = Number(form.stock);

    if (
      form.stock === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return "Shkruaj stokun si numër të plotë (0 ose më shumë).";
    }

    return "";
  }

  // ======================================
  // SAVE PRODUCT
  // ======================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (savingRef.current) return;

    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    savingRef.current = true;
    setLoading(true);

    try {
      let images = [];

      // UPLOAD PHOTOS
      if (fileEntries.length) {
        setProgress("Duke ngarkuar fotografitë...");

        const result = await uploadProductImages(
          fileEntries.map((entry) => entry.file)
        );

        images = Array.isArray(result)
          ? result
          : result?.images;

        if (
          !Array.isArray(images) ||
          images.length !== fileEntries.length
        ) {
          throw new Error(
            "Ngarkimi i fotografive nuk përfundoi. Provo përsëri."
          );
        }
      }

      // SAVE PRODUCT IN DATABASE
      setProgress("Duke ruajtur produktin...");

      await createProduct({
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

        images,

        active: form.active,
      });

      navigate("/admin/products", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Produkti nuk u ruajt. Provo përsëri."
      );

      setProgress("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
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
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-neutral-400 transition hover:text-[#FF7900]"
          >
            <ArrowLeft size={16} />
            KTHEHU TE PRODUKTET
          </Link>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
            PROTEINFITNESS / ADMIN
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            SHTO{" "}
            <span className="text-[#FF7900]">
              PRODUKT.
            </span>
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            Regjistro suplementet, çmimet, peshat,
            shijet dhe fotografitë.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF7900]/10 text-[#FF7900]">
          <PackagePlus size={27} />
        </div>
      </div>

      {/* ================================= */}
      {/* ERROR MESSAGE */}
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
      {/* PRODUCT FORM */}
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
            <SectionHeading
              number="01"
              eyebrow="INFORMACIONI"
              title="Të dhënat e produktit"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  Emri i produktit *
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={180}
                  placeholder="p.sh. Whey Protein 2 kg"
                  className={fieldClass}
                  required
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  Marka
                </span>

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="p.sh. Optimum Nutrition"
                  className={fieldClass}
                />

                <span className="mt-2 block text-[11px] text-neutral-500">
                  Kjo fushë kërkon mbështetje në API
                  dhe databazë për t'u ruajtur.
                </span>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  Përshkrimi
                </span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Përshkrimi i produktit, përbërësit dhe informacioni sipas etiketës..."
                  className={`${fieldClass} resize-y`}
                />
              </label>
            </div>
          </section>

          {/* ================================= */}
          {/* PRICE AND STOCK */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <SectionHeading
              number="02"
              eyebrow="ÇMIMI DHE STOKU"
              title="Çmimet dhe disponueshmëria"
            />

            <div className="grid gap-5 sm:grid-cols-3">

              {/* PRICE */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Çmimi (€) *
                </span>

                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={handleChange}
                  placeholder="49.90"
                  className={fieldClass}
                />
              </label>

              {/* OLD PRICE */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Çmimi i vjetër (€)
                </span>

                <input
                  type="number"
                  name="oldPrice"
                  min="0"
                  step="0.01"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="59.90"
                  className={fieldClass}
                />
              </label>

              {/* STOCK */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Stoku (copë) *
                </span>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  required
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  className={fieldClass}
                />
              </label>
            </div>

            {/* DISCOUNT PREVIEW */}
            {discount !== null && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#FF7900]/25 bg-[#FF7900]/10 p-4 text-sm">
                <BadgePercent
                  size={20}
                  className="text-[#FF7900]"
                />

                <span>Zbritja e llogaritur:</span>

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
          {/* PRODUCT VARIANTS */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <SectionHeading
              number="03"
              eyebrow="VARIANTET"
              title="Peshat dhe shijet"
            />

            <div className="grid gap-5 sm:grid-cols-2">

              {/* WEIGHTS */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Pesha / Paketimi
                </span>

                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="500 g, 1 kg, 2 kg, 2.5 kg"
                  className={fieldClass}
                />

                <span className="mt-2 block text-[11px] text-neutral-500">
                  Ndaji opsionet me presje.
                  Ruhet si sizes.
                </span>
              </label>

              {/* FLAVORS */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Shijet / Variantet
                </span>

                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Chocolate, Vanilla, Strawberry"
                  className={fieldClass}
                />

                <span className="mt-2 block text-[11px] text-neutral-500">
                  Ndaji opsionet me presje.
                  Ruhet si colors.
                </span>
              </label>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl border border-white/10 bg-[#0B0B0B] p-4">
              <Info
                size={18}
                className="mt-0.5 shrink-0 text-[#FF7900]"
              />

              <p className="text-xs leading-6 text-neutral-400">
                Pesha dhe shija janë emërtimet për klientin.
                Fushat teknike sizes dhe colors mbeten
                të pandryshuara për përputhshmëri me
                dyqanin dhe shportën. Stoku zbatohet
                për produktin në tërësi.
              </p>
            </div>
          </section>

          {/* ================================= */}
          {/* PRODUCT IMAGES */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <SectionHeading
                number="04"
                eyebrow="MEDIA"
                title="Fotografitë e produktit"
              />

              <span className="shrink-0 text-xs font-bold text-[#FF7900]">
                {fileEntries.length}/{MAX_IMAGES}
              </span>
            </div>

            {/* UPLOAD AREA */}
            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#FF7900]/40 bg-[#FF7900]/[0.04] px-4 text-center transition hover:bg-[#FF7900]/10">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                disabled={
                  loading ||
                  fileEntries.length >= MAX_IMAGES
                }
                className="sr-only"
              />

              <UploadCloud
                size={32}
                className="text-[#FF7900]"
              />

              <span className="mt-3 text-sm font-black">
                ZGJIDH FOTOGRAFITË
              </span>

              <span className="mt-2 text-xs text-neutral-400">
                JPG, PNG ose WEBP · maksimum 6 foto ·
                deri 12 MB secila
              </span>
            </label>

            {/* IMAGE PREVIEWS */}
            {fileEntries.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fileEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#222222]"
                  >
                    <img
                      src={entry.url}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-contain p-2"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-[#FF7900] px-2 py-1 text-[9px] font-black text-black">
                        KRYESORE
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeImage(entry.id)}
                      aria-label={`Largo fotografinë ${index + 1}`}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-black/85 text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ================================= */}
        {/* RIGHT COLUMN */}
        {/* ================================= */}

        <div className="space-y-6 lg:sticky lg:top-24">

          {/* CATEGORY AND BADGE */}
          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-6">
            <SectionHeading
              number="05"
              eyebrow="ORGANIZIMI"
              title="Kategoria dhe etiketa"
            />

            {/* CATEGORY */}
            <label className="block">
              <span className="mb-2 block text-xs font-bold">
                Kategoria *
              </span>

              <div className="rounded-xl border border-white/15 bg-[#0C0C0C] text-white focus-within:border-[#FF7900]">
                <AdminCategorySelect
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
            </label>

            {/* BADGE */}
            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-bold">
                Etiketa e produktit
              </span>

              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className={fieldClass}
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

          {/* ================================= */}
          {/* ACTIVE STATUS */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-6">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">
                  Produkt aktiv
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-400">
                  Aktivizo produktin për ta shfaqur
                  në dyqan.
                </p>
              </div>

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-5 w-5 shrink-0 accent-[#FF7900]"
              />
            </label>
          </section>

          {/* ================================= */}
          {/* SAVE PRODUCT */}
          {/* ================================= */}

          <section className="overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-[#151515]">

            <div className="border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <ImagePlus
                  size={20}
                  className="text-[#FF7900]"
                />

                <p className="text-[11px] font-black uppercase tracking-[0.13em] text-[#FF7900]">
                  PROTEINFITNESS DATABASE
                </p>
              </div>

              <p className="mt-3 text-xs leading-6 text-neutral-400">
                Fotografitë ngarkohen përmes API-së
                ekzistuese. Produkti ruhet përmes
                funksionit createProduct.
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
                disabled={loading}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-5 text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-[#FFA33E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    DUKE RUAJTUR...
                  </>
                ) : (
                  <>
                    <PackagePlus size={18} />
                    RUAJ PRODUKTIN
                  </>
                )}
              </button>

              <Link
                to="/admin/products"
                className="mt-4 block text-center text-xs font-bold text-neutral-400 transition hover:text-white"
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
