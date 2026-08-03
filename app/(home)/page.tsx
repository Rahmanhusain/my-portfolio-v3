import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import TrustStrip from '@/components/sections/TrustStrip';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import Workflow from '@/components/sections/Workflow';
import BlogPreview from '@/components/sections/BlogPreview';
import FaqHome from '@/components/sections/FaqHome';
import Contact from '@/components/sections/Contact';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import ServiceMarquee from '@/components/ui/ServiceMarquee';
import ScrollProgress from '@/components/ui/ScrollProgress';
import BackToTop from '@/components/ui/BackToTop';
import { siteUrl } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  // `absolute` skips the "%s | Rahman" template — the brand is already in the
  // title, and "… | Rahman" twice reads like a bug in the SERP.
  title: {
    absolute: 'Rahman — Full-Stack Web Developer for Startups & Small Business',
  },
  description:
    'Freelance full-stack developer building fast, accessible web apps, custom CRMs, e-commerce stores, APIs, and AI automations with Next.js and TypeScript. Book a free 30-minute call.',
  keywords: [
    'freelance full-stack developer',
    'hire a web developer',
    'Next.js developer',
    'React developer',
    'custom CRM development',
    'web app development',
    'AI automation developer',
    'e-commerce development',
    'web developer in Delhi',
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Rahman — Full-Stack Web Developer for Startups & Small Business',
    description:
      'Fast, accessible web apps, custom CRMs, e-commerce, APIs, and AI automations. Book a free 30-minute call.',
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahman — Full-Stack Web Developer',
    description:
      'Fast, accessible web apps, custom CRMs, e-commerce, APIs, and AI automations. Book a free 30-minute call.',
    site: site.social.twitterHandle,
    creator: site.social.twitterHandle,
  },
};

/** ProfilePage tells Google this URL is the canonical page *about* the Person
 *  entity declared in the root layout — the pairing that makes an author/
 *  freelancer knowledge panel eligible. */
const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${siteUrl}/#profilepage`,
  url: siteUrl,
  name: 'Rahman — Full-Stack Web Developer',
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': `${siteUrl}/#person` },
  primaryImageOfPage: `${siteUrl}/rahman.jpeg`,
  inLanguage: 'en-US',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <ScrollProgress />

      <SmoothScrollProvider>
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <ServiceMarquee />
        <Projects />
        <Testimonials />
        <Workflow />
        <BlogPreview />
        <FaqHome />
        <Contact />
      </SmoothScrollProvider>

      <BackToTop />
    </>
  );
}
