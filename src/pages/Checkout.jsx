
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

// ======================================
// PROTEINFITNESS CHECKOUT
// ======================================

// Tarifat duhet te perputhen me
// SHIPPING ne backend/orderController.js.

const SHIPPING_FEES = {
  "Kosovë": 2.5,
  "Shqipëri": 5,
  "Maqedoni e Veriut": 5,
};

const CITIES = {
  "Kosovë": [
    "Prishtinë",
    "Prizren",
    "Pejë",
    "Gjakovë",
    "Ferizaj",
    "Gjilan",
    "Mitrovicë",
    "Skenderaj",
    "Drenas",
    "Vushtrri",
    "Podujevë",
    "Lipjan",
    "Fushë Kosovë",
    "Suharekë",
    "Rahovec",
    "Malishevë",
    "Klinë",
    "Istog",
    "Deçan",
    "Kaçanik",
    "Viti",
    "Kamenicë",
    "Dragash",
    "Shtime",
    "Obiliq",
  ],

  "Shqipëri": [
    "Tiranë",
    "Durrës",
    "Shkodër",
    "Vlorë",
    "Fier",
    "Elbasan",
    "Korçë",
    "Berat",
    "Lezhë",
    "Kukës",
    "Gjirokastër",
  ],

  "Maqedoni e Veriut": [
    "Shkup",
    "Tetovë",
    "Gostivar",
    "Kumanovë",
    "Strugë",
    "Ohër",
    "Kërçovë",
    "Dibër",
  ],
};

const WHATSAPP_NUMBER = "38343977125";

const LOGO =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1794083333/proteinfitness-logo.png_c2xpdv.png";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  country: "Kosovë",
  city: "",
  address: "",
  note: "",
};

const fieldClass =
  "h-[54px] w-full rounded-xl border border-white/15 bg-[#0B0B0B] px-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#FF7900]";

// ======================================
// HELPERS
// ======================================

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (value == null || value === "") {
    return null;
  }

  const raw = String(value).replace(/[\s€]/g, "");

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
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

function getImage(item) {
  const image =
    item.image ||
    (Array.isArray(item.images)
      ? item.images[0]
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

// ======================================
// FORM FIELD COMPONENT
// ======================================

function Field({
  label,
  name,
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-neutral-200">
        {label}{" "}
        <span className="text-[#FF7900]">*</span>
      </span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        aria-invalid={Boolean(error)}
        className={`${fieldClass} ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />

      {error && (
        <span className="mt-2 block text-xs text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

// ======================================
// SECTION HEADER
// ======================================

function SectionHeader({
  icon: Icon,
  step,
  title,
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF7900]/10">
        <Icon
          size={23}
          className="text-[#FF7900]"
        />
      </span>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#FF7900]">
          {step}
        </p>

        <h2 className="mt-1 text-xl font-black sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

// ======================================
// WHATSAPP MESSAGE
// ======================================

function buildWhatsAppMessage(order) {
  const lines = order.items.map((item, index) => {
    const extras = [
      item.size
        ? `Pesha / Paketimi: ${item.size}`
        : "",

      item.color
        ? `Shija / Varianti: ${item.color}`
        : "",
    ].filter(Boolean);

    return `${index + 1}. ${item.name}
${extras.length ? extras.join("\n") + "\n" : ""}Sasia: ${item.quantity}`;
  });

  return [
    "Përshëndetje ProteinFitness!",

    `Kam regjistruar porosinë ${order.orderNumber} në website.`,

    "",

    `Klienti: ${order.customer.firstName} ${order.customer.lastName}`,

    `Telefoni: ${order.customer.phone}`,

    `Adresa: ${order.customer.address}, ${order.customer.city}, ${order.customer.country}`,

    "",

    "PRODUKTET:",

    lines.join("\n\n"),

    "",

    `Nëntotali: ${euro(order.subtotal)}`,

    `Dërgesa: ${euro(order.shipping)}`,

    `TOTALI: ${euro(order.total)}`,

    "Pagesa: Në dorëzim",

    ...(order.customer.note
      ? ["", `Shënim: ${order.customer.note}`]
      : []),

    "",

    "Ju lutem më konfirmoni porosinë.",
  ].join("\n");
}

// ======================================
// CHECKOUT COMPONENT
// ======================================

export default function Checkout() {
  const { cart = [], clearCart } = useCart();

  const [form, setForm] = useState(INITIAL_FORM);

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [savedOrder, setSavedOrder] =
    useState(null);

  const submittingRef = useRef(false);

  const items = Array.isArray(cart) ? cart : [];

  // ======================================
  // ORDER CALCULATIONS
  // ======================================

  const subtotal = items.reduce((sum, item) => {
    return (
      sum +
      (toNumber(item.price) || 0) *
        (Number(item.quantity) || 0)
    );
  }, 0);

  const shipping = items.length
    ? SHIPPING_FEES[form.country] ?? 0
    : 0;

  const estimatedTotal = subtotal + shipping;

  const count = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0),
    0
  );

  const invalidCart = items.some((item) => {
    const id = Number(
      item.id ?? item.productId
    );

    const qty = Number(item.quantity);

    return (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      !Number.isSafeInteger(qty) ||
      qty <= 0
    );
  });

  useEffect(() => {
    document.title = "Checkout | ProteinFitness";
  }, []);

  // ======================================
  // HANDLE FORM CHANGES
  // ======================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,

      ...(name === "country"
        ? { city: "" }
        : {}),
    }));

    setErrors((current) => ({
      ...current,

      [name]: "",

      ...(name === "country"
        ? { city: "" }
        : {}),
    }));

    setServerError("");
  }

  // ======================================
  // FORM VALIDATION
  // ======================================

  function validate() {
    const next = {};

    if (!form.firstName.trim()) {
      next.firstName = "Shkruaj emrin.";
    }

    if (!form.lastName.trim()) {
      next.lastName = "Shkruaj mbiemrin.";
    }

    const phoneLength = form.phone
      .replace(/\D/g, "")
      .length;

    if (
      phoneLength < 8 ||
      phoneLength > 15
    ) {
      next.phone =
        "Shkruaj një numër telefoni të vlefshëm.";
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        SHIPPING_FEES,
        form.country
      )
    ) {
      next.country = "Zgjidh shtetin.";
    }

    if (!form.city.trim()) {
      next.city = "Shkruaj qytetin.";
    }

    if (form.address.trim().length < 5) {
      next.address =
        "Shkruaj adresën e plotë.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  // ======================================
  // REGISTER ORDER IN DATABASE
  // ======================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      submittingRef.current ||
      savedOrder
    ) {
      return;
    }

    setServerError("");

    if (!items.length || invalidCart) {
      setServerError(
        "Shporta ka produkte ose sasi të pavlefshme. Kontrollo shportën."
      );

      return;
    }

    if (!validate()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    submittingRef.current = true;

    setSubmitting(true);

    try {
      // Backend merr ID, sasi dhe variantet.
      // Çmimet dhe stoku verifikohen në Neon.

      const orderItems = items.map((item) => ({
        productId: Number(
          item.id ?? item.productId
        ),

        quantity: Number(item.quantity),

        size: item.size || null,

        color: item.color || null,
      }));

      const response = await createOrder({
        firstName: form.firstName.trim(),

        lastName: form.lastName.trim(),

        phone: form.phone.trim(),

        country: form.country,

        city: form.city.trim(),

        address: form.address.trim(),

        note: form.note.trim(),

        items: orderItems,
      });

      if (
        !response?.success ||
        !response?.order?.orderNumber
      ) {
        throw new Error(
          "Serveri nuk konfirmoi regjistrimin e porosisë."
        );
      }

      const result = response.order;

      setSavedOrder({
        orderNumber: result.orderNumber,

        status: result.status,

        subtotal: Number(result.subtotal),

        shipping: Number(result.shipping),

        total: Number(result.total),

        customer: { ...form },

        items: items.map((item) => ({
          name: item.name,

          size: item.size,

          color: item.color,

          quantity: Number(item.quantity),
        })),
      });

      // Pastro shportën vetëm kur serveri
      // konfirmon regjistrimin e porosisë.

      clearCart();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setServerError(
        error?.message ||
          "Porosia nuk u regjistrua. Provo përsëri."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      submittingRef.current = false;

      setSubmitting(false);
    }
  }

  // ======================================
  // SUCCESS - ORDER SAVED IN NEON
  // ======================================

  if (savedOrder) {
    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        buildWhatsAppMessage(savedOrder)
      )}`;

    return (
      <>
        <Header />

        <main className="min-h-[75vh] bg-[#080808] px-5 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-[720px] text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10">
              <CheckCircle2
                size={38}
                className="text-green-400"
              />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#FF7900]">
              PROTEINFITNESS
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              POROSIA U{" "}
              <span className="text-[#FF7900]">
                REGJISTRUA.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-neutral-400">
              Porosia u ruajt në sistem dhe është
              në pritje të konfirmimit nga dyqani.
              Nuk është ende e konfirmuar për dërgim.
            </p>

            {/* ORDER CONFIRMATION */}
            <div className="mt-9 overflow-hidden rounded-2xl border border-white/10 bg-[#141414] text-left">

              <div className="border-b border-white/10 p-6">
                <p className="text-xs text-neutral-500">
                  NUMRI I POROSISË
                </p>

                <p className="mt-2 break-all text-xl font-black text-[#FF7900]">
                  {savedOrder.orderNumber}
                </p>
              </div>

              <div className="flex justify-between gap-5 border-b border-white/10 px-6 py-5 text-sm">
                <span className="text-neutral-400">
                  Destinacioni
                </span>

                <strong className="text-right">
                  {savedOrder.customer.city},{" "}
                  {savedOrder.customer.country}
                </strong>
              </div>

              <div className="flex justify-between gap-5 border-b border-white/10 px-6 py-5 text-sm">
                <span className="text-neutral-400">
                  Pagesa
                </span>

                <strong>
                  Në dorëzim
                </strong>
              </div>

              <div className="flex justify-between gap-5 px-6 py-6">
                <strong>
                  TOTALI
                </strong>

                <strong className="text-2xl font-black text-[#FF7900]">
                  {euro(savedOrder.total)}
                </strong>
              </div>

            </div>

            {/* OPTIONAL WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-6 text-sm font-black text-black hover:bg-[#FFA33E]"
            >
              <FaWhatsapp size={23} />

              DËRGO NUMRIN E POROSISË NË WHATSAPP

              <ArrowRight size={18} />
            </a>

            <p className="mt-3 text-xs leading-6 text-neutral-500">
              Opsionale: porosia është regjistruar
              tashmë. WhatsApp hap vetëm një mesazh
              që duhet ta dërgosh vetë.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-neutral-300 hover:text-[#FF7900]"
            >
              KTHEHU NË DYQAN

              <ArrowRight size={17} />
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ======================================
  // EMPTY CART
  // ======================================

  if (items.length === 0) {
    return (
      <>
        <Header />

        <main className="flex min-h-[65vh] items-center justify-center bg-[#080808] px-5 text-white">
          <div className="max-w-md text-center">

            <ShoppingBag
              size={50}
              className="mx-auto text-[#FF7900]"
            />

            <h1 className="mt-6 text-3xl font-black">
              SHPORTA ËSHTË BOSH
            </h1>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Shto produktet e ProteinFitness
              në shportë për të vazhduar.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-[#FF7900] px-7 text-xs font-black text-black"
            >
              SHIKO PRODUKTET

              <ArrowRight size={17} />
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ======================================
  // CHECKOUT FORM
  // ======================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#080808] text-white">

        {/* PAGE HEADER */}
        <section className="border-b border-white/10 bg-[#101010]">
          <div className="mx-auto max-w-[1450px] px-5 py-12 sm:px-7 lg:px-10 lg:py-16">

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900]">
              PROTEINFITNESS / CHECKOUT
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">
              PËRFUNDO{" "}
              <span className="text-[#FF7900]">
                POROSINË.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
              Plotëso të dhënat dhe regjistro
              porosinë në sistem. Pagesa bëhet
              në dorëzim.
            </p>

          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto grid max-w-[1450px] gap-7 px-4 py-10 sm:px-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10 lg:py-14"
        >

          {/* ================================= */}
          {/* LEFT COLUMN */}
          {/* ================================= */}

          <div className="space-y-6">

            {/* SERVER ERROR */}
            {serverError && (
              <div
                role="alert"
                className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300"
              >
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <p>{serverError}</p>
              </div>
            )}

            {/* CUSTOMER DETAILS */}
            <section className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7">

              <SectionHeader
                icon={UserRound}
                step="01 / KLIENTI"
                title="TË DHËNAT E KLIENTIT"
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <Field
                  label="Emri"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  autoComplete="given-name"
                  placeholder="Emri"
                  maxLength={100}
                />

                <Field
                  label="Mbiemri"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  autoComplete="family-name"
                  placeholder="Mbiemri"
                  maxLength={100}
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Telefoni"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    autoComplete="tel"
                    placeholder="+383 4X XXX XXX"
                    maxLength={40}
                  />
                </div>

              </div>
            </section>

            {/* SHIPPING DETAILS */}
            <section className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7">

              <SectionHeader
                icon={MapPin}
                step="02 / DËRGESA"
                title="ADRESA E DËRGESËS"
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* COUNTRY */}
                <label className="block">
                  <span className="mb-2 block text-xs font-bold">
                    Shteti *
                  </span>

                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {Object.keys(
                      SHIPPING_FEES
                    ).map((country) => (
                      <option
                        key={country}
                        value={country}
                      >
                        {country}
                      </option>
                    ))}
                  </select>

                  {errors.country && (
                    <span className="mt-2 block text-xs text-red-400">
                      {errors.country}
                    </span>
                  )}
                </label>

                {/* CITY */}
                <label className="block">
                  <span className="mb-2 block text-xs font-bold">
                    Qyteti *
                  </span>

                  <input
                    name="city"
                    list="checkout-city-options"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Shkruaj qytetin"
                    autoComplete="address-level2"
                    maxLength={120}
                    className={`${fieldClass} ${
                      errors.city
                        ? "border-red-500"
                        : ""
                    }`}
                  />

                  <datalist id="checkout-city-options">
                    {(CITIES[form.country] || []).map(
                      (city) => (
                        <option
                          key={city}
                          value={city}
                        />
                      )
                    )}
                  </datalist>

                  {errors.city && (
                    <span className="mt-2 block text-xs text-red-400">
                      {errors.city}
                    </span>
                  )}
                </label>

                {/* ADDRESS */}
                <div className="sm:col-span-2">
                  <Field
                    label="Adresa e plotë"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    error={errors.address}
                    autoComplete="street-address"
                    placeholder="Rruga, numri, lagjja..."
                    maxLength={250}
                  />
                </div>

              </div>

              {/* SHIPPING PRICE */}
              <div className="mt-5 flex items-center justify-between rounded-xl border border-[#FF7900]/20 bg-[#FF7900]/5 p-4">

                <span className="flex items-center gap-3 text-sm text-neutral-300">
                  <Truck
                    size={20}
                    className="text-[#FF7900]"
                  />

                  Tarifa e dërgesës
                </span>

                <strong className="text-lg text-[#FF7900]">
                  {euro(shipping)}
                </strong>

              </div>

              {/* ADDITIONAL NOTE */}
              <label className="mt-6 block">
                <span className="mb-2 block text-xs font-bold">
                  Shënim shtesë (opsional)
                </span>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  placeholder="Informacione shtesë për dorëzimin..."
                  className="w-full resize-y rounded-xl border border-white/15 bg-[#0B0B0B] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#FF7900]"
                />
              </label>

            </section>

            {/* PAYMENT METHOD */}
            <section className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7">

              <SectionHeader
                icon={CreditCard}
                step="03 / PAGESA"
                title="MËNYRA E PAGESËS"
              />

              <div className="mt-6 flex items-center gap-4 rounded-xl border-2 border-[#FF7900] bg-[#FF7900]/5 p-5">

                <PackageCheck
                  size={26}
                  className="shrink-0 text-[#FF7900]"
                />

                <div>
                  <p className="text-sm font-bold">
                    Pagesë në dorëzim
                  </p>

                  <p className="mt-2 text-xs leading-6 text-neutral-400">
                    Porosia regjistrohet tani,
                    pagesa kryhet gjatë dorëzimit.
                  </p>
                </div>

              </div>

            </section>

            {/* BACK TO CART */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-[#FF7900]"
              >
                <ArrowLeft size={17} />

                KTHEHU NË SHPORTË
              </Link>

              <span className="inline-flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck
                  size={17}
                  className="text-[#FF7900]"
                />

                Çmimet dhe stoku verifikohen nga serveri.
              </span>

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT COLUMN */}
          {/* ================================= */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-[#141414] lg:sticky lg:top-24">

            {/* ORDER HEADER */}
            <div className="border-b border-white/10 bg-[#1A1A1A] px-6 py-6">

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF7900]">
                PROTEINFITNESS
              </p>

              <h2 className="mt-2 text-2xl font-black">
                POROSIA JOTE
              </h2>

              <p className="mt-2 text-xs text-neutral-500">
                {count} artikuj
              </p>

            </div>

            {/* CART ITEMS */}
            <div className="max-h-[390px] divide-y divide-white/10 overflow-y-auto px-5">

              {items.map((item, index) => {
                const image = getImage(item);

                const quantity =
                  Number(item.quantity) || 0;

                return (
                  <div
                    key={`${item.id}-${item.size || ""}-${item.color || ""}-${index}`}
                    className="flex gap-3 py-5"
                  >

                    <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#222222]">

                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag
                          size={23}
                          className="text-neutral-600"
                        />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-bold">
                        {item.name}
                      </p>

                      {item.size && (
                        <p className="mt-1 text-xs text-neutral-500">
                          Pesha: {item.size}
                        </p>
                      )}

                      {item.color && (
                        <p className="mt-1 text-xs text-neutral-500">
                          Shija: {item.color}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-neutral-500">
                        Sasia: {quantity}
                      </p>

                    </div>

                    <strong className="shrink-0 text-sm">
                      {euro(
                        (toNumber(item.price) || 0) *
                          quantity
                      )}
                    </strong>

                  </div>
                );
              })}

            </div>

            {/* ORDER TOTALS */}
            <div className="border-t border-white/10 px-6 py-6">

              <div className="flex justify-between text-sm text-neutral-400">
                <span>Nëntotali</span>

                <strong className="text-white">
                  {euro(subtotal)}
                </strong>
              </div>

              <div className="mt-4 flex justify-between text-sm text-neutral-400">
                <span>
                  Dërgesa ({form.country})
                </span>

                <strong className="text-white">
                  {euro(shipping)}
                </strong>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">

                <span className="font-black">
                  TOTALI I PARASHIKUAR
                </span>

                <strong className="text-2xl font-black text-[#FF7900]">
                  {euro(estimatedTotal)}
                </strong>

              </div>

              {/* CART ERROR */}
              {invalidCart && (
                <p
                  role="alert"
                  className="mt-4 text-xs leading-5 text-red-400"
                >
                  Ka produkte me ID ose sasi
                  të pavlefshme. Kontrollo shportën.
                </p>
              )}

              {/* SUBMIT ORDER */}
              <button
                type="submit"
                disabled={
                  submitting || invalidCart
                }
                className="mt-7 flex min-h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-5 text-xs font-black text-black transition hover:bg-[#FFA33E] disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    DUKE REGJISTRUAR...
                  </>
                ) : (
                  <>
                    REGJISTRO POROSINË

                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[11px] leading-6 text-neutral-500">
                Me klikimin e butonit, porosia
                ruhet në sistem dhe mbetet
                në pritje të konfirmimit.
                Totali përfundimtar merret nga serveri.
              </p>

            </div>

            <div className="h-[3px] bg-gradient-to-r from-[#FF7900] via-[#FFB15E] to-[#FF7900]" />

          </aside>

        </form>

        {/* FOOTER BRAND */}
        <div className="border-t border-white/10 bg-[#0D0D0D]">
          <div className="mx-auto flex max-w-[1450px] items-center gap-4 px-5 py-7 sm:px-7 lg:px-10">

            <img
              src={LOGO}
              alt="ProteinFitness"
              className="h-14 w-20 object-contain"
            />

            <div>
              <p className="text-xs font-black">
                PROTEINFITNESS
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Sports Supplements Store
              </p>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
