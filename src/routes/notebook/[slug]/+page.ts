export async function load({params}) {
  console.log(params.slug)
  const Post = await import(`../thoughts/${params.slug}.md`)

  return {
    Post,
    ...Post.metadata,
    date: Post.metadata.created,
  }
}
