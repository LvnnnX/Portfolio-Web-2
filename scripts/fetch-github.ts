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

async function fetchActivity(): Promise<ActivityItem[]> {
  const res = await fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=10`, { headers });
  if (!res.ok) {
    console.warn(`[github] activity: ${res.status}`);
    return [];
  }
  const events = (await res.json()) as GitHubEventApi[];
  return events.map(parseEvent).slice(0, 6);
}

async function fetchContributions(): Promise<{ date: string; level: number; count: number }[]> {
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

  // Fallback: scrape HTML (1 level per week, expanded to daily in component)
  console.warn("[github] no token or GraphQL failed — falling back to HTML scrape");
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, { headers });
  if (!res.ok) {
    console.warn(`[github] contributions: ${res.status}`);
    return [];
  }
  const html = await res.text();
  const re = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  const matches = [...html.matchAll(re)];
  return matches.map((m) => ({ date: m[1], level: parseInt(m[2], 10), count: 0 }));
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

  if (!profile && repos.length === 0 && activity.length === 0) {
    const existing = await readExisting();
    if (existing) {
      console.warn("[github] all fetches failed — keeping existing snapshot");
      return;
    }
    console.warn("[github] no data fetched and no existing snapshot — writing empty");
  }

  const payload: SnapshotFile = {
    fetchedAt: new Date().toISOString(),
    profile,
    repos,
    activity,
    contributions,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`[github] wrote profile + ${repos.length} repos + ${activity.length} activity items`);
}

main().catch((err) => {
  console.error("[github] unexpected error:", err);
  process.exit(0);
});
