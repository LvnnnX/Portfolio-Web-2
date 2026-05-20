import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import CaseStudyLayout, {
  type CaseStudyFrontmatter,
} from "../components/layout/CaseStudyLayout";
import SEO from "../components/seo/SEO";
import NotFoundPage from "./NotFoundPage";

interface MdxModule {
  default: ComponentType;
  frontmatter?: Partial<CaseStudyFrontmatter>;
}

const modules = import.meta.glob<MdxModule>(
  "../content/case-studies/*.mdx",
  { eager: true },
);

const studies = new Map<string, MdxModule>();
for (const [path, mod] of Object.entries(modules)) {
  const slug = mod.frontmatter?.slug ?? path.split("/").pop()?.replace(/\.mdx$/, "");
  if (slug) studies.set(slug, mod);
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? studies.get(slug) : undefined;

  if (!mod) return <NotFoundPage />;

  const MDX = mod.default;
  const fm = mod.frontmatter ?? {};

  const frontmatter: CaseStudyFrontmatter = {
    slug: fm.slug ?? slug!,
    title: fm.title ?? slug!,
    summary: fm.summary ?? "",
    cover: fm.cover,
    repo: fm.repo,
    live: fm.live,
    period: fm.period,
    metrics: fm.metrics,
    tags: fm.tags,
  };

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.summary}
        path={`/case-study/${frontmatter.slug}`}
        image={frontmatter.cover}
        type="article"
      />
      <CaseStudyLayout frontmatter={frontmatter}>
        <MDX />
      </CaseStudyLayout>
    </>
  );
}
