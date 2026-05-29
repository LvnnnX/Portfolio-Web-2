import type { ReactElement } from "react";
export interface MastheadProps { edition: string; date?: string }
export function Masthead({ edition, date }: MastheadProps): ReactElement {
  return <header className="editorial-masthead"><div className="editorial-masthead__brand">Dani Wismagatha</div><div className="editorial-masthead__meta">{edition}{date ? ` · ${date}` : ""}</div></header>;
}
