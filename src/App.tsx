import { Outlet, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";
import { GlassFilter } from "./components/ui/liquid-glass-button";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

// Lazy-load Three.js shader so the ~600 KB three bundle stays out of the
// main route. Suspense fallback is null because the shader is purely
// decorative — first paint shouldn't wait for it.
const WebGLShader = lazy(() =>
  import("./components/ui/web-gl-shader").then((m) => ({ default: m.WebGLShader })),
);

function App() {
  const location = useLocation();
  const isEditorial =
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/case-study") ||
    location.pathname.startsWith("/planned-website");

  return (
    <div
      className="relative min-h-screen dark:bg-background"
      style={
        isEditorial
          ? { backgroundColor: "var(--editorial-paper, #fafaf6)" }
          : undefined
      }
    >
      {/* Background Layer (skipped on /blog and /case-study so the editorial
          paper surface isn't muddled by the WebGL shader). */}
      {!isEditorial && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <Suspense fallback={null}>
            <WebGLShader />
          </Suspense>
        </div>
      )}

      <Navigation />

      {/* Routed Content Layer */}
      <div className="relative z-10">
        <Outlet />
      </div>

      <Footer />

      <GlassFilter />
    </div>
  );
}

export default App;
