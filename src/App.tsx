import { Outlet } from "react-router-dom";
import "./index.css";
import { GlassFilter } from "./components/ui/liquid-glass-button";
import { FallingPattern } from "./components/ui/falling-pattern";
import { WebGLShader } from "./components/ui/web-gl-shader";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="relative min-h-screen dark:bg-background">
      {/* Background Layer (shared across all routes) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingPattern
          className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))] hidden dark:block"
          duration={120}
        />
        <WebGLShader />
      </div>

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
