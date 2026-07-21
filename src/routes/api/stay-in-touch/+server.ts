import type {RequestHandler} from "./$types"
import {json, error} from "@sveltejs/kit"
import {prisma} from "$lib/server/prisma"

const MAX_CIPHERTEXT = 4000
const MAX_SUBSCRIBERS = 100

export const POST: RequestHandler = async ({request}) => {
  const {ciphertext, website} = await request.json()

  if (typeof website === "string" && website.length > 0)
    return json({ok: true})

  if (
    typeof ciphertext !== "string" ||
    ciphertext.length === 0 ||
    ciphertext.length > MAX_CIPHERTEXT
  )
    throw error(400, "Malformed submission.")

  const total = await prisma.subscriber.count()
  if (total >= MAX_SUBSCRIBERS)
    throw error(503, "Signups are closed for now.")

  await prisma.subscriber.create({data: {ciphertext}})
  return json({ok: true})
}
