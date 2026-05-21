import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import CaseStudyPage from "./pages/CaseStudyPage";
import WritingIndexPage from "./pages/WritingIndexPage";
import WritingPostPage from "./pages/WritingPostPage";
import TechNewsIndexPage from "./pages/TechNewsIndexPage";
import TechNewsPostPage from "./pages/TechNewsPostPage";
import PlannedWebsitePage from "./pages/PlannedWebsitePage";
import ServicesPage from "./pages/ServicesPage";
import NotFoundPage from "./pages/NotFoundPage";

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
