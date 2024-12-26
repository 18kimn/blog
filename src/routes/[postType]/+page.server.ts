import {error} from '@sveltejs/kit'
import type {Post} from '$lib/utils/types'
import type {PageServerLoad} from './$types'

/**
 *
  import.meta.glob has to receive a static string
  luckily we have only three cases
 */
function getPosts(type: string) {
  switch (type) {
    case 'projects':
      return import.meta.glob('./projects/*/*md')
    case 'writing':
      return import.meta.glob('./writing/*/*md')
  }
}

export const load: PageServerLoad = async ({params}) => {
  const posts = getPosts(params.postType)
  if (!posts) error(404, 'post not found');

  const info = await Promise.all(
    Object.entries(posts).map(async ([path, resolver]) => {
      const {metadata} = await (resolver() as Promise<{
        metadata: Post
      }>)
      // the '.' at beginning and 'index.md' or '.md' at end need to be chopped off
      const postPath = path.slice(1, 0 - 'index.md'.length)

      return {
        ...metadata,
        path: postPath,
      }
    }),
  )

  const sorted = info
    .filter(
      (item: Post) => typeof item.date !== 'undefined',
    )
    .sort((a, b) => {
      return (
        Date.parse(b.date as string) -
        Date.parse(a.date as string)
      )
    })

  return {sorted}
}

export const prerender = true
