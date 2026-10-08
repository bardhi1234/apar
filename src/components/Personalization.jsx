import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Personalization() {
  return (
    <section
      id="personalizim"
      className="bg-[#f5f5f5] py-20"
    >
      <div className="mx-auto grid max-w-[1500px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-10">

        {/* LEFT */}
        <div>
          <p className="text-xs font-semibold tracking-[0.4em] text-neutral-400">
            APAR CUSTOM
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            KRIJO STILIN
            <br />
            TËND.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-neutral-600">
            Personalizo maicën ose duksin me emër,
            tekst, fotografi ose dizajn sipas dëshirës.
          </p>

          <div className="mt-8 space-y-3 text-sm text-neutral-600">
            <p>• Zgjidh produktin dhe madhësinë</p>
            <p>• Zgjidh ngjyrën</p>
            <p>• Shto tekst ose emër</p>
            <p>• Ngarko fotografinë ose dizajnin</p>
          </div>

          <Link
            to="/personalizim"
            className="mt-9 inline-flex items-center gap-3 bg-black px-8 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            PERSONALIZO TANI
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="relative">

          <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85"
              alt="APAR personalizim"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="absolute bottom-5 left-5 bg-black px-5 py-4 text-white">
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              APAR
            </p>

            <p className="mt-1 text-lg font-bold">
              WEAR YOUR STORY
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}