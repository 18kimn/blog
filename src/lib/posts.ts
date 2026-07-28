import type {Post} from "$lib/utils/types"

const modules = import.meta.glob(
  "../routes/[postType]/*/*/index.md",
)

export interface PostSummary extends Post {
  postType: string
  slug: string
}

export interface PostModule {
  metadata: Post
  default: unknown
}

function parsePath(globPath: string) {
  const segments = globPath.split("/")
  const slug = segments[segments.length - 2]
  const postType = segments[segments.length - 3]
  return {postType, slug}
}

async function loadSummary(
  globPath: string,
  resolver: () => Promise<unknown>,
): Promise<PostSummary> {
  const {metadata} = (await resolver()) as PostModule
  const {postType, slug} = parsePath(globPath)
  return {
    ...metadata,
    postType,
    slug,
    path: `/${postType}/${slug}`,
  }
}

export async function getPosts(
  postType?: string,
): Promise<PostSummary[]> {
  const entries = Object.entries(modules).filter(
    ([globPath]) =>
      !postType ||
      parsePath(globPath).postType === postType,
  )
  const posts = await Promise.all(
    entries.map(([globPath, resolver]) =>
      loadSummary(globPath, resolver),
    ),
  )
  return posts
    .filter((post) => typeof post.date !== "undefined")
    .filter((post) => !post.hidden)
    .sort(
      (a, b) =>
        Date.parse(b.date as string) -
        Date.parse(a.date as string),
    )
}

export async function getPost(
  postType: string,
  slug: string,
): Promise<PostModule | null> {
  const entry = Object.entries(modules).find(
    ([globPath]) => {
      const parsed = parsePath(globPath)
      return (
        parsed.postType === postType && parsed.slug === slug
      )
    },
  )
  if (!entry) return null
  const [, resolver] = entry
  return (await resolver()) as PostModule
}
