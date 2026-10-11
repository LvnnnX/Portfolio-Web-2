import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./routes";
import { preloadRoute } from "./lib/preloadRoute";

// The prerendered HTML is already on screen. Load this URL's chunks before
// mounting, so the first render reproduces that HTML instead of a fallback.
preloadRoute(routes, window.location.pathname)
  .catch(() => undefined) // a failed chunk still mounts; React.lazy surfaces the error
  .finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <RouterProvider router={createBrowserRouter(routes)} />
      </StrictMode>,
    );
  });
