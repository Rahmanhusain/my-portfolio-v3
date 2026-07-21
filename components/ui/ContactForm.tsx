'use client';

import { useState } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const inputClass =
  'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#8a8a8a] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
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
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

      <div>
        <label htmlFor="contact-phone" className="block text-xs text-[#8a8a8a] mb-1.5">
          Phone number
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p id="contact-phone-error" className="text-xs text-red-400 mt-1.5">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs text-[#8a8a8a] mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-xs text-red-400 mt-1.5">
            {errors.message}
          </p>
        )}
      </div>

      <MagneticButton
        type="submit"
        disabled={status === 'loading'}
        className="w-full justify-center"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </MagneticButton>

      {status === 'success' && (
        <p role="status" className="text-sm text-green-400 text-center pt-1">
          Message sent — I&apos;ll get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-400 text-center pt-1">
          Something went wrong. Please email me directly.
        </p>
      )}
    </form>
  );
}
