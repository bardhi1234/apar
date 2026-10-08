import {
  useState,
} from "react";

import {
  Loader2,
  LockKeyhole,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  adminLogin,
  getAdminToken,
  setAdminToken,
} from "../services/api";

const LOGO =
  "https://res.cloudinary.com/dmlszpk5l/image/upload/v1790361997/ChatGPT_Image_Sep_25_2026_08_43_05_PM_aqnxkj.png";

export default function AdminLogin() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (getAdminToken()) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const data =
        await adminLogin(
          email,
          password
        );

      setAdminToken(
        data.token
      );

      navigate(
        "/admin",
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-5">

      <div className="w-full max-w-[430px]">

        <div className="mb-8 text-center">

          <img
            src={LOGO}
            alt="APAR"
            className="mx-auto w-[190px] object-contain"
          />

          <p className="mt-5 text-[9px] font-black tracking-[0.4em] text-neutral-600">
            ADMINISTRATION
          </p>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="border border-white/10 bg-[#0d0d0d] p-7 sm:p-9"
        >

          <div className="flex h-11 w-11 items-center justify-center border border-white/10 text-white">
            <LockKeyhole
              size={18}
            />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Hyr në panelin APAR.
          </p>

          {error && (
            <div className="mt-6 border border-red-900/50 bg-red-950/30 p-4 text-xs font-semibold text-red-400">
              {error}
            </div>
          )}

          <label className="mt-7 block">

            <span className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-neutral-500">
              EMAIL
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              autoComplete="email"
              className="w-full border border-white/10 bg-black px-4 py-4 text-sm text-white outline-none transition focus:border-white/40"
            />

          </label>

          <label className="mt-5 block">

            <span className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-neutral-500">
              PASSWORD
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              autoComplete="current-password"
              className="w-full border border-white/10 bg-black px-4 py-4 text-sm text-white outline-none transition focus:border-white/40"
            />

          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              color: "#050505",
            }}
            className="mt-7 flex min-h-[54px] w-full items-center justify-center gap-3 bg-white text-xs font-black tracking-[0.13em] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                DUKE HYRË...
              </>
            ) : (
              "HYR NË ADMIN"
            )}
          </button>

        </form>

      </div>

    </main>
  );
}