// Central, editable site facts surfaced across the UI.
// Update these placeholders to match your real offer — they drive the
// availability pill, booking CTA, response-time promise, and location shown
// in the hero, headers, services page, contact, and footer.
//
// ⚠️ NAP consistency matters for SEO: the email/phone here are the single
// source of truth. Every page reads from this file — never hardcode them
// again, or search engines will see conflicting contact details.

export const site = {
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
    github:   'https://github.com/rahman',
    linkedin: 'https://linkedin.com/in/rahman',
    twitter:  'https://x.com/rahman',
    // Handle (no leading @) — used by Next's twitter.site / twitter.creator
    twitterHandle: 'rahman',
    phone:    '+91 98765 43210',
    // Digits only, with country code — for tel: and wa.me links
    phoneDigits: '919876543210',
    email:    'hello@yourname.dev',
  },

  // Proof points shown in the hero strip and the About stats.
  // Keep these honest — inflated numbers are the fastest way to lose a lead.
  proof: [
    { value: '100%', label: 'On-time delivery' },
    { value: '24h',  label: 'Average reply time' },
    { value: '30d',  label: 'Free post-launch fixes' },
    { value: '10+',  label: 'Happy clients' },
  ],
} as const;

// Composed strings used in multiple places.
export const availabilityLabel = `${site.availability.label} · ${site.availability.slots}`;
export const locationLabel = `Based in ${site.location.city} (${site.location.tz}, ${site.location.utcOffset}). ${site.location.global}`;

// Ready-made hrefs so no component has to build them by hand.
export const mailto = `mailto:${site.social.email}`;
export const telHref = `tel:+${site.social.phoneDigits}`;
export const whatsappHref = `https://wa.me/${site.social.phoneDigits}`;
