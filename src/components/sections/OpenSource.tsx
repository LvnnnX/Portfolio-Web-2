import data from "../../content/github.json";

interface RepoSnapshot {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
}

interface SnapshotFile {
  fetchedAt: string;
  repos: RepoSnapshot[];
}

const snapshot = data as SnapshotFile;

// Map a primary language to a small color dot, mirroring GitHub's familiar swatches.
const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  HTML: "#E34C26",
  CSS: "#563D7C",
  "C++": "#F34B7D",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
};

const formatStars = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

export default function OpenSource() {
  const repos = snapshot.repos;

  if (repos.length === 0) return null;

  return (
    <section id="open-source" className="py-12 md:py-20 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <p className="text-[10px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-[color:var(--color-accent,#B8422E)] mb-3">
          Open source
        </p>
        <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] text-foreground mb-3">
          On GitHub
        </h2>
        <p className="text-[13px] md:text-[16px] leading-[1.6] text-muted-foreground max-w-[640px] mb-8 md:mb-10">
          Pinned repos surfaced at build time. Click through for code, issues, and longer reads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {repos.map((repo) => (
            <a
              key={repo.fullName}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass rounded-[20px] p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[15px] md:text-[18px] font-bold tracking-tight text-foreground leading-tight">
                  {repo.name}
                </h3>
                <span className="text-[11px] md:text-[12px] font-mono text-muted-foreground shrink-0">
                  ★ {formatStars(repo.stars)}
                </span>
              </div>

              {repo.description && (
                <p className="text-[12px] md:text-[14px] leading-[1.5] text-muted-foreground flex-grow">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-muted-foreground">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#86868B" }}
                    />
                    {repo.language}
                  </span>
                )}
                {repo.forks > 0 && <span>· {repo.forks} forks</span>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
