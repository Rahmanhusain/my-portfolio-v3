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

  const cls = 'text-[#fafafa] underline underline-offset-2 hover:text-[#ffb3c6] transition-colors';
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

// ─── Renderer ────────────────────────────────────────────────────────────────

export function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={i}
          className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mt-10 mb-4"
        >
          {renderRich(block.text)}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={i}
          className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mt-7 mb-3"
        >
          {renderRich(block.text)}
        </h3>
      );

    case 'p':
      return (
        <p key={i} className="text-[#8a8a8a] leading-relaxed mb-5">
          {renderRich(block.text)}
        </p>
      );

    case 'ul':
      return (
        <ul
          key={i}
          className="mb-5 space-y-2 pl-5 list-disc marker:text-[#3a3a3a]"
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-sm text-[#8a8a8a] leading-relaxed">
              {renderRich(item)}
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol
          key={i}
          className="mb-5 space-y-2 pl-5 list-decimal marker:text-[#3a3a3a]"
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-sm text-[#8a8a8a] leading-relaxed">
              {renderRich(item)}
            </li>
          ))}
        </ol>
      );

    case 'code':
      return (
        <div
          key={i}
          className="mb-5 rounded-xl overflow-hidden border border-[#242424]"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#242424]">
            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-mono">
              {block.lang}
            </span>
          </div>
          <pre className="bg-[#0d0d0d] p-5 overflow-x-auto">
            <code className="text-xs text-[#c9d1d9] font-mono leading-relaxed whitespace-pre">
              {block.code}
            </code>
          </pre>
        </div>
      );

    case 'image':
      return (
        <figure key={i} className="mb-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#242424]">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-[#8a8a8a] text-center mt-3">
              {renderRich(block.caption)}
            </figcaption>
          )}
        </figure>
      );

    case 'table':
      return (
        <figure key={i} className="mb-6">
          <div className="overflow-x-auto rounded-xl border border-[#242424]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {block.headers.map((h, j) => (
                    <th
                      key={j}
                      className="bg-[#141414] px-4 py-3 text-left font-semibold text-[#fafafa] whitespace-nowrap border-b border-[#242424]"
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
                    className="odd:bg-[#0a0a0a] even:bg-[#0d0d0d] hover:bg-[#161616] transition-colors"
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="px-4 py-3 text-[#8a8a8a] align-top border-b border-[#242424]"
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
            <figcaption className="text-xs text-[#8a8a8a] text-center mt-3">
              {renderRich(block.caption)}
            </figcaption>
          )}
        </figure>
      );

    case 'hr':
      return <hr key={i} className="border-[#242424] my-8" />;

    default:
      return null;
  }
}
