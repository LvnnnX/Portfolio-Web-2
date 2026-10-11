import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import { langFor } from "./lib/lang";

/** Routes that render on the editorial paper surface rather than the app chrome. */
const EDITORIAL_ROUTES = [
  "/blog",
  "/tech-news",
  "/case-study",
  "/planned-website",
  "/services",
];

const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

function App() {
  const location = useLocation();
  const isEditorial = startsWithAny(location.pathname, EDITORIAL_ROUTES);

  // Keep <html lang> honest per route. Most of the writing is Indonesian,
  // and a wrong lang makes screen readers use the wrong pronunciation rules.
  useEffect(() => {
    document.documentElement.lang = langFor(location.pathname);
  }, [location.pathname]);

  // The prerendered <head> tags describe only the URL the page was loaded at.
  // React now renders its own; drop the static copies so a client-side
  // navigation can't leave the first page's title or canonical in front.
  useEffect(() => {
    document.head.querySelectorAll("[data-prerender]").forEach((node) => node.remove());
  }, []);

  return (
    <div
      className="relative min-h-dvh dark:bg-background"
      style={
        isEditorial
          ? { backgroundColor: "var(--editorial-paper, #fafaf6)" }
          : undefined
      }
    >
      <Navigation />

      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default App;
