import Image from 'next/image';

// ─── Block types ─────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: 'h2';    text: string }
  | { type: 'h3';    text: string }
  | { type: 'p';     text: string }
  | { type: 'ul';    items: string[] }
  | { type: 'ol';    items: string[] }
  | { type: 'code';  lang: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
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
          {block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={i}
          className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mt-7 mb-3"
        >
          {block.text}
        </h3>
      );

    case 'p':
      return (
        <p key={i} className="text-[#8a8a8a] leading-relaxed mb-5">
          {block.text}
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
              {item}
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
              {item}
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
              {block.caption}
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
