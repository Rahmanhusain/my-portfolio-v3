import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/* Inline markdown-style links: [label](/path) or [label](https://...).
   Internal paths render as fast Next.js <Link>s; http(s) URLs render as
   external <a> (new tab). Any other scheme is left as plain text. */
function safeHref(href: string): string | null {
  const h = href.trim();
  if (h.startsWith('/') || h.startsWith('#')) return h;
  if (/^https?:\/\//i.test(h)) return h;
  return null;
}

function renderRich(text: string): ReactNode[] {
  const md = /\[([^\]]+)\]\(([^)]+)\)/g;
  const html = /<a\s+[^>]*href=(["'])([^"']+)\1[^>]*>([^<]*)<\/a>/gi;
  const matches: { index: number; end: number; label: string; href: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = md.exec(text)) !== null) {
    const href = safeHref(m[2]);
    if (href) matches.push({ index: m.index, end: m.index + m[0].length, label: m[1], href });
  }
  while ((m = html.exec(text)) !== null) {
    const href = safeHref(m[2]);
    if (href) matches.push({ index: m.index, end: m.index + m[0].length, label: m[3], href });
  }
  matches.sort((a, b) => a.index - b.index);

  const cls = 'text-fg underline underline-offset-2 hover:text-[#ffb3c6] transition-colors';
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const mt of matches) {
    if (mt.index > last) nodes.push(text.slice(last, mt.index));
    nodes.push(
      mt.href.startsWith('http') ? (
        <a key={key++} href={mt.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {mt.label}
        </a>
      ) : (
        <Link key={key++} href={mt.href} className={cls}>
          {mt.label}
        </Link>
      ),
    );
    last = mt.end;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// ─── Block types ─────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: 'h2';    text: string }
  | { type: 'h3';    text: string }
  | { type: 'p';     text: string }
  | { type: 'ul';    items: string[] }
  | { type: 'ol';    items: string[] }
  | { type: 'code';  lang: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'hr' };

// ─── Heading anchors ─────────────────────────────────────────────────────────

/**
 * Stable, URL-safe id for a heading. Used both by the renderer (to stamp the
 * `id`) and by the table of contents (to build the `href`), so the two can
 * never drift apart. Markdown link syntax is stripped first so
 * `[Next.js](https://…)` in a heading doesn't leak brackets into the slug.
 */
export function headingSlug(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

/** Extracts the h2/h3 outline of a document, for a table of contents. */
export function extractHeadings(blocks: ContentBlock[]) {
  return blocks
    .filter(
      (b): b is Extract<ContentBlock, { type: 'h2' | 'h3' }> =>
        b.type === 'h2' || b.type === 'h3'
    )
    .map((b) => ({
      level: b.type,
      text: b.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
      id: headingSlug(b.text),
    }));
}

// ─── Renderer ────────────────────────────────────────────────────────────────

export function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={i}
          id={headingSlug(block.text)}
          className="group font-display text-2xl font-semibold text-fg tracking-tight mt-10 mb-4"
        >
          {renderRich(block.text)}
          <a
            href={`#${headingSlug(block.text)}`}
            aria-label={`Link to this section`}
            className="ml-2 align-middle text-base text-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
          >
            #
          </a>
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={i}
          id={headingSlug(block.text)}
          className="font-display text-xl font-semibold text-fg tracking-tight mt-7 mb-3"
        >
          {renderRich(block.text)}
        </h3>
      );

    case 'p':
      return (
        <p key={i} className="text-muted leading-relaxed mb-5">
          {renderRich(block.text)}
        </p>
      );

    case 'ul':
      return (
        <ul
          key={i}
          className="mb-5 space-y-2 pl-5 list-disc marker:text-faint"
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-sm text-muted leading-relaxed">
              {renderRich(item)}
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol
          key={i}
          className="mb-5 space-y-2 pl-5 list-decimal marker:text-faint"
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-sm text-muted leading-relaxed">
              {renderRich(item)}
            </li>
          ))}
        </ol>
      );

    case 'code':
      return (
        <div
          key={i}
          className="mb-5 rounded-xl overflow-hidden border border-border"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-raised border-b border-border">
            <span className="text-[10px] text-muted uppercase tracking-wider font-mono">
              {block.lang}
            </span>
          </div>
          <pre className="bg-surface p-5 overflow-x-auto">
            <code className="text-xs text-strong font-mono leading-relaxed whitespace-pre">
              {block.code}
            </code>
          </pre>
        </div>
      );

    case 'image':
      return (
        <figure key={i} className="mb-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted text-center mt-3">
              {renderRich(block.caption)}
            </figcaption>
          )}
        </figure>
      );

    case 'table':
      return (
        <figure key={i} className="mb-6">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {block.headers.map((h, j) => (
                    <th
                      key={j}
                      className="bg-raised px-4 py-3 text-left font-semibold text-fg whitespace-nowrap border-b border-border"
                    >
                      {renderRich(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr
                    key={r}
                    className="odd:bg-bg even:bg-surface hover:bg-border transition-colors"
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="px-4 py-3 text-muted align-top border-b border-border"
                      >
                        {renderRich(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted text-center mt-3">
              {renderRich(block.caption)}
            </figcaption>
          )}
        </figure>
      );

    case 'hr':
      return <hr key={i} className="border-border my-8" />;

    default:
      return null;
  }
}
