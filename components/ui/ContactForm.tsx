'use client';

import { useEffect, useState } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetAmount: string;
  budgetCurrency: Currency;
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

/* Per-currency bracket options. "Custom" lets the visitor type their own number
   and "not-sure" keeps the door open for the undecided — same as before. */
const BUDGET_BUCKETS: Record<Currency, { value: string; label: string }[]> = {
  USD: [
    { value: 'under-2500',    label: 'Under $2,500' },
    { value: '2500-5000',     label: '$2,500 – $5,000' },
    { value: '5000-10000',    label: '$5,000 – $10,000' },
    { value: '10000-plus',    label: '$10,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  INR: [
    { value: 'under-2L',      label: 'Under ₹2,00,000' },
    { value: '2L-4L',         label: '₹2,00,000 – ₹4,00,000' },
    { value: '4L-8L',         label: '₹4,00,000 – ₹8,00,000' },
    { value: '8L-15L',        label: '₹8,00,000 – ₹15,00,000' },
    { value: '15L-plus',      label: '₹15,00,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  EUR: [
    { value: 'under-2500',    label: 'Under €2,500' },
    { value: '2500-5000',     label: '€2,500 – €5,000' },
    { value: '5000-10000',    label: '€5,000 – €10,000' },
    { value: '10000-plus',    label: '€10,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  GBP: [
    { value: 'under-2000',    label: 'Under £2,000' },
    { value: '2000-4000',     label: '£2,000 – £4,000' },
    { value: '4000-8000',     label: '£4,000 – £8,000' },
    { value: '8000-plus',     label: '£8,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  AUD: [
    { value: 'under-4k',      label: 'Under A$4,000' },
    { value: '4k-8k',         label: 'A$4,000 – A$8,000' },
    { value: '8k-15k',        label: 'A$8,000 – A$15,000' },
    { value: '15k-plus',      label: 'A$15,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  CAD: [
    { value: 'under-4k',      label: 'Under C$4,000' },
    { value: '4k-8k',         label: 'C$4,000 – C$8,000' },
    { value: '8k-15k',        label: 'C$8,000 – C$15,000' },
    { value: '15k-plus',      label: 'C$15,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
  AED: [
    { value: 'under-10k',     label: 'Under د.إ10,000' },
    { value: '10k-20k',       label: 'د.إ10,000 – د.إ20,000' },
    { value: '20k-40k',       label: 'د.إ20,000 – د.إ40,000' },
    { value: '40k-plus',      label: 'د.إ40,000+' },
    { value: 'custom',        label: 'Custom amount…' },
    { value: 'not-sure',      label: 'Not sure yet' },
  ],
};

const BUDGET_LABELS: Record<Currency, Record<string, string>> = Object.fromEntries(
  CURRENCIES.map((c) => [c.value, Object.fromEntries(BUDGET_BUCKETS[c.value].map((b) => [b.value, b.label]))])
) as Record<Currency, Record<string, string>>;

const SYMBOL: Record<Currency, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.value, c.symbol])
) as Record<Currency, string>;

const inputClass =
  'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#8a8a8a] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200';

const selectClass =
  'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200 appearance-none cursor-pointer';

function ChevronDown() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8a8a8a]">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    budgetAmount: '',
    budgetCurrency: 'USD',
    timeline: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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
    if (!form.budgetAmount) newErrors.budgetAmount = 'Pick a budget range or "Not sure yet".';
    if (form.budgetAmount === 'custom') {
      const raw = form.message; // reused only for the validation check below
      void raw;
    }
    if (!form.timeline) newErrors.timeline = 'Please select a timeline.';
    if (!form.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (form.message.trim().length < 20) {
      newErrors.message = 'Please share a bit more detail (at least 20 characters).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      // Compose a human-readable budget for the backend + email/Telegram.
      const budgetLabel =
        form.budgetAmount === 'custom'
          ? 'Custom'
          : BUDGET_LABELS[form.budgetCurrency][form.budgetAmount] ?? form.budgetAmount;
      const budget = `${budgetLabel} (${form.budgetCurrency})`;

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
        budgetCurrency: 'USD',
        timeline: '',
        message: '',
      });
    } catch {
      setStatus('error');
    }
  };

  const messageLength = form.message.trim().length;
  const budgetOptions = BUDGET_BUCKETS[form.budgetCurrency];
  const showCustomInput = form.budgetAmount === 'custom';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs text-[#8a8a8a] mb-1.5">
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
          <label htmlFor="contact-email" className="block text-xs text-[#8a8a8a] mb-1.5">
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
          <label htmlFor="contact-phone" className="block text-xs text-[#8a8a8a] mb-1.5">
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
            <p id="contact-phone-hint" className="text-xs text-[#8a8a8a] mt-1.5">
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
          <label htmlFor="contact-service" className="block text-xs text-[#8a8a8a] mb-1.5">
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

      {/* Budget — currency picker + range select + optional custom amount */}
      <fieldset>
        <legend className="block text-xs text-[#8a8a8a] mb-1.5">Budget Range</legend>
        <div className="grid grid-cols-[112px_1fr] gap-2">
          <div className="relative">
            <label htmlFor="contact-budget-currency" className="sr-only">
              Currency
            </label>
            <select
              id="contact-budget-currency"
              name="budgetCurrency"
              value={form.budgetCurrency}
              onChange={(e) => {
                const next = e.target.value as Currency;
                // Reset the bucket — the old value won't exist in the new list.
                setForm({ ...form, budgetCurrency: next, budgetAmount: '' });
              }}
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
            <select
              id="contact-budget"
              name="budgetAmount"
              value={form.budgetAmount}
              onChange={(e) => setForm({ ...form, budgetAmount: e.target.value })}
              className={`${selectClass} pr-10`}
              aria-describedby={errors.budgetAmount ? 'contact-budget-error' : 'contact-budget-hint'}
              aria-invalid={!!errors.budgetAmount}
            >
              <option value="" disabled>Select range</option>
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>

        {showCustomInput && (
          <div className="mt-2 relative">
            <label htmlFor="contact-budget-custom" className="sr-only">
              Custom budget amount
            </label>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a8a8a]">
              {SYMBOL[form.budgetCurrency]}
            </span>
            <input
              id="contact-budget-custom"
              type="text"
              inputMode="numeric"
              placeholder="Type your budget"
              className={`${inputClass} pl-10`}
              aria-describedby="contact-budget-hint"
              onChange={(e) =>
                setForm({
                  ...form,
                  budgetAmount: `custom:${e.target.value.replace(/[^\d.,\s]/g, '')}`,
                })
              }
            />
          </div>
        )}

        <p id="contact-budget-hint" className="text-xs text-[#8a8a8a] mt-1.5">
          {form.budgetAmount === 'not-sure'
            ? "No problem — we'll figure it out together on the call."
            : 'Currency-converted estimates available on request.'}
        </p>
        {errors.budgetAmount && (
          <p id="contact-budget-error" className="text-xs text-red-400 mt-1.5">
            {errors.budgetAmount}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="contact-timeline" className="block text-xs text-[#8a8a8a] mb-1.5">
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
        <label htmlFor="contact-message" className="block text-xs text-[#8a8a8a] mb-1.5">
          Project Details
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me about your project, goals, and any specific requirements..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
          aria-invalid={!!errors.message}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.message ? (
            <p id="contact-message-error" className="text-xs text-red-400">
              {errors.message}
            </p>
          ) : (
            <p id="contact-message-hint" className="text-xs text-[#8a8a8a]">
              Share your goals, key requirements, and what success looks like.
            </p>
          )}
          <span className={`text-xs ${messageLength < 20 ? 'text-[#8a8a8a]' : 'text-[#fafafa]'}`}>
            {messageLength}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <MagneticButton
          type="submit"
          disabled={status === 'loading'}
          className="w-full justify-center"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </MagneticButton>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8a8a8a]">
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
            Something went wrong. Please email me directly at hello@yourname.dev.
          </p>
        </div>
      )}
    </form>
  );
}
