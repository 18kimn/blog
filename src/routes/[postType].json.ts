import type {Post} from '../utils/types'
/**
  import.meta.glob has to receive a static string
  luckily we have only two cases
 */
function getPosts(type: 'projects' | 'writing') {
  switch (type) {
  case 'projects':
    return import.meta.glob('./projects/*/*md')
  case 'writing':
    return import.meta.glob('./writing/*/*md')
  }
}

export const get = async ({params}) => {
  const posts = getPosts(params.postType)
  if (!posts) return {body: '', status: 404}

  const info = await Promise.all(
    Object.entries(posts).map(async ([path, resolver]) => {
      const meta = (await resolver()).metadata
      // the '.' at beginning and 'index.md' at end need to be chopped off
      const postPath = path.slice(1, 0 - 'index.md'.length)

      return {
        ...meta,
        path: postPath,
      }
    }),
  )

  const sorted = info.sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date)
  })

  return {
    body: sorted as Post[],
  }
}
