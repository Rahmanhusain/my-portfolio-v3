// Central, editable site facts surfaced across the UI.
// Update these placeholders to match your real offer — they drive the
// availability pill, booking CTA, response-time promise, and location shown
// in the hero, headers, services page, contact, and footer.

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
    tz: 'IST',
    utcOffset: 'UTC+5:30',
    global: 'Working with clients globally.',
  },
} as const;

// Composed strings used in multiple places.
export const availabilityLabel = `${site.availability.label} · ${site.availability.slots}`;
export const locationLabel = `Based in ${site.location.city} (${site.location.tz}, ${site.location.utcOffset}). ${site.location.global}`;
