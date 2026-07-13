import { SVGProps } from 'react';

import { IconProps } from './SearchIcon';

/**
 * Pen / design glyph.
 * Control size via `className` (e.g. "h-6 w-6") and weight via `strokeWidth`.
 */
export function PenIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 20 15.5 8.5l-2-2L2 18v2h2Z" />
      <path d="m14.5 7.5 2-2a1.4 1.4 0 0 1 2 0l0 0a1.4 1.4 0 0 1 0 2l-2 2" />
    </svg>
  );
}

export default PenIcon;
