
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock3,
  Euro,
  ImageOff,
  Loader2,
  Package,
  RefreshCw,
  Save,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "../../services/api";

// ======================================
// PROTEINFITNESS - ADMIN ORDERS
// ======================================

const STATUS_OPTIONS = [
  { value: "pending", label: "Në pritje" },
  { value: "confirmed", label: "E konfirmuar" },
  { value: "shipped", label: "E dërguar" },
  { value: "delivered", label: "E dorëzuar" },
  { value: "cancelled", label: "E anuluar" },
];

const STATUS_COLORS = {
  pending:
    "border-amber-500/25 bg-amber-500/10 text-amber-400",
  confirmed:
    "border-sky-500/25 bg-sky-500/10 text-sky-400",
  shipped:
    "border-violet-500/25 bg-violet-500/10 text-violet-400",
  delivered:
    "border-green-500/25 bg-green-500/10 text-green-400",
  cancelled:
    "border-red-500/25 bg-red-500/10 text-red-400",
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/15 bg-[#101010] px-4 text-sm text-white outline-none transition focus:border-[#FF7900]";

// ======================================
// HELPERS
// ======================================

function labelForStatus(status) {
  return (
    STATUS_OPTIONS.find(
      (item) => item.value === status
    )?.label ||
    status ||
    "I panjohur"
  );
}

function euros(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function dateLabel(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function customerName(order) {
  return (
    [
      order.first_name ?? order.firstName,
      order.last_name ?? order.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "Pa emër"
  );
}

function getImage(item) {
  const image = item.image;

  if (typeof image === "string") {
    return image;
  }

  return image?.url || image?.secure_url || "";
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
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-5 sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7900]/10">
        <Icon
          size={21}
          className="text-[#FF7900]"
        />
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.13em] text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-neutral-500">
        {detail}
      </p>
    </div>
  );
}

// ======================================
// STATUS BADGE
// ======================================

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide ${
        STATUS_COLORS[status] ||
        "border-white/15 bg-white/5 text-neutral-400"
      }`}
    >
      {labelForStatus(status)}
    </span>
  );
}

// ======================================
// ORDERS COMPONENT
// ======================================

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [expandedId, setExpandedId] =
    useState(null);

  const [draftStatuses, setDraftStatuses] =
    useState({});

  const [savingId, setSavingId] =
    useState(null);

  // ======================================
  // LOAD ORDERS
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await getOrders();

        const list = Array.isArray(response)
          ? response
          : response?.orders;

        if (!Array.isArray(list)) {
          throw new Error(
            "API nuk ktheu listë të vlefshme porosish."
          );
        }

        if (!cancelled) {
          setOrders(list);
          setDraftStatuses({});
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Porositë nuk u ngarkuan."
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
  }, [refreshKey]);

  // ======================================
  // STATISTICS
  // ======================================

  const stats = useMemo(() => {
    const delivered = orders.filter(
      (order) =>
        order.status === "delivered"
    );

    return {
      total: orders.length,

      pending: orders.filter(
        (order) =>
          order.status === "pending"
      ).length,

      delivered: delivered.length,

      deliveredValue: delivered.reduce(
        (sum, order) =>
          sum + (Number(order.total) || 0),
        0
      ),
    };
  }, [orders]);

  // ======================================
  // SEARCH AND FILTER
  // ======================================

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLocaleLowerCase("sq");

    return orders.filter((order) => {
      if (
        statusFilter !== "all" &&
        order.status !== statusFilter
      ) {
        return false;
      }

      if (!query) return true;

      const searchable = [
        order.order_number ??
          order.orderNumber,

        order.id,

        customerName(order),

        order.phone,

        order.city,

        order.country,
      ]
        .filter(
          (value) => value != null
        )
        .join(" ")
        .toLocaleLowerCase("sq");

      return searchable.includes(query);
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // ======================================
  // SAVE ORDER STATUS
  // ======================================

  async function handleSaveStatus(order) {
    const key = String(order.id);

    const nextStatus =
      draftStatuses[key] ??
      order.status;

    if (
      savingId !== null ||
      nextStatus === order.status
    ) {
      return;
    }

    if (
      nextStatus === "cancelled" &&
      ["shipped", "delivered"].includes(
        order.status
      )
    ) {
      setError(
        "Porositë e dërguara ose të dorëzuara kërkojnë proces kthimi; nuk mund të anulohen drejtpërdrejt."
      );

      return;
    }

    if (nextStatus === "cancelled") {
      const confirmed = window.confirm(
        `A dëshiron ta anulosh porosinë ${
          order.order_number || order.id
        }?\n\nStoku i produkteve do të kthehet automatikisht.`
      );

      if (!confirmed) return;
    }

    if (order.status === "cancelled") {
      const confirmed = window.confirm(
        `A dëshiron ta riaktivizosh porosinë ${
          order.order_number || order.id
        }?\n\nServeri do të kontrollojë dhe zbresë përsëri stokun.`
      );

      if (!confirmed) return;
    }

    setSavingId(key);
    setError("");
    setNotice("");

    try {
      const response =
        await updateOrderStatus(
          order.id,
          nextStatus
        );

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Statusi nuk u ndryshua."
        );
      }

      const savedStatus =
        response?.order?.status ??
        nextStatus;

      setOrders((current) =>
        current.map((item) =>
          String(item.id) === key
            ? {
                ...item,
                status: savedStatus,
              }
            : item
        )
      );

      setDraftStatuses((current) => {
        const updated = {
          ...current,
        };

        delete updated[key];

        return updated;
      });

      setNotice(
        `Statusi i porosisë ${
          order.order_number || order.id
        } u ndryshua në "${labelForStatus(
          savedStatus
        )}".`
      );
    } catch (err) {
      setError(
        err?.message ||
          "Statusi nuk u ndryshua."
      );
    } finally {
      setSavingId(null);
    }
  }

  const displayed = loading
    ? "..."
    : error && !orders.length
      ? "—"
      : null;

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-7 lg:px-9 lg:py-10">
      <div className="mx-auto max-w-[1450px]">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>
            <div className="mb-4 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF7900]">
                PROTEINFITNESS ADMIN
              </p>

            </div>

            <h1 className="text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
              POROSITË
              <span className="text-[#FF7900]">
                .
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
              Menaxho porositë reale, informacionin
              e klientëve, statuset dhe dërgesat
              nga një vend.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => {
                setNotice("");
                setRefreshKey(
                  (key) => key + 1
                );
              }}
              disabled={
                loading ||
                savingId !== null
              }
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border border-white/15 bg-[#181818] px-5 text-xs font-black hover:border-[#FF7900] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              RIFRESKO
            </button>

            <Link
              to="/admin/products"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-[#FF7900] px-6 text-xs font-black text-black hover:bg-[#FFA33E]"
            >
              <ShoppingBag size={18} />

              PRODUKTET
            </Link>

          </div>
        </div>

        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="mt-9 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">

          <StatCard
            icon={ClipboardList}
            label="Porositë gjithsej"
            value={
              displayed ?? stats.total
            }
            detail="Nga databaza"
          />

          <StatCard
            icon={Clock3}
            label="Në pritje"
            value={
              displayed ?? stats.pending
            }
            detail="Presin konfirmim"
          />

          <StatCard
            icon={CheckCircle2}
            label="Të dorëzuara"
            value={
              displayed ?? stats.delivered
            }
            detail="Me status delivered"
          />

          <StatCard
            icon={Euro}
            label="Vlera e dorëzuar"
            value={
              displayed ??
              euros(stats.deliveredValue)
            }
            detail="Jo domosdoshmërisht pagesa të arkëtuara"
          />

        </div>

        {/* ================================= */}
        {/* ERROR AND SUCCESS MESSAGES */}
        {/* ================================= */}

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <AlertCircle
              size={19}
              className="shrink-0"
            />

            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-6 flex gap-3 rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-300"
          >
            <CheckCircle2
              size={19}
              className="shrink-0"
            />

            {notice}
          </div>
        )}

        {/* ================================= */}
        {/* FILTERS */}
        {/* ================================= */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5">

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-[#101010] px-4 focus-within:border-[#FF7900]">

              <Search
                size={18}
                className="shrink-0 text-[#FF7900]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Kërko numrin e porosisë, klientin, telefonin..."
                aria-label="Kërko porositë"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Pastro kërkimin"
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filtro statusin e porosisë"
              className={`${inputClass} sm:w-[225px]`}
            >
              <option value="all">
                Të gjitha statuset
              </option>

              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>

          </div>

          <p className="mt-4 text-xs text-neutral-400">
            Po shfaqen{" "}
            <strong className="text-white">
              {filteredOrders.length}
            </strong>{" "}
            nga{" "}
            <strong className="text-white">
              {orders.length}
            </strong>{" "}
            porosi
          </p>

        </section>

        {/* ================================= */}
        {/* ORDERS TABLE */}
        {/* ================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">

          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5 sm:px-6">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#FF7900]">
                ORDER MANAGEMENT
              </p>

              <h2 className="mt-2 text-xl font-black">
                Lista e porosive
              </h2>
            </div>

            {loading && (
              <Loader2
                size={20}
                className="animate-spin text-[#FF7900]"
              />
            )}

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="bg-[#1B1B1B] text-left text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">

                <tr>
                  <th className="px-5 py-4">
                    POROSIA
                  </th>

                  <th className="px-5 py-4">
                    KLIENTI
                  </th>

                  <th className="px-5 py-4">
                    DATA
                  </th>

                  <th className="px-5 py-4">
                    TOTALI
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

                {!loading &&
                  filteredOrders.map((order) => {
                    const key =
                      String(order.id);

                    const expanded =
                      expandedId === key;

                    const selectedStatus =
                      draftStatuses[key] ??
                      order.status;

                    const isSaving =
                      savingId === key;

                    const lineItems =
                      Array.isArray(
                        order.items
                      )
                        ? order.items
                        : [];

                    return (
                      <Fragment key={key}>

                        {/* MAIN ORDER ROW */}
                        <tr className="transition hover:bg-white/[0.035]">

                          {/* ORDER NUMBER */}
                          <td className="px-5 py-5 align-middle">

                            <p className="text-sm font-black text-[#FF7900]">
                              {order.order_number ||
                                order.orderNumber ||
                                `#${order.id}`}
                            </p>

                            <p className="mt-1 text-[11px] text-neutral-500">
                              ID #{order.id}
                            </p>

                          </td>

                          {/* CUSTOMER */}
                          <td className="px-5 py-5 align-middle">

                            <p className="text-sm font-bold">
                              {customerName(
                                order
                              )}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {order.phone ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {[
                                order.city,
                                order.country,
                              ]
                                .filter(Boolean)
                                .join(", ") ||
                                "—"}
                            </p>

                          </td>

                          {/* DATE */}
                          <td className="px-5 py-5 text-xs text-neutral-300">
                            {dateLabel(
                              order.created_at ??
                                order.createdAt
                            )}
                          </td>

                          {/* TOTAL */}
                          <td className="px-5 py-5 text-sm font-black">
                            {euros(
                              order.total
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-5">
                            <StatusBadge
                              status={
                                order.status
                              }
                            />
                          </td>

                          {/* ACTIONS */}
                          <td className="px-5 py-5 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(
                                  expanded
                                    ? null
                                    : key
                                )
                              }
                              aria-expanded={
                                expanded
                              }
                              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-black text-white hover:border-[#FF7900] hover:text-[#FF7900]"
                            >
                              DETAJET

                              {expanded ? (
                                <ChevronUp
                                  size={16}
                                />
                              ) : (
                                <ChevronDown
                                  size={16}
                                />
                              )}
                            </button>

                          </td>

                        </tr>

                        {/* EXPANDED ORDER DETAILS */}
                        {expanded && (
                          <tr className="bg-[#0F0F0F]">

                            <td
                              colSpan={6}
                              className="px-5 py-6 sm:px-7"
                            >

                              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">

                                {/* ================================= */}
                                {/* ORDERED PRODUCTS */}
                                {/* ================================= */}

                                <div>

                                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[#FF7900]">
                                    Produktet e porositura
                                  </h3>

                                  <div className="space-y-3">

                                    {lineItems.map(
                                      (item, index) => {
                                        const image =
                                          getImage(
                                            item
                                          );

                                        return (
                                          <div
                                            key={
                                              item.id ??
                                              index
                                            }
                                            className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#181818] p-3"
                                          >

                                            {/* IMAGE */}
                                            <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#262626]">

                                              {image ? (
                                                <img
                                                  src={
                                                    image
                                                  }
                                                  alt={
                                                    item.name ||
                                                    "Produkt"
                                                  }
                                                  className="h-full w-full object-contain"
                                                />
                                              ) : (
                                                <ImageOff
                                                  size={22}
                                                  className="text-neutral-600"
                                                />
                                              )}

                                            </div>

                                            {/* PRODUCT INFO */}
                                            <div className="min-w-0 flex-1">

                                              <p className="text-sm font-bold">
                                                {item.name ||
                                                  "Produkt"}
                                              </p>

                                              {item.size && (
                                                <p className="mt-1 text-xs text-neutral-400">
                                                  Pesha:{" "}
                                                  {
                                                    item.size
                                                  }
                                                </p>
                                              )}

                                              {item.color && (
                                                <p className="mt-1 text-xs text-neutral-400">
                                                  Shija:{" "}
                                                  {
                                                    item.color
                                                  }
                                                </p>
                                              )}

                                              <p className="mt-1 text-xs text-neutral-500">
                                                Sasia:{" "}
                                                {
                                                  item.quantity
                                                }
                                              </p>

                                            </div>

                                            {/* PRODUCT TOTAL */}
                                            <p className="text-sm font-black text-[#FF7900]">
                                              {euros(
                                                Number(
                                                  item.price
                                                ) *
                                                  Number(
                                                    item.quantity
                                                  )
                                              )}
                                            </p>

                                          </div>
                                        );
                                      }
                                    )}

                                    {lineItems.length ===
                                      0 && (
                                      <p className="text-sm text-neutral-500">
                                        Nuk ka detaje produktesh për këtë porosi.
                                      </p>
                                    )}

                                  </div>

                                  {/* TOTALS */}
                                  <div className="mt-4 rounded-xl border border-white/10 p-4 text-sm">

                                    <div className="flex justify-between gap-4 text-neutral-400">
                                      <span>
                                        Nëntotali
                                      </span>

                                      <span>
                                        {euros(
                                          order.subtotal
                                        )}
                                      </span>
                                    </div>

                                    <div className="mt-3 flex justify-between gap-4 text-neutral-400">
                                      <span>
                                        Dërgesa
                                      </span>

                                      <span>
                                        {euros(
                                          order.shipping
                                        )}
                                      </span>
                                    </div>

                                    <div className="mt-4 flex justify-between gap-4 border-t border-white/10 pt-4 font-black">
                                      <span>
                                        TOTALI
                                      </span>

                                      <span className="text-[#FF7900]">
                                        {euros(
                                          order.total
                                        )}
                                      </span>
                                    </div>

                                  </div>

                                </div>

                                {/* ================================= */}
                                {/* CUSTOMER AND STATUS */}
                                {/* ================================= */}

                                <div className="space-y-4">

                                  {/* CUSTOMER DETAILS */}
                                  <div className="rounded-xl border border-white/10 bg-[#181818] p-5">

                                    <h3 className="text-sm font-black uppercase tracking-wide text-[#FF7900]">
                                      Të dhënat e dërgesës
                                    </h3>

                                    <p className="mt-4 text-sm font-bold">
                                      {customerName(
                                        order
                                      )}
                                    </p>

                                    <p className="mt-2 text-sm text-neutral-400">
                                      {order.phone ||
                                        "—"}
                                    </p>

                                    <p className="mt-2 text-sm text-neutral-400">
                                      {[
                                        order.address,
                                        order.city,
                                        order.country,
                                      ]
                                        .filter(
                                          Boolean
                                        )
                                        .join(", ") ||
                                        "—"}
                                    </p>

                                    {order.note && (
                                      <div className="mt-4 border-t border-white/10 pt-4">

                                        <p className="text-[10px] font-black uppercase text-neutral-500">
                                          Shënimi
                                        </p>

                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral-300">
                                          {
                                            order.note
                                          }
                                        </p>

                                      </div>
                                    )}

                                  </div>

                                  {/* STATUS EDITOR */}
                                  <div className="rounded-xl border border-[#FF7900]/20 bg-[#181818] p-5">

                                    <h3 className="text-sm font-black uppercase tracking-wide text-[#FF7900]">
                                      Përditëso statusin
                                    </h3>

                                    <label
                                      className="mt-4 block text-xs font-bold text-neutral-400"
                                      htmlFor={`status-${key}`}
                                    >
                                      Statusi i porosisë
                                    </label>

                                    <select
                                      id={`status-${key}`}
                                      value={
                                        selectedStatus
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setDraftStatuses(
                                          (
                                            current
                                          ) => ({
                                            ...current,

                                            [key]:
                                              event
                                                .target
                                                .value,
                                          })
                                        )
                                      }
                                      disabled={
                                        savingId !==
                                        null
                                      }
                                      className={`${inputClass} mt-2`}
                                    >

                                      {STATUS_OPTIONS.map(
                                        (
                                          status
                                        ) => (
                                          <option
                                            value={
                                              status.value
                                            }
                                            key={
                                              status.value
                                            }
                                          >
                                            {
                                              status.label
                                            }
                                          </option>
                                        )
                                      )}

                                    </select>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveStatus(
                                          order
                                        )
                                      }
                                      disabled={
                                        savingId !==
                                          null ||
                                        selectedStatus ===
                                          order.status
                                      }
                                      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF7900] px-4 text-xs font-black text-black hover:bg-[#FFA33E] disabled:cursor-not-allowed disabled:opacity-40"
                                    >

                                      {isSaving ? (
                                        <Loader2
                                          size={16}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Save
                                          size={16}
                                        />
                                      )}

                                      {isSaving
                                        ? "DUKE RUAJTUR..."
                                        : "RUAJ STATUSIN"}

                                    </button>

                                    <p className="mt-3 text-[11px] leading-5 text-neutral-500">
                                      Anulimi kthen stokun.
                                      Riaktivizimi kërkon stok
                                      të disponueshëm.
                                      Porositë e dërguara ose
                                      të dorëzuara kërkojnë
                                      proces kthimi për anulim.
                                    </p>

                                  </div>

                                </div>

                              </div>

                            </td>
                          </tr>
                        )}

                      </Fragment>
                    );
                  })}

              </tbody>

            </table>
          </div>

          {/* LOADING / EMPTY STATE */}
          {loading ? (
            <div className="flex min-h-[170px] items-center justify-center gap-3 text-sm text-neutral-400">

              <Loader2
                size={19}
                className="animate-spin text-[#FF7900]"
              />

              Duke ngarkuar porositë...

            </div>
          ) : !error &&
            filteredOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <Package
                size={37}
                className="mx-auto text-[#FF7900]"
              />

              <h3 className="mt-5 text-lg font-black">
                Nuk u gjet asnjë porosi
              </h3>

              <p className="mt-3 text-sm text-neutral-400">
                {orders.length
                  ? "Ndrysho kërkimin ose filtrin e statusit."
                  : "Porositë e regjistruara në Checkout do të shfaqen këtu."}
              </p>

              {!!orders.length && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="mt-5 text-xs font-black text-[#FF7900]"
                >
                  PASTRO FILTRAT
                </button>
              )}

            </div>
          ) : null}

        </section>

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">

          <p className="text-xs text-neutral-500">
            Të dhënat merren nga API e porosive.
            Qasja kërkon hyrje si administrator.
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-black text-[#FF7900] hover:text-[#FFA33E]"
          >
            DASHBOARD

            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    </div>
  );
}
