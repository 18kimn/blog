import type {Post} from '../../utils/types'
const siteURL = 'https://nathan-kim.org/'
const siteTitle = 'Nathan Kim'
const siteDescription = 'Nathan Kim\'s Personal Website'

/** produces formatted XML string for rss feed */
function render(posts: Post[]) {
  const postXML = posts
    .map(
      ({path, title, subtitle, date}) => `
      <item>
        <guid isPermaLink="true">${siteURL}${path}</guid>
        <title>${title}</title>
        <link>${siteURL}${path}</link>
        ${
  subtitle
    ? `<description>${subtitle}</description>`
    : ''
}
        <pubDate>${new Date(date).toUTCString()}</pubDate>
      </item>
      `,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${siteTitle}</title>
      <description>${siteDescription}</description>
      <link>${siteURL}</link>
      <atom:link href="${siteURL}/feed" rel="self" type="application/rss+xml"/>
      ${postXML}
    </channel>
  </rss>
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
