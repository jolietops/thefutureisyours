const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
if (!env.RESEND_API_KEY) return json({ error: 'Email service not configured' }, 503);
  const origin = request.headers.get('Origin');
  if (origin) {
    let host;
    try { host = new URL(origin).hostname; } catch { return json({ error: 'Invalid origin' }, 403); }
    if (!['thefutureis-yours.com', 'www.thefutureis-yours.com', 'thefutureisyoursnew.pages.dev'].includes(host)) return json({ error: 'Invalid origin' }, 403);
  }
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 12000) return json({ error: 'Message too large' }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  if (body.website) return json({ ok: true }); // honeypot
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 5000) return json({ error: 'Please check your form fields' }, 400);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'The Future Is Yours <hello@thefutureis-yours.com>',
      to: ['jolie.tops@gmail.com'],
      reply_to: email,
      subject: `Website contact: ${name.replace(/[\r\n]/g, ' ')}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    })
  });
  if (!res.ok) {
    console.error('Resend failed', res.status, await res.text());
    return json({ error: 'Email could not be sent' }, 502);
  }
  return json({ ok: true });
}
