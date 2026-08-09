import type { MDXComponents } from "mdx/types";
import { Lede } from "./components/Lede";
import { EditorialBlockquote } from "./components/EditorialBlockquote";
import { EditorialTable } from "./components/EditorialTable";
import { Footnote } from "./components/Footnote";

export function useMDXComponents(): MDXComponents {
  return { Lede, Footnote, blockquote: EditorialBlockquote, table: EditorialTable };
}
