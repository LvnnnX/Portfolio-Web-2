import { Mail } from "lucide-react";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-16 md:mt-24 border-t border-border/30 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row gap-6 md:gap-10 md:items-center md:justify-between">
        <div>
          <p className="text-[14px] md:text-[15px] font-semibold tracking-tight text-foreground">
            Pande Gede Dani Wismagatha
          </p>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-1">
            Computer Vision &amp; Applied ML Engineer · Karangasem, Bali
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <a
            href="mailto:pandedani5@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-[12px] md:text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/80"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" /> Email
          </a>
          <a
            href="https://github.com/LvnnnX"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-[12px] md:text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/80"
            aria-label="GitHub"
          >
            <GithubIcon /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kokopandan"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-[12px] md:text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/80"
            aria-label="LinkedIn"
          >
            <LinkedinIcon /> LinkedIn
          </a>
        </div>
      </div>

      <div className="border-t border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[11px] md:text-[12px] text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© {year} Pande Dani · All rights reserved</span>
          <span>Built with React, Vite, Tailwind, Three.js, and Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
