// Syncs newsletter issues from content/newsletter.json into content/routes.json
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const newsletterPath = path.join(root, "webseitenversionen", "4.9.2026", "content", "newsletter.json");
const routesPath = path.join(root, "webseitenversionen", "4.9.2026", "content", "routes.json");

const newsletterData = JSON.parse(fs.readFileSync(newsletterPath, "utf8"));
const routesData = JSON.parse(fs.readFileSync(routesPath, "utf8"));

// Filter out existing free newsletter routes (we keep draft ones if any, or replace them)
const nonNewsletterRoutes = routesData.routes.filter(
  (r) => r.type !== "newsletter" || r.draft === true
);

// Map newsletter issues to route items
const newNewsletterRoutes = newsletterData.issues.map((issue) => ({
  path: `/newsletter/${issue.slug}`,
  type: "newsletter",
  slug: issue.slug,
  category: issue.category,
  h1: issue.h1 || issue.title,
  title: issue.title,
  description: issue.description,
  teaser: issue.teaser,
  intro: issue.teaser,
  published: issue.published,
  updated: issue.asOf,
  readTime: issue.readTime,
  tier: issue.tier,
  rechner: issue.rechnerHref || "/rechner",
  changefreq: "monthly",
  priority: "0.7",
  sections: issue.sections,
  sources: issue.sources,
  keywords: issue.keywords,
}));

// Find the position of the "/newsletter" page route
const newsletterPageIndex = nonNewsletterRoutes.findIndex((r) => r.path === "/newsletter");
if (newsletterPageIndex !== -1) {
  // Update the summary sections of the /newsletter page route
  const newsletterPage = nonNewsletterRoutes[newsletterPageIndex];
  newsletterPage.sections = newsletterData.issues.map((issue) => ({
    heading: `${issue.category} · ${issue.published}`,
    body: `${issue.title}: ${issue.teaser} (Stand ${issue.asOf}, ${issue.sources?.length ?? 0} Quellen)`,
  }));

  // Insert the newsletter routes right after /newsletter page
  nonNewsletterRoutes.splice(newsletterPageIndex + 1, 0, ...newNewsletterRoutes);
} else {
  nonNewsletterRoutes.push(...newNewsletterRoutes);
}

routesData.routes = nonNewsletterRoutes;
routesData.updated = new Date().toISOString().slice(0, 10);

fs.writeFileSync(routesPath, JSON.stringify(routesData, null, 2) + "\n", "utf8");
console.log(`Synced ${newNewsletterRoutes.length} newsletter routes into routes.json successfully.`);
