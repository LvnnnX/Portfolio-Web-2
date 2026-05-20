import React, { Suspense } from "react";
import PortfolioHero from "../components/ui/portfolio-hero";
import SEO, { PersonJsonLd } from "../components/seo/SEO";

const AboutMe = React.lazy(() => import("../components/ui/AboutMe"));
const Experience = React.lazy(() => import("../components/ui/Experience"));
const Projects = React.lazy(() => import("../components/ui/Projects"));
const Skills = React.lazy(() => import("../components/ui/Skills"));
const Tools = React.lazy(() => import("../components/ui/Tools"));
const OpenSource = React.lazy(() => import("../components/sections/OpenSource"));
const Contact = React.lazy(() => import("../components/ui/Contact"));

const SectionFallback = () => (
  <div className="w-full h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
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

      <Suspense fallback={<SectionFallback />}>
        <div id="about">
          <AboutMe />
        </div>
        <div id="experience">
          <Experience />
        </div>
        <div id="projects">
          <Projects />
        </div>
        <div id="tools">
          <Tools />
        </div>
        <div id="skills">
          <Skills />
        </div>
        <OpenSource />
        <div id="contact">
          <Contact />
        </div>
      </Suspense>
    </div>
  );
}
