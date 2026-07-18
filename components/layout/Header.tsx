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
  { label: 'Contact',  href: '/#contact' },
];

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
          scrolled && 'bg-[#0a0a0a]/75 backdrop-blur-2xl'
        )}
      >
        {/* Left — logo */}
        <Link
          href="/"
          aria-label="Home"
          className="font-display font-bold text-[#fafafa] text-base tracking-tight hover:opacity-60 transition-opacity duration-200 w-fit"
        >
          Rahman<span className="text-white/30">.</span>
        </Link>

        {/* Centre — pill nav */}
        <nav
          aria-label="Main navigation"
          className={clsx(
            'flex items-center justify-center gap-0.5 mx-auto rounded-full px-1.5 py-1 transition-all duration-500',
            scrolled
              ? 'bg-white/[0.05] border border-white/[0.08]'
              : 'bg-white/[0.03] border border-white/[0.05]'
          )}
        >
          {navLinks.map((link) => {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all duration-200 text-[#8a8a8a] hover:text-[#fafafa] hover:bg-white/[0.07]'
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
            className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-[#fafafa] bg-transparent border border-white/[0.12] px-4 py-2 rounded-full hover:bg-[#fafafa] hover:text-[#0a0a0a] hover:border-transparent transition-all duration-200"
          >
            Book a call
          </button>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div
        className={clsx(
          'md:hidden flex items-center justify-between px-5 h-14 transition-all duration-500',
          (scrolled || menuOpen) && 'bg-[#0a0a0a]/85 backdrop-blur-2xl'
        )}
      >
        <Link
          href="/"
          aria-label="Home"
          className="font-display font-bold text-[#fafafa] text-base tracking-tight"
        >
          Rahman<span className="text-white/30">.</span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        >
          <span className={clsx('block h-px bg-[#fafafa] transition-all duration-300 origin-center',
            menuOpen ? 'w-5 translate-y-[5px] rotate-45' : 'w-5')} />
          <span className={clsx('block h-px bg-[#fafafa] transition-all duration-300',
            menuOpen ? 'w-0 opacity-0' : 'w-3.5 opacity-100')} />
          <span className={clsx('block h-px bg-[#fafafa] transition-all duration-300 origin-center',
            menuOpen ? 'w-5 -translate-y-[5px] -rotate-45' : 'w-5')} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={clsx(
        'md:hidden overflow-hidden transition-all duration-350 bg-[#0a0a0a]/95 backdrop-blur-2xl',
        menuOpen ? 'max-h-80 ' : 'max-h-0'
      )}>
        <nav className="px-5 py-3 flex flex-col" aria-label="Mobile navigation">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-none text-sm font-medium text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200"
            >
              <span>{link.label}</span>
              <span className="text-[10px] text-white/20 font-mono">
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
            className="mt-4 mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#0a0a0a] bg-[#fafafa] px-5 py-3 rounded-full cursor-pointer"
          >
            Book a call
          </button>
        </nav>
      </div>

    </header>
  );
}
