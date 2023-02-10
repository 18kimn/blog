export async function load({params, data}) {
  const {slug, postType} = params
  const postPath =
    postType !== 'notebook'
      ? `../${postType}/${slug}/index.md`
      : `../${postType}/thoughts/${slug}.md`
  const promised = import(postPath)

  const Post = await promised
  return {
    Post,
    ...Post.metadata,
    date: Post.metadata.created || Post.metadata.date,
    postData: data,
  }
}
