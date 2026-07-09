import Link from 'next/link';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/rahman' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rahman' },
  { label: 'X / Twitter', href: 'https://x.com/rahman' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#242424] bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display font-semibold text-[#fafafa] tracking-tight mb-1">
            Rahman.
          </p>
          <p className="text-xs text-[#8a8a8a]">
            © {year} — All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs text-[#8a8a8a]">Available for freelance</span>
        </div>
      </div>
    </footer>
  );
}
