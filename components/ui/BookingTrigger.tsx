'use client';

import MagneticButton, {
  type ButtonVariant,
} from '@/components/ui/MagneticButton';
import { useBookingModal } from '@/components/ui/BookingModalProvider';

interface BookingTriggerProps {
  children: React.ReactNode;
  className?: string;
  /** Which CTA triggered the modal — surfaced in the Telegram notification. */
  source?: string;
  variant?: ButtonVariant;
}

export default function BookingTrigger({
  children,
  className,
  source = 'unknown',
  variant = 'outline',
}: BookingTriggerProps) {
  const { open } = useBookingModal();
  return (
    <MagneticButton
      onClick={() => open(source)}
      variant={variant}
      className={className}
    >
      {children}
    </MagneticButton>
  );
}
