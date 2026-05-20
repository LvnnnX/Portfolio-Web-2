import type { ComponentProps } from "react";
import EditorialBlockquote from "./components/EditorialBlockquote";
import EditorialTable from "./components/EditorialTable";
import Lede from "./components/Lede";
import Eyebrow from "./components/Eyebrow";
import Footnote from "./components/Footnote";

/**
 * Provider mapping for MDX rendering inside /blog/[slug].
 *
 * - <blockquote> in raw MDX is auto-promoted to <EditorialBlockquote>.
 * - <table> in raw MDX is auto-promoted to <EditorialTable>.
 * - <Lede>, <Eyebrow>, <Footnote> are exposed as named MDX components for
 *   explicit use in source.mdx (per the "auto-map plus Lede manual" choice).
 *
 * Pass this object to MDXProvider in the post route.
 */
export const blogMdxComponents = {
  blockquote: (props: ComponentProps<"blockquote">) => (
    <EditorialBlockquote>{props.children}</EditorialBlockquote>
  ),
  table: (props: ComponentProps<"table">) => (
    <EditorialTable>{props.children}</EditorialTable>
  ),
  Lede,
  Eyebrow,
  Footnote,
};
