import { SVGProps } from 'react';

import { IconProps } from './SearchIcon';

/**
 * Code / build glyph (angle brackets and slash).
 * Control size via `className` (e.g. "h-6 w-6") and weight via `strokeWidth`.
 */
export function CodeIcon(props: IconProps) {
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
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
    </svg>
  );
}

export default CodeIcon;
