import { CACHE_TAGS, settingsCollection } from '@/lib/db/collections';
import { cachedContent } from '@/lib/data/loader';
import { defaultSite, mergeSiteConfig } from '@/lib/site';
import type { SiteConfig } from '@/lib/types/content';

/** The `key` of the singleton settings document holding the site config. */
export const SITE_SETTINGS_KEY = 'site';

/**
 * The live site config: contact details, booking URL, availability, proof
 * points. Server Components only — this module reaches the database. Client
 * Components take the result as a prop.
 *
 * The stored document is merged over `defaultSite`, so a settings document
 * that only carries the fields you actually edited is still complete.
 */
export const getSite = cachedContent<SiteConfig>(
  CACHE_TAGS.site,
  async () => {
    const collection = await settingsCollection();
    const doc = await collection.findOne({ key: SITE_SETTINGS_KEY });
    return mergeSiteConfig(doc?.data);
  },
  () => defaultSite,
);
