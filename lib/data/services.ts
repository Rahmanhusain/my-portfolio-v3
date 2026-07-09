export interface Service {
  number: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    number: '01',
    title: 'Web Development',
    description:
      'End-to-end web applications built with modern frameworks — fast, scalable, and production-ready.',
  },
  {
    number: '02',
    title: 'UI / UX Engineering',
    description:
      'Pixel-perfect interfaces with fluid animations and micro-interactions that elevate user experience.',
  },
  {
    number: '03',
    title: 'API & Backend',
    description:
      'Robust REST and GraphQL APIs, database design, and cloud infrastructure that scale with your product.',
  },
  {
    number: '04',
    title: 'Performance Audits',
    description:
      'Lighthouse-driven performance reviews, Core Web Vitals fixes, and SEO optimization for maximum reach.',
  },
];
