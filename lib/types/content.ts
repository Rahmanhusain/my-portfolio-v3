/**
 * Every content shape the site renders, in one dependency-free module.
 *
 * This file must stay importable from a Client Component: it holds types only,
 * so nothing here survives compilation. `lib/data/*.ts` pulls in the MongoDB
 * driver, which would blow up a client bundle — components that only need a
 * *type* (`ProjectCard`, `TestimonialCard`, `Faq`) import it from here instead.
 *
 * The admin panel keeps a byte-identical copy at `lib/types/content.ts`. If you
 * change a shape here, change it there too — the JSON editor validates against
 * it before anything is written to the database.
 */

import type { ContentBlock } from '@/lib/content-blocks';

export type { ContentBlock } from '@/lib/content-blocks';

// ─── Services ────────────────────────────────────────────────────────────────

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  number: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  bannerImage: string;
  bannerAlt: string;
  /** Long-tail phrases for `<meta name="keywords">` and JSON-LD. */
  keywords: string[];
  /** Two-to-three-word display chips shown next to the title in the
   *  services list. Deliberately separate from `keywords`, which is far too
   *  wordy to render. */
  tags: string[];
  benefits: ServiceBenefit[];
  whyMe: string;
  faq?: ServiceFaq[];
  body: ContentBlock[];
}

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ProjectResult {
  /** The headline figure — '+38%', '11s → 380ms', '0'. Kept as a string so a
   *  before/after or a ratio reads as well as a percentage. */
  metric: string;
  label: string;
}

export interface ProjectStack {
  /** 'Frontend', 'Backend', 'Infrastructure' — the grouping heading. */
  group: string;
  items: string[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Project {
  number: string;
  slug: string;
  /** Card blurb — clamped to two lines in ProjectCard. */
  shortDesc: string;
  /** Hero paragraph on the case study. Longer, sets up the problem. */
  description: string;
  title: string;
  year: string;
  /** Two-to-three-word display chips. Separate from `keywords`, which is far
   *  too wordy to render — same split as `Service`. */
  tags: string[];
  /** Long-tail phrases for `<meta name="keywords">` and JSON-LD. Never rendered. */
  keywords: string[];
  challenge: string;
  solution: string;
  stack: ProjectStack[];
  body: ContentBlock[];

  // ── Optional. Omit the field and its UI block is not rendered at all, so a
  //    personal project can skip client/testimonial/metrics without leaving
  //    an empty heading or a gap behind. ───────────────────────────────────
  ProjectImage?: string;
  ProjectAlt?: string;
  bannerImage?: string;
  bannerAlt?: string;
  client?: string;
  role?: string;
  duration?: string;
  results?: ProjectResult[];
  testimonial?: ProjectTestimonial;
  liveUrl?: string;
  repoUrl?: string;
}

// ─── Posts ───────────────────────────────────────────────────────────────────

/** The stored shape — `updatedAt` is a `YYYY-MM-DD` string in JSON and Mongo. */
export interface PostRaw {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  readTime: string;
  tags: string[];
  keywords: string[];
  bannerImage: string;
  bannerAlt: string;
  body: ContentBlock[];
}

/** The rendered shape — `updatedAt` promoted to a `Date` for sorting. */
export interface Post extends Omit<PostRaw, 'updatedAt'> {
  updatedAt: Date;
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  initials: string;
  /** Optional attribution line under the name. Both are omitted from the card
   *  when absent — a first-name-only reference shouldn't render a dangling
   *  comma or an empty row. */
  role?: string;
  company?: string;
  /** URL of the client's profile photo. Falls back to the initials avatar when
   *  absent or when the image fails to load. */
  avatarUrl?: string;
  /** The type of service the client hired for — shown below the client name
   *  on the testimonial card (e.g. "Web Development", "UI Design"). */
  serviceType?: string;
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export interface Faq {
  question: string;
  answer: string;
}

// ─── Site settings ───────────────────────────────────────────────────────────

export interface SiteProofPoint {
  value: string;
  label: string;
}

export interface SiteConfig {
  /** Primary booking link (Calendly or Cal.com). Opens in a new tab. */
  bookingUrl: string;
  /** Availability signal — creates urgency and shows you're taking on work. */
  availability: {
    label: string;
    slots: string;
  };
  /** Response-time promise — shown near the contact form. */
  responseTime: string;
  /** Location + timezone — removes a hidden objection before a call is booked. */
  location: {
    city: string;
    country: string;
    tz: string;
    utcOffset: string;
    global: string;
  };
  /** Socials — full URLs so they're drop-in for `Person.sameAs`, footer/contact
   *  link `href`s, and the `twitter.site` / `twitter.creator` SEO fields. */
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    /** Handle (no leading @) — used by Next's twitter.site / twitter.creator. */
    twitterHandle: string;
    phone: string;
    /** Digits only, with country code — for tel: and wa.me links. */
    phoneDigits: string;
    email: string;
  };
  /** Proof points shown in the hero strip and the About stats. */
  proof: SiteProofPoint[];
}
