import type {PostSummary} from "$lib/posts"

const siteURL = "https://nathan-kim.org"
const siteTitle = "Nathan Kim"
const siteDescription = "Nathan Kim's Personal Website"
const authorName = "Nathan Kim"
const authorEmail = "nathanckim18@gmail.com"

function escapeXML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function postURL(post: PostSummary) {
  return `${siteURL}${post.path}`
}

function rfc822(date: string | Date) {
  return new Date(date).toUTCString()
}

function rfc3339(date: string | Date) {
  return new Date(date).toISOString()
}

export function renderRSS(posts: PostSummary[]) {
  const items = posts
    .map(
      (post) => `
      <item>
        <guid isPermaLink="true">${postURL(post)}</guid>
        <title>${escapeXML(post.title)}</title>
        <link>${postURL(post)}</link>
        ${
          post.subtitle
            ? `<description>${escapeXML(
                post.subtitle,
              )}</description>`
            : ""
        }
        <pubDate>${rfc822(post.date)}</pubDate>
      </item>`,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <description>${siteDescription}</description>
    <link>${siteURL}/</link>
    <lastBuildDate>${rfc822(new Date())}</lastBuildDate>
    <atom:link href="${siteURL}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>
`
}

export function renderAtom(posts: PostSummary[]) {
  const updated = rfc3339(posts[0]?.date ?? new Date())
  const entries = posts
    .map((post) => {
      const iso = rfc3339(post.date)
      return `
      <entry>
        <title>${escapeXML(post.title)}</title>
        <link rel="alternate" href="${postURL(post)}"/>
        <id>${postURL(post)}</id>
        ${
          post.subtitle
            ? `<summary>${escapeXML(
                post.subtitle,
              )}</summary>`
            : ""
        }
        <updated>${iso}</updated>
        <published>${iso}</published>
      </entry>`
    })
    .join("")

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteTitle}</title>
  <subtitle>${siteDescription}</subtitle>
  <id>${siteURL}/</id>
  <link rel="alternate" href="${siteURL}/"/>
  <link rel="self" type="application/atom+xml" href="${siteURL}/atom"/>
  <updated>${updated}</updated>
  <author>
    <name>${authorName}</name>
    <email>${authorEmail}</email>
    <uri>${siteURL}</uri>
  </author>
  <rights>All rights reserved ${new Date().getFullYear()}, ${authorName}</rights>
  ${entries}
</feed>
`
}
