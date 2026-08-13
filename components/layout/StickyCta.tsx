'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBookingModal } from '@/components/ui/BookingModalProvider';
import { whatsappHrefFor } from '@/lib/site';
import type { SiteConfig } from '@/lib/types/content';

/**
 * Persistent booking CTA that slides up once the visitor is past the fold.
 *
 * This is the site's safety net: wherever someone stops reading — mid-article,
 * mid-service-page — the next step is one tap away instead of a scroll back to
 * the header. Dismissible, because a bar you can't close is a bar people leave.
 *
 * Hidden on /contact (the form is already the page) and while the booking
 * modal itself is open.
 */
export default function StickyCta({ site }: { site: SiteConfig }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { open, isOpen } = useBookingModal();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      // Show past ~70% of a viewport, and hide again near the very bottom so
      // it never covers the footer's own contact links.
      const y = window.scrollY;
      const nearBottom =
        y + window.innerHeight >= document.documentElement.scrollHeight - 220;
      setVisible(y > window.innerHeight * 0.7 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (pathname === '/contact' || dismissed) return null;

  const shown = visible && !isOpen;

  return (
    <div
      className={`fixed sm:translate-x-1/2 sm:right-1/2 inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 transition-all duration-300 motion-reduce:transition-none ${
        shown
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      aria-hidden={!shown}
    >
      <div
        className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-black/[0.1] bg-bg/85 p-2.5 pl-4 shadow-2xl backdrop-blur-2xl sm:gap-4"
        role="complementary"
        aria-label="Booking shortcut"
      >
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-sm font-medium text-fg">
            Have a project in mind?
          </p>
          <p className="truncate text-[11px] text-muted">
            {site.responseTime}
          </p>
        </div>

        <a
          href={whatsappHrefFor(site)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message on WhatsApp"
          tabIndex={shown ? 0 : -1}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.1] text-muted transition-colors duration-200 hover:border-black/25 hover:text-fg"
        >
          <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        <button
          type="button"
          onClick={() => open('sticky-cta')}
          tabIndex={shown ? 0 : -1}
          className="flex-1 cursor-pointer rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-strong sm:flex-none"
        >
          Book a free call
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          tabIndex={shown ? 0 : -1}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors duration-200 hover:text-fg"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
