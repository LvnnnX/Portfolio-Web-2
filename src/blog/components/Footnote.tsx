import type { ReactElement, ReactNode } from "react";
export interface FootnoteProps { children: ReactNode }
export function Footnote({ children }: FootnoteProps): ReactElement {
  return <aside className="editorial-footnote">{children}</aside>;
}
