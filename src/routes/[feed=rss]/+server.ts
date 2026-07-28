import {getPosts} from "$lib/posts"
import {renderRSS} from "$lib/feed"

export async function GET() {
  const posts = await getPosts()
  return new Response(renderRSS(posts), {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    },
  })
}
