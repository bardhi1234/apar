
import { useEffect } from "react";

import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import Features from "../components/Features";
import Footer from "../components/Footer";

// ======================================
// PROTEINFITNESS - TRAINER CONSULTATION
// ======================================

const WHATSAPP_NUMBER = "38343977125";

const WHATSAPP_MESSAGE =
  "Përshëndetje ProteinFitness! Dua të konsultohem me trajnerin për produktet dhe suplementet tuaja.";

const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

function TrainerConsultation() {
  return (
    <section
      aria-labelledby="trainer-title"
      className="relative overflow-hidden bg-[#080808] px-4 py-12 sm:px-6 sm:py-20 lg:px-10"
    >
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[24px] border border-[#FF7900]/25 bg-[#141414]">

        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-24 -top-32 h-[380px] w-[380px] rounded-full bg-[#FF7900]/10 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-36 -left-28 h-[300px] w-[300px] rounded-full bg-[#FF7900]/5 blur-[100px]" />

        {/* CONTENT */}
        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-20">

          <div className="max-w-[760px]">

            {/* SMALL LABEL */}
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#FF7900]" />

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7900] sm:text-xs">
                PROTEINFITNESS CONSULTATION
              </p>
            </div>

            {/* TITLE */}
            <h2
              id="trainer-title"
              className="mt-6 text-3xl font-black uppercase leading-[1.1] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl"
            >
              KE NEVOJË PËR
              <span className="mt-2 block text-[#FF7900]">
                KËSHILLIM?
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-[570px] text-sm leading-7 text-neutral-400 sm:text-base">
              Nuk je i sigurt cilin produkt të zgjedhësh?
              Kontakto trajnerin tonë për informacione
              rreth proteinave, suplementeve dhe
              përdorimit të tyre.
            </p>

            {/* SUPPORT INFO */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">

              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <MessageCircle
                  size={17}
                  className="text-[#FF7900]"
                />

                Komunikim direkt
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <ShieldCheck
                  size={17}
                  className="text-[#FF7900]"
                />

                Informacione për produktet
              </div>

            </div>

          </div>

          {/* WHATSAPP BUTTON */}
          <div className="flex flex-col items-start lg:items-center">

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Konsultohu me trajnerin në WhatsApp"
              className="group inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF7900] px-7 text-center text-xs font-black uppercase tracking-wide text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFA33E] hover:shadow-[0_15px_45px_rgba(255,121,0,0.18)] sm:w-auto sm:text-sm"
            >
              <FaWhatsapp
                size={24}
                className="shrink-0"
              />

              KONSULTOHU ME TRAJNERIN

              <ArrowUpRight
                size={19}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Na kontakto drejtpërdrejt në WhatsApp
            </p>

          </div>

        </div>

        {/* ORANGE ACCENT */}
        <div className="h-[3px] bg-gradient-to-r from-[#FF7900] via-[#FFB15E] to-transparent" />

      </div>
    </section>
  );
}

// ======================================
// PROTEINFITNESS - HOME PAGE
// ======================================

export default function Home() {
  useEffect(() => {
    document.title =
      "ProteinFitness | Proteina & Suplemente Sportive";
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main
        id="main-content"
        className="relative w-full"
      >

        {/* HERO SECTION */}
        <Hero />

        {/* PRODUCT CATEGORIES */}
        <Categories />

        {/* NEW PRODUCTS */}
        <NewArrivals />

        {/* BEST SELLING PRODUCTS */}
        <BestSellers />

        {/* TRAINER CONSULTATION */}
        <TrainerConsultation />

        {/* STORE FEATURES */}
        <Features />

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
