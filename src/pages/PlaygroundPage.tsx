import { Suspense, lazy } from "react";

const Playground = lazy(() => import("../components/sections/Playground"));

const Fallback = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen pt-20">
      <Suspense fallback={<Fallback />}>
        <Playground />
      </Suspense>
    </main>
  );
}
