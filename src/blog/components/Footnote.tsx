import type { ReactNode } from "react";

interface FootnoteProps {
  children: ReactNode;
}

export default function Footnote({ children }: FootnoteProps) {
  return <aside className="editorial-footnote">{children}</aside>;
}
