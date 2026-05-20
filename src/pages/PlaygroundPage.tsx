import { Suspense, lazy } from "react";
import SEO from "../components/seo/SEO";

const Playground = lazy(() => import("../components/sections/Playground"));

const Fallback = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen pt-20">
      <SEO
        title="Playground"
        description="In-browser YOLOv8 inference demo. Drop an image, see bounding boxes and latency in milliseconds."
        path="/playground"
      />
      <Suspense fallback={<Fallback />}>
        <Playground />
      </Suspense>
    </main>
  );
}
