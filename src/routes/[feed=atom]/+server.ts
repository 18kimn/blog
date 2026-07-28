import {getPosts} from "$lib/posts"
import {renderAtom} from "$lib/feed"

export async function GET() {
  const posts = await getPosts()
  return new Response(renderAtom(posts), {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    },
  })
}
