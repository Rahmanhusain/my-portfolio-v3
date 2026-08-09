import Link from 'next/link';
import { locationLabelFor } from '@/lib/site';
import { getSite } from '@/lib/data/site';
import FooterBookingButton from '@/components/layout/FooterBookingButton';

const linkClass =
  'text-sm text-muted hover:text-fg transition-colors duration-200';

export default async function Footer() {
  const site = await getSite();
  const year = new Date().getFullYear();

  const socialLinks = [
    { label: 'GitHub',      href: site.social.github },
    { label: 'LinkedIn',    href: site.social.linkedin },
    { label: 'X / Twitter', href: site.social.twitter },
  ];

  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left — brand, copyright, location, availability */}
        <div>
          <p className="font-display font-semibold text-fg tracking-tight mb-1">
            Rahman.
          </p>
          <p className="text-xs text-muted">
            © {year} — All rights reserved.
          </p>
          <p className="text-xs text-muted mt-1">
            {locationLabelFor(site)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span
              className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs text-muted">Available for freelance</span>
          </div>
        </div>

        {/* Middle — social links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — quick links (always visible, no hover) */}
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted mb-3">
            Quick Links
          </h2>
          <nav aria-label="Quick links" className="flex flex-wrap gap-6">
            <Link href="/services" className={linkClass}>
              Services
            </Link>
            <Link href="/blog" className={linkClass}>
              Blog
            </Link>
            <Link href="/contact" className={linkClass}>
            Contact
            </Link>
            <FooterBookingButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
