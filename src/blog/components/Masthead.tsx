import type { ReactNode } from "react";

interface MastheadProps {
  edition?: string | number;
  date?: string;
  /** e.g. "5 min · 1.450 kata" */
  meta?: string;
}

const formatEdition = (edition: string | number | undefined): string | null => {
  if (edition === undefined || edition === null || edition === "") return null;
  const n = typeof edition === "number" ? edition : Number(edition);
  if (!Number.isFinite(n)) return String(edition);
  return `EDISI ${String(Math.floor(n)).padStart(2, "0")}`;
};

export default function Masthead({ edition, date, meta }: MastheadProps) {
  const editionLabel = formatEdition(edition);
  const parts: ReactNode[] = [];
  if (editionLabel) parts.push(editionLabel);
  if (date) parts.push(date);
  if (meta) parts.push(meta);

  return (
    <header className="editorial-masthead">
      <span className="editorial-masthead__brand">DANIWISMAGATHA.MY.ID / CATATAN</span>
      <span className="editorial-masthead__meta">
        {parts.map((part, i) => (
          <span key={i}>
            {i > 0 ? " · " : ""}
            {part}
          </span>
        ))}
      </span>
    </header>
  );
}
