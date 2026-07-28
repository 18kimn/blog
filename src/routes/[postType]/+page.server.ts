import {error} from "@sveltejs/kit"
import {getPosts} from "$lib/posts"
import type {PageServerLoad} from "./$types"

export const load: PageServerLoad = async ({params}) => {
  if (
    params.postType !== "writing" &&
    params.postType !== "projects"
  )
    error(404, "post not found")

  const sorted = await getPosts(params.postType)
  return {sorted}
}

export const prerender = true
