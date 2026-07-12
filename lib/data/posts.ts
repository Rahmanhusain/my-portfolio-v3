import type { ContentBlock } from '@/lib/content-blocks';
export type { ContentBlock } from '@/lib/content-blocks';

// ─── Raw JSON shape (updatedAt is a string in JSON) ──────────────────────────

interface PostRaw {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  updatedAt:   string;   // "YYYY-MM-DD" in JSON
  readTime:    string;
  tags:        string[];
  keywords:    string[];
  bannerImage: string;
  bannerAlt:   string;
  body:        ContentBlock[];
}

// ─── Public type (updatedAt promoted to Date) ────────────────────────────────

export interface Post extends Omit<PostRaw, 'updatedAt'> {
  updatedAt: Date;
}

// ─── Load from JSON files ────────────────────────────────────────────────────
// Import each file explicitly — Next.js static analysis needs literal paths.

import gsapPost        from '@/content/posts/building-performant-animations-with-gsap.json';
import seoPost         from '@/content/posts/next-js-app-router-seo-checklist.json';
import tailwindPost    from '@/content/posts/tailwind-css-v4-what-changed.json';

function hydrate(raw: PostRaw): Post {
  return { ...raw, updatedAt: new Date(raw.updatedAt) };
}

// Sorted newest-first so callers can simply slice(0, n)
export const posts: Post[] = [
  hydrate(gsapPost     as PostRaw),
  hydrate(seoPost      as PostRaw),
  hydrate(tailwindPost as PostRaw),
].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
