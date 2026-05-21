import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import "../blog/styles/case-study.css";

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  edition?: string;
  location?: string;
  validFrom?: string;
  tags?: string[];
}

interface PricelistModule {
  default: ComponentType;
  frontmatter?: Frontmatter;
}

const modules = import.meta.glob<PricelistModule>(
  "../content/pricelist/*.mdx",
  { eager: true },
);

const entries = Object.values(modules);
const latest = entries[entries.length - 1];

export default function ServicesPage() {
  if (!latest) {
    return (
      <main className="cs">
        <article className="cs-article">
          <Link to="/" className="cs-back">
            <ArrowLeft size={12} /> Back to portfolio
          </Link>
          <h1 className="cs-title">Services</h1>
          <p className="cs-deck">No pricelist published yet.</p>
        </article>
      </main>
    );
  }

  const MDX = latest.default;
  const fm = latest.frontmatter ?? {};
  const eyebrowParts = [fm.edition, fm.location].filter(Boolean);

  return (
    <main className="cs">
      <SEO
        title={fm.title ?? "Services"}
        description={fm.description ?? ""}
        path="/services"
      />

      <article className="cs-article">
        <Link to="/" className="cs-back">
          <ArrowLeft size={12} /> Back to portfolio
        </Link>

        <p className="cs-eyebrow">
          <span>Services</span>
          {eyebrowParts.length > 0 && (
            <span className="cs-eyebrow__period">
              · {eyebrowParts.join(" · ")}
            </span>
          )}
          {fm.validFrom && (
            <span className="cs-eyebrow__period">· Berlaku {fm.validFrom}</span>
          )}
        </p>

        <h1 className="cs-title">{fm.title ?? "Services"}</h1>

        {fm.description && <p className="cs-deck">{fm.description}</p>}

        <div className="cs-grid">
          <div className="cs-body" style={{ gridColumn: "1 / -1" }}>
            <MDX />
          </div>
        </div>
      </article>
    </main>
  );
}
