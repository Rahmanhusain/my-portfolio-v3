'use client';

import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Work',    href: '/#projects' },
  { label: 'About',   href: '/#about'    },
  { label: 'Blog',    href: '/blog'       },
  { label: 'Contact', href: '/#contact'  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* scroll detection — replaces ScrollTrigger */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    // Set initial state in case page loads mid-scroll
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ animation: 'header-enter 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both' }}
    >
      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div
        className={[
          'hidden md:grid grid-cols-3 items-center px-8 h-[58px] transition-all duration-500',
          scrolled ? 'bg-[#0a0a0a]/75 backdrop-blur-2xl' : '',
        ].join(' ')}
      >
        {/* Left — logo */}
        <a
          href="/"
          aria-label="Home"
          className="font-display font-bold text-[#fafafa] text-base tracking-tight hover:opacity-60 transition-opacity duration-200 w-fit"
        >
          Rahman<span className="text-white/30">.</span>
        </a>

        {/* Centre — pill nav */}
        <nav
          aria-label="Main navigation"
          className={[
            'flex items-center justify-center gap-0.5 mx-auto rounded-full px-1.5 py-1 transition-all duration-500',
            scrolled
              ? 'bg-white/[0.05] border border-white/[0.08]'
              : 'bg-white/[0.03] border border-white/[0.05]',
          ].join(' ')}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all duration-200 text-[#8a8a8a] hover:text-[#fafafa] hover:bg-white/[0.07]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — CTA */}
        <div className="flex justify-end">
          <a
            href="mailto:hello@yourname.dev"
            className="text-[11px] font-semibold uppercase tracking-wide text-[#fafafa] border border-white/[0.12] px-4 py-2 rounded-full hover:bg-[#fafafa] hover:text-[#0a0a0a] hover:border-transparent transition-all duration-200"
          >
            Hire me
          </a>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div
        className={[
          'md:hidden flex items-center justify-between px-5 h-14 transition-all duration-500',
          scrolled || menuOpen ? 'bg-[#0a0a0a]/85 backdrop-blur-2xl' : '',
        ].join(' ')}
      >
        <a
          href="/"
          aria-label="Home"
          className="font-display font-bold text-[#fafafa] text-base tracking-tight"
        >
          Rahman<span className="text-white/30">.</span>
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        >
          <span
            className="block h-px bg-[#fafafa] transition-all duration-300 origin-center"
            style={menuOpen ? { width: '1.25rem', transform: 'translateY(5px) rotate(45deg)' } : { width: '1.25rem' }}
          />
          <span
            className="block h-px bg-[#fafafa] transition-all duration-300"
            style={menuOpen ? { width: 0, opacity: 0 } : { width: '0.875rem', opacity: 1 }}
          />
          <span
            className="block h-px bg-[#fafafa] transition-all duration-300 origin-center"
            style={menuOpen ? { width: '1.25rem', transform: 'translateY(-5px) rotate(-45deg)' } : { width: '1.25rem' }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 bg-[#0a0a0a]/95 backdrop-blur-2xl"
        style={{ maxHeight: menuOpen ? '20rem' : '0' }}
      >
        <nav className="px-5 py-3 flex flex-col" aria-label="Mobile navigation">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-none text-sm font-medium text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200"
            >
              <span>{link.label}</span>
              <span className="text-[10px] text-white/20 font-mono">
                {String(i + 1).padStart(2, '0')}
              </span>
            </a>
          ))}
          <a
            href="mailto:hello@yourname.dev"
            onClick={() => setMenuOpen(false)}
            className="mt-4 mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#0a0a0a] bg-[#fafafa] px-5 py-3 rounded-full"
          >
            Hire me
          </a>
        </nav>
      </div>

    </header>
  );
}
