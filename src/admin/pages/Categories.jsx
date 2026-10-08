import {
  useEffect,
  useState,
} from "react";

import {
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

export default function Categories() {
  const [categories, setCategories] =
    useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    sortOrder: 0,
    imageUrl: "",
  });

  const [newImage, setNewImage] =
    useState(null);

  const [newPreview, setNewPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminCategories();

      setCategories(
        data.categories || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Kategoritë nuk u morën."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function selectNewImage(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Lejohen JPG, PNG dhe WEBP."
      );
      return;
    }

    if (newPreview) {
      URL.revokeObjectURL(
        newPreview
      );
    }

    setNewImage(file);

    setNewPreview(
      URL.createObjectURL(file)
    );
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Shkruaj emrin e kategorisë."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl =
        form.imageUrl || "";

      if (newImage) {
        const upload =
          await uploadProductImages([
            newImage,
          ]);

        imageUrl =
          upload.images?.[0]?.url ||
          "";
      }

      await createCategory({
        name: form.name.trim(),
        description:
          form.description.trim(),
        imageUrl,
        sortOrder:
          Number(form.sortOrder) || 0,
      });

      if (newPreview) {
        URL.revokeObjectURL(
          newPreview
        );
      }

      setForm({
        name: "",
        description: "",
        sortOrder: 0,
        imageUrl: "",
      });

      setNewImage(null);
      setNewPreview("");

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Kategoria nuk u krijua."
      );
    } finally {
      setSaving(false);
    }
  }

  function changeLocal(
    id,
    field,
    value
  ) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              [field]: value,
            }
          : category
      )
    );
  }

  async function changeImage(
    category,
    file
  ) {
    if (!file) return;

    try {
      setError("");

      const upload =
        await uploadProductImages([
          file,
        ]);

      const imageUrl =
        upload.images?.[0]?.url ||
        "";

      changeLocal(
        category.id,
        "image_url",
        imageUrl
      );
    } catch (err) {
      setError(
        err.message ||
          "Foto nuk u ngarkua."
      );
    }
  }

  async function handleSave(category) {
    try {
      setError("");

      await updateCategory(
        category.id,
        {
          name:
            category.name.trim(),

          description:
            category.description ||
            "",

          imageUrl:
            category.image_url ||
            "",

          sortOrder:
            Number(
              category.sort_order
            ) || 0,

          active:
            category.active,
        }
      );

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Kategoria nuk u ndryshua."
      );
    }
  }

  async function handleDelete(
    category
  ) {
    const confirmed =
      window.confirm(
        `A dëshiron ta fshish "${category.name}"?`
      );

    if (!confirmed) return;

    try {
      await deleteCategory(
        category.id
      );

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Kategoria nuk u fshi."
      );
    }
  }

  return (
    <div className="mx-auto max-w-[1200px]">

      <div className="flex items-end justify-between border-b border-neutral-200 pb-6">
        <div>
          <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
            APAR ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Kategoritë
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Kategoritë shfaqen automatikisht në website.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center bg-black text-white">
          <Tags size={20} />
        </div>
      </div>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-7 border border-neutral-200 bg-white p-5"
      >
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

          <div>
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              {newPreview ? (
                <>
                  <img
                    src={newPreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(
                        newPreview
                      );

                      setNewPreview("");
                      setNewImage(null);
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black text-white"
                  >
                    <X size={15} />
                  </button>
                </>
              ) : (
                <label className="flex h-full cursor-pointer flex-col items-center justify-center">
                  <ImagePlus size={28} />

                  <span className="mt-3 text-xs font-bold">
                    NGARKO FOTO
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      selectNewImage
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Emri i kategorisë"
              className="h-12 border border-neutral-300 px-4 outline-none focus:border-black"
            />

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              placeholder="Përshkrimi i kategorisë..."
              rows={3}
              className="resize-none border border-neutral-300 p-4 outline-none focus:border-black"
            />

            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({
                  ...form,
                  sortOrder:
                    e.target.value,
                })
              }
              placeholder="Renditja"
              className="h-12 border border-neutral-300 px-4 outline-none focus:border-black"
            />

            <button
              disabled={saving}
              className="flex h-12 items-center justify-center gap-2 bg-black text-xs font-black text-white disabled:opacity-50"
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Plus size={16} />
              )}

              SHTO KATEGORINË
            </button>
          </div>

        </div>
      </form>

      <div className="mt-7 space-y-4">

        {loading ? (
          <div className="p-10 text-center">
            Duke ngarkuar...
          </div>
        ) : (
          categories.map(
            (category) => (
              <div
                key={category.id}
                className="grid gap-5 border border-neutral-200 bg-white p-5 lg:grid-cols-[180px_1fr]"
              >

                <label className="relative block aspect-square cursor-pointer overflow-hidden bg-neutral-100">

                  {category.image_url ? (
                    <img
                      src={
                        category.image_url
                      }
                      alt={
                        category.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <ImagePlus
                        size={26}
                      />

                      <span className="mt-2 text-[10px] font-black">
                        SHTO FOTO
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      changeImage(
                        category,
                        e.target
                          .files?.[0]
                      )
                    }
                    className="hidden"
                  />
                </label>

                <div className="space-y-4">

                  <input
                    value={
                      category.name
                    }
                    onChange={(e) =>
                      changeLocal(
                        category.id,
                        "name",
                        e.target.value
                      )
                    }
                    className="h-11 w-full border border-neutral-300 px-3 font-bold outline-none focus:border-black"
                  />

                  <textarea
                    value={
                      category.description ||
                      ""
                    }
                    onChange={(e) =>
                      changeLocal(
                        category.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Përshkrimi..."
                    className="w-full resize-none border border-neutral-300 p-3 text-sm outline-none focus:border-black"
                  />

                  <div className="flex flex-wrap items-center gap-3">

                    <input
                      type="number"
                      value={
                        category.sort_order
                      }
                      onChange={(e) =>
                        changeLocal(
                          category.id,
                          "sort_order",
                          e.target.value
                        )
                      }
                      className="h-11 w-28 border border-neutral-300 px-3 outline-none"
                    />

                    <label className="flex items-center gap-2 text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={
                          category.active
                        }
                        onChange={(e) =>
                          changeLocal(
                            category.id,
                            "active",
                            e.target
                              .checked
                          )
                        }
                        className="accent-black"
                      />

                      AKTIVE
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        handleSave(
                          category
                        )
                      }
                      className="ml-auto flex h-11 items-center gap-2 bg-black px-5 text-xs font-black text-white"
                    >
                      <Save size={15} />
                      RUAJ
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          category
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center border border-red-200 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>
              </div>
            )
          )
        )}

      </div>
    </div>
  );
}