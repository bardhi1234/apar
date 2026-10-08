import {
  BarChart3,
  Boxes,
  ClipboardList,
  Home,
  Menu,
  PackagePlus,
  X,
  Tags,
} from "lucide-react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  useState,
} from "react";

const APAR_LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

const links = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: BarChart3,
    end: true,
  },
  {
    name: "Produktet",
    to: "/admin/products",
    icon: Boxes,
  },
  {
    name: "Shto Produkt",
    to: "/admin/products/new",
    icon: PackagePlus,
  },
  {
    name: "Kategoritë",
    to: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Porositë",
    to: "/admin/orders",
    icon: ClipboardList,
  },
];

export default function AdminLayout() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f3]">

      <div
        onClick={() =>
          setMenuOpen(false)
        }
        className={`fixed inset-0 z-[90] bg-black/60 lg:hidden ${
          menuOpen
            ? "block"
            : "hidden"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-[100] flex h-screen w-[280px] flex-col bg-[#050505] text-white transition-transform lg:translate-x-0 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-[3px]">
          <span className="flex-1 bg-[#009246]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#CE2B37]" />
        </div>

        <div className="flex h-[90px] items-center justify-between border-b border-white/10 px-6">

          <img
            src={APAR_LOGO}
            alt="APAR"
            className="w-[150px] object-contain mix-blend-screen"
          />

          <button
            type="button"
            onClick={() =>
              setMenuOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center border border-white/10 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>

        <div className="border-b border-white/10 px-6 py-5">

          <p className="text-[9px] font-black tracking-[0.35em] text-neutral-600">
            APAR ADMIN
          </p>

          <p className="mt-2 text-sm font-semibold text-neutral-300">
            Store Management
          </p>

        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">

          {links.map(
            ({
              name,
              to,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() =>
                  setMenuOpen(false)
                }
                className={({
                  isActive,
                }) =>
                  `flex min-h-[50px] items-center gap-3 px-4 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-black"
                      : "text-neutral-500 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.7}
                />

                {name}
              </NavLink>
            )
          )}

        </nav>

        <div className="border-t border-white/10 p-4">

          <NavLink
            to="/"
            className="flex min-h-[48px] items-center gap-3 px-4 text-sm font-semibold text-neutral-500 transition hover:text-white"
          >
            <Home size={17} />

            Shiko Website
          </NavLink>

        </div>

      </aside>

      <div className="min-h-screen lg:pl-[280px]">

        <header className="sticky top-0 z-[70] flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white/95 px-5 backdrop-blur-xl lg:px-8">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                setMenuOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center border border-neutral-200 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-[8px] font-black tracking-[0.3em] text-neutral-400">
                APAR
              </p>

              <p className="mt-1 text-sm font-bold">
                Administration
              </p>
            </div>

          </div>

        </header>

        <main className="p-5 sm:p-7 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
