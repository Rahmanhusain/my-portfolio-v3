'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { site } from '@/lib/site';

interface BookingModalContextValue {
  open: (source?: string) => void;
  close: () => void;
  isOpen: boolean;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function useBookingModal(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error('useBookingModal must be used within <BookingModalProvider>');
  }
  return ctx;
}

interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  /** Optional — narrows the conversation before the call. */
  service: string;
  /** Optional — visitor can drop a one-liner here. */
  details: string;
}

/**
 * Fields a freelancer can actually act on, gathered from the visitor's
 * browser at submit time. None of it is invasive — it's the kind of context
 * that helps you qualify a lead and propose a good meeting time.
 */
function collectDeviceInfo() {
  if (typeof window === 'undefined') return {};
  const ua = navigator.userAgent;
  const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
    ? /iPad|Tablet/i.test(ua)
      ? 'tablet'
      : 'mobile'
    : 'desktop';
  const conn =
    (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
      ?.effectiveType ?? null;
  return {
    userAgent: ua,
    language: navigator.language,
    languages: navigator.languages?.join(', ') ?? null,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    deviceType,
    screen: `${window.screen.width}x${window.screen.height} @${window.devicePixelRatio}x`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    online: navigator.onLine,
    connection: conn,
    referrer: document.referrer || null,
    url: window.location.href,
    path: window.location.pathname,
  };
}

const inputClass =
  'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#8a8a8a] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200';

const SERVICE_OPTIONS = [
  { value: 'web-app',     label: 'Web App Development' },
  { value: 'ui-ux',       label: 'UI/UX Design' },
  { value: 'api-backend', label: 'API & Backend' },
  { value: 'crm',         label: 'Custom CRM' },
  { value: 'ecommerce',   label: 'E-Commerce' },
  { value: 'hosting',     label: 'Hosting & Deployment' },
  { value: 'automation',  label: 'Automation / AI Agents' },
  { value: 'email-setup', label: 'Business Email Setup' },
  { value: 'other',       label: 'Other' },
] as const;

const selectClass =
  'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200 appearance-none cursor-pointer pr-10';

export default function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<string>('unknown');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<BookingDetails>({
    name: '',
    email: '',
    phone: '',
    service: '',
    details: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingDetails, string>>>({});

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const open = useCallback((src = 'unknown') => {
    setSource(src);
    setForm({ name: '', email: '', phone: '', service: '', details: '' });
    setErrors({});
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  /* Capture previously-focused element + lock body scroll while open */
  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* Focus first field on open, restore on close */
  useEffect(() => {
    if (!isOpen) {
      lastFocusedRef.current?.focus?.();
      return;
    }
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [isOpen]);

  /* Escape to close + simple focus trap */
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof BookingDetails, string>> = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email.';
    }
    if (!form.phone.trim()) {
      next.phone = 'Phone number is required.';
    } else {
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) {
        next.phone = 'Enter a valid phone number (with country code).';
      }
    }
    // service + details are optional but if details is set it should be
    // substantive enough to be useful on the call.
    if (form.details.trim() && form.details.trim().length < 10) {
      next.details = 'A sentence or two helps me prepare.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.service.trim() || null,
      details: form.details.trim() || null,
      source,
      device: collectDeviceInfo(),
    };

    // Fire the Telegram notification in the background — never block the
    // visitor from reaching the scheduler.
    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('[Booking] notify failed:', err));

    // Redirect to the scheduling page within the click gesture so popup
    // blockers don't interfere. Prefill so the visitor isn't asked twice.
    const params = new URLSearchParams({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    });
    if (payload.service) params.set('service', payload.service);
    if (payload.details) params.set('notes', payload.details);
    window.open(`${site.bookingUrl}?${params.toString()}`, '_blank', 'noopener,noreferrer');

    setSubmitting(false);
    close();
  };

  const detailsLength = form.details.trim().length;

  return (
    <BookingModalContext.Provider value={{ open, close, isOpen }}>
      {children}

      <div
        className={`fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-5 overflow-y-auto transition-opacity duration-200 motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="presentation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />

        {/* Dialog — caps at viewport height and scrolls internally so it
            never gets clipped on short screens, while still centering on tall
            ones (flex parent above does the centering). */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          aria-describedby="booking-modal-desc"
          className={`relative w-full max-w-md my-auto bg-[#0a0a0a] border border-[#242424] rounded-2xl p-6 md:p-8 shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto transition-all duration-200 motion-reduce:transition-none ${
            isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
          }`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#8a8a8a] hover:text-[#fafafa] hover:bg-white/[0.06] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <header className="mb-5 pr-8">
            <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-2">
              Book a Free 30-Minute Call
            </p>
            <h2
              id="booking-modal-title"
              className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight"
            >
              Let&apos;s set up a time
            </h2>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="booking-name" className="block text-xs text-[#8a8a8a] mb-1.5">
                Name
              </label>
              <input
                ref={firstFieldRef}
                id="booking-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                aria-describedby={errors.name ? 'booking-name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p id="booking-name-error" className="text-xs text-red-400 mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-email" className="block text-xs text-[#8a8a8a] mb-1.5">
                Email
              </label>
              <input
                id="booking-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                aria-describedby={errors.email ? 'booking-email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="booking-email-error" className="text-xs text-red-400 mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-phone" className="block text-xs text-[#8a8a8a] mb-1.5">
                Phone number
              </label>
              <input
                id="booking-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/[^\d+\s().-]/g, '').slice(0, 24),
                  })
                }
                className={inputClass}
                aria-describedby={
                  errors.phone ? 'booking-phone-error' : 'booking-phone-hint'
                }
                aria-invalid={!!errors.phone}
              />
              {!errors.phone && (
                <p id="booking-phone-hint" className="text-xs text-[#8a8a8a] mt-1.5">
                  Include your country code (e.g. +1, +44, +91).
                </p>
              )}
              {errors.phone && (
                <p id="booking-phone-error" className="text-xs text-red-400 mt-1.5">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-service" className="block text-xs text-[#8a8a8a] mb-1.5">
                What can I help with? <span className="text-[#6a6a6a]">(optional)</span>
              </label>
              <div className="relative">
                <select
                  id="booking-service"
                  name="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Not sure yet</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8a8a8a]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="booking-details" className="block text-xs text-[#8a8a8a] mb-1.5">
                A few project details <span className="text-[#6a6a6a]">(optional)</span>
              </label>
              <textarea
                id="booking-details"
                name="details"
                rows={3}
                placeholder="What are you building, and what's the timeline?"
                value={form.details}
                onChange={(e) =>
                  setForm({ ...form, details: e.target.value.slice(0, 500) })
                }
                className={`${inputClass} resize-none`}
                aria-describedby={
                  errors.details ? 'booking-details-error' : 'booking-details-hint'
                }
                aria-invalid={!!errors.details}
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.details ? (
                  <p id="booking-details-error" className="text-xs text-red-400">
                    {errors.details}
                  </p>
                ) : (
                  <p id="booking-details-hint" className="text-xs text-[#8a8a8a]">
                    Helps me prep useful questions instead of generic ones.
                  </p>
                )}
                <span
                  className={`text-xs ${detailsLength < 10 ? 'text-[#8a8a8a]' : 'text-[#fafafa]'}`}
                >
                  {detailsLength}/500
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer w-full mt-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#fafafa] text-sm font-semibold text-[#0a0a0a] bg-[#fafafa] hover:bg-white/[0.85] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fafafa] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Redirecting…' : 'Continue to scheduling →'}
            </button>
          </form>

          <p
            id="booking-modal-desc"
            className="mt-4 text-xs leading-relaxed text-[#8a8a8a]"
          >
            By submitting, you&apos;ll be redirected to the scheduling page where
            you can pick a date and your preferred available time slot — your
            booking is confirmed there.
          </p>
        </div>
      </div>
    </BookingModalContext.Provider>
  );
}
