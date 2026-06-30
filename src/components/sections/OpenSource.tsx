import data from "../../content/github.json";

interface ProfileSnapshot {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  url: string;
  joinedAt: string;
}

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
  updatedAt: string;
}

interface ActivityItem {
  type: string;
  createdAt: string;
  repo: string;
  detail: string;
}

interface SnapshotFile {
  fetchedAt: string;
  profile: ProfileSnapshot | null;
  repos: RepoSnapshot[];
  activity: ActivityItem[];
  contributions: { date: string; level: number; count: number }[];
}

const snapshot = data as SnapshotFile;

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  HTML: "#E34C26",
  CSS: "#563D7C",
  "C++": "#F34B7D",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  MDX: "#fcb32c",
};

const formatStars = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const EVENT_ICONS: Record<string, string> = {
  PushEvent: "↳",
  CreateEvent: "+",
  ForkEvent: "⑃",
  WatchEvent: "★",
  PullRequestEvent: "⇄",
  IssuesEvent: "◉",
};

// Contribution heatmap colors — Bali clay scaled by level
const LEVEL_COLORS = [
  "var(--muted)",           // 0: no activity
  "#e8a899",                // 1: light
  "#d9775a",                // 2: medium
  "#c4583a",                // 3: strong
  "#B8422E",                // 4: max (Bali clay)
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function OpenSource() {
  const { profile, repos, activity, contributions } = snapshot;

  if (repos.length === 0 && !profile) return null;

  // Build weeks array for heatmap — data is already daily from GraphQL
  const weeks: { date: string; level: number; count: number }[][] = [];
  let currentWeek: { date: string; level: number; count: number }[] = [];
  contributions.forEach((day, i) => {
    const dow = new Date(day.date).getDay();
    if (dow === 1 && i > 0) { // Monday starts a new week
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Pad first/last weeks to 7 days for consistent grid
  weeks.forEach((week) => {
    while (week.length < 7) {
      week.push({ date: "", level: 0, count: 0 });
    }
  });

  // Month labels for the top axis
  const weekMonths = weeks.map((week) => {
    const first = week[0];
    if (!first) return null;
    return new Date(first.date).getMonth();
  });
  const monthHeaders: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weekMonths.forEach((m, i) => {
    if (m !== null && m !== lastMonth) {
      monthHeaders.push({ label: MONTH_LABELS[m], weekIndex: i });
      lastMonth = m;
    }
  });

  // Active days count
  const activeDays = contributions.filter((c) => c.count > 0).length;
  const totalContribs = contributions.reduce((sum, c) => sum + c.count, 0);

  return (
    <section id="open-source" className="py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-foreground mb-1">
          On GitHub
        </h2>
        <p className="text-muted-foreground text-[13px] md:text-[15px] mb-6 md:mb-8">
          Pinned repos surfaced at build time.
        </p>

        {/* C: Profile card */}
        {profile && (
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 p-4 md:p-6 bg-muted rounded-xl border border-border">
            <img
              src={profile.avatar}
              alt={profile.name ?? profile.username}
              className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-border shrink-0"
              loading="lazy"
            />
            <div className="flex-grow min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-[16px] md:text-[20px] font-extrabold tracking-tight text-foreground truncate">
                  {profile.name ?? profile.username}
                </h3>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] md:text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  @{profile.username}
                </a>
              </div>
              {profile.bio && (
                <p className="text-[12px] md:text-[14px] text-muted-foreground mt-0.5 mb-2">
                  {profile.bio}
                </p>
              )}
              <div className="flex gap-4 md:gap-6 text-[11px] md:text-[13px]">
                <span className="text-muted-foreground">
                  <strong className="text-foreground font-bold">{profile.publicRepos}</strong> repos
                </span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground font-bold">{profile.followers}</strong> followers
                </span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground font-bold">{profile.following}</strong> following
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contribution heatmap */}
        {contributions.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[14px] md:text-[16px] font-bold tracking-tight text-foreground">
                {totalContribs} contributions
              </h3>
              <span className="text-[11px] md:text-[12px] text-muted-foreground">
                {activeDays} active days · last 12 months
              </span>
            </div>

            <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="inline-block">
                {/* Month labels */}
                <div className="flex gap-[3px] mb-1 ml-7">
                  {weeks.map((_, wi) => {
                    const hdr = monthHeaders.find((h) => h.weekIndex === wi);
                    return (
                      <div key={wi} className="w-[11px] text-[9px] text-muted-foreground/70 font-medium h-3">
                        {hdr ? hdr.label : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Grid: day labels + cells */}
                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[3px] pt-0 w-5 shrink-0">
                    {["M", "", "W", "", "F", "", ""].map((d, i) => (
                      <div key={i} className="text-[9px] text-muted-foreground/70 font-medium h-[11px] leading-[11px]">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Weeks */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {Array.from({ length: 7 }).map((_, di) => {
                          const day = week[di];
                          if (!day) {
                            return <div key={di} className="w-[11px] h-[11px] rounded-[2px]" />;
                          }
                          return (
                            <div
                              key={di}
                              className="w-[11px] h-[11px] rounded-[2px]"
                              style={{ backgroundColor: LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0] }}
                              title={day.date ? `${day.date}: ${day.count} contributions` : ""}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-1.5 mt-2 justify-end">
                  <span className="text-[9px] text-muted-foreground/70 font-medium">Less</span>
                  {LEVEL_COLORS.map((c, i) => (
                    <div
                      key={i}
                      className="w-[11px] h-[11px] rounded-[2px]"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="text-[9px] text-muted-foreground/70 font-medium">More</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D: Bento grid repos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          {repos.map((repo, i) => {
            const featured = i === 0;
            return (
              <a
                key={repo.fullName}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className={`p-4 md:p-5 rounded-xl bg-muted border border-border flex flex-col gap-2 group transition-colors hover:border-primary hover:bg-primary/5 ${featured ? "md:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[14px] md:text-[16px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    {repo.homepage && (
                      <span className="text-[10px] md:text-[11px] font-semibold text-primary">
                        live ↗
                      </span>
                    )}
                    <span className="text-[11px] md:text-[12px] font-mono text-muted-foreground">
                      ★ {formatStars(repo.stars)}
                    </span>
                  </div>
                </div>

                {repo.description && (
                  <p className="text-[12px] md:text-[13px] leading-[1.5] text-muted-foreground flex-grow">
                    {repo.description}
                  </p>
                )}
                {!repo.description && featured && (
                  <p className="text-[12px] md:text-[13px] leading-[1.5] text-muted-foreground/60 flex-grow">
                    No description
                  </p>
                )}

                {repo.topics.length > 0 && featured && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {repo.topics.slice(0, 6).map((topic) => (
                      <span key={topic} className="text-[10px] font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-muted-foreground mt-auto">
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
                  <span className="ml-auto">· {timeAgo(repo.pushedAt)}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* E: Activity timeline */}
        {activity.length > 0 && (
          <div>
            <h3 className="text-[14px] md:text-[16px] font-bold tracking-tight text-foreground mb-3 md:mb-4">
              Recent Activity
            </h3>
            <div className="relative pl-4">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
              <div className="flex flex-col gap-3">
                {activity.map((item, i) => (
                  <div key={i} className="relative flex items-baseline gap-3">
                    <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-border" />
                    <span className="text-[11px] md:text-[12px] text-muted-foreground font-mono shrink-0">
                      {timeAgo(item.createdAt)}
                    </span>
                    <span className="text-primary text-[12px] md:text-[14px] shrink-0">
                      {EVENT_ICONS[item.type] ?? "·"}
                    </span>
                    <span className="text-[12px] md:text-[14px] text-foreground/80 truncate">
                      <span className="font-semibold">{item.repo.replace("LvnnnX/", "")}</span>
                      <span className="text-muted-foreground"> — {item.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
