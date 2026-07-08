export const prerender = false

export const GET = () =>
  new Response("ok", {
    headers: {"cache-control": "no-store"},
  })
