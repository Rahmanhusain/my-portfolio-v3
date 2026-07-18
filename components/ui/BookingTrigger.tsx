'use client';

import MagneticButton from '@/components/ui/MagneticButton';
import { useBookingModal } from '@/components/ui/BookingModalProvider';

interface BookingTriggerProps {
  children: React.ReactNode;
  className?: string;
  /** Which CTA triggered the modal — surfaced in the Telegram notification. */
  source?: string;
}

export default function BookingTrigger({
  children,
  className,
  source = 'unknown',
}: BookingTriggerProps) {
  const { open } = useBookingModal();
  return (
    <MagneticButton onClick={() => open(source)} className={className}>
      {children}
    </MagneticButton>
  );
}
