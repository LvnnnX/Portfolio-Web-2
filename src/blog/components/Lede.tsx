import type { ReactNode } from "react";

interface LedeProps {
  children: ReactNode;
}

/**
 * Wrap the lede paragraph(s) of a post. Renders a `.lede` paragraph so the
 * editorial CSS applies the drop cap via `::first-letter` (FR-9.5 — no
 * separate <span>, screen readers read the lede normally).
 *
 * MDX usage:
 *
 *   <Lede>
 *     Hari Selasa lalu aku nonton satu video pendek...
 *   </Lede>
 */
export default function Lede({ children }: LedeProps) {
  return <p className="lede">{children}</p>;
}
