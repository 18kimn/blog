import type {EmailMessage} from '$lib/server/mailer'

export function magicLinkEmail(
  url: string,
  host: string,
): Omit<EmailMessage, 'to'> {
  const subject = `Sign in to ${host}`

  const text = [
    `Sign in to ${host}`,
    '',
    'Click the link below to sign in. It expires in 30 minutes.',
    url,
    '',
    "If you didn't request this, you can ignore this email.",
  ].join('\n')

  const html = `
    <body style="font-family: system-ui, sans-serif; color: #222; line-height: 1.5;">
      <div style="max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 16px;">Sign in to ${host}</h2>
        <p style="margin: 0 0 24px;">Click the button below to sign in. This link expires in 30 minutes.</p>
        <a href="${url}"
           style="display: inline-block; padding: 12px 20px; background: #222; color: #fff; text-decoration: none; border-radius: 6px;">
          Sign in
        </a>
        <p style="margin: 24px 0 0; font-size: 13px; color: #888;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </body>
  `

  return {subject, html, text}
}
