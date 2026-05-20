interface BylineProps {
  author?: string;
  date?: string;
  readTime?: string;
}

export default function Byline({ author, date, readTime }: BylineProps) {
  const items: { text: string; bold?: boolean }[] = [];
  if (author) items.push({ text: author, bold: true });
  if (date) items.push({ text: date });
  if (readTime) items.push({ text: readTime });

  if (items.length === 0) return null;

  return (
    <p className="editorial-byline">
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
          {i > 0 ? <span className="editorial-byline__sep">·</span> : null}
          <span className={item.bold ? "editorial-byline__author" : undefined}>
            {item.text}
          </span>
        </span>
      ))}
    </p>
  );
}
