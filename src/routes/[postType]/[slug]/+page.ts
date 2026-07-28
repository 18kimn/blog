import {error} from "@sveltejs/kit"
import {getPost} from "$lib/posts"

export const prerender = true

export async function load({params, data}) {
  const {slug, postType} = params
  const Post = await getPost(postType, slug)
  if (!Post) error(404, "post not found")

  return {
    Post,
    ...Post.metadata,
    date: Post.metadata.date,
    postData: data,
  }
}
