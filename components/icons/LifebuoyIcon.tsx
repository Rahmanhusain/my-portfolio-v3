import { SVGProps } from 'react';

import { IconProps } from './SearchIcon';

/**
 * Lifebuoy / support glyph.
 * Control size via `className` (e.g. "h-6 w-6") and weight via `strokeWidth`.
 */
export function LifebuoyIcon(props: IconProps) {
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
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="m14 6 2.5-2.5M6 14l-2.5 2.5M18 14l2.5 2.5M10 6 7.5 3.5" />
    </svg>
  );
}

export default LifebuoyIcon;
