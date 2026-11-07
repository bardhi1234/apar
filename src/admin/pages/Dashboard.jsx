
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Euro,
  ImageOff,
  Layers3,
  Loader2,
  PackagePlus,
  PackageX,
  Pencil,
  RefreshCw,
  ShoppingBag,
  Tags,
} from "lucide-react";

import {
  getProducts,
  getAdminCategories,
} from "../../services/api";

// ======================================
// PROTEINFITNESS DASHBOARD
// ======================================

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

const LOW_STOCK_LIMIT = 5;

// ======================================
// HELPERS
// ======================================

function getStock(product) {
  const value = product?.stock;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const stock = Number(value);

  return Number.isFinite(stock)
    ? Math.max(0, Math.floor(stock))
    : null;
}

function isActive(product) {
  return ![
    false,
    0,
    "false",
    "0",
  ].includes(product.active);
}

function getImage(product) {
  const image =
    product.image ||
    (Array.isArray(product.images)
      ? product.images[0]
      : null);

  if (typeof image === "string") {
    return image;
  }

  return (
    image?.secure_url ||
    image?.url ||
    image?.image_url ||
    ""
  );
}

function getCategory(product) {
  return typeof product.category === "string"
    ? product.category
    : product.category?.name || "Pa kategori";
}

function euro(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const amount = Number(
    String(value).replace(",", ".")
  );

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// ======================================
// STATISTIC CARD
// ======================================

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#151515] p-5 transition-all duration-300 hover:border-[#FF7900]/40 sm:p-6">

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7900]/10">
          <Icon
            size={23}
            className="text-[#FF7900]"
          />
        </div>

        <span className="h-2 w-2 rounded-full bg-[#FF7900]/70" />

      </div>

      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
        {value}
      </h3>

      <p className="mt-2 text-xs leading-5 text-neutral-500">
        {detail}
      </p>

    </div>
  );
}

// ======================================
// QUICK ACTION
// ======================================

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#151515] p-4 transition-colors hover:border-[#FF7900]/40 hover:bg-[#1C1C1C]"
    >

      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF7900]/10">
        <Icon
          size={21}
          className="text-[#FF7900]"
        />
      </span>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-black text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          {description}
        </p>

      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-neutral-500 transition-all group-hover:translate-x-1 group-hover:text-[#FF7900]"
      />

    </Link>
  );
}

// ======================================
// DASHBOARD COMPONENT
// ======================================

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productsLoaded, setProductsLoaded] =
    useState(false);

  const [categoriesLoaded, setCategoriesLoaded] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // ======================================
  // LOAD REAL DATA
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getProducts(),
        getAdminCategories(),
      ]);

      if (cancelled) return;

      const errors = [];

      const productsResult = results[0];

      if (productsResult.status === "fulfilled") {
        const response = productsResult.value;

        const list = Array.isArray(response)
          ? response
          : response?.products;

        if (Array.isArray(list)) {
          setProducts(list);
          setProductsLoaded(true);
        } else {
          setProductsLoaded(false);
          errors.push(
            "API nuk ktheu listë të vlefshme produktesh."
          );
        }
      } else {
        setProductsLoaded(false);

        errors.push(
          productsResult.reason?.message ||
            "Produktet nuk u ngarkuan."
        );
      }

      const categoriesResult = results[1];

      if (categoriesResult.status === "fulfilled") {
        const response = categoriesResult.value;

        const list = Array.isArray(response)
          ? response
          : response?.categories;

        if (Array.isArray(list)) {
          setCategories(list);
          setCategoriesLoaded(true);
        } else {
          setCategoriesLoaded(false);
          errors.push(
            "API nuk ktheu listë të vlefshme kategorish."
          );
        }
      } else {
        setCategoriesLoaded(false);

        errors.push(
          categoriesResult.reason?.message ||
            "Kategoritë nuk u ngarkuan."
        );
      }

      setError(errors.join(" "));
      setLoading(false);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // ======================================
  // STATISTICS
  // ======================================

  const stats = useMemo(() => {
    const active = products.filter(isActive).length;

    const lowStock = products.filter((product) => {
      const stock = getStock(product);

      return (
        stock !== null &&
        stock > 0 &&
        stock <= LOW_STOCK_LIMIT
      );
    }).length;

    const outOfStock = products.filter(
      (product) => getStock(product) === 0
    ).length;

    return {
      total: products.length,
      active,
      lowStock,
      outOfStock,
      categories: categories.length,
    };
  }, [products, categories]);

  // ======================================
  // LOW STOCK PRODUCTS
  // ======================================

  const stockAlerts = useMemo(() => {
    return products
      .filter((product) => {
        const stock = getStock(product);

        return (
          stock !== null &&
          stock <= LOW_STOCK_LIMIT
        );
      })
      .sort(
        (a, b) =>
          getStock(a) - getStock(b)
      )
      .slice(0, 5);
  }, [products]);

  // ======================================
  // RECENT PRODUCTS
  // ======================================

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const aDate = Date.parse(
          a.createdAt || a.created_at || ""
        );

        const bDate = Date.parse(
          b.createdAt || b.created_at || ""
        );

        if (
          Number.isFinite(aDate) &&
          Number.isFinite(bDate)
        ) {
          return bDate - aDate;
        }

        const aId = Number(a.id);
        const bId = Number(b.id);

        if (
          Number.isFinite(aId) &&
          Number.isFinite(bId)
        ) {
          return bId - aId;
        }

        return 0;
      })
      .slice(0, 5);
  }, [products]);

  const display = (loaded, number) =>
    loading ? "..." : loaded ? number : "—";

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-7 lg:px-9 lg:py-10">

      <div className="mx-auto max-w-[1450px]">

        {/* ================================= */}
        {/* DASHBOARD HEADER */}
        {/* ================================= */}

        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">

          <div>

            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900]">
                PROTEINFITNESS ADMIN
              </p>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              DASHBOARD
              <span className="text-[#FF7900]">.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
              Menaxho produktet, kategoritë,
              inventarin dhe aktivitetin e
              dyqanit ProteinFitness nga një vend.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setReloadKey((key) => key + 1)
              }
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border border-white/15 bg-[#181818] px-5 text-xs font-black text-white transition hover:border-[#FF7900] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              RIFRESKO
            </button>

            <Link
              to="/admin/products/new"
              className="inline-flex min-h-[52px] items-center gap-3 rounded-xl bg-[#FF7900] px-6 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#FFA33E]"
            >
              <PackagePlus size={18} />

              SHTO PRODUKT
            </Link>

          </div>
        </div>

        {/* ================================= */}
        {/* BRAND BANNER */}
        {/* ================================= */}

        <section className="relative mt-9 overflow-hidden rounded-2xl border border-[#FF7900]/20 bg-gradient-to-r from-[#1D130B] via-[#171717] to-[#101010]">

          <div className="pointer-events-none absolute -right-20 -top-24 h-[320px] w-[320px] rounded-full bg-[#FF7900]/10 blur-[95px]" />

          <div className="relative flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900]">
                STORE MANAGEMENT
              </p>

              <h2 className="mt-3 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                PANELI I ADMINISTRIMIT
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400">
                Kontrollo inventarin dhe përditëso
                produktet që shfaqen në dyqan.
              </p>

            </div>

            <img
              src={LOGO}
              alt="ProteinFitness"
              className="h-20 w-24 shrink-0 object-contain sm:h-24 sm:w-32"
            />

          </div>

          <div className="h-[2px] bg-gradient-to-r from-[#FF7900] via-[#FFB15E] to-transparent" />

        </section>

        {/* ================================= */}
        {/* API ERROR */}
        {/* ================================= */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 p-5 text-sm leading-6 text-red-300"
          >
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <section className="mt-9">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-black uppercase">
              PASQYRA E DYQANIT
            </h2>

            {loading && (
              <Loader2
                size={19}
                className="animate-spin text-[#FF7900]"
              />
            )}

          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">

            <StatCard
              icon={Boxes}
              label="Produktet"
              value={display(
                productsLoaded,
                stats.total
              )}
              detail="Produkte të ngarkuara nga API"
            />

            <StatCard
              icon={CheckCircle2}
              label="Produkte aktive"
              value={display(
                productsLoaded,
                stats.active
              )}
              detail="Të aktivizuara në sistem"
            />

            <StatCard
              icon={AlertTriangle}
              label="Stok i ulët"
              value={display(
                productsLoaded,
                stats.lowStock
              )}
              detail={`Nga 1 deri ${LOW_STOCK_LIMIT} copë`}
            />

            <StatCard
              icon={PackageX}
              label="Jashtë stokut"
              value={display(
                productsLoaded,
                stats.outOfStock
              )}
              detail="Produkte me stok 0"
            />

          </div>

        </section>

        {/* ================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================= */}

        <section className="mt-9">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

            <h2 className="text-xl font-black uppercase">
              VEPRIME TË SHPEJTA
            </h2>

            <p className="text-xs text-neutral-500">
              Menaxhimi i përditshëm
            </p>

          </div>

          <div className="grid gap-3 md:grid-cols-2">

            <QuickAction
              to="/admin/products/new"
              icon={PackagePlus}
              title="Shto produkt të ri"
              description="Regjistro një proteinë ose suplement."
            />

            <QuickAction
              to="/admin/products"
              icon={Boxes}
              title="Menaxho produktet"
              description="Ndrysho çmimet, stokun dhe fotografitë."
            />

            <QuickAction
              to="/admin/categories"
              icon={Tags}
              title="Menaxho kategoritë"
              description="Shto dhe organizo kategoritë."
            />

            <QuickAction
              to="/admin/orders"
              icon={ClipboardList}
              title="Porositë"
              description="Hap faqen e porosive në Admin."
            />

          </div>
        </section>

        {/* ================================= */}
        {/* INVENTORY + CATEGORIES */}
        {/* ================================= */}

        <section className="mt-9 grid gap-6 lg:grid-cols-2">

          {/* LOW STOCK ALERTS */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  size={21}
                  className="text-[#FF7900]"
                />

                <h2 className="text-base font-black">
                  GJENDJA E STOKUT
                </h2>

              </div>

              <Link
                to="/admin/products"
                className="text-xs font-bold text-[#FF7900] hover:text-[#FFB15E]"
              >
                SHIKO
              </Link>

            </div>

            <div className="p-5">

              {loading ? (
                <p className="text-sm text-neutral-500">
                  Duke ngarkuar...
                </p>
              ) : !productsLoaded ? (
                <p className="text-sm text-neutral-500">
                  Të dhënat nuk janë të disponueshme.
                </p>
              ) : stockAlerts.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl bg-[#0D0D0D] p-5">

                  <CheckCircle2
                    size={21}
                    className="text-green-400"
                  />

                  <p className="text-sm text-neutral-400">
                    Nuk ka produkte me stok të ulët
                    ose zero në listën e ngarkuar.
                  </p>

                </div>
              ) : (
                <div className="space-y-3">

                  {stockAlerts.map((product) => {
                    const stock = getStock(product);

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#0D0D0D] p-4"
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {getCategory(product)}
                          </p>

                        </div>

                        <div className="flex shrink-0 items-center gap-3">

                          <span
                            className={`text-xs font-black ${
                              stock === 0
                                ? "text-red-400"
                                : "text-amber-400"
                            }`}
                          >
                            {stock} copë
                          </span>

                          <Link
                            to={`/admin/products/${encodeURIComponent(
                              product.id
                            )}/edit`}
                            title="Edito stokun"
                            aria-label={`Edito ${product.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white hover:border-[#FF7900] hover:text-[#FF7900]"
                          >
                            <Pencil size={15} />
                          </Link>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          </div>

          {/* CATEGORY SUMMARY */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">

              <div className="flex items-center gap-3">

                <Layers3
                  size={21}
                  className="text-[#FF7900]"
                />

                <h2 className="text-base font-black">
                  KATEGORITË
                </h2>

              </div>

              <Link
                to="/admin/categories"
                className="text-xs font-bold text-[#FF7900] hover:text-[#FFB15E]"
              >
                MENAXHO
              </Link>

            </div>

            <div className="p-5">

              <div className="flex items-center justify-between gap-4 rounded-xl border border-[#FF7900]/20 bg-[#FF7900]/[0.06] p-5">

                <div>
                  <p className="text-xs text-neutral-400">
                    Kategoritë e regjistruara
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#FF7900]">
                    {display(
                      categoriesLoaded,
                      stats.categories
                    )}
                  </p>
                </div>

                <Tags
                  size={30}
                  className="text-[#FF7900]"
                />

              </div>

              <p className="mt-5 text-xs leading-6 text-neutral-500">
                Kategoritë menaxhohen nga Admin.
                Ndryshimet në dyqan varen nga
                konfigurimi i API-së dhe komponentëve.
              </p>

              <Link
                to="/admin/categories"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#FF7900] hover:text-[#FFB15E]"
              >
                HAP KATEGORITË

                <ArrowRight size={16} />
              </Link>

            </div>
          </div>

        </section>

        {/* ================================= */}
        {/* RECENT PRODUCTS */}
        {/* ================================= */}

        <section className="mt-9 overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-6">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#FF7900]">
                INVENTARI
              </p>

              <h2 className="mt-2 text-lg font-black">
                PRODUKTET E FUNDIT
              </h2>
            </div>

            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7900] hover:text-[#FFB15E]"
            >
              TË GJITHA

              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="divide-y divide-white/10">

            {loading ? (
              <div className="flex items-center gap-3 p-6 text-sm text-neutral-400">
                <Loader2
                  size={18}
                  className="animate-spin text-[#FF7900]"
                />

                Duke ngarkuar produktet...
              </div>
            ) : !productsLoaded ? (
              <p className="p-6 text-sm text-neutral-500">
                Produktet nuk janë të disponueshme.
              </p>
            ) : recentProducts.length === 0 ? (
              <p className="p-6 text-sm text-neutral-500">
                Nuk ka produkte të regjistruara.
              </p>
            ) : (
              recentProducts.map((product) => {
                const image = getImage(product);

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 px-4 py-4 transition hover:bg-white/[0.03] sm:px-6"
                  >

                    <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#222222]">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <ImageOff
                          size={22}
                          className="text-neutral-600"
                        />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {getCategory(product)}
                      </p>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-sm font-black text-[#FF7900]">
                        {euro(product.price)}
                      </p>

                      <p className="mt-1 text-[11px] text-neutral-500">
                        Stoku: {getStock(product) ?? "—"}
                      </p>

                    </div>

                    <Link
                      to={`/admin/products/${encodeURIComponent(
                        product.id
                      )}/edit`}
                      title="Edito produktin"
                      aria-label={`Edito ${product.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-[#FF7900] hover:text-[#FF7900]"
                    >
                      <Pencil size={15} />
                    </Link>

                  </div>
                );
              })
            )}

          </div>

        </section>

        {/* ================================= */}
        {/* ORDERS AND SALES */}
        {/* ================================= */}

        <section className="mt-9">

          <h2 className="mb-5 text-xl font-black uppercase">
            POROSITË DHE SHITJET
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7900]/10">
                <ClipboardList
                  size={23}
                  className="text-[#FF7900]"
                />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                POROSITË
              </p>

              <p className="mt-2 text-4xl font-black">
                —
              </p>

              <p className="mt-3 text-xs leading-6 text-neutral-500">
                Statistikat e porosive nuk janë
                lidhur ende me një burim të dhënash.
              </p>

              <Link
                to="/admin/orders"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#FF7900]"
              >
                HAP POROSITË
                <ArrowRight size={16} />
              </Link>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7900]/10">
                <Euro
                  size={23}
                  className="text-[#FF7900]"
                />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                SHITJET
              </p>

              <p className="mt-2 text-4xl font-black">
                —
              </p>

              <p className="mt-3 text-xs leading-6 text-neutral-500">
                Shuma e shitjeve do të shfaqet
                pasi të lidhen porositë e konfirmuara
                me backend-in.
              </p>

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* DASHBOARD FOOTER */}
        {/* ================================= */}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6">

          <div className="flex items-center gap-3">

            <ShoppingBag
              size={17}
              className="text-[#FF7900]"
            />

            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
              PROTEINFITNESS ADMIN PANEL
            </p>

          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7900] hover:text-[#FFB15E]"
          >
            SHIKO DYQANIN

            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    </div>
  );
}
