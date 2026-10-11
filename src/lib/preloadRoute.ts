import { matchRoutes, type RouteObject } from "react-router-dom";

type Preloadable = { type?: { preload?: () => Promise<unknown> } };

/**
 * Load every code-split chunk a URL renders, so React never suspends on it. The
 * browser needs this to keep the prerendered HTML on screen; the prerender needs it
 * too, or React writes a Suspense fallback into the page and parks the real
 * content in a hidden element behind an inline swap script.
 */
export function preloadRoute(routes: RouteObject[], pathname: string): Promise<unknown> {
  return Promise.all(
    (matchRoutes(routes, pathname) ?? []).map((match) =>
      (match.route.element as Preloadable | undefined)?.type?.preload?.(),
    ),
  );
}
