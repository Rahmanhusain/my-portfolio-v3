import type { ContentBlock } from '@/lib/content-blocks';
export type { ContentBlock } from '@/lib/content-blocks';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ServiceBenefit {
  title:       string;
  description: string;
}

export interface Service {
  number:      string;
  slug:        string;
  title:       string;
  shortDesc:   string;
  description: string;
  bannerImage: string;
  bannerAlt:   string;
  keywords:    string[];
  benefits:    ServiceBenefit[];
  whyMe:       string;
  body:        ContentBlock[];
}

// ─── Load from JSON files ────────────────────────────────────────────────────
// Import each file explicitly — Next.js static analysis needs literal paths.

import webDev     from '@/content/services/web-app-development.json';
import uiUx       from '@/content/services/ui-ux-design.json';
import apiBackend from '@/content/services/api-backend-development.json';
import crm        from '@/content/services/custom-crm-development.json';
import email      from '@/content/services/business-email-setup.json';
import hosting    from '@/content/services/hosting-deployment.json';

// Ordered by service number
export const services: Service[] = [
  webDev,
  uiUx,
  apiBackend,
  crm,
  email,
  hosting,
] as Service[];
