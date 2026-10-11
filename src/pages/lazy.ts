/**
 * Code-split route components. They live apart from routes.tsx so that file can
 * export plain route objects without tripping react-refresh/only-export-components.
 *
 * HomePage is absent on purpose: it is the entry route and is imported eagerly.
 */

import { lazyPage } from "../lib/lazyPage";

export const CaseStudyPage = lazyPage("src/pages/CaseStudyPage.tsx", () => import("./CaseStudyPage"));
export const WritingIndexPage = lazyPage("src/pages/WritingIndexPage.tsx", () => import("./WritingIndexPage"));
export const WritingPostPage = lazyPage("src/pages/WritingPostPage.tsx", () => import("./WritingPostPage"));
export const TechNewsIndexPage = lazyPage("src/pages/TechNewsIndexPage.tsx", () => import("./TechNewsIndexPage"));
export const TechNewsPostPage = lazyPage("src/pages/TechNewsPostPage.tsx", () => import("./TechNewsPostPage"));
export const PlannedWebsitePage = lazyPage("src/pages/PlannedWebsitePage.tsx", () => import("./PlannedWebsitePage"));
export const ServicesPage = lazyPage("src/pages/ServicesPage.tsx", () => import("./ServicesPage"));
export const NotFoundPage = lazyPage("src/pages/NotFoundPage.tsx", () => import("./NotFoundPage"));
