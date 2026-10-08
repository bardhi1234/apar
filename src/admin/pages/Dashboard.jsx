import {
  Boxes,
  ClipboardList,
  Euro,
  PackagePlus,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function Dashboard() {
  return (
    <div>

      <p className="text-[9px] font-black tracking-[0.3em] text-neutral-400">
        APAR ADMIN
      </p>

      <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Menaxho APAR nga një vend.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          style={{
            color: "#ffffff",
          }}
          className="flex min-h-[52px] items-center gap-3 bg-black px-6 text-xs font-black text-white"
        >
          <PackagePlus size={17} />

          SHTO PRODUKT
        </Link>

      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="border border-neutral-200 bg-white p-6">
          <Boxes size={21} />

          <p className="mt-5 text-[9px] font-black tracking-[0.2em] text-neutral-400">
            PRODUKTET
          </p>

          <p className="mt-2 text-3xl font-black">
            —
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <ClipboardList size={21} />

          <p className="mt-5 text-[9px] font-black tracking-[0.2em] text-neutral-400">
            POROSITË
          </p>

          <p className="mt-2 text-3xl font-black">
            —
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <Euro size={21} />

          <p className="mt-5 text-[9px] font-black tracking-[0.2em] text-neutral-400">
            SHITJET
          </p>

          <p className="mt-2 text-3xl font-black">
            —
          </p>
        </div>

      </div>

    </div>
  );
}
