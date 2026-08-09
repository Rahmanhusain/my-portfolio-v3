import { CACHE_TAGS, projectsCollection } from '@/lib/db/collections';
import { cachedContent, emptyArray } from '@/lib/data/loader';
import type { Project } from '@/lib/types/content';

export type {
  ContentBlock,
  Project,
  ProjectResult,
  ProjectStack,
  ProjectTestimonial,
} from '@/lib/types/content';

// ─── Bundled fallback ────────────────────────────────────────────────────────

import ecommerce from '@/content/projects/ecommerce-platform.json';
import analytics from '@/content/projects/saas-analytics-dashboard.json';
import cms from '@/content/projects/portfolio-cms.json';

/** Ordered by project number. */
export const fallbackProjects: Project[] = [
  ecommerce,
  analytics,
  cms,
] as Project[];

// ─── Public API ──────────────────────────────────────────────────────────────

/** Every published project, in display order. Only the first three reach the
 *  homepage; `/projects` shows all of them. */
export const getProjects = cachedContent<Project[]>(
  CACHE_TAGS.projects,
  async () => {
    const collection = await projectsCollection();
    const docs = await collection
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return docs.map((doc) => doc.data);
  },
  () => fallbackProjects,
  emptyArray,
);

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((project) => project.slug === slug) ?? null;
}
