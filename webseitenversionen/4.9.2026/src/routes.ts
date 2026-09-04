import { createBrowserRouter } from "react-router";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Rechner from "./pages/Rechner";
import Holding from "./pages/Holding";
import Anlageformen from "./pages/Anlageformen";
import Artikel from "./pages/Artikel";
import ArtikelDetail from "./pages/ArtikelDetail";
import Transparenz from "./pages/Transparenz";
import Abo from "./pages/Abo";
import Kabinett from "./pages/Kabinett";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "rechner", Component: Rechner },
      { path: "holding", Component: Holding },
      { path: "anlageformen", Component: Anlageformen },
      { path: "artikel", Component: Artikel },
      { path: "artikel/:slug", Component: ArtikelDetail },
      { path: "transparenz", Component: Transparenz },
      { path: "abo", Component: Abo },
      { path: "kabinett", Component: Kabinett },
      { path: "impressum", Component: Impressum },
      { path: "datenschutz", Component: Datenschutz },
      { path: "*", Component: NotFound },
    ],
  },
]);
