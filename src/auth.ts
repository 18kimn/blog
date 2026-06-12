import {SvelteKitAuth} from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import {PrismaAdapter} from "@auth/prisma-adapter"
import type {EmailConfig} from "@auth/sveltekit/providers"
import {env} from "$env/dynamic/private"
import {prisma} from "$lib/server/prisma"
import {mailer} from "$lib/server/mailer"
import {magicLinkEmail} from "$lib/server/authEmail"

const oauthProviders = [
  {provider: Google, id: "google", name: "Google"},
]

export const oauthProviderInfo = oauthProviders.map(
  ({id, name}) => ({
    id,
    name,
  }),
)

const emailProvider: EmailConfig = {
  id: "email",
  type: "email",
  name: "Email",
  from: env.AUTH_EMAIL_FROM,
  maxAge: 60 * 30,
  async sendVerificationRequest({identifier, url}) {
    const {host} = new URL(url)
    await mailer.send({
      to: identifier,
      ...magicLinkEmail(url, host),
    })
  },
}

export const {handle, signIn, signOut} = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    ...oauthProviders.map((p) => p.provider),
    emailProvider,
  ],
  trustHost: true,
  pages: {
    verifyRequest: "/check-email",
    error: "/auth-error",
  },
})
