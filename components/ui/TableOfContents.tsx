import { extractHeadings, type ContentBlock } from "@/lib/content-blocks";

/**
 * Sticky outline of an article, generated from its `h2`/`h3` blocks.
 *
 * Two payoffs: readers can see the shape of the piece before committing to it
 * (which is what keeps them on the page), and the jump links give Google a
 * clean set of in-page anchors it can surface as sitelinks.
 *
 * Server Component — the ids come from the same `headingSlug()` the renderer
 * uses, so the links can't break.
 */
export default function TableOfContents({
  body,
  heading = "In this article",
}: {
  body: ContentBlock[];
  heading?: string;
}) {
  const headings = extractHeadings(body);

  // Not worth the visual weight for a two-section post.
  if (headings.length < 3) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="mb-12 rounded-2xl border border-border bg-raised/60 p-6"
    >
      <h2
        id="toc-heading"
        className="mb-4 text-xs font-medium uppercase tracking-widest text-muted"
      >
        {heading}
      </h2>
      <ol className="space-y-2.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === "h3" ? "pl-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className="group flex items-start gap-2.5 text-sm leading-snug text-muted transition-colors duration-200 hover:text-fg"
            >
              <span
                aria-hidden="true"
                className="mt-[0.45rem] h-px w-3 shrink-0 bg-faint transition-all duration-200 group-hover:w-5 group-hover:bg-fg"
              />
              <span className="link-sweep">{heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
