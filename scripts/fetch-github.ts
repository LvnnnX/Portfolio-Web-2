/**
 * Build-time GitHub fetcher.
 *
 * Pulls user profile + curated repos + recent activity,
 * writes to src/content/github.json.
 *
 * Usage: node scripts/fetch-github.ts
 * Env:   GITHUB_TOKEN optional (raises rate limit)
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT = resolve(__dirname, "..", "src", "content", "github.json");
const USERNAME = "LvnnnX";

const FEATURED_REPOS = [
  "Portfolio-Web-2",
  "exam-app",
  "FruitNinjaAUTO",
  "POS-Restaurant",
];

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-v3-build",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

interface GitHubUserApi {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
}

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

interface GitHubRepoApi {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  updated_at: string;
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

interface GitHubEventApi {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    ref?: string;
    action?: string;
  };
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

async function fetchProfile(): Promise<ProfileSnapshot | null> {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
  if (!res.ok) {
    console.warn(`[github] profile: ${res.status}`);
    return null;
  }
  const d = (await res.json()) as GitHubUserApi;
  return {
    username: d.login,
    name: d.name,
    avatar: d.avatar_url,
    bio: d.bio,
    followers: d.followers,
    following: d.following,
    publicRepos: d.public_repos,
    url: d.html_url,
    joinedAt: d.created_at,
  };
}

async function fetchRepo(name: string): Promise<RepoSnapshot | null> {
  const res = await fetch(`https://api.github.com/repos/${USERNAME}/${name}`, { headers });
  if (!res.ok) {
    console.warn(`[github] ${name}: ${res.status}`);
    return null;
  }
  const d = (await res.json()) as GitHubRepoApi;
  return {
    name: d.name,
    fullName: d.full_name,
    description: d.description,
    url: d.html_url,
    homepage: d.homepage,
    stars: d.stargazers_count,
    forks: d.forks_count,
    language: d.language,
    topics: d.topics ?? [],
    pushedAt: d.pushed_at,
    updatedAt: d.updated_at,
  };
}

function parseEvent(e: GitHubEventApi): ActivityItem {
  let detail = "";
  if (e.type === "PushEvent" && e.payload.commits) {
    const first = e.payload.commits[0];
    detail = first ? first.message.split("\n")[0] : "push";
  } else if (e.type === "CreateEvent") {
    detail = e.payload.ref ?? "create";
  } else if (e.type === "ForkEvent") {
    detail = "forked";
  } else if (e.type === "WatchEvent") {
    detail = "starred";
  } else {
    detail = e.payload.action ?? e.type.replace("Event", "").toLowerCase();
  }
  return {
    type: e.type,
    createdAt: e.created_at,
    repo: e.repo.name,
    detail: detail.substring(0, 80),
  };
}

async function fetchActivity(): Promise<ActivityItem[] | null> {
  const res = await fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=10`, { headers });
  if (!res.ok) {
    console.warn(`[github] activity: ${res.status}`);
    return null;
  }
  const events = (await res.json()) as GitHubEventApi[];
  return events.map(parseEvent).slice(0, 6);
}

async function fetchContributions(): Promise<{ date: string; level: number; count: number }[] | null> {
  // Use GraphQL API for accurate daily contribution data (requires token)
  if (process.env.GITHUB_TOKEN) {
    try {
      const query = `{ user(login: "${USERNAME}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }`;
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          ...headers,
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const json = await res.json() as {
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: number;
                  weeks: {
                    contributionDays: { contributionCount: number; date: string }[];
                  }[];
                };
              };
            };
          };
        };
        const cal = json.data.user.contributionsCollection.contributionCalendar;
        const days: { date: string; level: number; count: number }[] = [];
        for (const week of cal.weeks) {
          for (const day of week.contributionDays) {
            // Map count to level (0-4) using GitHub's thresholds
            let level = 0;
            if (day.contributionCount >= 10) level = 4;
            else if (day.contributionCount >= 6) level = 3;
            else if (day.contributionCount >= 3) level = 2;
            else if (day.contributionCount >= 1) level = 1;
            days.push({ date: day.date, level, count: day.contributionCount });
          }
        }
        console.log(`[github] contributions (GraphQL): ${days.length} days, ${cal.totalContributions} total`);
        return days;
      }
      console.warn(`[github] GraphQL contributions: ${res.status}`);
    } catch (err) {
      console.warn(`[github] GraphQL error:`, err);
    }
  }

  // Fallback: scrape the public calendar. Each day cell carries the date and level;
  // the count lives in a separate <tool-tip for="<cell id>"> element, so the two are
  // joined by id. A cell with no matching tooltip keeps count 0, and the UI renders
  // "Contribution activity" instead of a total when no count survives.
  console.warn("[github] no token or GraphQL failed, falling back to HTML scrape");
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, { headers });
  if (!res.ok) {
    console.warn(`[github] contributions: ${res.status}`);
    return null;
  }
  const html = await res.text();

  const counts = new Map<string, number>();
  const tipRe = /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  for (const tip of html.matchAll(tipRe)) {
    const text = tip[2];
    const n = /^\s*(\d+)\s+contribution/i.exec(text);
    counts.set(tip[1], n ? parseInt(n[1], 10) : 0);
  }

  const cellRe = /<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g;
  const days: { date: string; level: number; count: number }[] = [];
  for (const cell of html.matchAll(cellRe)) {
    const tag = cell[0];
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    if (!date) continue;
    const level = parseInt(/\bdata-level="(\d)"/.exec(tag)?.[1] ?? "0", 10);
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    days.push({ date, level, count: (id && counts.get(id)) || 0 });
  }

  if (days.length === 0) {
    console.warn("[github] contributions: no calendar cells in the response");
    return null;
  }
  // Cells arrive in the calendar's row order (every Sunday, then every Monday).
  days.sort((a, b) => a.date.localeCompare(b.date));

  const withCounts = days.filter((d) => d.count > 0).length;
  console.log(`[github] contributions (scrape): ${days.length} days, ${withCounts} with a count`);
  return days;
}

async function readExisting(): Promise<SnapshotFile | null> {
  try {
    const raw = await readFile(OUTPUT, "utf8");
    return JSON.parse(raw) as SnapshotFile;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  console.log(`[github] fetching profile + ${FEATURED_REPOS.length} repos + activity for ${USERNAME}…`);

  const [profile, repoResults, activity, contributions] = await Promise.all([
    fetchProfile(),
    Promise.all(FEATURED_REPOS.map(fetchRepo)),
    fetchActivity(),
    fetchContributions(),
  ]);

  const repos = repoResults.filter((r): r is RepoSnapshot => r !== null);
  const existing = await readExisting();

  if (existing && !profile && repos.length === 0 && activity === null && contributions === null) {
    console.warn("[github] every fetch failed, keeping the existing snapshot untouched");
    return;
  }

  // Each field falls back to the committed snapshot on its own. A failed
  // contributions fetch used to overwrite a year of data with [] and hide the heatmap.
  const kept: string[] = [];
  const keep = <T>(field: string, previous: T): T => {
    kept.push(field);
    return previous;
  };

  const payload: SnapshotFile = {
    fetchedAt: new Date().toISOString(),
    profile: profile ?? (existing?.profile ? keep("profile", existing.profile) : null),
    repos: repos.length > 0 ? repos : existing?.repos?.length ? keep("repos", existing.repos) : [],
    activity: activity ?? (existing?.activity ? keep("activity", existing.activity) : []),
    contributions: [
      ...(contributions ??
        (existing?.contributions?.length ? keep("contributions", existing.contributions) : [])),
    ].sort((a, b) => a.date.localeCompare(b.date)),
  };
  if (kept.length > 0) console.warn(`[github] fetch failed, kept previous: ${kept.join(", ")}`);

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    `[github] wrote profile + ${payload.repos.length} repos + ${payload.activity.length} activity items` +
      ` + ${payload.contributions.length} contribution days`,
  );
}

main().catch((err) => {
  console.error("[github] unexpected error:", err);
  process.exit(0);
});
