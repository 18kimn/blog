export async function load({params}) {
  const Post = await import(`../${params.slug}/index.md`)
  const {title, subtitle, date} = Post.metadata

  return {
    Post,
    title,
    subtitle,
    date,
  }
}
