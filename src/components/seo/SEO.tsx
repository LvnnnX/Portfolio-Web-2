/**
 * SEO uses React 19's native document metadata hoisting.
 * <title>, <meta>, and <link> rendered anywhere in the component tree are
 * automatically promoted to <head> by React 19, so we don't need helmet.
 *
 * Reference: https://react.dev/reference/react-dom/components/title
 */

const SITE_URL = "https://www.daniwismagatha.my.id";
const SITE_NAME = "Pande Gede Dani Wismagatha";
const DEFAULT_DESCRIPTION =
  "Computer Vision & Applied ML Engineer building vision systems for real-world automation.";
const DEFAULT_OG_IMAGE = "/og-default.png";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  /** ISO date string for article type. */
  publishedTime?: string;
  /** Skip the global "| Pande Dani" suffix. */
  exact?: boolean;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  exact,
}: SEOProps) {
  const fullTitle = exact ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Computer Vision & Applied ML Engineer",
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://github.com/LvnnnX",
      "https://www.linkedin.com/in/kokopandan",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karangasem",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
