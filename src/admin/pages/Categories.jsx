
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CheckCircle2,
  ImageOff,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
  uploadProductImages,
} from "../../services/api";

// ======================================
// PROTEINFITNESS CONFIGURATION
// ======================================

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const INPUT =
  "w-full rounded-xl border border-white/15 bg-[#0B0B0B] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-[#FF7900]";

const EMPTY_FORM = {
  name: "",
  description: "",
  sortOrder: "0",
  imageUrl: "",
  active: true,
};

// ======================================
// HELPERS
// ======================================

function getUrl(value) {
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

function normalizeCategory(item) {
  return {
    ...item,

    name: item.name || "",

    description: item.description || "",

    image_url: getUrl(
      item.image_url ?? item.imageUrl
    ),

    sort_order:
      item.sort_order ??
      item.sortOrder ??
      0,

    active:
      item.active !== false &&
      item.active !== 0,
  };
}

function validateFile(file) {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Lejohen vetëm fotografi JPG, PNG ose WEBP.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Fotografia duhet të jetë më e vogël se 12 MB.";
  }

  return "";
}

function validImageLink(url) {
  if (!url.trim()) return true;

  try {
    return ["http:", "https:"].includes(
      new URL(url).protocol
    );
  } catch {
    return false;
  }
}

async function uploadOneImage(file) {
  const result = await uploadProductImages([
    file,
  ]);

  const images = Array.isArray(result)
    ? result
    : result?.images;

  const url = Array.isArray(images)
    ? getUrl(images[0])
    : "";

  if (!url) {
    throw new Error(
      "Ngarkimi nuk ktheu URL të fotografisë."
    );
  }

  return url;
}

// ======================================
// CATEGORIES COMPONENT
// ======================================

export default function Categories() {
  const [categories, setCategories] =
    useState([]);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [newImage, setNewImage] =
    useState(null);

  const [pendingImages, setPendingImages] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [savingId, setSavingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [reloadKey, setReloadKey] =
    useState(0);

  const objectUrls = useRef(new Set());

  // ======================================
  // CLEAN UP TEMPORARY IMAGES
  // ======================================

  useEffect(() => {
    const urls = objectUrls.current;

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      urls.clear();
    };
  }, []);

  // ======================================
  // LOAD CATEGORIES
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response =
          await getAdminCategories();

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.categories)
            ? response.categories
            : [];

        if (!cancelled) {
          setCategories(
            list.map(normalizeCategory)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Nuk u ngarkuan kategoritë."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // ======================================
  // CATEGORY STATISTICS
  // ======================================

  const stats = useMemo(
    () => ({
      total: categories.length,

      active: categories.filter(
        (item) => item.active
      ).length,

      withImage: categories.filter(
        (item) => item.image_url
      ).length,
    }),
    [categories]
  );

  // ======================================
  // PREVIEW CLEANUP
  // ======================================

  function clearPreview(url) {
    if (!url) return;

    URL.revokeObjectURL(url);

    objectUrls.current.delete(url);
  }

  // ======================================
  // SELECT NEW CATEGORY IMAGE
  // ======================================

  function selectNewImage(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const message = validateFile(file);

    if (message) {
      setError(message);
      return;
    }

    if (newImage) {
      clearPreview(newImage.preview);
    }

    const preview =
      URL.createObjectURL(file);

    objectUrls.current.add(preview);

    setNewImage({
      file,
      preview,
    });

    setError("");
  }

  function removeNewImage() {
    if (newImage) {
      clearPreview(newImage.preview);
    }

    setNewImage(null);
  }

  // ======================================
  // UPDATE CATEGORY LOCALLY
  // ======================================

  function changeLocal(id, field, value) {
    setCategories((current) =>
      current.map((category) =>
        String(category.id) === String(id)
          ? {
              ...category,
              [field]: value,
            }
          : category
      )
    );

    setNotice("");
  }

  // ======================================
  // SELECT IMAGE FOR EXISTING CATEGORY
  // ======================================

  function selectEditImage(category, event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const message = validateFile(file);

    if (message) {
      setError(message);
      return;
    }

    const key = String(category.id);

    if (pendingImages[key]) {
      clearPreview(
        pendingImages[key].preview
      );
    }

    const preview =
      URL.createObjectURL(file);

    objectUrls.current.add(preview);

    setPendingImages((current) => ({
      ...current,

      [key]: {
        file,
        preview,
      },
    }));

    setError("");
    setNotice("");
  }

  // ======================================
  // REMOVE CATEGORY IMAGE
  // ======================================

  function removeEditImage(category) {
    const key = String(category.id);

    if (pendingImages[key]) {
      clearPreview(
        pendingImages[key].preview
      );
    }

    setPendingImages((current) => {
      const updated = { ...current };

      delete updated[key];

      return updated;
    });

    changeLocal(
      category.id,
      "image_url",
      ""
    );
  }

  // ======================================
  // CREATE CATEGORY
  // ======================================

  async function handleCreate(event) {
    event.preventDefault();

    if (creating) return;

    if (!form.name.trim()) {
      setError(
        "Shkruaj emrin e kategorisë."
      );

      return;
    }

    if (!validImageLink(form.imageUrl)) {
      setError(
        "URL-ja e fotografisë nuk është e vlefshme."
      );

      return;
    }

    const sortOrder =
      Number(form.sortOrder);

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0
    ) {
      setError(
        "Renditja duhet të jetë numër i plotë, 0 ose më shumë."
      );

      return;
    }

    setCreating(true);
    setError("");
    setNotice("");

    try {
      const imageUrl = newImage
        ? await uploadOneImage(newImage.file)
        : form.imageUrl.trim();

      await createCategory({
        name: form.name.trim(),

        description:
          form.description.trim(),

        sortOrder,

        imageUrl,

        active: form.active,
      });

      removeNewImage();

      setForm(EMPTY_FORM);

      setNotice(
        "Kategoria u shtua me sukses."
      );

      setReloadKey(
        (key) => key + 1
      );
    } catch (err) {
      setError(
        err?.message ||
          "Kategoria nuk u krijua."
      );
    } finally {
      setCreating(false);
    }
  }

  // ======================================
  // SAVE CATEGORY CHANGES
  // ======================================

  async function handleSave(category) {
    const key = String(category.id);

    if (savingId !== null) return;

    if (!category.name.trim()) {
      setError(
        "Emri i kategorisë nuk mund të jetë bosh."
      );

      return;
    }

    const sortOrder =
      Number(category.sort_order);

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0
    ) {
      setError(
        "Renditja duhet të jetë numër i plotë, 0 ose më shumë."
      );

      return;
    }

    setSavingId(key);
    setError("");
    setNotice("");

    try {
      let imageUrl =
        category.image_url || "";

      const pending =
        pendingImages[key];

      if (pending) {
        imageUrl =
          await uploadOneImage(
            pending.file
          );
      }

      await updateCategory(
        category.id,
        {
          name: category.name.trim(),

          description:
            category.description || "",

          imageUrl,

          sortOrder,

          active:
            Boolean(category.active),
        }
      );

      if (pending) {
        clearPreview(
          pending.preview
        );

        setPendingImages(
          (current) => {
            const updated = {
              ...current,
            };

            delete updated[key];

            return updated;
          }
        );
      }

      setNotice(
        `Kategoria "${category.name}" u përditësua.`
      );

      setReloadKey(
        (value) => value + 1
      );
    } catch (err) {
      setError(
        err?.message ||
          "Kategoria nuk u përditësua."
      );
    } finally {
      setSavingId(null);
    }
  }

  // ======================================
  // DELETE CATEGORY
  // ======================================

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `A dëshiron ta fshish kategorinë "${category.name}"?\n\nNëse ka produkte të lidhura, fshirja mund të refuzohet nga serveri.`
    );

    if (!confirmed) return;

    const key = String(category.id);

    setDeletingId(key);
    setError("");
    setNotice("");

    try {
      await deleteCategory(
        category.id
      );

      const pending =
        pendingImages[key];

      if (pending) {
        clearPreview(
          pending.preview
        );
      }

      setPendingImages(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[key];

          return updated;
        }
      );

      setNotice(
        "Kategoria u fshi."
      );

      setReloadKey(
        (value) => value + 1
      );
    } catch (err) {
      setError(
        err?.message ||
          "Kategoria nuk u fshi."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-7 lg:px-9">

      <div className="mx-auto max-w-[1250px]">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#FF7900]">
                PROTEINFITNESS ADMIN
              </p>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              KATEGORITË
              <span className="text-[#FF7900]">
                .
              </span>
            </h1>

            <p className="mt-3 text-sm text-neutral-400">
              Organizo proteinat, kreatinën,
              vitaminat dhe produktet e tjera.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF7900]/10">
            <Tags
              size={26}
              className="text-[#FF7900]"
            />
          </div>

        </div>

        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="mt-7 grid grid-cols-3 gap-3">

          {[
            ["Gjithsej", stats.total],
            ["Aktive", stats.active],
            ["Me fotografi", stats.withImage],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#151515] p-4 sm:p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                {label}
              </p>

              <p className="mt-2 text-2xl font-black text-[#FF7900] sm:text-3xl">
                {value}
              </p>
            </div>
          ))}

        </div>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* SUCCESS */}
        {/* ================================= */}

        {notice && (
          <div
            role="status"
            className="mt-6 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300"
          >
            <CheckCircle2 size={17} />

            {notice}
          </div>
        )}

        {/* ================================= */}
        {/* ADD CATEGORY */}
        {/* ================================= */}

        <form
          onSubmit={handleCreate}
          className="mt-7 rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-7"
        >

          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">

            <Plus
              size={22}
              className="text-[#FF7900]"
            />

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#FF7900]">
                KATEGORI E RE
              </p>

              <h2 className="mt-1 text-xl font-black">
                Shto kategori
              </h2>
            </div>

          </div>

          <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">

            {/* NEW IMAGE */}
            <div>

              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#FF7900]/30 bg-[#0B0B0B]">

                {newImage || form.imageUrl ? (
                  <img
                    src={
                      newImage?.preview ||
                      form.imageUrl
                    }
                    alt="Pamja e kategorisë së re"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus
                    size={36}
                    className="text-[#FF7900]"
                  />
                )}

                {newImage && (
                  <button
                    type="button"
                    onClick={removeNewImage}
                    disabled={creating}
                    aria-label="Hiq fotografinë e zgjedhur"
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-black/80 text-white hover:bg-red-600"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#FF7900]/30 bg-[#FF7900]/10 px-3 py-3 text-xs font-bold text-[#FF7900] hover:bg-[#FF7900]/20">

                <ImagePlus size={16} />

                ZGJIDH FOTON

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectNewImage}
                  disabled={creating}
                  className="sr-only"
                />

              </label>

              <p className="mt-2 text-center text-[11px] text-neutral-500">
                JPG, PNG, WEBP · max 12 MB
              </p>

            </div>

            {/* NEW CATEGORY FIELDS */}
            <div className="grid gap-4 sm:grid-cols-2">

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  Emri i kategorisë *
                </span>

                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="p.sh. Proteina, Kreatinë, Vitamina"
                  maxLength={100}
                  required
                  className={INPUT}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  Përshkrimi
                </span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="Përshkrimi i kategorisë..."
                  rows={3}
                  className={`${INPUT} resize-y`}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold">
                  URL e fotografisë (opsionale)
                </span>

                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imageUrl:
                        event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className={INPUT}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Renditja
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sortOrder:
                        event.target.value,
                    }))
                  }
                  className={INPUT}
                />
              </label>

              <label className="flex items-center gap-3 self-end pb-3 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      active:
                        event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-[#FF7900]"
                />

                Kategori aktive
              </label>

              <button
                type="submit"
                disabled={creating}
                className="flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-6 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#FFA33E] disabled:opacity-50 sm:col-span-2"
              >
                {creating ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={18} />
                )}

                {creating
                  ? "DUKE RUAJTUR..."
                  : "SHTO KATEGORINË"}
              </button>

            </div>
          </div>
        </form>

        {/* ================================= */}
        {/* EXISTING CATEGORIES */}
        {/* ================================= */}

        <div className="mt-9">

          <div className="mb-5 flex items-center justify-between gap-4">

            <h2 className="text-xl font-black">
              Kategoritë ekzistuese
            </h2>

            <span className="text-xs text-neutral-500">
              {categories.length} kategori
            </span>

          </div>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#151515] text-sm text-neutral-400">

              <Loader2
                size={19}
                className="animate-spin text-[#FF7900]"
              />

              Duke ngarkuar kategoritë...

            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#151515] px-6 py-14 text-center">

              <Tags
                size={32}
                className="mx-auto text-[#FF7900]"
              />

              <p className="mt-4 text-sm text-neutral-400">
                Nuk ka kategori të regjistruara.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {categories.map((category) => {
                const key = String(category.id);

                const pending =
                  pendingImages[key];

                const displayImage =
                  pending?.preview ||
                  category.image_url;

                const isBusy =
                  savingId === key ||
                  deletingId === key;

                return (
                  <article
                    key={key}
                    className="grid gap-5 rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5 lg:grid-cols-[170px_minmax(0,1fr)]"
                  >

                    {/* CATEGORY PHOTO */}
                    <div>

                      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0B0B0B]">

                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff
                            size={31}
                            className="text-neutral-600"
                          />
                        )}

                      </div>

                      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-[11px] font-bold text-[#FF7900] hover:border-[#FF7900]">

                        <ImagePlus size={15} />

                        NDRYSHO FOTO

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isBusy}
                          onChange={(event) =>
                            selectEditImage(
                              category,
                              event
                            )
                          }
                          className="sr-only"
                        />

                      </label>

                      {displayImage && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            removeEditImage(
                              category
                            )
                          }
                          className="mt-2 w-full text-center text-[11px] font-bold text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Largo fotografinë
                        </button>
                      )}

                    </div>

                    {/* CATEGORY DETAILS */}
                    <div className="space-y-4">

                      <div className="grid gap-4 sm:grid-cols-2">

                        {/* NAME */}
                        <label className="sm:col-span-2">
                          <span className="mb-2 block text-xs font-bold">
                            Emri i kategorisë
                          </span>

                          <input
                            value={category.name}
                            onChange={(event) =>
                              changeLocal(
                                category.id,
                                "name",
                                event.target.value
                              )
                            }
                            disabled={isBusy}
                            className={INPUT}
                          />
                        </label>

                        {/* DESCRIPTION */}
                        <label className="sm:col-span-2">
                          <span className="mb-2 block text-xs font-bold">
                            Përshkrimi
                          </span>

                          <textarea
                            value={
                              category.description
                            }
                            onChange={(event) =>
                              changeLocal(
                                category.id,
                                "description",
                                event.target.value
                              )
                            }
                            rows={3}
                            disabled={isBusy}
                            className={`${INPUT} resize-y`}
                          />
                        </label>

                        {/* SORT ORDER */}
                        <label>
                          <span className="mb-2 block text-xs font-bold">
                            Renditja
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              category.sort_order
                            }
                            onChange={(event) =>
                              changeLocal(
                                category.id,
                                "sort_order",
                                event.target.value
                              )
                            }
                            disabled={isBusy}
                            className={INPUT}
                          />
                        </label>

                        {/* ACTIVE */}
                        <label className="flex items-center gap-3 self-end pb-3 text-xs font-bold">

                          <input
                            type="checkbox"
                            checked={category.active}
                            onChange={(event) =>
                              changeLocal(
                                category.id,
                                "active",
                                event.target.checked
                              )
                            }
                            disabled={isBusy}
                            className="h-5 w-5 accent-[#FF7900]"
                          />

                          Kategori aktive
                        </label>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">

                        <span className="text-[11px] text-neutral-500">
                          ID #{category.id}
                        </span>

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleSave(
                                category
                              )
                            }
                            disabled={isBusy}
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#FF7900] px-5 text-xs font-black text-black hover:bg-[#FFA33E] disabled:opacity-50"
                          >
                            {savingId === key ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Save size={16} />
                            )}

                            RUAJ
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={isBusy}
                            aria-label={`Fshi kategorinë ${category.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50"
                          >
                            {deletingId === key ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>

                        </div>
                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
