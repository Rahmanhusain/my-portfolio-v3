import { MongoClient, type Db } from 'mongodb';

/**
 * Shared MongoDB connection for the public site.
 *
 * The site is *read-only* against this database — the admin panel owns every
 * write. Two properties matter here:
 *
 * 1. **The connection is optional.** `MONGODB_URI` may be absent (a fresh
 *    clone, a CI build without secrets, a preview deploy). Callers check
 *    `isDbConfigured()` and fall back to the bundled `content/*.json` files
 *    rather than failing the build. The site must never white-screen because
 *    a database is unreachable.
 * 2. **The client is a singleton.** In development Next.js re-evaluates modules
 *    on every HMR pass, so the promise is parked on `globalThis` to stop the
 *    connection pool growing without bound.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? 'portfolio';

/** True when a connection string is configured. Callers fall back to bundled
 *  JSON when this is false. */
export function isDbConfigured(): boolean {
  return Boolean(uri);
}

const globalForMongo = globalThis as typeof globalThis & {
  _portfolioMongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set — call isDbConfigured() first.');
  }

  if (!globalForMongo._portfolioMongoClientPromise) {
    globalForMongo._portfolioMongoClientPromise = new MongoClient(uri, {
      // Keep the pool small: content reads are cached by `unstable_cache`, so
      // the database is hit rarely and a large pool would just idle.
      maxPoolSize: 5,
      // Fail fast rather than hanging a request (and therefore a page render)
      // for the driver's 30s default.
      serverSelectionTimeoutMS: 5_000,
    }).connect();
  }

  return globalForMongo._portfolioMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
