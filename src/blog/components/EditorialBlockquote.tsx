import type { ReactNode } from "react";

interface EditorialBlockquoteProps {
  children: ReactNode;
}

export default function EditorialBlockquote({ children }: EditorialBlockquoteProps) {
  return <blockquote className="editorial-quote">{children}</blockquote>;
}
