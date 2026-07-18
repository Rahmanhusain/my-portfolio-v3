import { NextRequest } from 'next/server';

interface BookingPayload {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  device?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingPayload;
    const { name, email, phone, source, device } = body;

    // Never trust the client — validate server-side too.
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return Response.json({ error: 'Name, email and phone are required.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Best-effort client IP (works behind Vercel / nginx / a proxy).
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : (request.headers.get('x-real-ip') ?? 'unknown');

    // If Telegram isn't wired up yet, don't break the booking flow.
    if (!token || !chatId) {
      console.warn('[Booking] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notify.');
      if (process.env.NODE_ENV === 'development') {
        console.log('[Booking] lead captured:', { name, email, phone, source, device, ip });
      }
      return Response.json({ success: true, warned: 'telegram_not_configured' }, { status: 200 });
    }

    // Escape Markdown control chars in user-supplied fields.
    const esc = (s: string) => s.replace(/[_*`]/g, (c) => '\\' + c);

    const line = (label: string, value: unknown) =>
      `${label}: ${value === undefined || value === null || value === '' ? '—' : String(value)}`;

    const message = [
      '*New Booking Request*',
      '──────────────────────',
      line('Name', esc(name.trim())),
      line('Email', esc(email.trim())),
      line('Phone', esc(phone.trim())),
      line('Source', source),
      '──────────────────────',
      '*Device*',
      line('Timezone', device?.timezone),
      line('Locale', device?.language),
      line('Platform', device?.platform),
      line('User agent', device?.userAgent),
      line('Device type', device?.deviceType),
      line('Screen', device?.screen),
      line('Referrer', device?.referrer),
      line('Page', device?.path),
      line('IP', ip),
      '──────────────────────',
      line('Submitted', new Date().toISOString()),
    ].join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Booking] Telegram send failed:', res.status, err);
      return Response.json({ error: 'Notification failed.' }, { status: 502 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
