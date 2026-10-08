import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  useCart,
} from "../context/CartContext";

const WHATSAPP_NUMBER =
  "38343977125";

const SHIPPING_FEES = {
  Kosovë: 2.5,
  Shqipëri: 5,
  "Maqedoni e Veriut": 5,
};

const CITIES = {
  Kosovë: [
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

  Shqipëri: [
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

export default function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
      country: "Kosovë",
      city: "",
      address: "",
      note: "",
    });

  const [errors, setErrors] =
    useState({});

  const [
    completedOrder,
    setCompletedOrder,
  ] = useState(null);

  const shipping =
    cart.length > 0
      ? SHIPPING_FEES[
          form.country
        ] || 0
      : 0;

  const total =
    cartTotal + shipping;

  const currentCities =
    CITIES[form.country] || [];

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,

      ...(name === "country"
        ? {
            city: "",
          }
        : {}),
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",

      ...(name === "country"
        ? {
            city: "",
          }
        : {}),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !form.firstName.trim()
    ) {
      newErrors.firstName =
        "Shkruaj emrin.";
    }

    if (
      !form.lastName.trim()
    ) {
      newErrors.lastName =
        "Shkruaj mbiemrin.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Shkruaj numrin e telefonit.";
    }

    if (!form.country) {
      newErrors.country =
        "Zgjidh shtetin.";
    }

    if (!form.city) {
      newErrors.city =
        "Zgjidh qytetin.";
    }

    if (
      !form.address.trim()
    ) {
      newErrors.address =
        "Shkruaj adresën.";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  const saveOrderLocally = (
    order
  ) => {
    try {
      const saved =
        localStorage.getItem(
          "apar-orders"
        );

      const existing =
        saved
          ? JSON.parse(saved)
          : [];

      const orders =
        Array.isArray(existing)
          ? existing
          : [];

      localStorage.setItem(
        "apar-orders",
        JSON.stringify([
          order,
          ...orders,
        ])
      );
    } catch {
      localStorage.setItem(
        "apar-orders",
        JSON.stringify([
          order,
        ])
      );
    }
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const orderNumber =
      `APAR-${Date.now()
        .toString()
        .slice(-7)}`;

    const order = {
      id: orderNumber,

      customer: {
        ...form,
      },

      products: cart,

      subtotal: cartTotal,

      shipping,

      total,

      currency: "EUR",

      paymentMethod:
        "Pagesë në dorëzim",

      status: "E re",

      createdAt:
        new Date().toISOString(),
    };

    saveOrderLocally(order);

    setCompletedOrder(
      order
    );

    clearCart();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getWhatsAppMessage = (
    order
  ) => {
    const productText =
      order.products
        .map(
          (
            item,
            index
          ) => {
            const size =
              item.size
                ? `\nMadhësia: ${item.size}`
                : "";

            const color =
              item.color
                ? `\nNgjyra: ${item.color}`
                : "";

            return `${index + 1}. ${item.name}${size}${color}
Sasia: ${item.quantity}
Çmimi: ${(
              item.price *
              item.quantity
            ).toFixed(
              2
            )} €`;
          }
        )
        .join("\n\n");

    return `Përshëndetje APAR 👋

Dua të konfirmoj porosinë:

POROSIA: ${order.id}

KLIENTI
${order.customer.firstName} ${order.customer.lastName}
Tel: ${order.customer.phone}

DËRGESA
${order.customer.country}
${order.customer.city}
${order.customer.address}

PRODUKTET

${productText}

Nëntotali: ${order.subtotal.toFixed(
      2
    )} €
Dërgesa: ${order.shipping.toFixed(
      2
    )} €
TOTALI: ${order.total.toFixed(
      2
    )} €

Pagesa: Pagesë në dorëzim

${
  order.customer.note
    ? `Shënim: ${order.customer.note}`
    : ""
}`;
  };

  const openWhatsApp = () => {
    if (!completedOrder) {
      return;
    }

    const message =
      getWhatsAppMessage(
        completedOrder
      );

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
    ========================================
    ORDER SUCCESS
    ========================================
  */

  if (completedOrder) {
    return (
      <>
        <Header />

        <main className="min-h-[720px] bg-[#f6f6f4]">

          <section className="border-b border-neutral-200 bg-white">

            <div className="mx-auto max-w-[900px] px-5 py-20 text-center sm:px-6 sm:py-24">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">

                <CheckCircle2
                  size={36}
                  strokeWidth={1.5}
                />

              </div>

              <div className="mt-7 flex items-center justify-center">

                <span className="h-[2px] w-7 bg-[#009246]" />

                <span className="h-[2px] w-7 bg-neutral-300" />

                <span className="h-[2px] w-7 bg-[#CE2B37]" />

              </div>

              <p className="mt-7 text-[9px] font-black tracking-[0.4em] text-neutral-400">
                APAR ORDER CONFIRMED
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-6xl">
                Faleminderit për
                porosinë.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
                Porosia është
                regjistruar. Tani mund
                ta dërgosh edhe në
                WhatsApp për konfirmim
                me APAR.
              </p>

            </div>

          </section>

          <section className="mx-auto max-w-[760px] px-5 py-10 sm:px-6">

            <div className="border border-neutral-200 bg-white p-6 sm:p-8">

              <div className="flex items-center justify-between border-b border-neutral-200 pb-5">

                <span className="text-xs font-semibold text-neutral-500">
                  Numri i porosisë
                </span>

                <span className="text-sm font-black">
                  {
                    completedOrder.id
                  }
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-neutral-200 py-5">

                <span className="text-xs font-semibold text-neutral-500">
                  Destinacioni
                </span>

                <span className="text-right text-sm font-bold">
                  {
                    completedOrder
                      .customer
                      .country
                  }
                  {" · "}
                  {
                    completedOrder
                      .customer.city
                  }
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-neutral-200 py-5">

                <span className="text-xs font-semibold text-neutral-500">
                  Pagesa
                </span>

                <span className="text-sm font-bold">
                  Pagesë në dorëzim
                </span>

              </div>

              <div className="flex items-end justify-between pt-6">

                <span className="text-sm font-bold">
                  TOTALI
                </span>

                <span className="text-3xl font-black tracking-[-0.04em]">
                  {completedOrder.total.toFixed(
                    2
                  )}{" "}
                  €
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={
                openWhatsApp
              }
              className="mt-4 flex min-h-[60px] w-full items-center justify-center gap-3 bg-black px-6 text-sm font-black tracking-[0.08em] text-white transition hover:bg-neutral-800"
            >
              <FaWhatsapp
                size={20}
              />

              DËRGO POROSINË NË
              WHATSAPP
            </button>

            <Link
              to="/shop"
              className="mt-3 flex min-h-[54px] w-full items-center justify-center border border-neutral-300 bg-white text-xs font-black tracking-[0.12em] text-black transition hover:border-black"
            >
              VAZHDO SHOPPING
            </Link>

          </section>

        </main>

        <Footer />
      </>
    );
  }

  /*
    ========================================
    EMPTY CART
    ========================================
  */

  if (cart.length === 0) {
    return (
      <>
        <Header />

        <main className="flex min-h-[650px] items-center justify-center bg-[#f6f6f4] px-5">

          <div className="max-w-lg text-center">

            <p className="text-[9px] font-black tracking-[0.4em] text-neutral-400">
              APAR CHECKOUT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">
              Shporta është bosh.
            </h1>

            <p className="mt-4 text-sm leading-7 text-neutral-500">
              Shto produkte në
              shportë para se të
              vazhdosh me porosinë.
            </p>

            <Link
              to="/shop"
              style={{
                color:
                  "#ffffff",
              }}
              className="mt-8 inline-flex bg-black px-9 py-4 text-sm font-black tracking-[0.08em] text-white"
            >
              SHKO NË SHOP
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="bg-[#f5f5f3]">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <section className="relative overflow-hidden bg-[#050505] text-white">

          <div className="absolute inset-0">

            <div className="absolute -left-40 top-0 h-[300px] w-[300px] rounded-full bg-[#009246]/[0.04] blur-[120px]" />

            <div className="absolute -right-40 top-0 h-[300px] w-[300px] rounded-full bg-[#CE2B37]/[0.04] blur-[120px]" />

          </div>

          <div className="relative mx-auto max-w-[1500px] px-5 py-12 sm:px-6 lg:px-10 lg:py-16">

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition hover:text-white"
            >
              <ArrowLeft
                size={15}
              />

              KTHEHU NË SHPORTË
            </Link>

            <p className="mt-8 text-[9px] font-black tracking-[0.4em] text-neutral-500">
              APAR / SECURE
              CHECKOUT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              PËRFUNDO
              POROSINË.
            </h1>

            <div className="mt-6 flex">

              <span className="h-[2px] w-10 bg-[#009246]" />

              <span className="h-[2px] w-10 bg-white/70" />

              <span className="h-[2px] w-10 bg-[#CE2B37]" />

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="mx-auto grid max-w-[1500px] gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-10 lg:py-14"
        >

          {/* =============================== */}
          {/* LEFT */}
          {/* =============================== */}

          <div className="space-y-6">

            {/* CUSTOMER */}
            <section className="border border-neutral-200 bg-white p-6 sm:p-8 lg:p-10">

              <div className="border-b border-neutral-100 pb-6">

                <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
                  01 / CUSTOMER
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  Të dhënat e
                  porosisë
                </h2>

              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {/* FIRST NAME */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Emri *
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={
                      form.firstName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Emri"
                    className={`w-full border bg-white px-4 py-4 text-sm outline-none transition ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-neutral-300 focus:border-black"
                    }`}
                  />

                  {errors.firstName && (
                    <p className="mt-2 text-xs text-red-600">
                      {
                        errors.firstName
                      }
                    </p>
                  )}

                </div>

                {/* LAST NAME */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Mbiemri *
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={
                      form.lastName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Mbiemri"
                    className={`w-full border bg-white px-4 py-4 text-sm outline-none transition ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-neutral-300 focus:border-black"
                    }`}
                  />

                  {errors.lastName && (
                    <p className="mt-2 text-xs text-red-600">
                      {
                        errors.lastName
                      }
                    </p>
                  )}

                </div>

                {/* PHONE */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Telefoni *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+383 / +355 / +389"
                    className={`w-full border bg-white px-4 py-4 text-sm outline-none transition ${
                      errors.phone
                        ? "border-red-500"
                        : "border-neutral-300 focus:border-black"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-600">
                      {
                        errors.phone
                      }
                    </p>
                  )}

                </div>

                {/* COUNTRY */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Shteti *
                  </label>

                  <select
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                    className={`w-full border bg-white px-4 py-4 text-sm outline-none ${
                      errors.country
                        ? "border-red-500"
                        : "border-neutral-300 focus:border-black"
                    }`}
                  >
                    {Object.keys(
                      SHIPPING_FEES
                    ).map(
                      (
                        country
                      ) => (
                        <option
                          key={
                            country
                          }
                          value={
                            country
                          }
                        >
                          {
                            country
                          }
                        </option>
                      )
                    )}
                  </select>

                </div>

                {/* CITY */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Qyteti *
                  </label>

                  <select
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    className={`w-full border bg-white px-4 py-4 text-sm outline-none ${
                      errors.city
                        ? "border-red-500"
                        : "border-neutral-300 focus:border-black"
                    }`}
                  >
                    <option value="">
                      Zgjidh qytetin
                    </option>

                    {currentCities.map(
                      (
                        city
                      ) => (
                        <option
                          key={
                            city
                          }
                          value={
                            city
                          }
                        >
                          {
                            city
                          }
                        </option>
                      )
                    )}
                  </select>

                  {errors.city && (
                    <p className="mt-2 text-xs text-red-600">
                      {
                        errors.city
                      }
                    </p>
                  )}

                </div>

                {/* SHIPPING PREVIEW */}
                <div>

                  <label className="mb-2 block text-xs font-bold">
                    Tarifa e dërgesës
                  </label>

                  <div className="flex min-h-[52px] items-center justify-between border border-neutral-200 bg-[#f7f7f5] px-4">

                    <span className="text-xs text-neutral-500">
                      {
                        form.country
                      }
                    </span>

                    <span className="text-sm font-black">
                      {shipping.toFixed(
                        2
                      )}{" "}
                      €
                    </span>

                  </div>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="mt-5">

                <label className="mb-2 block text-xs font-bold">
                  Adresa e plotë *
                </label>

                <input
                  type="text"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Rruga, numri, lagjja..."
                  className={`w-full border bg-white px-4 py-4 text-sm outline-none transition ${
                    errors.address
                      ? "border-red-500"
                      : "border-neutral-300 focus:border-black"
                  }`}
                />

                {errors.address && (
                  <p className="mt-2 text-xs text-red-600">
                    {
                      errors.address
                    }
                  </p>
                )}

              </div>

              {/* NOTE */}
              <div className="mt-5">

                <label className="mb-2 block text-xs font-bold">
                  Shënim
                </label>

                <textarea
                  name="note"
                  value={
                    form.note
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Informacione shtesë për porosinë..."
                  rows={4}
                  className="w-full resize-none border border-neutral-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                />

              </div>

            </section>

            {/* PAYMENT */}
            <section className="border border-neutral-200 bg-white p-6 sm:p-8">

              <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
                02 / PAYMENT
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                Pagesa
              </h2>

              <div className="mt-6 flex items-center gap-4 border-2 border-black p-5">

                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-black text-white">

                  <PackageCheck
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-sm font-bold">
                    Pagesë në
                    dorëzim
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Paguaj kur të
                    pranosh porosinë.
                  </p>

                </div>

                <div className="ml-auto h-4 w-4 rounded-full border-[4px] border-black" />

              </div>

            </section>

            {/* TRUST */}
            <div className="grid gap-3 sm:grid-cols-3">

              <div className="border border-neutral-200 bg-white p-5">

                <Truck
                  size={20}
                />

                <p className="mt-4 text-xs font-bold">
                  3 SHTETE
                </p>

                <p className="mt-1 text-[10px] leading-5 text-neutral-500">
                  Kosovë, Shqipëri,
                  Maqedoni e Veriut
                </p>

              </div>

              <div className="border border-neutral-200 bg-white p-5">

                <ShieldCheck
                  size={20}
                />

                <p className="mt-4 text-xs font-bold">
                  SECURE ORDER
                </p>

                <p className="mt-1 text-[10px] leading-5 text-neutral-500">
                  Të dhënat përdoren
                  për porosinë.
                </p>

              </div>

              <div className="border border-neutral-200 bg-white p-5">

                <MapPin
                  size={20}
                />

                <p className="mt-4 text-xs font-bold">
                  DELIVERY
                </p>

                <p className="mt-1 text-[10px] leading-5 text-neutral-500">
                  Dërgesë direkt në
                  adresën tënde.
                </p>

              </div>

            </div>

          </div>

          {/* =============================== */}
          {/* ORDER SUMMARY */}
          {/* =============================== */}

          <aside className="h-fit border border-neutral-200 bg-white p-6 lg:sticky lg:top-24 lg:p-7">

            <div className="flex items-end justify-between border-b border-neutral-200 pb-5">

              <div>

                <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
                  APAR ORDER
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  Porosia juaj
                </h2>

              </div>

              <span className="text-xs font-bold text-neutral-400">
                {cart.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    item.quantity,
                  0
                )}
                {" "}
                PCS
              </span>

            </div>

            {/* PRODUCTS */}
            <div className="divide-y divide-neutral-100">

              {cart.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={`${item.id}-${item.size || "no-size"}-${item.color || "no-color"}-${index}`}
                    className="flex gap-4 py-5"
                  >

                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-neutral-100">

                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center bg-black px-1 text-[9px] font-black text-white">
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-black leading-5">
                        {
                          item.name
                        }
                      </p>

                      <div className="mt-2 space-y-1 text-[10px] text-neutral-500">

                        {item.size && (
                          <p>
                            SIZE:{" "}
                            <span className="font-bold text-black">
                              {
                                item.size
                              }
                            </span>
                          </p>
                        )}

                        {item.color && (
                          <p>
                            COLOR:{" "}
                            <span className="font-bold text-black">
                              {
                                item.color
                              }
                            </span>
                          </p>
                        )}

                      </div>

                    </div>

                    <p className="whitespace-nowrap text-xs font-black">
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(
                        2
                      )}{" "}
                      €
                    </p>

                  </div>
                )
              )}

            </div>

            {/* TOTALS */}
            <div className="border-t border-neutral-200 pt-5">

              <div className="flex items-center justify-between text-xs">

                <span className="text-neutral-500">
                  Nëntotali
                </span>

                <span className="font-bold">
                  {cartTotal.toFixed(
                    2
                  )}{" "}
                  €
                </span>

              </div>

              <div className="mt-4 flex items-center justify-between text-xs">

                <span className="text-neutral-500">
                  Dërgesa
                </span>

                <div className="text-right">

                  <span className="font-bold">
                    {shipping.toFixed(
                      2
                    )}{" "}
                    €
                  </span>

                  <p className="mt-1 text-[9px] text-neutral-400">
                    {
                      form.country
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* TOTAL */}
            <div className="mt-6 flex items-end justify-between border-t border-neutral-200 pt-6">

              <div>

                <span className="text-sm font-black">
                  TOTALI
                </span>

                <p className="mt-1 text-[9px] text-neutral-400">
                  EUR · VAT / DELIVERY
                </p>

              </div>

              <span className="text-3xl font-black tracking-[-0.04em]">
                {total.toFixed(
                  2
                )}{" "}
                €
              </span>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="group mt-7 flex min-h-[60px] w-full items-center justify-between bg-black px-6 text-sm font-black tracking-[0.08em] text-white transition hover:bg-neutral-800"
            >
              <span>
                KONFIRMO POROSINË
              </span>

              <ArrowLeft
                size={17}
                className="rotate-180 transition group-hover:translate-x-1"
              />
            </button>

            <p className="mt-4 text-center text-[10px] leading-5 text-neutral-400">
              Nuk kërkohet account.
              Pagesa bëhet në
              dorëzim.
            </p>

          </aside>

        </form>

      </main>

      <Footer />
    </>
  );
}