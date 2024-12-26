export const prerender = true
export async function load({params, data}) {
  const {slug, postType} = params
  const promised = import(`../${postType}/${slug}/index.md`)

  const Post = await promised
  return {
    Post,
    ...Post.metadata,
    date: Post.metadata.created || Post.metadata.date,
    postData: data,
  }
}
