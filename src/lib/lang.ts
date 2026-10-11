/** Sections written in Indonesian; everything else (/, /case-study) is English. */
const INDONESIAN_PREFIXES = ["/blog", "/tech-news", "/services", "/planned-website"];

export function langFor(pathname: string): "id" | "en" {
  return INDONESIAN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ? "id"
    : "en";
}
