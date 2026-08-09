import type { Collection, Document, ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import type {
  Faq,
  PostRaw,
  Project,
  Service,
  SiteConfig,
  Testimonial,
} from '@/lib/types/content';

/**
 * The database contract shared with the admin panel.
 *
 * Every content document wraps its payload in a `data` field holding the exact
 * JSON shape the site already rendered from `content/*.json`. That indirection
 * is what makes the admin panel's JSON editor honest: what you type is what is
 * stored and what the renderer receives, with no field mapping in between.
 * The envelope around it (`slug`, `order`, `published`, timestamps) is
 * bookkeeping the editor never has to see.
 */

/** Content collections keyed by slug. */
export interface ContentDoc<T> extends Document {
  _id: ObjectId;
  /** Mirrored from `data.slug` so it can be indexed and queried directly. */
  slug: string;
  /** Display order — ascending. Mirrors the old hand-ordered arrays. */
  order: number;
  /** Drafts stay out of every public query, sitemap and feed. */
  published: boolean;
  data: T;
  createdAt: Date;
  updatedAt: Date;
}

/** Collections that are ordered lists without their own URL (no slug). */
export interface ListDoc<T> extends Document {
  _id: ObjectId;
  order: number;
  published: boolean;
  data: T;
  createdAt: Date;
  updatedAt: Date;
}

/** Singleton settings documents, keyed by `key`. */
export interface SettingsDoc extends Document {
  _id: ObjectId;
  key: string;
  data: SiteConfig;
  updatedAt: Date;
}

export const COLLECTIONS = {
  services: 'services',
  projects: 'projects',
  posts: 'posts',
  testimonials: 'testimonials',
  faqs: 'faqs',
  settings: 'settings',
  leads: 'leads',
  admins: 'admins',
  media: 'media',
} as const;

/** Cache tags — one per content type. The admin panel POSTs these to
 *  `/api/revalidate` after a write, which is what makes an edit show up on the
 *  live site without a redeploy. Keep in sync with the admin's copy. */
export const CACHE_TAGS = {
  services: 'services',
  projects: 'projects',
  posts: 'posts',
  testimonials: 'testimonials',
  faqs: 'faqs',
  site: 'site',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export async function servicesCollection(): Promise<
  Collection<ContentDoc<Service>>
> {
  const db = await getDb();
  return db.collection<ContentDoc<Service>>(COLLECTIONS.services);
}

export async function projectsCollection(): Promise<
  Collection<ContentDoc<Project>>
> {
  const db = await getDb();
  return db.collection<ContentDoc<Project>>(COLLECTIONS.projects);
}

export async function postsCollection(): Promise<
  Collection<ContentDoc<PostRaw>>
> {
  const db = await getDb();
  return db.collection<ContentDoc<PostRaw>>(COLLECTIONS.posts);
}

export async function testimonialsCollection(): Promise<
  Collection<ListDoc<Testimonial>>
> {
  const db = await getDb();
  return db.collection<ListDoc<Testimonial>>(COLLECTIONS.testimonials);
}

export async function faqsCollection(): Promise<Collection<ListDoc<Faq>>> {
  const db = await getDb();
  return db.collection<ListDoc<Faq>>(COLLECTIONS.faqs);
}

export async function settingsCollection(): Promise<Collection<SettingsDoc>> {
  const db = await getDb();
  return db.collection<SettingsDoc>(COLLECTIONS.settings);
}
