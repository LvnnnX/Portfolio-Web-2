import PortfolioHero from "./components/ui/portfolio-hero";
import AboutMe from "./components/ui/AboutMe";
import Experience from "./components/ui/Experience";
import Projects from "./components/ui/Projects";
import Skills from "./components/ui/Skills";
import Tools from "./components/ui/Tools";
import Contact from "./components/ui/Contact";

export default function Demo() {
  return (
    <div>
      <div id="home">
        <PortfolioHero />
      </div>
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
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}