import { CACHE_TAGS, postsCollection } from '@/lib/db/collections';
import { cachedContent, emptyArray } from '@/lib/data/loader';
import type { Post, PostRaw } from '@/lib/types/content';

export type { ContentBlock, Post, PostRaw } from '@/lib/types/content';

// ─── Bundled fallback ────────────────────────────────────────────────────────

import kimivsfable5 from '@/content/posts/kimik3vsfable5.json';
import gsapPost from '@/content/posts/gsap.json';
import queryMethod from '@/content/posts/querymethod.json';
import customCrm from '@/content/posts/custom-crm-vs-saas-tool.json';
import whyBusinessEmailKeepGoingToSpam from '@/content/posts/why-business-email-keep-going-to-spam.json';
import vercelVsAwsForSmallBusinessApps from '@/content/posts/vercel-vs-aws-for-small-business.json';
import howMuchTimeAutomationActuallySavesASmallTeam from '@/content/posts/how-much-time-automation-actually-saves-a-small-team.json';
import signsYourBusinessNeedsAB2BBuyerPortal from '@/content/posts/signs-your-business-needs-a-b2b-buyer-portal.json';

/** `updatedAt` is a `YYYY-MM-DD` string in storage and a `Date` in the UI. */
function hydrate(raw: PostRaw): Post {
  return { ...raw, updatedAt: new Date(raw.updatedAt) };
}

/** Newest-first, so `sitemap.ts` and the homepage preview can both `slice(0, n)`. */
function sortNewestFirst(list: Post[]): Post[] {
  return [...list].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export const fallbackPosts: Post[] = sortNewestFirst([
  hydrate(kimivsfable5 as PostRaw),
  hydrate(queryMethod as PostRaw),
  hydrate(gsapPost as PostRaw),
  hydrate(customCrm as PostRaw),
  hydrate(whyBusinessEmailKeepGoingToSpam as PostRaw),
  hydrate(vercelVsAwsForSmallBusinessApps as PostRaw),
  hydrate(howMuchTimeAutomationActuallySavesASmallTeam as PostRaw),
  hydrate(signsYourBusinessNeedsAB2BBuyerPortal as PostRaw),
]);

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Every published post, newest-first.
 *
 * The database read returns `PostRaw` (string dates) and hydration happens
 * here, after the cache — `unstable_cache` serialises its payload, so a `Date`
 * stored inside the cache would come back as a string and `getTime()` would
 * throw. Keeping the cached value string-shaped makes that impossible.
 */
const getRawPosts = cachedContent<PostRaw[]>(
  CACHE_TAGS.posts,
  async () => {
    const collection = await postsCollection();
    const docs = await collection
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return docs.map((doc) => doc.data);
  },
  () => fallbackPosts.map((post) => ({
    ...post,
    updatedAt: post.updatedAt.toISOString().slice(0, 10),
  })),
  emptyArray,
);

export async function getPosts(): Promise<Post[]> {
  const raw = await getRawPosts();
  return sortNewestFirst(raw.map(hydrate));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getPosts();
  return all.find((post) => post.slug === slug) ?? null;
}
