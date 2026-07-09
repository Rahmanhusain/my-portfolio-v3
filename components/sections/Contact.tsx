'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from('.contact-inner', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' },
      });
    },
    { scope: sectionRef }
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email.';
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
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#8a8a8a] focus:outline-none focus:border-[#8a8a8a] transition-colors duration-200';

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="contact-inner grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          {/* Left */}
          <div>
            <SectionHeading
              eyebrow="Get in Touch"
              title="Let's work together."
              description="Have a project in mind or just want to say hello? I'd love to hear from you."
            />
            <div className="space-y-4 mt-2">
              <a
                href="mailto:hello@yourname.dev"
                className="flex items-center gap-3 text-[#8a8a8a] hover:text-[#fafafa] transition-colors text-sm group"
              >
                <span className="w-8 h-8 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden="true">
                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                hello@yourname.dev
              </a>
              <a
                href="https://github.com/rahman"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#8a8a8a] hover:text-[#fafafa] transition-colors text-sm group"
              >
                <span className="w-8 h-8 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </span>
                github.com/rahman
              </a>
              <a
                href="https://linkedin.com/in/rahman"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#8a8a8a] hover:text-[#fafafa] transition-colors text-sm group"
              >
                <span className="w-8 h-8 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </span>
                linkedin.com/in/rahman
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs text-[#8a8a8a] mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-red-400 mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs text-[#8a8a8a] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-400 mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-[#8a8a8a] mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
                aria-describedby={errors.message ? 'message-error' : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p id="message-error" className="text-xs text-red-400 mt-1.5">
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
        </div>
      </div>
    </section>
  );
}
