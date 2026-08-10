import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { saveLead } from '@/lib/db/leads';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      serviceType?: string;
      budget?: string;
      timeline?: string;
      message?: string;
      device?: Record<string, unknown>;

    };
    const { name, email, phone, serviceType, budget, timeline, message, device } = body;

    // Basic server-side validation. The project-details message is optional —
    // name, email and phone are already enough to reply to.
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return Response.json({ error: 'Name, email and phone are required.' }, { status: 400 });
    }

    // Normalised once so every consumer below (archive, Telegram, both emails)
    // agrees on what "no message" looks like instead of each guarding for
    // undefined in its own way.
    const messageText = message?.trim() ?? '';

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
    const path = request.nextUrl?.pathname ?? '/';
    const submittedAt = new Date().toISOString();

       const asText = (value: unknown) =>
      typeof value === 'string' && value.trim() ? value.trim() : undefined;

    // Archive the lead for the admin inbox before notifying. `saveLead`
    // never throws, so a database problem cannot block the notification.
    await saveLead({
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      serviceType,
      budget,
      timeline,
      message: messageText,
      meta: {
        ip,
        userAgent: asText(device?.userAgent),
        referrer: asText(device?.referrer),
        path: asText(device?.path),
        timezone: asText(device?.timezone),
        language: asText(device?.language),
        platform: asText(device?.platform),
        deviceType: asText(device?.deviceType),
        screen: asText(device?.screen),
      }
    });

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
        serviceType ? line('Service', serviceType) : null,
        budget ? line('Budget', budget) : null,
        timeline ? line('Timeline', timeline) : null,
        // Skipped entirely when empty — a "*Message:*" heading with nothing
        // under it reads like the notification broke.
        messageText ? '*Message:*' : null,
        messageText ? esc(messageText) : null,
        '──────────────────────',
        '*Meta*',
       line('Timezone', asText(device?.timezone) ?? ''),
      line('Locale', asText(device?.language) ?? ''),
      line('Platform', asText(device?.platform) ?? ''),
      line('User agent', asText(device?.userAgent) ?? ''),
      line('Device type', asText(device?.deviceType) ?? ''),
      line('Screen', asText(device?.screen) ?? ''),
      line('Referrer', asText(device?.referrer) ?? ''),
      line('Page', asText(device?.path) ?? ''),
      line('IP', ip),
        line('Submitted', submittedAt),
      ].filter(Boolean).join('\n');

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
          ${serviceType ? `<p><strong>Service:</strong> ${escapeHtml(serviceType)}</p>` : ''}
          ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ''}
          ${messageText
            ? `<p><strong>Message:</strong></p>
          <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #ff8fab;background:#fafafa;color:#333;">
            ${escapeHtml(messageText).replace(/\n/g, '<br/>')}
          </blockquote>`
            : '<p style="color:#888;"><em>No project details were provided.</em></p>'}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <p style="color:#888;font-size:12px;">
            IP: ${escapeHtml(ip)}<br/>
            Page: ${escapeHtml(path)}<br/>
            Submitted: ${escapeHtml(submittedAt)}
          </p>
        </div>`;

      try {
        const resend = new Resend(resendKey);

        // 1. Notify you with the full submission details.
        // const { error } = await resend.emails.send({
        //   // `onboarding@resend.dev` works out-of-the-box; swap for your own
        //   // verified domain once Resend is configured.
        //   from: process.env.CONTACT_FROM_EMAIL ?? 'Rahman Portfolio <onboarding@resend.dev>',
        //   to: contactEmail,
        //   replyTo: email.trim(),
        //   subject: `New contact message from ${name.trim()}`,
        //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n${serviceType ? `Service: ${serviceType}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}${timeline ? `Timeline: ${timeline}\n` : ''}\n${message}\n\n—\nIP: ${ip}\nPage: ${path}\nSubmitted: ${submittedAt}`,
        //   html,
        // });
        // if (error) {
        //   emailFailed = true;
        //   console.error('[Contact] Resend error:', error);
        // }

        // 2. Send a confirmation email to the person who filled the form.
        const confirmHtml = `
          <div style="font-family:Inter,Arial,sans-serif;color:#1a1a1a;line-height:1.6;max-width:560px;margin:0 auto;">
            <h2 style="margin:0 0 8px;">Thanks for reaching out, ${escapeHtml(name.trim())}!</h2>
            <p style="color:#555;margin:0 0 20px;">
              I've received your message and will get back to you within 24 hours.
              Here's a copy of what you sent:
            </p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
              <tr><td style="padding:6px 0;color:#888;width:110px;">Service</td><td style="padding:6px 0;">${escapeHtml(serviceType ?? '—')}</td></tr>
              <tr><td style="padding:6px 0;color:#888;">Budget</td><td style="padding:6px 0;">${escapeHtml(budget ?? '—')}</td></tr>
              <tr><td style="padding:6px 0;color:#888;">Timeline</td><td style="padding:6px 0;">${escapeHtml(timeline ?? '—')}</td></tr>
            </table>
            ${messageText
              ? `<p style="font-weight:600;margin:0 0 8px;">Your message</p>
            <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:3px solid #ff8fab;background:#fafafa;color:#333;">
              ${escapeHtml(messageText).replace(/\n/g, '<br/>')}
            </blockquote>`
              : ''}
            <p style="color:#555;">
              If you have anything to add, just reply to this email.<br/>
              Talk soon — Rahman
            </p>
          </div>`;

        const { error: confirmError } = await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL ?? 'Rahman Portfolio <onboarding@resend.dev>',
          to: email.trim(),
          replyTo: contactEmail,
          // cc: process.env.CONTACT_EMAIL?.split(',').map((e) => e.trim()) ?? [],
          subject: `Got your message — I'll be in touch soon`,
          text: `Hi ${name.trim()},\n\nThanks for reaching out! I've received your message and will get back to you within 24 hours.\n${messageText ? `\nYour message:\n${messageText}\n` : ''}\nTalk soon,\nRahman`,
          html: confirmHtml,
        });
        if (confirmError) {
          // A failed confirmation doesn't block the success response — you
          // already have the lead saved and your own notification delivered.
          console.error('[Contact] Confirmation email error:', confirmError);
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
      console.log('[Contact Form]', { name, email, phone, message: messageText, ip, path });
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
