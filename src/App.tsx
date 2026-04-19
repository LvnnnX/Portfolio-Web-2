import Demo from "./demo";
import "./index.css";
import { GlassFilter } from "./components/ui/liquid-glass-button";
import { FallingPattern } from "./components/ui/falling-pattern";
import { WebGLShader } from "./components/ui/web-gl-shader";

function App() {
  return (
    <div className="relative min-h-screen dark:bg-background">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingPattern 
          className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))] hidden dark:block" 
          duration={120}
        />
        <WebGLShader />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Demo />
      </div>
      
      <GlassFilter />
    </div>
  );
}

export default App;