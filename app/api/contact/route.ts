import { NextResponse } from 'next/server'

const resendEndpoint = 'https://api.resend.com/emails'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: 'Feedback email is not configured yet. Add RESEND_API_KEY and CONTACT_FROM_EMAIL on the server.' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (
    !isRecord(body) ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.message !== 'string'
  ) {
    return NextResponse.json({ error: 'Provide your name, email address, and a message.' }, { status: 400 })
  }

  const name = body.name.trim()
  const email = body.email.trim()
  const message = body.message.trim()
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (
    !name ||
    name.length > 80 ||
    /[\r\n]/.test(name) ||
    !validEmail ||
    email.length > 254 ||
    message.length < 5 ||
    message.length > 3000
  ) {
    return NextResponse.json({ error: 'Check your name, email address, and message, then try again.' }, { status: 400 })
  }

  let resendResponse: Response
  try {
    resendResponse = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['balamurugan008jk@gmail.com'],
        subject: `Portfolio message from ${name} (${email})`,
        text: [
          'NEW PORTFOLIO MESSAGE',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <div style="margin:0;padding:32px 16px;background:#090f12;font-family:Arial,sans-serif;color:#e5e7eb">
            <div style="max-width:600px;margin:0 auto;border:1px solid #23423e;border-radius:12px;overflow:hidden;background:#0d1518">
              <div style="padding:20px 24px;border-bottom:1px solid #23423e">
                <p style="margin:0 0 8px;color:#5eead4;font-size:11px;letter-spacing:2px">BALA.DEV · PORTFOLIO</p>
                <h1 style="margin:0;font-size:21px;color:#f4f4f5">New message from a visitor</h1>
              </div>
              <div style="padding:24px">
                <table role="presentation" style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:0 0 14px;color:#94a3b8;font-size:12px">NAME</td>
                    <td style="padding:0 0 14px;color:#f4f4f5;font-size:14px">${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 20px;color:#94a3b8;font-size:12px">EMAIL</td>
                    <td style="padding:0 0 20px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#5eead4;text-decoration:none">${escapeHtml(email)}</a></td>
                  </tr>
                </table>
                <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;letter-spacing:1px">MESSAGE</p>
                <div style="padding:16px;border:1px solid #1f3434;border-radius:8px;background:#091012;color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</div>
              </div>
              <div style="padding:14px 24px;border-top:1px solid #1f3434;color:#64748b;font-size:11px">Reply directly to this email to respond to ${escapeHtml(name)}.</div>
            </div>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch (error) {
    console.error('Contact email delivery failed:', error)
    return NextResponse.json({ error: 'Could not reach the email service. Please try again later.' }, { status: 502 })
  }

  if (!resendResponse.ok) {
    const providerError = await resendResponse.text()
    let providerErrorName: string | undefined
    try {
      const parsedError: unknown = JSON.parse(providerError)
      if (isRecord(parsedError) && typeof parsedError.name === 'string') {
        providerErrorName = parsedError.name
      }
    } catch {
      providerErrorName = undefined
    }
    console.error(`Resend rejected contact email (${resendResponse.status})${providerErrorName ? `: ${providerErrorName}` : ''}`)

    if (
      resendResponse.status === 403 &&
      providerError.includes('You can only send testing emails to your own email address')
    ) {
      return NextResponse.json(
        {
          error:
            'Resend’s testing sender can only deliver to the email address verified on your Resend account. Verify a domain in Resend, then set CONTACT_FROM_EMAIL to an address on that domain.',
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ error: 'The email service could not send your message. Please try again later.' }, { status: 502 })
  }

  return NextResponse.json({ sent: true })
}
