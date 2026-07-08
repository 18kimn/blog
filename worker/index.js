import ERROR_PAGE from "./cloudflare-error.html"

const PROBE_HEADER = "x-origin-probe"

function fallback() {
  return new Response(ERROR_PAGE, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "120",
      "cache-control": "no-store",
    },
  })
}

async function notify(state, env) {
  if (!env.RESEND_API_KEY) return
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.ALERT_FROM,
      to: env.ALERT_TO,
      subject:
        state === "down"
          ? "🔴 origin is down"
          : "🟢 origin recovered",
      text: `Origin state changed to ${state} at ${new Date().toISOString()}`,
    }),
  })
}

async function transition(next, env) {
  const prev = await env.HEALTH.get("origin")
  if (prev === next) return
  await env.HEALTH.put("origin", next)
  console.log(
    JSON.stringify({
      event: "state_change",
      from: prev,
      to: next,
      at: Date.now(),
    }),
  )
  await notify(next, env)
}

export default {
  async scheduled(event, env, ctx) {
    let healthy = false
    try {
      const res = await fetch(env.ORIGIN_HEALTH_URL, {
        signal: AbortSignal.timeout(5000),
        headers: {[PROBE_HEADER]: env.PROBE_TOKEN},
      })
      // liveness, not path existence: any reply under 500 means the
      // server is up. Only 5xx (incl. Cloudflare's 52x) or a thrown
      // error (unreachable/timeout) counts as down.
      healthy = res.status < 500
    } catch {}
    ctx.waitUntil(transition(healthy ? "up" : "down", env))
  },

  async fetch(request, env, ctx) {
    // Loop breaker: a same-zone subrequest should reach the origin, not
    // re-enter this Worker. If it ever does re-enter (carrying our probe
    // header), short-circuit immediately — no proxy, no KV, no recursion —
    // so a misrouted health check can't burn the daily invocation budget.
    if (
      request.headers.get(PROBE_HEADER) === env.PROBE_TOKEN
    ) {
      return new Response(null, {status: 204})
    }

    const state = await env.HEALTH.get("origin", {
      cacheTtl: 60,
    })
    if (state === "down") return fallback()

    let res
    try {
      res = await fetch(request, {
        signal: AbortSignal.timeout(2500),
      })
    } catch {
      // no response at all: unreachable or timed out. Flag the origin
      // down so slow-timeout requests short-circuit instead of each
      // paying the 2.5s wait.
      ctx.waitUntil(transition("down", env))
      return fallback()
    }

    // A dead origin makes fetch() resolve with Cloudflare's own 5xx
    // (502/52x) rather than throwing, so the status must be checked.
    // Only 5xx swaps in the fallback; 4xx (e.g. a real 404) and all
    // 2xx/3xx pass straight through to the visitor.
    return res.status >= 500 ? fallback() : res
  },
}
