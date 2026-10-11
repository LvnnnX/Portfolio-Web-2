import type { RouteObject } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import {
  CaseStudyPage,
  WritingIndexPage,
  WritingPostPage,
  TechNewsIndexPage,
  TechNewsPostPage,
  PlannedWebsitePage,
  ServicesPage,
  NotFoundPage,
} from "./pages/lazy";

// Plain route objects, so the browser (main.tsx) and the build-time prerender
// (entry-server.tsx) can each build their own router from the same table.
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "case-study/:slug", element: <CaseStudyPage /> },
      { path: "blog", element: <WritingIndexPage /> },
      { path: "blog/:slug", element: <WritingPostPage /> },
      { path: "tech-news", element: <TechNewsIndexPage /> },
      { path: "tech-news/:slug", element: <TechNewsPostPage /> },
      { path: "planned-website", element: <PlannedWebsitePage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
