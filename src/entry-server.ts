/**
 * Server entry for the build-time prerender (scripts/prerender.ts). Plain .ts with
 * createElement: this module never hot-reloads, and keeping JSX out keeps it clear
 * of the react-refresh export rule.
 */

import { createElement, StrictMode } from "react";
import { prerender } from "react-dom/static";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./routes";
import { renderedModules } from "./lib/lazyPage";
import { preloadRoute } from "./lib/preloadRoute";

export { listRoutes } from "./seo/routeList";
export { langFor } from "./lib/lang";
export { SITE_URL } from "./seo/schema";

export async function render(path: string) {
  await preloadRoute(routes, path);
  renderedModules.clear();
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://www.daniwismagatha.my.id${path}`));
  if (context instanceof Response) throw new Error(`${path}: router returned a redirect`);

  const router = createStaticRouter(handler.dataRoutes, context);
  const { prelude } = await prerender(
    createElement(
      StrictMode,
      null,
      createElement(StaticRouterProvider, { router, context, hydrate: false }),
    ),
    // Past this many bytes React splits a Suspense boundary out for progressive
    // streaming: a fallback in place, the content in a hidden div, and an inline
    // script to swap them. A static file gains nothing from that, and crawlers
    // without JavaScript would find the page body hidden.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
  return { html: await new Response(prelude).text(), modules: [...renderedModules] };
}
