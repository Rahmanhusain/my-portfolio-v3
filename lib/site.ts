import type { SiteConfig } from '@/lib/types/content';

export type { SiteConfig, SiteProofPoint } from '@/lib/types/content';

/**
 * Default site facts, and the helpers that compose them.
 *
 * These values are now *defaults*, not the source of truth: the admin panel
 * stores an override in the `settings` collection and `getSite()` in
 * `lib/data/site.ts` merges the two. What lives here is what the site shows
 * before anything has been edited, and what it falls back to if the database
 * is unreachable.
 *
 * This module stays free of any database import so Client Components can
 * import the type and the helpers. Anything that needs the *live* values must
 * call `getSite()` (Server Components) or receive the config as a prop
 * (Client Components).
 *
 * ⚠️ NAP consistency matters for SEO: email/phone must be identical on every
 * page. That is why the composed `mailtoFor`/`telHrefFor`/`whatsappHrefFor`
 * helpers exist — never hand-build these hrefs in a component.
 */
export const defaultSite: SiteConfig = {
  // Primary booking link (Calendly or Cal.com). Opens in a new tab.
  bookingUrl: 'https://cal.com/rahmanhusain/intro',

  // Availability signal — creates urgency and shows you're taking on work.
  availability: {
    label: 'Booking for August 2026',
    slots: '1 slot open',
  },

  // Response-time promise — shown near the contact form.
  responseTime: 'I reply within 24 hours on weekdays',

  // Location + timezone — removes a hidden objection before a call is booked.
  location: {
    city: 'Delhi',
    country: 'India',
    tz: 'IST',
    utcOffset: 'UTC+5:30',
    global: 'Working with clients globally.',
  },

  // Socials — full URLs so they're drop-in for `Person.sameAs`, footer/contact
  // link `href`s, and the `twitter.site` / `twitter.creator` SEO fields.
  social: {
    github: 'https://github.com/rahman',
    linkedin: 'https://linkedin.com/in/rahman',
    twitter: 'https://x.com/rahman',
    // Handle (no leading @) — used by Next's twitter.site / twitter.creator
    twitterHandle: 'rahman',
    phone: '+91 98765 43210',
    // Digits only, with country code — for tel: and wa.me links
    phoneDigits: '919876543210',
    email: 'hello@yourname.dev',
  },

  // Proof points shown in the hero strip and the About stats.
  // Keep these honest — inflated numbers are the fastest way to lose a lead.
  proof: [
    { value: '100%', label: 'On-time delivery' },
    { value: '24h', label: 'Average reply time' },
    { value: '30d', label: 'Free post-launch fixes' },
    { value: '10+', label: 'Happy clients' },
  ],
};

// ─── Composed strings used in multiple places ────────────────────────────────

export const availabilityLabelFor = (site: SiteConfig) =>
  `${site.availability.label} · ${site.availability.slots}`;

export const locationLabelFor = (site: SiteConfig) =>
  `Based in ${site.location.city} (${site.location.tz}, ${site.location.utcOffset}). ${site.location.global}`;

// ─── Ready-made hrefs, so no component has to build them by hand ─────────────

export const mailtoFor = (site: SiteConfig) => `mailto:${site.social.email}`;
export const telHrefFor = (site: SiteConfig) => `tel:+${site.social.phoneDigits}`;
export const whatsappHrefFor = (site: SiteConfig) =>
  `https://wa.me/${site.social.phoneDigits}`;

// ─── Merge ───────────────────────────────────────────────────────────────────

/**
 * Deep-merges a stored override over the defaults, one nested group at a time.
 *
 * A shallow spread would let a partial `social` object stored by the admin
 * panel wipe out every sibling field — an empty `phoneDigits` breaks every
 * `tel:` and `wa.me` link on the site. Merging per group means a settings
 * document can carry only the fields that were actually edited.
 */
export function mergeSiteConfig(override: Partial<SiteConfig> | null | undefined): SiteConfig {
  if (!override) return defaultSite;

  return {
    ...defaultSite,
    ...override,
    availability: { ...defaultSite.availability, ...override.availability },
    location: { ...defaultSite.location, ...override.location },
    social: { ...defaultSite.social, ...override.social },
    proof:
      Array.isArray(override.proof) && override.proof.length > 0
        ? override.proof
        : defaultSite.proof,
  };
}
