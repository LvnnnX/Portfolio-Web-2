import type { ReactElement } from "react";
export interface EyebrowProps { children: string }
export function Eyebrow({ children }: EyebrowProps): ReactElement {
  return <p className="editorial-eyebrow">{children}</p>;
}
