import type { ReactElement, ReactNode } from "react";
export interface LedeProps { children: ReactNode }
export function Lede({ children }: LedeProps): ReactElement {
  return <p className="editorial-lede">{children}</p>;
}
