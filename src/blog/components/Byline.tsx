import type { ReactElement } from "react";
export interface BylineProps { author: string; date: string; readTime?: string }
export function Byline({ author, date, readTime }: BylineProps): ReactElement {
  return <p className="editorial-byline"><span>{author}</span><span>·</span><span>{date}</span>{readTime ? <><span>·</span><span>{readTime}</span></> : null}</p>;
}
