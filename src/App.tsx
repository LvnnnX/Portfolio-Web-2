import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

/** Routes that render on the editorial paper surface rather than the app chrome. */
const EDITORIAL_ROUTES = [
  "/blog",
  "/tech-news",
  "/case-study",
  "/planned-website",
  "/services",
];

/** Routes whose content is written in Indonesian; the rest (/, /case-study) are English. */
const INDONESIAN_ROUTES = ["/blog", "/tech-news", "/services", "/planned-website"];

const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

function App() {
  const location = useLocation();
  const isEditorial = startsWithAny(location.pathname, EDITORIAL_ROUTES);

  // Keep <html lang> honest per route — most of the writing is Indonesian,
  // and a wrong lang makes screen readers use the wrong pronunciation rules.
  useEffect(() => {
    document.documentElement.lang = startsWithAny(
      location.pathname,
      INDONESIAN_ROUTES,
    )
      ? "id"
      : "en";
  }, [location.pathname]);

  return (
    <div
      className="relative min-h-screen dark:bg-background"
      style={
        isEditorial
          ? { backgroundColor: "var(--editorial-paper, #fafaf6)" }
          : undefined
      }
    >
      <Navigation />

      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default App;
