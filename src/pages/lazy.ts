/**
 * Lazily-loaded route components.
 *
 * These live apart from routes.tsx so that file can export the router object
 * without tripping react-refresh/only-export-components (a module may export
 * components *or* other values, not both).
 *
 * HomePage is deliberately absent — it's the entry route and is imported
 * eagerly, so splitting it would only add a round trip before first paint.
 */

import { lazy } from "react";

export const CaseStudyPage = lazy(() => import("./CaseStudyPage"));
export const WritingIndexPage = lazy(() => import("./WritingIndexPage"));
export const WritingPostPage = lazy(() => import("./WritingPostPage"));
export const TechNewsIndexPage = lazy(() => import("./TechNewsIndexPage"));
export const TechNewsPostPage = lazy(() => import("./TechNewsPostPage"));
export const PlannedWebsitePage = lazy(() => import("./PlannedWebsitePage"));
export const ServicesPage = lazy(() => import("./ServicesPage"));
export const NotFoundPage = lazy(() => import("./NotFoundPage"));
