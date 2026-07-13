import { SVGProps } from 'react';

import { IconProps } from './SearchIcon';

/**
 * Rocket / launch glyph.
 * Control size via `className` (e.g. "h-6 w-6") and weight via `strokeWidth`.
 */
export function RocketIcon(props: IconProps) {
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
      <path d="M12 3c3 1.5 4.5 4.5 4.5 8L12 15l-4.5-4c0-3.5 1.5-6.5 4.5-8Z" />
      <path d="M9 15l-2 4 3-1M15 15l2 4-3-1" />
      <circle cx="12" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default RocketIcon;
