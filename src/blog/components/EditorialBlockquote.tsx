import type { BlockquoteHTMLAttributes, ReactElement } from "react";
export function EditorialBlockquote(props: BlockquoteHTMLAttributes<HTMLQuoteElement>): ReactElement {
  return <blockquote {...props} className="editorial-blockquote" />;
}
