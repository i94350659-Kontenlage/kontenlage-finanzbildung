import { useEffect } from "react";
import { useLocation } from "react-router";
import registry from "../../content/routes.json";

const siteUrl = registry.site;

type RouteMeta = { path: string; title: string; description: string; noindex: boolean };

const routes: RouteMeta[] = registry.routes.map((route) => ({
  path: route.path,
  title: route.title,
  description: route.description,
  noindex: "noindex" in route && route.noindex === true,
}));

function metaFor(pathname: string): RouteMeta | null {
  const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return routes.find((route) => route.path === normalized) ?? null;
}

export default function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = metaFor(location.pathname);
    const title = meta?.title ?? "Kontolage | Unabhängige Finanzbildung";
    const description = meta?.description ?? "Neutrale Finanzbildung und nachvollziehbare Szenarien für bessere finanzielle Entscheidungen.";
    const url = `${siteUrl}${location.pathname === "/" ? "/" : location.pathname}`;

    document.title = title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute("content", description);

    // Unbekannte Pfade (Client-Routing) und bewusst ausgenommene Seiten bleiben aus dem Index.
    const noindex = meta ? meta.noindex : true;
    document
      .querySelector<HTMLMetaElement>('meta[name="robots"]')
      ?.setAttribute("content", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
  }, [location.pathname]);

  return null;
}
