import { NextRequest } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };
    const { name, email, phone, message } = body;

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      return Response.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    // Best-effort client metadata (server-side only — no extra client work).
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : (request.headers.get('x-real-ip') ?? 'unknown');
    const userAgent = request.headers.get('user-agent') ?? 'unknown';
    const referer = request.headers.get('referer') ?? 'unknown';
    const path = request.nextUrl?.pathname ?? '/';
    const submittedAt = new Date().toISOString();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    const telegramConfigured = Boolean(token && chatId);
    const emailConfigured = Boolean(resendKey && contactEmail);

    // Escape Markdown control chars in user-supplied fields.
    const esc = (s: string) => s.replace(/[_*`]/g, (c) => '\\' + c);
    const line = (label: string, value: string) => `*${label}:* ${esc(value)}`;

    let telegramFailed = false;
    let emailFailed = false;

    /* ── Telegram notification (mirrors /api/booking) ───────────── */
    if (telegramConfigured) {
      const tgMessage = [
        '*New Contact Message* 💌',
        '──────────────────────',
        line('Name', name.trim()),
        line('Email', email.trim()),
        line('Phone', phone.trim()),
        '*Message:*',
        esc(message.trim()),
        '──────────────────────',
        '*Meta*',
        line('IP', ip),
        line('User agent', userAgent),
        line('Referrer', referer),
        line('Page', path),
        line('Submitted', submittedAt),
      ].join('\n');

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: tgMessage, parse_mode: 'Markdown' }),
        });
        if (!res.ok) {
          telegramFailed = true;
          console.error('[Contact] Telegram send failed:', res.status, await res.text());
        }
      } catch (err) {
        telegramFailed = true;
        console.error('[Contact] Telegram send error:', err);
      }
    } else {
      console.warn('[Contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping Telegram notify.');
    }

    /* ── Email via Resend ──────────────────────────────────────── */
    if (resendKey && contactEmail) {
      const escapeHtml = (s: string) =>
        s.replace(
          /[&<>"']/g,
          (c) =>
            c === '&' ? '&amp;'
            : c === '<' ? '&lt;'
            : c === '>' ? '&gt;'
            : c === '"' ? '&quot;'
            : '&#39;',
        );
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;color:#1a1a1a;line-height:1.5;">
          <h2 style="margin:0 0 12px;">New contact message 💌</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #ff8fab;background:#fafafa;color:#333;">
            ${escapeHtml(message).replace(/\n/g, '<br/>')}
          </blockquote>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <p style="color:#888;font-size:12px;">
            IP: ${escapeHtml(ip)}<br/>
            Page: ${escapeHtml(path)}<br/>
            Submitted: ${escapeHtml(submittedAt)}
          </p>
        </div>`;

      try {
        const resend = new Resend(resendKey);
        const { error } = await resend.emails.send({
          // `onboarding@resend.dev` works out-of-the-box; swap for your own
          // verified domain once Resend is configured.
          from: process.env.CONTACT_FROM_EMAIL ?? 'Rahman Portfolio <onboarding@resend.dev>',
          to: contactEmail,
          replyTo: email.trim(),
          subject: `New contact message from ${name.trim()}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}\n\n—\nIP: ${ip}\nPage: ${path}\nSubmitted: ${submittedAt}`,
          html,
        });
        if (error) {
          emailFailed = true;
          console.error('[Contact] Resend error:', error);
        }
      } catch (err) {
        emailFailed = true;
        console.error('[Contact] Resend send error:', err);
      }
    } else {
      console.warn('[Contact] RESEND_API_KEY / CONTACT_EMAIL not set — skipping email.');
    }

    // Dev fallback so we never lose a lead before env vars are wired up.
    if (!telegramConfigured && !emailConfigured && process.env.NODE_ENV === 'development') {
      console.log('[Contact Form]', { name, email, phone, message, ip, path });
    }

    // Success if at least one configured channel delivered (or none configured).
    const delivered =
      (telegramConfigured && !telegramFailed) || (emailConfigured && !emailFailed);
    if ((telegramConfigured || emailConfigured) && !delivered) {
      return Response.json({ error: 'Notification failed.' }, { status: 502 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
