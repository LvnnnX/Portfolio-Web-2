interface BylineProps {
  author?: string;
  date?: string;
  readTime?: string;
}

export default function Byline({ author, date, readTime }: BylineProps) {
  const items = [author, date, readTime].filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  if (items.length === 0) return null;

  return (
    <p className="editorial-byline">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 ? <span className="editorial-byline__sep"> · </span> : null}
          {item}
        </span>
      ))}
    </p>
  );
}
