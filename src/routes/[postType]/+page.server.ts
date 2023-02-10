import {error} from '@sveltejs/kit'
import type {Post} from '$lib/utils/types'
import type {PageServerLoad} from './$types'

/**
 *
  import.meta.glob has to receive a static string
  luckily we have only three cases
 */
function getPosts(
  type: 'projects' | 'writing' | 'notebook',
) {
  switch (type) {
  case 'projects':
    return import.meta.glob('./projects/*/*md')
  case 'writing':
    return import.meta.glob('./writing/*/*md')
  case 'notebook':
    return import.meta.glob('./notebook/thoughts/*md')
  }
}

export const load: PageServerLoad = async ({params}) => {
  const posts = getPosts(params.postType)
  if (!posts) throw error(404, 'post not found')

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

  const sorted = info
    .filter(
      (item: Post) => typeof item.date !== 'undefined',
    )
    .sort((a, b) => {
      return Date.parse(b.date) - Date.parse(a.date)
    })

  return {sorted}
}

export const prerender = true
