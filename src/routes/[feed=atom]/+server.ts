import type {Post} from '$lib/utils/types'
import {dirname, basename} from 'path'
const siteURL = 'https://nathan-kim.org/'
const siteTitle = 'Nathan Kim'
const siteDescription = 'Nathan Kim\'s Personal Website'

/** produces formatted XML string for rss feed */
function render(posts: Post[]) {
  const postXML = posts
    .map(({path, title, subtitle, date}) => {
      const slug = `${basename(dirname(path))}/${basename(
        path,
      )}`

      return `
      <entry>
        <title>${title}</title>
        <link rel="alternate" href="${siteURL}${slug}"/>
        <id>${siteURL}${slug}</id>
        ${subtitle ? `<summary>${subtitle}</summary>` : ''}
        <published>${new Date(
    date,
  ).toUTCString()}</published>
      </entry>
      `
    })
    .join('')
  return `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${siteTitle}</title>
      <subtitle>${siteDescription}</subtitle>
      <link rel="self" href="${siteURL}" />
      <author>
        <name> Nathan Kim </name>
        <email> nathanckim18@gmail.com </email>
        <uri> https://nathan-kim.org </uri>
      </author>
      <rights>All rights reserved ${new Date().getFullYear()}, Nathan Kim</rights>
      ${postXML}
    </feed>
`
}

/** on request, imports and delivers all of the markdown files */
export async function GET() {
  const paths = import.meta.glob(
    '../[postType]/*/*/index.md',
  )
  const posts: Post[] = await Promise.all(
    Object.entries(paths).map(
      async ([fullPath, resolver]) => {
        const {metadata} = await resolver()
        const path = fullPath.slice(
          2,
          0 - 'index.md'.length,
        )
        return {...metadata, path}
      },
    ),
  ).then((posts) => {
    return posts.sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date),
    )
  })

  const body = render(posts)
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  }

  return new Response(body, {headers})
}
