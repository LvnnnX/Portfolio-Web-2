import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";

export default function NotFoundPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <SEO
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex
      />
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold tracking-[0.12em] text-[color:var(--color-accent,#B8422E)] uppercase mb-4">
          404
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
