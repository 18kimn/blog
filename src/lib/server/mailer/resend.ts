import {env} from "$env/dynamic/private"
import type {Mailer} from "./types"

const RESEND_ENDPOINT = "https://api.resend.com/emails"

export const resendMailer: Mailer = {
  async send({to, subject, html, text}) {
    if (!env.RESEND_API_KEY)
      throw new Error("RESEND_API_KEY is not set")
    if (!env.AUTH_EMAIL_FROM)
      throw new Error("AUTH_EMAIL_FROM is not set")

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.AUTH_EMAIL_FROM,
        to,
        subject,
        html,
        text,
      }),
    })

    if (!response.ok)
      throw new Error(
        `Resend request failed (${response.status}): ${await response.text()}`,
      )
  },
}
