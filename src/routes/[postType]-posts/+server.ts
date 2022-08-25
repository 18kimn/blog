/**
  import.meta.glob has to receive a static string
  luckily we have only two cases
 */
function getPosts(
  type: 'projects' | 'writing' | 'notebook',
) {
  switch (type) {
  case 'projects':
    return import.meta.glob('../projects/*/*md')
  case 'writing':
    return import.meta.glob('../writing/*/*md')
  case 'notebook':
    return import.meta.glob('../notebook/thoughts/*md')
  }
}

export const GET = async ({params}) => {
  const posts = getPosts(params.postType)
  if (!posts) return {body: '', status: 404}

  const info = await Promise.all(
    Object.entries(posts).map(async ([path, resolver]) => {
      const meta = (await resolver()).metadata
      // the '.' at beginning and 'index.md' or '.md' at end need to be chopped off
      const postPath =
        params.postType === 'notebook'
          ? path
            .slice(1, 0 - '.md'.length)
            .replace('thoughts/', '')
          : path.slice(1, 0 - 'index.md'.length)

      const auxProperties =
        params.postType === 'notebook' && meta?.modified
          ? {
            date: meta?.modified[
              meta?.modified?.length - 1
            ],
          }
          : {}
      return {
        ...meta,
        path: postPath,
        ...auxProperties,
      }
    }),
  )

  const sorted = info.sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date)
  })

  return new Response(JSON.stringify(sorted))
}