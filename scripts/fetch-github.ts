/**
 * Build-time GitHub fetcher.
 *
 * Pulls a curated list of repos owned by LvnnnX and writes a flattened
 * snapshot to src/content/github.json. Runs as a `prebuild` hook so
 * the result is committed when needed and the runtime never hits the API
 * (NFR-6).
 *
 * If the API call fails (rate limit, offline, 4xx/5xx), we keep whatever
 * existing src/content/github.json is on disk so the build never breaks.
 *
 * Usage:
 *   node scripts/fetch-github.ts
 *
 * Env:
 *   GITHUB_TOKEN  optional; raises rate limit from 60 to 5000/hr.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT = resolve(__dirname, "..", "src", "content", "github.json");
const USERNAME = "LvnnnX";

// Curated set surfaced on the home page (FR-7.1). Keep to 4.
const FEATURED_REPOS = [
  "Portfolio-Web-2",
  "exam-app",
  "FruitNinjaAUTO",
  "POS-Restaurant",
];

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
}

interface SnapshotFile {
  fetchedAt: string;
  repos: RepoSnapshot[];
}

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-v3-build",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchRepo(name: string): Promise<RepoSnapshot | null> {
  const url = `https://api.github.com/repos/${USERNAME}/${name}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`[github] ${name}: ${res.status} ${res.statusText}`);
    return null;
  }
  const data = (await res.json()) as GitHubRepoApi;
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    url: data.html_url,
    homepage: data.homepage,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    topics: data.topics ?? [],
    pushedAt: data.pushed_at,
  };
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
  console.log(`[github] fetching ${FEATURED_REPOS.length} repos for ${USERNAME}…`);
  const results = await Promise.all(FEATURED_REPOS.map(fetchRepo));
  const repos = results.filter((r): r is RepoSnapshot => r !== null);

  if (repos.length === 0) {
    const existing = await readExisting();
    if (existing) {
      console.warn("[github] all fetches failed — keeping existing snapshot");
      return;
    }
    console.warn("[github] no data fetched and no existing snapshot — writing empty");
  }

  const payload: SnapshotFile = {
    fetchedAt: new Date().toISOString(),
    repos,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`[github] wrote ${repos.length} repos to ${OUTPUT}`);
}

main().catch((err) => {
  console.error("[github] unexpected error:", err);
  // Don't fail the build — the existing snapshot (if any) will be used.
  process.exit(0);
});
