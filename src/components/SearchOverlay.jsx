import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay({ open, onClose }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(value.trim())}`);
    setValue("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm">
      <div className="bg-white">

        <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.35em] text-neutral-400">
                APAR
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Kërko produkte
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center transition hover:bg-neutral-100"
            >
              <X size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex border-b-2 border-black"
          >
            <Search
              size={25}
              className="my-auto flex-shrink-0"
            />

            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Çfarë po kërkon?"
              className="w-full bg-transparent px-5 py-5 text-xl outline-none md:text-3xl"
            />

            <button
              type="submit"
              className="px-5 text-sm font-bold"
            >
              KËRKO
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-500">
            <span>Provo:</span>

            <button
              onClick={() => setValue("Duks")}
              className="hover:text-black"
            >
              Duks
            </button>

            <button
              onClick={() => setValue("Maicë")}
              className="hover:text-black"
            >
              Maicë
            </button>

            <button
              onClick={() => setValue("Kapelë")}
              className="hover:text-black"
            >
              Kapelë
            </button>

            <button
              onClick={() => setValue("Çantë")}
              className="hover:text-black"
            >
              Çantë
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}