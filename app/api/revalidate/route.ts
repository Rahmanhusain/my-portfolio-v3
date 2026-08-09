import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/db/collections';

/**
 * On-demand cache invalidation, called by the admin panel after every write.
 *
 * This is the link that makes an edit show up on the live site without a
 * redeploy: the admin saves a document, POSTs the affected tags here, and the
 * next request re-reads MongoDB.
 *
 * Auth is a shared secret in `x-revalidate-secret`. That is deliberately not a
 * JWT — the two apps do not share a session, and a leaked secret can only
 * cause a cache miss, never a data change. If the secret is unset the route
 * refuses every request rather than defaulting to open.
 */

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error('[Revalidate] REVALIDATE_SECRET is not set — refusing.');
    return Response.json({ error: 'Revalidation is not configured.' }, { status: 503 });
  }

  const provided = request.headers.get('x-revalidate-secret');
  if (provided !== secret) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let tags: unknown;
  try {
    ({ tags } = (await request.json()) as { tags?: unknown });
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    return Response.json(
      { error: 'Body must be { tags: string[] } with at least one tag.' },
      { status: 400 },
    );
  }

  // Only tags this app actually caches under — an unknown tag is a caller bug
  // worth surfacing, not something to silently accept.
  const unknown = tags.filter((tag) => typeof tag !== 'string' || !VALID_TAGS.has(tag));
  if (unknown.length > 0) {
    return Response.json(
      { error: `Unknown cache tags: ${unknown.join(', ')}` },
      { status: 400 },
    );
  }

  for (const tag of tags as string[]) {
    // `{ expire: 0 }` drops the entry immediately, so the very next request
    // re-reads the database. The stale-while-revalidate profile ('max') would
    // serve the *old* content once more, which reads as "my edit didn't save".
    // The one-argument form has the behaviour we want but is deprecated.
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: tags, at: Date.now() });
}
