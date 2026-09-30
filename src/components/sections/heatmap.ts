export interface ContributionDay {
  date: string;
  level: number;
  count: number;
}

export interface Heatmap {
  /** One entry per column; each column holds 7 slots, Monday first. */
  weeks: (ContributionDay | null)[][];
  monthHeaders: { label: string; weekIndex: number }[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

/** Parse YYYY-MM-DD as UTC so the weekday never shifts with the viewer's timezone. */
function utcDay(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Place each day by its date, not by its position in the array. The GitHub scrape
 * returns cells in the calendar's row order (every Sunday, then every Monday, ...),
 * so any grouping that walks the array in order scrambles the grid.
 */
export function buildHeatmap(days: ContributionDay[]): Heatmap {
  const byDate = new Map<string, ContributionDay>();
  for (const day of days) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day.date)) byDate.set(day.date, day);
  }
  const sorted = [...byDate.values()].sort((a, b) => utcDay(a.date) - utcDay(b.date));
  if (sorted.length === 0) return { weeks: [], monthHeaders: [] };

  const first = utcDay(sorted[0].date);
  const firstRow = (new Date(first).getUTCDay() + 6) % 7; // Monday = 0
  const gridStart = first - firstRow * DAY_MS;
  const last = utcDay(sorted[sorted.length - 1].date);
  const columns = Math.floor((last - gridStart) / DAY_MS / 7) + 1;

  const weeks: (ContributionDay | null)[][] = Array.from({ length: columns }, () =>
    Array<ContributionDay | null>(7).fill(null),
  );
  for (const day of sorted) {
    const offset = Math.round((utcDay(day.date) - gridStart) / DAY_MS);
    weeks[Math.floor(offset / 7)][offset % 7] = day;
  }

  const monthHeaders: Heatmap["monthHeaders"] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;
    const month = new Date(utcDay(firstDay.date)).getUTCMonth();
    if (month !== lastMonth) {
      monthHeaders.push({ label: MONTH_LABELS[month], weekIndex });
      lastMonth = month;
    }
  });

  return { weeks, monthHeaders };
}
