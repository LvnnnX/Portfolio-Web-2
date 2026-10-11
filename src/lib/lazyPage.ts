import { createElement, lazy, type ComponentType, type FunctionComponent } from "react";

type PageModule = { default: ComponentType };

export type LazyPage = FunctionComponent & {
  /** Load the chunk ahead of the first render so React never suspends on it. */
  preload: () => Promise<void>;
};

/**
 * Source paths of the code-split components rendered during a server render. The
 * prerender reads this to link exactly the CSS and JS chunks each page needs.
 */
export const renderedModules = new Set<string>();

/**
 * React.lazy plus a preload hook. The prerendered HTML is already on screen when
 * the client mounts; if the route chunk is still pending, React would swap that
 * HTML for a Suspense fallback and flash an empty page. Preloading before the
 * first render, and rendering the resolved component directly, avoids that.
 *
 * `id` is the module's path from the project root, the key Vite's manifest uses.
 */
export function lazyPage(id: string, load: () => Promise<PageModule>): LazyPage {
  let Loaded: ComponentType | null = null;
  const resolve = () =>
    load().then(
      (mod) => {
        Loaded = mod.default;
        return mod;
      },
      (error: unknown) => {
        // Never settle while the reload is under way, so Suspense keeps the page
        // on screen instead of the router's error screen flashing first.
        if (!import.meta.env.SSR && reloadForNewDeploy()) return new Promise<never>(() => {});
        throw error;
      },
    );
  const Lazy = lazy(resolve);

  const Page: FunctionComponent = () => {
    if (import.meta.env.SSR) renderedModules.add(id);
    return createElement(Loaded ?? Lazy);
  };
  Page.displayName = `LazyPage(${id.split("/").pop()})`;
  return Object.assign(Page, { preload: () => resolve().then(() => undefined) });
}

const RELOAD_KEY = "lazy-page-reload-at";

/**
 * After a deploy, a tab that is still open asks for the previous build's chunk
 * names, which no longer exist. Reload once to pick up the current build; the
 * timestamp stops a loop when a chunk is genuinely missing.
 */
function reloadForNewDeploy(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 10_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false; // storage unavailable: let the error surface instead of risking a loop
  }
  window.location.reload();
  return true;
}
