import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import { GlassFilter } from "./components/ui/liquid-glass-button";
import { WebGLShader } from "./components/ui/web-gl-shader";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

function App() {
  const location = useLocation();
  const isEditorial =
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/case-study");

  return (
    <div className="relative min-h-screen dark:bg-background">
      {/* Background Layer (skipped on /blog and /case-study so the editorial
          paper surface isn't muddled by the WebGL shader). */}
      {!isEditorial && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <WebGLShader />
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
