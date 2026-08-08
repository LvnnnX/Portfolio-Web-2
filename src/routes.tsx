import { createBrowserRouter } from "react-router-dom";
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

// Every route except the entry point is code-split (see ./pages/lazy). Without
// this, a visitor to / downloads every blog post, every tech-news edition, all
// three case studies, and the full services pricing page in the main chunk.
export const router = createBrowserRouter([
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
]);
