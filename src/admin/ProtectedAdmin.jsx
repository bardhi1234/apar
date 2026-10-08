import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  adminMe,
  clearAdminToken,
  getAdminToken,
} from "../services/api";

export default function ProtectedAdmin() {
  const [status, setStatus] =
    useState("checking");

  useEffect(() => {
    async function check() {
      if (!getAdminToken()) {
        setStatus("unauthorized");
        return;
      }

      try {
        await adminMe();
        setStatus("authorized");
      } catch {
        clearAdminToken();
        setStatus("unauthorized");
      }
    }

    check();
  }, []);

  if (
    status === "checking"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2
          size={22}
          className="animate-spin"
        />
      </div>
    );
  }

  if (
    status === "unauthorized"
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}