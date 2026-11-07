
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ImageOff,
  Loader2,
  Package,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteProduct,
  getProducts,
} from "../../services/api";

// ======================================
// PROTEINFITNESS ADMIN PRODUCTS
// ======================================

const LOW_STOCK = 5;

// ======================================
// HELPERS
// ======================================

function getPrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const raw = String(value)
    .trim()
    .replace(/[\s€]/g, "");

  const normalized =
    raw.includes(",") && raw.includes(".")
      ? raw.lastIndexOf(",") > raw.lastIndexOf(".")
        ? raw.replace(/\./g, "").replace(",", ".")
        : raw.replace(/,/g, "")
      : raw.replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function euro(value) {
  if (value === null) return "—";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function getCategory(product) {
  return typeof product.category === "string"
    ? product.category
    : product.category?.name || "Pa kategori";
}

function getImage(product) {
  const candidate =
    product.image ||
    (Array.isArray(product.images)
      ? product.images[0]
      : null);

  if (typeof candidate === "string") {
    return candidate;
  }

  return (
    candidate?.secure_url ||
    candidate?.url ||
    candidate?.image_url ||
    ""
  );
}

function getStock(product) {
  if (
    product.stock === null ||
    product.stock === undefined ||
    product.stock === ""
  ) {
    return null;
  }

  const stock = Number(product.stock);

  return Number.isFinite(stock)
    ? Math.max(0, Math.floor(stock))
    : null;
}

// ======================================
// STAT CARD
// ======================================

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-5 transition-colors hover:border-[#FF7900]/40">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7900]/10">
        <Icon size={21} className="text-[#FF7900]" />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        {value}
      </h3>

      <p className="mt-2 text-xs text-neutral-500">
        {detail}
      </p>
    </div>
  );
}

// ======================================
// PRODUCTS COMPONENT
// ======================================

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sort, setSort] = useState("newest");
  const [reloadKey, setReloadKey] = useState(0);

  // ======================================
  // LOAD PRODUCTS FROM DATABASE
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await getProducts();

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : [];

        if (!cancelled) {
          setProducts(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Nuk u arritën të ngarkohen produktet."
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
  }, [reloadKey]);

  // ======================================
  // DELETE PRODUCT
  // ======================================

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `A dëshiron ta fshish produktin "${product.name}"?\n\nKy veprim mund të mos kthehet mbrapa.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter(
          (item) =>
            String(item.id) !== String(product.id)
        )
      );
    } catch (err) {
      window.alert(
        err?.message ||
          "Produkti nuk u fshi. Provo përsëri."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ======================================
  // STATISTICS
  // ======================================

  const stats = useMemo(() => {
    const active = products.filter(
      (product) => product.active !== false
    ).length;

    const outOfStock = products.filter(
      (product) => getStock(product) === 0
    ).length;

    const lowStock = products.filter((product) => {
      const stock = getStock(product);

      return (
        stock !== null &&
        stock > 0 &&
        stock <= LOW_STOCK
      );
    }).length;

    return {
      total: products.length,
      active,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // ======================================
  // DATABASE CATEGORIES
  // ======================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map(getCategory)
          .filter(
            (name) => name !== "Pa kategori"
          )
      ),
    ].sort((a, b) => a.localeCompare(b, "sq"));
  }, [products]);

  // ======================================
  // FILTER AND SORT PRODUCTS
  // ======================================

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLocaleLowerCase("sq");

    const result = products.filter((product) => {
      const category = getCategory(product);
      const stock = getStock(product);
      const active = product.active !== false;

      if (
        categoryFilter !== "all" &&
        category !== categoryFilter
      ) {
        return false;
      }

      if (
        statusFilter === "active" &&
        !active
      ) {
        return false;
      }

      if (
        statusFilter === "inactive" &&
        active
      ) {
        return false;
      }

      if (
        statusFilter === "outofstock" &&
        stock !== 0
      ) {
        return false;
      }

      if (
        statusFilter === "lowstock" &&
        !(
          stock !== null &&
          stock > 0 &&
          stock <= LOW_STOCK
        )
      ) {
        return false;
      }

      if (query) {
        const searchable = [
          product.name,
          product.brand,
          category,
          product.id,
        ]
          .filter(
            (value) =>
              value !== null &&
              value !== undefined
          )
          .join(" ")
          .toLocaleLowerCase("sq");

        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });

    if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || ""),
          "sq"
        )
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          (getPrice(a.price) ?? Infinity) -
          (getPrice(b.price) ?? Infinity)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          (getPrice(b.price) ?? -Infinity) -
          (getPrice(a.price) ?? -Infinity)
      );
    }

    if (sort === "stock") {
      result.sort(
        (a, b) =>
          (getStock(a) ?? Infinity) -
          (getStock(b) ?? Infinity)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => {
        const dateA = Date.parse(
          a.createdAt || a.created_at || ""
        );

        const dateB = Date.parse(
          b.createdAt || b.created_at || ""
        );

        if (
          Number.isFinite(dateA) &&
          Number.isFinite(dateB)
        ) {
          return dateB - dateA;
        }

        const idA = Number(a.id);
        const idB = Number(b.id);

        if (
          Number.isFinite(idA) &&
          Number.isFinite(idB)
        ) {
          return idB - idA;
        }

        return 0;
      });
    }

    return result;
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    sort,
  ]);

  // ======================================
  // RESET FILTERS
  // ======================================

  function resetFilters() {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSort("newest");
  }

  const selectClass =
    "h-12 w-full appearance-none rounded-xl border border-white/15 bg-[#111111] px-4 text-xs font-semibold text-white outline-none transition focus:border-[#FF7900]";

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-7 text-white sm:px-7 lg:px-9 lg:py-10">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">

        <div>

          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#FF7900]" />

            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#FF7900]">
              PROTEINFITNESS ADMIN
            </p>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
            MENAXHIMI I{" "}
            <span className="text-[#FF7900]">
              PRODUKTEVE.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
            Shto, edito dhe menaxho produktet,
            çmimet, kategoritë dhe stokun e
            ProteinFitness.
          </p>
        </div>

        {/* ADD PRODUCT */}

        <Link
          to="/admin/products/new"
          className="group inline-flex min-h-[52px] w-fit items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-6 text-xs font-black uppercase tracking-wide text-black transition-all hover:bg-[#FFA33E]"
        >
          <PackagePlus size={19} />

          SHTO PRODUKT

          <ArrowUpDown
            size={15}
            className="rotate-45 transition-transform group-hover:translate-x-1"
          />
        </Link>

      </div>

      {/* ================================= */}
      {/* STATISTICS */}
      {/* ================================= */}

      <div className="mt-9 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">

        <StatCard
          icon={Package}
          label="Produktet gjithsej"
          value={stats.total}
          detail="Të regjistruara"
        />

        <StatCard
          icon={CheckCircle2}
          label="Produkte aktive"
          value={stats.active}
          detail="Të aktivizuara"
        />

        <StatCard
          icon={AlertTriangle}
          label="Stok i ulët"
          value={stats.lowStock}
          detail={`1–${LOW_STOCK} copë`}
        />

        <StatCard
          icon={ShoppingBagIcon}
          label="Jashtë stokut"
          value={stats.outOfStock}
          detail="0 copë në stok"
        />

      </div>

      {/* ================================= */}
      {/* FILTER PANEL */}
      {/* ================================= */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5">

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_180px_190px]">

          {/* SEARCH */}
          <div className="flex h-12 items-center gap-3 rounded-xl border border-white/15 bg-[#111111] px-4 focus-within:border-[#FF7900]">

            <Search
              size={18}
              className="shrink-0 text-[#FF7900]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Kërko produkt, markë ose ID..."
              aria-label="Kërko produkte"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Pastro kërkimin"
                className="text-neutral-400 hover:text-white"
              >
                <X size={17} />
              </button>
            )}

          </div>

          {/* CATEGORY */}
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            aria-label="Filtro sipas kategorisë"
            className={selectClass}
          >
            <option value="all">
              Të gjitha kategoritë
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filtro sipas statusit"
            className={selectClass}
          >
            <option value="all">
              Të gjitha statuset
            </option>

            <option value="active">
              Aktive
            </option>

            <option value="inactive">
              Jo aktive
            </option>

            <option value="lowstock">
              Stok i ulët
            </option>

            <option value="outofstock">
              Jashtë stokut
            </option>
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            aria-label="Rendit produktet"
            className={selectClass}
          >
            <option value="newest">
              Më të rejat
            </option>

            <option value="name">
              Emri A–Z
            </option>

            <option value="price-low">
              Çmimi: ulët–lartë
            </option>

            <option value="price-high">
              Çmimi: lartë–ulët
            </option>

            <option value="stock">
              Stoku më i ulët
            </option>
          </select>

        </div>

        {/* FILTER FOOTER */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">

          <p className="text-xs text-neutral-400">
            Po shfaqen{" "}
            <strong className="text-white">
              {filteredProducts.length}
            </strong>{" "}
            nga{" "}
            <strong className="text-white">
              {products.length}
            </strong>{" "}
            produkte
          </p>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-neutral-400 transition hover:text-[#FF7900]"
            >
              PASTRO FILTRAT
            </button>

            <button
              type="button"
              onClick={() =>
                setReloadKey((key) => key + 1)
              }
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7900] transition hover:text-[#FFB15E] disabled:opacity-50"
            >
              <RefreshCw size={15} />

              RIFRESKO
            </button>

          </div>
        </div>

      </div>

      {/* ================================= */}
      {/* LOADING STATE */}
      {/* ================================= */}

      {loading && (
        <div
          role="status"
          className="mt-7 flex min-h-[220px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#151515]"
        >
          <Loader2
            size={23}
            className="animate-spin text-[#FF7900]"
          />

          <span className="text-sm text-neutral-400">
            Duke ngarkuar produktet...
          </span>
        </div>
      )}

      {/* ================================= */}
      {/* ERROR STATE */}
      {/* ================================= */}

      {!loading && error && (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-red-500/20 bg-red-500/10 p-6"
        >
          <p className="text-sm font-bold text-red-400">
            Gabim gjatë ngarkimit
          </p>

          <p className="mt-2 text-sm text-neutral-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setReloadKey((key) => key + 1)
            }
            className="mt-4 rounded-lg bg-[#FF7900] px-5 py-2.5 text-xs font-black text-black"
          >
            PROVO PËRSËRI
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* PRODUCTS TABLE */}
      {/* ================================= */}

      {!loading && !error && (
        <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

          {/* TABLE HEADER */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF7900]">
                INVENTARI
              </p>

              <h2 className="mt-1 text-lg font-black">
                Lista e produkteve
              </h2>
            </div>

            <span className="rounded-lg border border-[#FF7900]/20 bg-[#FF7900]/10 px-3 py-2 text-xs font-bold text-[#FF7900]">
              {filteredProducts.length} produkte
            </span>

          </div>

          {/* SCROLLABLE TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[920px]">

              <thead className="bg-[#1B1B1B]">

                <tr className="text-left text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">

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
                    STATUSI
                  </th>

                  <th className="px-5 py-4 text-right">
                    VEPRIMET
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/[0.07]">

                {filteredProducts.map((product) => {
                  const price = getPrice(
                    product.price
                  );

                  const oldPrice = getPrice(
                    product.oldPrice ??
                      product.old_price
                  );

                  const stock = getStock(product);
                  const active =
                    product.active !== false;

                  const image = getImage(product);
                  const category = getCategory(product);

                  const discounted =
                    price !== null &&
                    oldPrice !== null &&
                    oldPrice > price;

                  const discountPercent = discounted
                    ? Math.round(
                        ((oldPrice - price) /
                          oldPrice) *
                          100
                      )
                    : 0;

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-white/[0.035]"
                    >

                      {/* PRODUCT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          <div className="flex h-[70px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#222222]">

                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              <ImageOff
                                size={23}
                                className="text-neutral-600"
                              />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[250px] text-sm font-bold leading-5 text-white">
                              {product.name}
                            </p>

                            {product.brand && (
                              <p className="mt-1 text-[11px] text-neutral-400">
                                {product.brand}
                              </p>
                            )}

                            <p className="mt-1 text-[10px] text-neutral-600">
                              ID #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-4">

                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-neutral-300">
                          {category}
                        </span>

                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-black text-white">
                          {euro(price)}
                        </p>

                        {discounted && (
                          <>
                            <p className="mt-1 text-xs text-neutral-500 line-through">
                              {euro(oldPrice)}
                            </p>

                            <span className="mt-2 inline-block rounded bg-[#FF7900]/10 px-2 py-1 text-[10px] font-bold text-[#FF7900]">
                              −{discountPercent}%
                            </span>
                          </>
                        )}

                      </td>

                      {/* STOCK */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${
                              stock === null
                                ? "bg-neutral-500"
                                : stock === 0
                                  ? "bg-red-500"
                                  : stock <= LOW_STOCK
                                    ? "bg-amber-400"
                                    : "bg-green-500"
                            }`}
                          />

                          <span className="text-sm font-bold text-white">
                            {stock === null
                              ? "—"
                              : stock}
                          </span>

                        </div>

                        {stock === 0 && (
                          <p className="mt-1 text-[10px] text-red-400">
                            Pa stok
                          </p>
                        )}

                        {stock !== null &&
                          stock > 0 &&
                          stock <= LOW_STOCK && (
                            <p className="mt-1 text-[10px] text-amber-400">
                              Stok i ulët
                            </p>
                          )}

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide ${
                            active
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                          }`}
                        >
                          {active
                            ? "AKTIV"
                            : "JO AKTIV"}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/admin/products/${encodeURIComponent(
                              product.id
                            )}/edit`}
                            title="Edito produktin"
                            aria-label={`Edito ${product.name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#222222] text-white transition-all hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-black"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(product)
                            }
                            disabled={
                              deletingId !== null
                            }
                            title="Fshi produktin"
                            aria-label={`Fshi ${product.name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === product.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF7900]/10">

                <Package
                  size={29}
                  className="text-[#FF7900]"
                />

              </div>

              <h3 className="mt-5 text-xl font-black">
                Nuk u gjet asnjë produkt
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
                {products.length === 0
                  ? "Nuk ke regjistruar ende produkte."
                  : "Ndrysho kërkimin ose filtrat dhe provo përsëri."}
              </p>

              {products.length > 0 ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-[#FF7900] px-6 py-3 text-xs font-black text-black"
                >
                  PASTRO FILTRAT
                </button>
              ) : (
                <Link
                  to="/admin/products/new"
                  className="mt-6 rounded-xl bg-[#FF7900] px-6 py-3 text-xs font-black text-black"
                >
                  SHTO PRODUKTIN E PARË
                </Link>
              )}

            </div>
          )}

          {/* TABLE FOOTER */}
          {filteredProducts.length > 0 && (
            <div className="border-t border-white/10 bg-[#111111] px-5 py-4">

              <p className="text-[11px] text-neutral-500">
                Menaxhimi i produkteve ProteinFitness
                · Të dhënat nga API
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

// ======================================
// ICON HELPER
// ======================================

function ShoppingBagIcon(props) {
  return <PackagePlus {...props} />;
}
