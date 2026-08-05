import type { ContentBlock } from '@/lib/content-blocks';
export type { ContentBlock } from '@/lib/content-blocks';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProjectResult {
  /** The headline figure — '+38%', '11s → 380ms', '0'. Kept as a string so a
   *  before/after or a ratio reads as well as a percentage. */
  metric: string;
  label:  string;
}

export interface ProjectStack {
  /** 'Frontend', 'Backend', 'Infrastructure' — the grouping heading. */
  group: string;
  items: string[];
}

export interface ProjectTestimonial {
  quote:  string;
  author: string;
  role?:  string;
}

export interface Project {
  number:      string;
  slug:        string;
  /** Card blurb — clamped to two lines in ProjectCard. */
  shortDesc:   string;
  /** Hero paragraph on the case study. Longer, sets up the problem. */
  description: string;
  title:       string;
  year:        string;
  /** Two-to-three-word display chips. Separate from `keywords`, which is far
   *  too wordy to render — same split as `Service`. */
  tags:        string[];
  /** Long-tail phrases for `<meta name="keywords">` and JSON-LD. Never rendered. */
  keywords:    string[];
  challenge:   string;
  solution:    string;
  stack:       ProjectStack[];
  body:        ContentBlock[];

  // ── Optional. Omit the field and its UI block is not rendered at all, so a
  //    personal project can skip client/testimonial/metrics without leaving
  //    an empty heading or a gap behind. ───────────────────────────────────
  bannerImage?: string;
  bannerAlt?:   string;
  client?:      string;
  role?:        string;
  duration?:    string;
  results?:     ProjectResult[];
  testimonial?: ProjectTestimonial;
  liveUrl?:     string;
  repoUrl?:     string;
}

// ─── Load from JSON files ────────────────────────────────────────────────────
// Import each file explicitly — Next.js static analysis needs literal paths.

import ecommerce from '@/content/projects/ecommerce-platform.json';
import analytics from '@/content/projects/saas-analytics-dashboard.json';
import cms       from '@/content/projects/portfolio-cms.json';

// Ordered by project number
export const projects: Project[] = [
  ecommerce,
  analytics,
  cms,
] as Project[];
