import { createBrowserRouter } from "react-router";
import type { ComponentType } from "react";
import Root from "./layouts/Root";
import ErrorPage from "./components/ErrorPage";
import RouterFallback from "./components/RouterFallback";
import Home from "./pages/Home";

// Startseite und Layout bleiben im Startchunk (erster Aufruf, LCP).
// Alle weiteren Seiten werden als eigene Chunks nachgeladen (Ticket P1-03).
const load = <T extends { default: ComponentType }>(factory: () => Promise<T>) => async () => ({
  Component: (await factory()).default,
});

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorPage,
    HydrateFallback: RouterFallback,
    children: [
      { index: true, Component: Home },
      { path: "rechner", lazy: load(() => import("./pages/Rechner")) },
      { path: "holding", lazy: load(() => import("./pages/Holding")) },
      { path: "anlageformen", lazy: load(() => import("./pages/Anlageformen")) },
      { path: "artikel", lazy: load(() => import("./pages/Artikel")) },
      { path: "artikel/:slug", lazy: load(() => import("./pages/ArtikelDetail")) },
      { path: "transparenz", lazy: load(() => import("./pages/Transparenz")) },
      { path: "abo", lazy: load(() => import("./pages/Abo")) },
      { path: "kabinett", lazy: load(() => import("./pages/Kabinett")) },
      { path: "konto", lazy: load(() => import("./components/ProtectedAccount")) },
      { path: "impressum", lazy: load(() => import("./pages/Impressum")) },
      { path: "datenschutz", lazy: load(() => import("./pages/Datenschutz")) },
      { path: "*", lazy: load(() => import("./pages/NotFound")) },
    ],
  },
]);

