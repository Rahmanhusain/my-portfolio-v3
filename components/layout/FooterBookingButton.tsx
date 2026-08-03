'use client';

import { useBookingModal } from '@/components/ui/BookingModalProvider';

export default function FooterBookingButton() {
  const { open } = useBookingModal();
  return (
    <button
      type="button"
      onClick={() => open('footer')}
      className="text-sm text-muted hover:text-fg transition-colors duration-200 cursor-pointer"
    >
      Book a call
    </button>
  );
}
