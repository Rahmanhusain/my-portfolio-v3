export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Delivered a beautifully crafted product ahead of schedule. The attention to detail and proactive communication made the entire process seamless. Would absolutely work together again.',
    name: 'Alex Morgan',
    role: 'Product Lead',
    company: 'Acme Corp',
    initials: 'AM',
  },
  {
    id: '2',
    quote:
      'Transformed our legacy dashboard into a modern, performant application. The code quality is excellent and the animations feel premium. Our team is still impressed.',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Nexus Labs',
    initials: 'SC',
  },
  {
    id: '3',
    quote:
      'Sharp technical instincts and a great eye for design. Took our vague brief and turned it into something we are genuinely proud to show clients.',
    name: 'James Okafor',
    role: 'Founder',
    company: 'Studio Eleven',
    initials: 'JO',
  },
];
