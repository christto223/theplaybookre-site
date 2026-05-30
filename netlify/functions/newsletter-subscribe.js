// Netlify Function: proxies email subscriptions to Beehiiv API
// Required env vars (set in Netlify → Site Settings → Environment Variables):
//   BEEHIIV_PUBLICATION_ID  — your publication ID (pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//   BEEHIIV_API_KEY         — your API key from Beehiiv → Settings → API

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email, source;
  try {
    ({ email, source } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;

  // Credentials not configured yet — return success so UI confirmation still shows
  if (!publicationId || !apiKey) {
    console.warn('[subscribe] Beehiiv credentials not set. Add BEEHIIV_PUBLICATION_ID and BEEHIIV_API_KEY to Netlify environment variables.');
    return { statusCode: 200, body: JSON.stringify({ success: true, note: 'credentials_missing' }) };
  }

  try {
    const payload = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'website',
      // The placement that captured the signup (e.g. newsletter-band,
      // footer-modal, toolkit-download). Lets you segment in Beehiiv.
      utm_medium: source || 'unknown',
    };

    // Capture the exact page the signup happened on, read server-side from
    // the request's referer header — no client changes needed.
    const referer = event.headers.referer || event.headers.referrer;
    if (referer) {
      payload.referring_site = referer;
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[subscribe] Beehiiv error:', res.status, err);
      return { statusCode: 502, body: JSON.stringify({ error: 'Subscription service error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
