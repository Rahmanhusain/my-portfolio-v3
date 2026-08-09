import { CACHE_TAGS, testimonialsCollection } from '@/lib/db/collections';
import { cachedContent, emptyArray } from '@/lib/data/loader';
import type { Testimonial } from '@/lib/types/content';

export type { Testimonial } from '@/lib/types/content';

// ─── Bundled fallback ────────────────────────────────────────────────────────

export const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Rahman built a professional website for our handloom and curtain business. It strengthened our online presence and brought us quality leads. the oberall experience was smooth and satisfying.',
    name: 'Rakesh Gogia',
    initials: 'RG',
  },
  {
    id: '2',
    quote:
      "He helped us set up a custom business email with our domain. The process was quick, and it has improved our brand's professional image.",
    name: 'Shivam Shukla',
    initials: 'SS',
  },
  {
    id: '3',
    quote:
      "The calling automation has improved our workflow and customer experience. It's been a valuable solution for our business. his expertise in web development and automation is commendable.",
    name: 'Fatima Ahmed',
    initials: 'FA',
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

export const getTestimonials = cachedContent<Testimonial[]>(
  CACHE_TAGS.testimonials,
  async () => {
    const collection = await testimonialsCollection();
    const docs = await collection
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return docs.map((doc) => doc.data);
  },
  () => fallbackTestimonials,
  emptyArray,
);
