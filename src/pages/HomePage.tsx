import React, { Suspense } from "react";
import PortfolioHero from "../components/ui/portfolio-hero";
import SEO, { PersonJsonLd } from "../components/seo/SEO";

const Experience = React.lazy(() => import("../components/ui/Experience"));
const Projects = React.lazy(() => import("../components/ui/Projects"));
const Skills = React.lazy(() => import("../components/ui/Skills"));
const OpenSource = React.lazy(() => import("../components/sections/OpenSource"));
const Contact = React.lazy(() => import("../components/ui/Contact"));

const bar = (w: string, h = "h-3", d = 0) => (
  <div
    className={`${h} rounded animate-shimmer`}
    style={{ width: w, animationDelay: `${d}s` }}
  />
);

const SectionSkeleton = ({ variant = "timeline" }: { variant?: "timeline" | "grid" | "list" | "profile" }) => (
  <div className="py-10 md:py-16 px-4 md:px-6 max-w-5xl mx-auto">
    {bar("48", "h-6", 0)}
    <div className="mt-3 mb-8">{bar("64", "h-4", 0.1)}</div>

    {variant === "timeline" && (
      <div className="relative pl-4 md:pl-6 space-y-6">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
        {[0.2, 0.4, 0.6].map((d) => (
          <div key={d} className="relative">
            <div className="absolute -left-4 md:-left-6 top-1.5 w-2 h-2 rounded-full bg-border" />
            <div className="mb-2">{bar("20", "h-3", d)}</div>
            <div className="mb-2">{bar("56", "h-4", d + 0.1)}</div>
            {bar("80", "h-3", d + 0.2)}
          </div>
        ))}
      </div>
    )}

    {variant === "grid" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[0.2, 0.4, 0.6, 0.8].map((d, i) => (
          <div
            key={d}
            className={`rounded-xl animate-shimmer ${i === 0 ? "md:col-span-2 h-40" : "h-36"}`}
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    )}

    {variant === "list" && (
      <div className="space-y-5">
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((d) => (
          <div key={d} className="flex items-baseline justify-between gap-4">
            {bar("60", "h-4", d)}
            <div className="shrink-0">{bar("16", "h-3", d + 0.1)}</div>
          </div>
        ))}
      </div>
    )}

    {variant === "profile" && (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl animate-shimmer">
          <div className="w-16 h-16 rounded-full bg-border shrink-0" />
          <div className="space-y-2 flex-grow">
            <div className="h-4 w-40 rounded bg-border" />
            <div className="h-3 w-56 rounded bg-border/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0.2, 0.4, 0.6].map((d) => (
            <div key={d} className="h-28 rounded-xl animate-shimmer" style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
    )}
  </div>
);

export default function HomePage() {
  return (
    <div>
      <SEO
        title="Pande Dani — Computer Vision & Applied ML Engineer"
        exact
        description="Computer Vision & Applied ML Engineer based in Bali. Case studies and writing on applied machine learning."
        path="/"
      />
      <PersonJsonLd />

      <div id="home">
        <PortfolioHero />
      </div>

      <Suspense fallback={<SectionSkeleton variant="timeline" />}>
        <div id="experience">
          <Experience />
        </div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="grid" />}>
        <div id="projects">
          <Projects />
        </div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="list" />}>
        <div id="skills">
          <Skills />
        </div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="profile" />}>
        <OpenSource />
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="list" />}>
        <div id="contact">
          <Contact />
        </div>
      </Suspense>
    </div>
  );
}
