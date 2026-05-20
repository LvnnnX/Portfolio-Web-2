import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
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
