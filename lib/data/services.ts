import { CACHE_TAGS, servicesCollection } from '@/lib/db/collections';
import { cachedContent, emptyArray } from '@/lib/data/loader';
import type { Service } from '@/lib/types/content';

export type {
  ContentBlock,
  Service,
  ServiceBenefit,
  ServiceFaq,
} from '@/lib/types/content';

// ─── Bundled fallback ────────────────────────────────────────────────────────
// These are the seed for `npm run seed` and the safety net for a build with no
// database. Import each file explicitly — Next.js static analysis needs literal
// paths.

import webDev from '@/content/services/web-app-development.json';
import uiUx from '@/content/services/ui-ux-design.json';
import apiBackend from '@/content/services/api-backend-development.json';
import crm from '@/content/services/custom-crm-development.json';
import email from '@/content/services/business-email-setup.json';
import hosting from '@/content/services/hosting-deployment.json';
import automation from '@/content/services/automation-agent-development.json';
import ecommerce from '@/content/services/e-commerce-solutions.json';

/** Ordered by service number. */
export const fallbackServices: Service[] = [
  webDev,
  uiUx,
  apiBackend,
  crm,
  email,
  hosting,
  automation,
  ecommerce,
] as Service[];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Every published service, in display order.
 *
 * Server Components call this directly. Client Components (`ServiceList`, which
 * is pulled into the client bundle by the homepage `Services` section) receive
 * the result as a prop — this module imports the MongoDB driver and must never
 * be reachable from browser code.
 */
export const getServices = cachedContent<Service[]>(
  CACHE_TAGS.services,
  async () => {
    const collection = await servicesCollection();
    const docs = await collection
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return docs.map((doc) => doc.data);
  },
  () => fallbackServices,
  emptyArray,
);

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((service) => service.slug === slug) ?? null;
}
