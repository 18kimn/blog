import type {Post as PostType} from "$lib/utils/types"

export const prerender = true

export async function load({params, data}) {
  const {slug, postType} = params
  /**
   * For some reason have to do with glob instead of
   * with dynamic import, since I guess MDSveX can't be
   * compiled at runtime by Vite 5 or something dumb
   * like that
   */
  const writingFiles = import.meta.glob("../writing/*/*md")
  const projectFiles = import.meta.glob("../projects/*/*md")
  const files = {...writingFiles, ...projectFiles}
  const [, resolver] = Object.entries(files).find(
    ([path]) => {
      const segments = path.split("/")
      const fileSlug = segments[segments.length - 2]
      const fileType = segments[segments.length - 3]
      return slug === fileSlug && postType === fileType
    },
  )
  const Post = await (resolver() as Promise<{
    metadata: PostType
  }>)
  return {
    Post,
    ...Post.metadata,
    date: Post.metadata.date,
    postData: data,
  }
}
