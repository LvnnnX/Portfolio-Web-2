import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

function App() {
  const location = useLocation();
  const isEditorial =
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/case-study") ||
    location.pathname.startsWith("/planned-website") ||
    location.pathname.startsWith("/services");

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
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default App;
