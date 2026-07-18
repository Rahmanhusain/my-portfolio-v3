import Link from 'next/link';
import { locationLabel } from '@/lib/site';
import FooterBookingButton from '@/components/layout/FooterBookingButton';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/rahman' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rahman' },
  { label: 'X / Twitter', href: 'https://x.com/rahman' },
];

const linkClass =
  'text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#242424] bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left — brand, copyright, location, availability */}
        <div>
          <p className="font-display font-semibold text-[#fafafa] tracking-tight mb-1">
            Rahman.
          </p>
          <p className="text-xs text-[#8a8a8a]">
            © {year} — All rights reserved.
          </p>
          <p className="text-xs text-[#8a8a8a] mt-1">
            {locationLabel}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span
              className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs text-[#8a8a8a]">Available for freelance</span>
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
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#8a8a8a] mb-3">
            Quick Links
          </h2>
          <nav aria-label="Quick links" className="flex flex-wrap gap-6">
            <Link href="/services" className={linkClass}>
              Services
            </Link>
            <Link href="/blog" className={linkClass}>
              Blog
            </Link>
            <FooterBookingButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
