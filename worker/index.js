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

async function probeOnce(env) {
  try {
    const res = await fetch(env.ORIGIN_HEALTH_URL, {
      signal: AbortSignal.timeout(5000),
      headers: {[PROBE_HEADER]: env.PROBE_TOKEN},
    })
    // liveness, not path existence: any reply under 500 means the
    // server is up. Only 5xx (incl. Cloudflare's 52x) or a thrown
    // error (unreachable/timeout) counts as down.
    return res.status < 500
  } catch {
    return false
  }
}

// A single blip between Cloudflare and the origin used to flip state
// instantly. Retry a few times within the tick first, so a momentary
// glitch doesn't count as a failed probe at all.
async function probe(env) {
  const attempts = Number(env.PROBE_ATTEMPTS) || 2
  const gapMs = Number(env.PROBE_RETRY_MS) || 2000
  for (let i = 0; i < attempts; i++) {
    if (await probeOnce(env)) return true
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, gapMs))
    }
  }
  return false
}

// Debounce across ticks: only announce "down" (and email) after
// FAIL_THRESHOLD consecutive failing probes. With a per-minute cron a
// threshold of 3 rides out ~2-3 min of transient trouble before
// alerting, while a single healthy probe clears the count immediately.
// The counter is only written when it actually changes, so a healthy
// origin costs zero KV writes per tick.
async function record(healthy, env) {
  const threshold = Number(env.FAIL_THRESHOLD) || 3
  if (healthy) {
    const fails = await env.HEALTH.get("fails")
    if (fails && fails !== "0") await env.HEALTH.put("fails", "0")
    await transition("up", env)
    return
  }
  const fails = (Number(await env.HEALTH.get("fails")) || 0) + 1
  await env.HEALTH.put("fails", String(fails))
  if (fails >= threshold) await transition("down", env)
}

export default {
  async scheduled(event, env, ctx) {
    const healthy = await probe(env)
    ctx.waitUntil(record(healthy, env))
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
      // no response at all: unreachable or timed out. Serve this
      // visitor the fallback immediately, but only count it toward the
      // debounce — a single timed-out request shouldn't alert on its
      // own; the next cron probe confirms or clears it.
      ctx.waitUntil(record(false, env))
      return fallback()
    }

    // A dead origin makes fetch() resolve with Cloudflare's own 5xx
    // (502/52x) rather than throwing, so the status must be checked.
    // Only 5xx swaps in the fallback; 4xx (e.g. a real 404) and all
    // 2xx/3xx pass straight through to the visitor.
    return res.status >= 500 ? fallback() : res
  },
}
