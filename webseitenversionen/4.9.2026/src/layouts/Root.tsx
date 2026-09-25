import { Outlet } from "react-router";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

export default function Root() {
  return (
    <div style={{ minHeight: "100%", background: "#111827", display: "flex", flexDirection: "column" }}>
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <Seo />
      <Nav />
      <main id="main" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
