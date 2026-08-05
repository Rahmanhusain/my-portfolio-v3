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
}

export const testimonials: Testimonial[] = [
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
      'He helped us set up a custom business email with our domain. The process was quick, and it has improved our brand\'s professional image.',
    name: 'Shivam Shukla',
    initials: 'SS',
  },
  {
    id: '3',
    quote:
      'The calling automation has improved our workflow and customer experience. It\'s been a valuable solution for our business. his expertise in web development and automation is commendable.',
    name: 'Fatima Ahmed',
    initials: 'FA',
  },
];
