import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import CaseStudyPage from "./pages/CaseStudyPage";
import WritingIndexPage from "./pages/WritingIndexPage";
import WritingPostPage from "./pages/WritingPostPage";
import PlannedWebsitePage from "./pages/PlannedWebsitePage";
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
      { path: "planned-website", element: <PlannedWebsitePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
