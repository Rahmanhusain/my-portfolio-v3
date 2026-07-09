export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: Date;
  readTime: string;
  tags: string[];
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'building-performant-animations-with-gsap',
    title: 'Building Performant Animations with GSAP and React',
    description:
      'A deep dive into crafting smooth, GPU-accelerated animations using GSAP ScrollTrigger inside Next.js App Router components without memory leaks.',
    date: 'June 12, 2025',
    updatedAt: new Date('2025-06-12'),
    readTime: '8 min read',
    tags: ['GSAP', 'React', 'Animation', 'Performance'],
    content: `
# Building Performant Animations with GSAP and React

GSAP is the gold standard for web animations. Paired with React's component model and the \`useGSAP\` hook from \`@gsap/react\`, you get a powerful, leak-free animation system.

## Why useGSAP?

The \`useGSAP\` hook from \`@gsap/react\` automatically handles cleanup when a component unmounts — no dangling tweens or ScrollTriggers left behind. This is critical in Next.js App Router where components mount and unmount during navigation.

## Basic Setup

\`\`\`ts
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
}
\`\`\`

Always scope animations to a container ref to avoid targeting elements outside the component.
    `.trim(),
  },
  {
    slug: 'next-js-app-router-seo-checklist',
    title: 'The Complete Next.js App Router SEO Checklist',
    description:
      'From metadata objects and OpenGraph images to structured data and sitemaps — everything you need to hit Lighthouse SEO 100.',
    date: 'May 3, 2025',
    updatedAt: new Date('2025-05-03'),
    readTime: '6 min read',
    tags: ['Next.js', 'SEO', 'Metadata', 'Performance'],
    content: `
# The Complete Next.js App Router SEO Checklist

Hitting Lighthouse SEO 100 is achievable with the right setup. The App Router makes it cleaner than ever.

## 1. Metadata Object

Export a typed \`Metadata\` object from your \`layout.tsx\` and override it per page.

\`\`\`ts
export const metadata: Metadata = {
  title: { default: 'My Site', template: '%s | My Site' },
  description: '150–160 character summary',
  openGraph: { ... },
};
\`\`\`

## 2. Sitemap

Create \`app/sitemap.ts\` returning a \`MetadataRoute.Sitemap\` array. Next.js serves it at \`/sitemap.xml\` automatically.

## 3. Structured Data

Add JSON-LD \`Person\` schema in the root layout for personal/portfolio sites. Add \`BlogPosting\` schema per post.

## 4. Core Web Vitals

- Use \`next/image\` for all images — eliminates CLS.
- Self-host fonts with \`next/font\` — eliminates render-blocking requests.
- Lazy-load heavy client components with dynamic imports.
    `.trim(),
  },
  {
    slug: 'tailwind-css-v4-what-changed',
    title: 'Tailwind CSS v4 — What Actually Changed',
    description:
      'Tailwind v4 rewrites the engine in Rust, drops the config file, and moves everything into CSS. Here is what you need to know to migrate.',
    date: 'March 18, 2025',
    updatedAt: new Date('2025-03-18'),
    readTime: '5 min read',
    tags: ['Tailwind CSS', 'CSS', 'Frontend'],
    content: `
# Tailwind CSS v4 — What Actually Changed

Tailwind v4 is a ground-up rewrite. The biggest changes affect how you configure and extend the framework.

## No More tailwind.config.js

Configuration moves into CSS via the \`@theme\` directive:

\`\`\`css
@import "tailwindcss";

@theme inline {
  --color-brand: #6366f1;
  --font-display: "Inter Tight", sans-serif;
}
\`\`\`

## Rust-Based Engine (Lightning CSS)

The new engine is dramatically faster — full builds that took seconds now take milliseconds.

## CSS-First Plugins

Plugins are now written as CSS instead of JavaScript functions, making them simpler to author and maintain.

## Upgrading

Run \`npx @tailwindcss/upgrade\` to migrate existing projects automatically.
    `.trim(),
  },
];
