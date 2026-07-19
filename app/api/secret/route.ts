
/**
 * Exposes ONLY a one-way SHA-256 hash of the easter-egg trigger phrase.
 *
 * The plaintext lives in the server-only `CAT_SECRET_PHRASE` env var — it is
 * never inlined into the client bundle and never sent over the wire. The
 * browser receives just the irreversible hash + length, which is enough to
 * match keystrokes against but reveals nothing about the phrase itself.
 */

const DEFAULT_PHRASE = 'i love you';

export async function GET() {
  const phrase = (process.env.CAT_SECRET_PHRASE ?? DEFAULT_PHRASE).toLowerCase();
  const compact = phrase.replace(/\s+/g, '');

  const data = new TextEncoder().encode(compact);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return Response.json(
    { hash, length: compact.length },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
