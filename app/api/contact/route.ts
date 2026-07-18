import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

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

    // TODO: wire up Resend / Nodemailer
    // Example with Resend:
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Portfolio <noreply@yourname.dev>',
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New message from ${name}`,
    //   text: `From: ${name} <${email}>\n\n${message}`,
    // });

    // For now, log in dev and return success
    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact Form]', { name, email, phone, message });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
