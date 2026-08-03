'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBookingModal } from '@/components/ui/BookingModalProvider';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About',    href: '/#about'   },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact'  },
];

/** A nav item is "current" when the route is that section or below it. */
function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useBookingModal();
  const pathname = usePathname();

  /* scroll detection — replaces ScrollTrigger */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    // Set initial state in case page loads mid-scroll
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The drawer closes from each link's own onClick — no route-change effect
     needed, and React 19 flags setState-in-effect anyway. */

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ animation: 'header-enter 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both' }}
    >
      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div
        className={'hidden md:grid grid-cols-3 items-center px-8 h-14.5 bg-(--color-bg) border-b border-(--color-border) transition-all duration-500'}
      >
        {/* Left — logo */}
        <Link
          href="/"
          aria-label="Home"
          className="font-display font-bold text-fg text-base tracking-tight hover:opacity-60 transition-opacity duration-200 w-fit"
        >
          Rahman<span className="text-faint">.</span>
        </Link>

        {/* Centre — pill nav */}
        <nav
          aria-label="Main navigation"
          className={[
            'flex items-center justify-center gap-0.5 mx-auto rounded-full px-1.5 py-1 transition-all duration-500',
            scrolled
              ? 'bg-black/[0.015] border border-black/[0.09]'
              : 'bg-black/[0.025] border border-black/[0.06]',
          ].join(' ')}
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all duration-200',
                  active
                    ? 'bg-black/[0.07] text-fg'
                    : 'text-muted hover:text-fg hover:bg-black/[0.055]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right — CTA */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => open('header')}
            className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-fg bg-transparent border border-black/[0.14] px-4 py-2 rounded-full hover:bg-fg hover:text-bg hover:border-transparent transition-all duration-200"
          >
            Book a call
          </button>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div
        className={'md:hidden flex items-center bg-(--color-bg) border-b border-(--color-border) justify-between px-5 h-14 transition-all duration-500'}
      >
        <Link
          href="/"
          aria-label="Home"
          className="font-display font-bold text-fg text-base tracking-tight"
        >
          Rahman<span className="text-faint">.</span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        >
          <span
            className="block h-px bg-fg transition-all duration-300 origin-center"
            style={menuOpen ? { width: '1.25rem', transform: 'translateY(5px) rotate(45deg)' } : { width: '1.25rem' }}
          />
          <span
            className="block h-px bg-fg transition-all duration-300"
            style={menuOpen ? { width: 0, opacity: 0 } : { width: '0.875rem', opacity: 1 }}
          />
          <span
            className="block h-px bg-fg transition-all duration-300 origin-center"
            style={menuOpen ? { width: '1.25rem', transform: 'translateY(-5px) rotate(-45deg)' } : { width: '1.25rem' }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 bg-bg/95 backdrop-blur-2xl"
        style={{ maxHeight: menuOpen ? '20rem' : '0' }}
      >
        <nav className="px-5 py-3 flex flex-col" aria-label="Mobile navigation">
          {navLinks.map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={[
                  'flex items-center justify-between py-3.5 border-b border-black/[0.06] last:border-none text-sm font-medium transition-colors duration-200',
                  active ? 'text-fg' : 'text-muted hover:text-fg',
                ].join(' ')}
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-subtle font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open('header');
            }}
            className="mt-4 mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-bg bg-fg px-5 py-3 rounded-full cursor-pointer"
          >
            Book a call
          </button>
        </nav>
      </div>

    </header>
  );
}
