export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  href: string;
  year: string;
}

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard built with Next.js and MongoDB.',
    tags: ['Next.js', 'TypeScript', 'MongoDB', 'Stripe'],
    image: '/projects/project-one.png',
    href: '#',
    year: '2024',
  },
  {
    slug: 'project-two',
    title: 'SaaS Analytics Dashboard',
    description:
      'Multi-tenant analytics dashboard with real-time data visualization, role-based access control, and CSV export functionality.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Recharts'],
    image: '/projects/project-two.png',
    href: '#',
    year: '2024',
  },
  {
    slug: 'project-three',
    title: 'Developer Portfolio CMS',
    description:
      'Headless CMS powering developer portfolios with a visual editor, custom domain support, and built-in SEO optimization.',
    tags: ['Next.js', 'GraphQL', 'Tailwind CSS', 'Docker'],
    image: '/projects/project-three.png',
    href: '#',
    year: '2023',
  },
];
