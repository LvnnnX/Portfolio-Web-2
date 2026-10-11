/** Site identity and schema.org builders shared by the SEO component and pages. */

export const SITE_URL = "https://www.daniwismagatha.my.id";
export const SITE_NAME = "Pande Gede Dani Wismagatha";
export const DEFAULT_DESCRIPTION =
  "Computer Vision & Applied ML Engineer building vision systems for real-world automation.";
export const DEFAULT_OG_IMAGE = "/og-default.png";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (pathOrUrl: string) =>
  pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    alternateName: "Pande Dani",
    url: `${SITE_URL}/`,
    image: absoluteUrl("/images/hero-480.jpg"),
    jobTitle: "Computer Vision & Applied ML Engineer",
    description: DEFAULT_DESCRIPTION,
    sameAs: ["https://github.com/LvnnnX", "https://www.linkedin.com/in/kokopandan"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karangasem",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: "Pande Dani",
    inLanguage: ["en", "id"],
    publisher: { "@id": PERSON_ID },
  };
}

interface ArticleInput {
  type: "BlogPosting" | "Article";
  title: string;
  description: string;
  path: string;
  lang: "id" | "en";
  datePublished?: string;
  image?: string;
  keywords?: string[];
}

export function articleSchema(a: ArticleInput) {
  const url = absoluteUrl(a.path);
  return {
    "@context": "https://schema.org",
    "@type": a.type,
    headline: a.title,
    description: a.description || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: a.lang,
    datePublished: a.datePublished || undefined,
    image: absoluteUrl(a.image ?? DEFAULT_OG_IMAGE),
    keywords: a.keywords?.length ? a.keywords.join(", ") : undefined,
    author: { "@type": "Person", "@id": PERSON_ID, name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
