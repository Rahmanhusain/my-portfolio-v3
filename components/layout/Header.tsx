'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import clsx from 'clsx';
import { useBookingModal } from '@/components/ui/BookingModalProvider';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About',    href: '/#about'   },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact' },
];

/** A nav item is "current" when the route is that section or below it.
 *  Hash links point back into this page, so they're never "current". */
function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const { open } = useBookingModal();

  /* scroll detection */
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top -64',
      onEnter:     () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => st.kill();
  }, []);

  /* entrance */
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">

      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div
        className={clsx(
          'hidden md:grid grid-cols-3 items-center px-8 h-[58px] transition-all duration-500',
          scrolled && 'bg-bg/75 backdrop-blur-2xl'
        )}
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
          className={clsx(
            'flex items-center justify-center gap-0.5 mx-auto rounded-full px-1.5 py-1 transition-all duration-500',
            scrolled
              ? 'bg-black/[0.04] border border-black/[0.09]'
              : 'bg-black/[0.025] border border-black/[0.06]'
          )}
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all duration-200',
                  active
                    ? 'bg-black/[0.07] text-fg'
                    : 'text-muted hover:text-fg hover:bg-black/[0.055]'
                )}
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
        className={clsx(
          'md:hidden flex items-center justify-between px-5 h-14 transition-all duration-500',
          (scrolled || menuOpen) && 'bg-bg/85 backdrop-blur-2xl'
        )}
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
          <span className={clsx('block h-px bg-fg transition-all duration-300 origin-center',
            menuOpen ? 'w-5 translate-y-[5px] rotate-45' : 'w-5')} />
          <span className={clsx('block h-px bg-fg transition-all duration-300',
            menuOpen ? 'w-0 opacity-0' : 'w-3.5 opacity-100')} />
          <span className={clsx('block h-px bg-fg transition-all duration-300 origin-center',
            menuOpen ? 'w-5 -translate-y-[5px] -rotate-45' : 'w-5')} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={clsx(
        'md:hidden overflow-hidden transition-all duration-350 bg-bg/95 backdrop-blur-2xl',
        menuOpen ? 'max-h-80 ' : 'max-h-0'
      )}>
        <nav className="px-5 py-3 flex flex-col" aria-label="Mobile navigation">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3.5 border-b border-black/[0.06] last:border-none text-sm font-medium text-muted hover:text-fg transition-colors duration-200"
            >
              <span>{link.label}</span>
              <span className="text-[10px] text-subtle font-mono">
                {String(i + 1).padStart(2, '0')}
              </span>
            </Link>
          ))}
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
