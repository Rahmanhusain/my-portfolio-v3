import { unstable_cache } from 'next/cache';
import { isDbConfigured } from '@/lib/db/mongodb';

/**
 * Wraps a database read in Next's data cache and guarantees it never takes the
 * site down.
 *
 * Three things are folded together here, and all three are deliberate:
 *
 * - **Caching.** Content changes a few times a month but is read on every
 *   render, so the query is cached indefinitely under a tag. The admin panel
 *   POSTs that tag to `/api/revalidate` after a write, so an edit is live in
 *   one round trip instead of waiting for a timer. The one-hour `revalidate`
 *   is only a backstop for a revalidate call that never arrived.
 * - **Fallback on absence.** Without `MONGODB_URI` — a fresh clone, CI without
 *   secrets — the bundled `content/*.json` is served. `next build` therefore
 *   still works with no database at all.
 * - **Fallback on failure or emptiness.** A dropped connection, or a database
 *   that simply hasn't been seeded yet, serves the bundled JSON rather than an
 *   error page or an empty `/blog`. This is what makes adopting the admin panel
 *   a no-downtime change: until you seed, the site behaves exactly as before.
 *
 * `unstable_cache` is used rather than `use cache` on purpose: the latter needs
 * the `cacheComponents` flag, which also switches the App Router to Partial
 * Prerendering and React `<Activity>` navigation. That is a large behavioural
 * change to a site whose homepage is a hand-tuned GSAP/Lenis timeline, and it
 * is not a change this feature needs.
 */
export function cachedContent<T>(
  tag: string,
  load: () => Promise<T>,
  fallback: () => T,
  /** Treat a successful-but-empty read as "not seeded yet" and use the
   *  bundled JSON instead. */
  isEmpty: (value: T) => boolean = () => false,
): () => Promise<T> {
  const cached = unstable_cache(load, [`content:${tag}`], {
    tags: [tag],
    revalidate: 3600,
  });

  return async () => {
    if (!isDbConfigured()) return fallback();

    try {
      const value = await cached();
      return isEmpty(value) ? fallback() : value;
    } catch (error) {
      console.error(
        `[content] Failed to read "${tag}" from MongoDB — serving bundled JSON.`,
        error,
      );
      return fallback();
    }
  };
}

/** `isEmpty` helper for the list-shaped collections. */
export const emptyArray = (value: unknown[]): boolean => value.length === 0;
