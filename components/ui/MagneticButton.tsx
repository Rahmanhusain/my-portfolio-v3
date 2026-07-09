'use client';

import { useRef, MouseEvent } from 'react';
import { gsap } from '@/lib/gsap';
import clsx from 'clsx';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: 'button' | 'a';
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  as = 'button',
  target,
  rel,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  const sharedProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: clsx(
      'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#242424]',
      'text-sm font-medium text-[#fafafa] transition-colors duration-200',
      'hover:bg-[#fafafa] hover:text-[#0a0a0a] hover:border-[#fafafa]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fafafa]',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      className
    ),
    'aria-label': ariaLabel,
  };

  if (as === 'a' && href) {
    return (
      <a
        {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        target={target}
        rel={rel}
        ref={ref as React.RefObject<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      type={type}
      onClick={onClick}
      disabled={disabled}
      ref={ref as React.RefObject<HTMLButtonElement>}
    >
      {children}
    </button>
  );
}
