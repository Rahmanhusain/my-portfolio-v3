import type { ReactNode } from 'react';

// ─── Content block types ────────────────────────────────────────────────────
// Rich content is expressed as a typed array of blocks so pages can render
// images, code, headings and paragraphs without a markdown parser.

export type ContentBlock =
  | { type: 'h2';   text: string }
  | { type: 'h3';   text: string }
  | { type: 'p';    text: string }
  | { type: 'ul';   items: string[] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'hr' };

// ─── Post type ───────────────────────────────────────────────────────────────

export interface Post {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  updatedAt:   Date;
  readTime:    string;
  tags:        string[];
  keywords:    string[];
  bannerImage: string;        // required — shown at top of post
  bannerAlt:   string;
  body:        ContentBlock[]; // rich structured content
}

// ─── Posts ───────────────────────────────────────────────────────────────────
// Keep sorted newest-first so callers can just slice(0, n).

export const posts: Post[] = [
  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    slug:        'building-performant-animations-with-gsap',
    title:       'Building Performant Animations with GSAP and React',
    description: 'A deep dive into crafting smooth, GPU-accelerated animations using GSAP ScrollTrigger inside Next.js App Router components — without memory leaks or layout thrash.',
    date:        'June 12, 2025',
    updatedAt:   new Date('2025-06-12'),
    readTime:    '8 min read',
    tags:        ['GSAP', 'React', 'Animation', 'Performance'],
    keywords:    ['GSAP animation React', 'ScrollTrigger Next.js', 'web animation performance', 'useGSAP hook', 'GPU-accelerated animations'],
    bannerImage: '/blogpostimages/banner.webp',
    bannerAlt:   'Abstract animation curves representing smooth GSAP-powered motion on a dark background',
    body: [
      {
        type: 'p',
        text: 'GSAP is the gold standard for web animations. Paired with React\'s component model and the useGSAP hook from @gsap/react, you get a powerful, leak-free animation system that plays nicely with the Next.js App Router.',
      },
      { type: 'h2', text: 'Why useGSAP Over a Plain useEffect?' },
      {
        type: 'p',
        text: 'A standard useEffect that creates a GSAP tween will not clean up properly when the component unmounts during navigation. The useGSAP hook solves this — it automatically reverts all tweens and ScrollTriggers registered inside it when the component leaves the tree.',
      },
      { type: 'h2', text: 'Basic Setup' },
      {
        type: 'code',
        lang: 'tsx',
        code: `import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export default function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.fade-in', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: containerRef });

  return <div ref={containerRef}>...</div>;
}`,
      },
      {
        type: 'p',
        text: 'Scoping animations to a container ref prevents GSAP from querying elements outside the component — important when you have multiple instances on the same page.',
      },
      { type: 'h2', text: 'Keeping ScrollTrigger in Sync with Lenis' },
      {
        type: 'p',
        text: 'If you use Lenis for smooth scrolling, ScrollTrigger\'s scroll proxy needs to read from Lenis instead of the native scroll position. Set up scrollerProxy in your SmoothScrollProvider and call ScrollTrigger.refresh() after layout is fully painted.',
      },
      { type: 'h2', text: 'Performance Tips' },
      {
        type: 'ul',
        items: [
          'Animate only transform and opacity — these stay on the compositor thread and avoid layout recalculation.',
          'Set will-change: transform on elements before animation begins, then clear it afterward.',
          'Use gsap.set() instead of gsap.to() when you want an immediate state change with no duration.',
          'Batch DOM reads before writes inside your animation callbacks to avoid forced reflows.',
        ],
      },
      { type: 'h2', text: 'Debugging' },
      {
        type: 'p',
        text: 'GSAP DevTools is free for local development. It provides a timeline panel in Chrome DevTools where you can scrub, slow down, and inspect every tween registered on the page.',
      },
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    slug:        'next-js-app-router-seo-checklist',
    title:       'The Complete Next.js App Router SEO Checklist',
    description: 'From metadata objects and Open Graph images to structured data and sitemaps — everything you need to push your Next.js site to Lighthouse SEO 100.',
    date:        'May 3, 2025',
    updatedAt:   new Date('2025-05-03'),
    readTime:    '6 min read',
    tags:        ['Next.js', 'SEO', 'Metadata', 'Performance'],
    keywords:    ['Next.js App Router SEO', 'Next.js metadata API', 'Open Graph Next.js', 'sitemap Next.js', 'JSON-LD structured data'],
    bannerImage: '/blog/nextjs-seo.jpg',
    bannerAlt:   'Lighthouse score panel showing 100 for SEO alongside a Next.js project structure',
    body: [
      {
        type: 'p',
        text: 'Hitting Lighthouse SEO 100 consistently is achievable with a methodical setup. The App Router\'s built-in metadata API handles the heavy lifting — you just need to know where to put things.',
      },
      { type: 'h2', text: '1. Root Metadata Object' },
      {
        type: 'p',
        text: 'Export a typed Metadata object from your root layout.tsx. Use the template format for titles so every page gets the brand suffix automatically.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `export const metadata: Metadata = {
  metadataBase: new URL('https://yourname.dev'),
  title: { default: 'Rahman — Full-Stack Developer', template: '%s | Rahman' },
  description: 'A 150–160 character description of your site.',
  openGraph: {
    images: ['/og-image.png'],
    locale: 'en_US',
    type: 'website',
  },
};`,
      },
      { type: 'h2', text: '2. Per-Page Metadata' },
      {
        type: 'p',
        text: 'Override metadata in each page.tsx. For dynamic routes use generateMetadata() — it receives the same params as the page component and can fetch data before returning.',
      },
      { type: 'h2', text: '3. Sitemap' },
      {
        type: 'p',
        text: 'Create app/sitemap.ts returning a MetadataRoute.Sitemap array. Next.js automatically serves it at /sitemap.xml. Include all blog posts and service pages with their lastModified dates.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `import { posts } from '@/lib/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://yourname.dev', lastModified: new Date() },
    ...posts.map(p => ({
      url: \`https://yourname.dev/blog/\${p.slug}\`,
      lastModified: p.updatedAt,
    })),
  ];
}`,
      },
      { type: 'h2', text: '4. Structured Data (JSON-LD)' },
      {
        type: 'p',
        text: 'Add a Person schema in the root layout for personal sites. Add BlogPosting schema on each post page. Inject it as a <script type="application/ld+json"> tag — Next.js handles escaping automatically when you use dangerouslySetInnerHTML.',
      },
      { type: 'h2', text: '5. Core Web Vitals' },
      {
        type: 'ul',
        items: [
          'Use next/image for all images — it eliminates CLS with automatic size reservation.',
          'Self-host fonts with next/font — eliminates render-blocking third-party font requests.',
          'Lazy-load heavy client components using dynamic() with { ssr: false } where appropriate.',
          'Set priority on above-the-fold images to prevent LCP delays.',
        ],
      },
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    slug:        'tailwind-css-v4-what-changed',
    title:       'Tailwind CSS v4 — What Actually Changed',
    description: 'Tailwind v4 rewrites the engine in Rust, drops the JavaScript config file, and moves all configuration into CSS. Here is what you need to know before migrating.',
    date:        'March 18, 2025',
    updatedAt:   new Date('2025-03-18'),
    readTime:    '5 min read',
    tags:        ['Tailwind CSS', 'CSS', 'Frontend'],
    keywords:    ['Tailwind CSS v4', 'Tailwind v4 migration', 'Lightning CSS', '@theme directive', 'Tailwind CSS config'],
    bannerImage: '/blog/tailwind-v4.jpg',
    bannerAlt:   'Tailwind CSS v4 logo over a dark code editor showing the new @theme CSS directive',
    body: [
      {
        type: 'p',
        text: 'Tailwind v4 is a ground-up rewrite with a new Rust-powered engine. If you are upgrading an existing project, most changes are handled by the official codemod — but understanding what changed helps you make better decisions going forward.',
      },
      { type: 'h2', text: 'No More tailwind.config.js' },
      {
        type: 'p',
        text: 'Configuration moves entirely into CSS via the @theme directive. Colors, fonts, spacing, and breakpoints are all defined as CSS custom properties, which means your design tokens are available natively in the browser without any build step.',
      },
      {
        type: 'code',
        lang: 'css',
        code: `@import "tailwindcss";

@theme inline {
  --color-brand:   #6366f1;
  --font-display:  "Inter Tight", sans-serif;
  --radius-card:   1rem;
}`,
      },
      { type: 'h2', text: 'Rust-Based Engine (Lightning CSS)' },
      {
        type: 'p',
        text: 'The new engine processes CSS dramatically faster. Incremental builds that took hundreds of milliseconds now complete in single-digit milliseconds on large projects. Cold builds are typically 10x faster than v3.',
      },
      { type: 'h2', text: 'CSS-First Plugins' },
      {
        type: 'p',
        text: 'Plugins are now authored as CSS files using @plugin, rather than JavaScript functions. This makes community plugins easier to write, read, and audit.',
      },
      { type: 'h2', text: 'What Stayed the Same' },
      {
        type: 'ul',
        items: [
          'All utility class names remain identical — no relearning required.',
          'The JIT engine is still the default (and only) mode.',
          'PostCSS integration works exactly as before.',
          'Arbitrary values like w-[420px] and the bracket syntax are fully supported.',
        ],
      },
      { type: 'h2', text: 'Migrating an Existing Project' },
      {
        type: 'p',
        text: 'Run npx @tailwindcss/upgrade to automatically convert your config file and update import paths. Review the output carefully — custom plugins and theme extensions need manual attention.',
      },
    ],
  },
];
