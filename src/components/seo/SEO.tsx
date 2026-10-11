/**
 * Page metadata through React 19's native hoisting: <title>, <meta> and <link>
 * rendered anywhere are moved into <head>. The build-time prerender relies on the
 * same hoisting, so these tags also land in the static HTML crawlers read.
 *
 * Reference: https://react.dev/reference/react-dom/components/title
 */

import { langFor } from "../../lib/lang";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
} from "../../seo/schema";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  /** Alt text for the share image; defaults to the page title. */
  imageAlt?: string;
  type?: "website" | "article";
  /** ISO date string for article type. */
  publishedTime?: string;
  tags?: string[];
  /** Skip the global "| Pande Gede Dani Wismagatha" suffix. */
  exact?: boolean;
  /** Keep the page out of search results (and drop its canonical). */
  noindex?: boolean;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = "website",
  publishedTime,
  tags,
  exact,
  noindex,
}: SEOProps) {
  const fullTitle = exact ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const isDefaultImage = image === DEFAULT_OG_IMAGE;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:locale" content={langFor(path) === "id" ? "id_ID" : "en_US"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {!noindex && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt ?? fullTitle} />
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {tags?.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={imageAlt ?? fullTitle} />
    </>
  );
}

/** One or more schema.org objects as JSON-LD. `<` is escaped so content can never close the script. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
