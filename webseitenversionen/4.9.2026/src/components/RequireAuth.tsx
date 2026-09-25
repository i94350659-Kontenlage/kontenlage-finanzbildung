import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#e8e2da" }}>Lade…</div>;
  if (!user) return <Navigate to="/kabinett" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
