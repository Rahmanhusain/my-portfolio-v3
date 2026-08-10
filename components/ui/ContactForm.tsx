'use client';

import { useEffect, useRef, useState } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';
import type { SiteConfig } from '@/lib/types/content';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetAmount: string;
  budgetCurrency: Currency;
  /** Ticked by default — the visitor opts *out* of it to name a figure. */
  budgetDecideOnCall: boolean;
  timeline: string;
  message: string;
}

const CURRENCIES: { value: Currency; symbol: string; label: string }[] = [
  { value: 'USD', symbol: '$',  label: 'USD ($)' },
  { value: 'INR', symbol: '₹',  label: 'INR (₹)' },
  { value: 'EUR', symbol: '€',  label: 'EUR (€)' },
  { value: 'GBP', symbol: '£',  label: 'GBP (£)' },
  { value: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { value: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { value: 'AED', symbol: 'د.إ', label: 'AED (د.إ)' },
];

const SYMBOL: Record<Currency, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.value, c.symbol])
) as Record<Currency, string>;

/* Budget defaults to "decide on call" — the honest answer for most enquiries,
   and it removes the one question a visitor is least able to answer before
   speaking to anyone. Unticking the box is how someone who *does* have a
   figure names it, in the currency they picked.

   The typed value is kept permissive on purpose — a range ("5000-8000") or a
   grouped figure ("1,50,000") are both normal answers. Letters and symbols are
   stripped so the value stays readable in the notification and the admin
   inbox, and the length is capped so the field cannot smuggle a payload. */
const MAX_BUDGET_LENGTH = 24;

function sanitizeBudget(value: string): string {
  return value.replace(/[^\d.,\s\-–]/g, '').slice(0, MAX_BUDGET_LENGTH);
}

const inputClass =
  'w-full bg-raised border border-border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-muted transition-colors duration-200';

const selectClass =
  'w-full bg-raised border border-border rounded-xl px-4 py-3 text-sm text-fg focus:outline-none focus:border-muted transition-colors duration-200 appearance-none cursor-pointer';

function ChevronDown() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function ContactForm({ site }: { site: SiteConfig }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    budgetAmount: '',
    budgetCurrency: 'USD',
    budgetDecideOnCall: true,
    timeline: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  /** Focused when "Decide on call" is unticked, so typing can start at once. */
  const budgetInputRef = useRef<HTMLInputElement>(null);

  /* Auto-hide the success banner after 5 seconds. */
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => setStatus('idle'), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  /* Region detection: default to INR for visitors in India, USD otherwise.
     Done in an effect (not at init) because Intl APIs only resolve on the
     client, and reading them in render would mismatch SSR vs CSR. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isIndia = false;
    try {
      const locale = new Intl.Locale(navigator.language).maximize();
      isIndia = locale.region === 'IN';
    } catch {
      isIndia = false;
    }
    if (!isIndia) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        isIndia = tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta';
      } catch {
        isIndia = false;
      }
    }
    if (isIndia) {
      // One-shot region inference on mount: flip the default currency to INR
      // only if the user hasn't picked yet. Reading the current state via the
      // updater function makes this safe against race conditions.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => (prev.budgetCurrency === 'USD' && !prev.budgetAmount
        ? { ...prev, budgetCurrency: 'INR' }
        : prev));
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email.';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else {
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) {
        newErrors.phone = 'Enter a valid phone number (with country code).';
      }
    }
    if (!form.serviceType) newErrors.serviceType = 'Please select a service.';
    // Only checked once the visitor has opted out of "Decide on call" — at
    // that point an empty box is an unfinished thought, not an answer.
    if (!form.budgetDecideOnCall && !form.budgetAmount.trim()) {
      newErrors.budgetAmount = 'Enter an amount, or tick “Decide on call”.';
    }
    if (!form.timeline) newErrors.timeline = 'Please select a timeline.';
    // Project details are optional and unbounded: name, email, phone, service
    // and timeline are already enough to reply to, and a length floor only
    // ever punished the people who wrote a short, clear sentence.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      // Compose a human-readable budget for the backend + email/Telegram.
      // The default reads as an explicit "Decide on call" rather than an empty
      // line nobody can interpret later.
      const amount = form.budgetAmount.trim();
      const budget =
        form.budgetDecideOnCall || !amount
          ? 'Decide on call'
          : `${SYMBOL[form.budgetCurrency]}${amount} (${form.budgetCurrency})`;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          serviceType: form.serviceType,
          budget,
          budgetCurrency: form.budgetCurrency,
          budgetAmount: form.budgetAmount,
          timeline: form.timeline,
          message: form.message,
          device: collectDeviceInfo(),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        budgetAmount: '',
        // Keep the currency. Region detection only runs once on mount, so
        // resetting to USD here would silently undo it for a visitor in India
        // who sends a second message.
        budgetCurrency: form.budgetCurrency,
        budgetDecideOnCall: true,
        timeline: '',
        message: '',
      });
    } catch {
      setStatus('error');
    }
  };


  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs text-muted mb-1.5">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p id="contact-name-error" className="text-xs text-red-400 mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs text-muted mb-1.5">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs text-red-400 mt-1.5">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="block text-xs text-muted mb-1.5">
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+1 555 123 4567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            aria-describedby={
              errors.phone ? 'contact-phone-error' : 'contact-phone-hint'
            }
            aria-invalid={!!errors.phone}
          />
          {!errors.phone && (
            <p id="contact-phone-hint" className="text-xs text-muted mt-1.5">
              Include your country code (e.g. +1, +44, +91).
            </p>
          )}
          {errors.phone && (
            <p id="contact-phone-error" className="text-xs text-red-400 mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-service" className="block text-xs text-muted mb-1.5">
            Service
          </label>
          <div className="relative">
            <select
              id="contact-service"
              name="serviceType"
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              className={`${selectClass} pr-10`}
              aria-describedby={errors.serviceType ? 'contact-service-error' : undefined}
              aria-invalid={!!errors.serviceType}
            >
              <option value="" disabled>Select a service</option>
              <option value="web-app">Web App Development</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="api-backend">API & Backend</option>
              <option value="crm">Custom CRM</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="hosting">Hosting & Deployment</option>
              <option value="automation">Automation / AI Agents</option>
              <option value="email-setup">Business Email Setup</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown />
          </div>
          {errors.serviceType && (
            <p id="contact-service-error" className="text-xs text-red-400 mt-1.5">
              {errors.serviceType}
            </p>
          )}
        </div>
      </div>

      {/* Budget — "Decide on call" is ticked by default; untick it to name a
          figure. The currency picker stays live either way. */}
      <fieldset>
        <legend className="block text-xs text-muted mb-1.5">Budget</legend>
        <div className="grid grid-cols-[112px_1fr] gap-2">
          <div className="relative">
            <label htmlFor="contact-budget-currency" className="sr-only">
              Currency
            </label>
            <select
              id="contact-budget-currency"
              name="budgetCurrency"
              value={form.budgetCurrency}
              onChange={(e) =>
                // The typed amount is deliberately preserved — switching
                // currency is how someone corrects the unit on a figure they
                // already entered, so wiping it would be hostile.
                setForm({ ...form, budgetCurrency: e.target.value as Currency })
              }
              className={`${selectClass} pr-8 pl-3`}
              aria-label="Budget currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <div className="relative">
            <label htmlFor="contact-budget" className="sr-only">
              Budget amount
            </label>
            <span
              aria-hidden="true"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted transition-opacity duration-200 ${
                form.budgetDecideOnCall ? 'opacity-40' : ''
              }`}
            >
              {SYMBOL[form.budgetCurrency]}
            </span>
            <input
              ref={budgetInputRef}
              id="contact-budget"
              name="budgetAmount"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.budgetAmount}
              onChange={(e) =>
                setForm({ ...form, budgetAmount: sanitizeBudget(e.target.value) })
              }
              disabled={form.budgetDecideOnCall}
              placeholder={form.budgetDecideOnCall ? '—' : 'e.g. 5,000'}
              className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-50`}
              aria-describedby={
                errors.budgetAmount ? 'contact-budget-error' : 'contact-budget-hint'
              }
              aria-invalid={!!errors.budgetAmount}
            />
          </div>
        </div>

        <label className="mt-2.5 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-strong">
          <input
            type="checkbox"
            name="budgetDecideOnCall"
            checked={form.budgetDecideOnCall}
            onChange={(e) => {
              const decideOnCall = e.target.checked;
              setForm({
                ...form,
                budgetDecideOnCall: decideOnCall,
                // Clear on tick so a disabled field never shows a number that
                // is not the one being sent.
                budgetAmount: decideOnCall ? '' : form.budgetAmount,
              });
              setErrors({ ...errors, budgetAmount: undefined });
              // Unticking is a request to type, so put the caret where the
              // typing goes instead of making them click again.
              if (!decideOnCall) {
                requestAnimationFrame(() => budgetInputRef.current?.focus());
              }
            }}
            className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-fg"
          />
          Decide on call
        </label>

        <p id="contact-budget-hint" className="text-xs text-muted mt-1.5">
          {form.budgetDecideOnCall
            ? "No problem — we'll work it out together on the call."
            : 'A rough figure or a range is fine — nothing here is binding.'}
        </p>
        {errors.budgetAmount && (
          <p id="contact-budget-error" className="text-xs text-red-400 mt-1.5">
            {errors.budgetAmount}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="contact-timeline" className="block text-xs text-muted mb-1.5">
          Timeline
        </label>
        <div className="relative">
          <select
            id="contact-timeline"
            name="timeline"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            className={`${selectClass} pr-10`}
            aria-describedby={errors.timeline ? 'contact-timeline-error' : undefined}
            aria-invalid={!!errors.timeline}
          >
            <option value="" disabled>Select timeline</option>
            <option value="asap">ASAP / Rush</option>
            <option value="1-2-weeks">1–2 weeks</option>
            <option value="1-month">~1 month</option>
            <option value="1-3-months">1–3 months</option>
            <option value="3-months-plus">3+ months</option>
            <option value="flexible">Flexible</option>
          </select>
          <ChevronDown />
        </div>
        {errors.timeline && (
          <p id="contact-timeline-error" className="text-xs text-red-400 mt-1.5">
            {errors.timeline}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs text-muted mb-1.5">
          Project Details <span className="text-subtle">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me about your project, goals, and any specific requirements..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          aria-describedby="contact-message-hint"
        />
        {/* The character count existed only to signal the old 20-character
            minimum. With no floor to reach it is just a number counting up at
            someone, so it goes with the rule it served. */}
        <p id="contact-message-hint" className="text-xs text-muted mt-1.5">
          Optional — but the more you share about goals and requirements, the
          more useful my first reply is.
        </p>
      </div>

      <div className="space-y-3">
        <MagneticButton
          type="submit"
          variant="solid"
          disabled={status === 'loading'}
          className="w-full justify-center cursor-pointer"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </MagneticButton>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1L6 6M6 6L9.5 2.5M6 6L2.5 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reply within 24 hours
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            NDA available on request
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1"/>
              <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            No spam, ever
          </span>
        </div>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-xl bg-green-400/10 border border-green-400/20">
          <p role="status" className="text-sm text-green-400 text-center">
            Message sent — I&apos;ll get back to you within one business day.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20">
          <p role="alert" className="text-sm text-red-400 text-center">
            Something went wrong. Please email me directly at{' '}
            <a href={`mailto:${site.social.email}`} className="underline">
              {site.social.email}
            </a>
            .
          </p>
        </div>
      )}
    </form>
  );
}
