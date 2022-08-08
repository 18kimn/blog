export type Footnote = {
  index: number
  id: string
  html: string
}

export function getFootnotes(): Footnote[] {
  const raw = [
    ...document.getElementsByClassName('footnotes'),
  ][0]?.children
  if (!raw) return []
  return [...raw].map((footnote, index) => {
    return {
      index,
      id: footnote.id,
      html: footnote.innerHTML,
    }
  })
}

export default function updateFloater(
  footnotes: Footnote[],
): Footnote[] {
  const visibleLinks = [
    ...document.getElementsByClassName('footnote-link'),
  ]
    .filter((link) => {
      const top = link.getBoundingClientRect().top
      // should be innerHeight - height of footnote show area
      return top > 0 && top < 0.7 * innerHeight
    })
    .map((link) =>
      (link as HTMLLinkElement).href.replace(/.*#/, ''),
    )
  const visibleFootnotes = footnotes.filter((footnote) =>
    visibleLinks.includes(footnote.id),
  )
  return visibleFootnotes
}

export function getHeadings() {
  const raw = [
    ...document.getElementsByClassName('heading'),
  ]
  return raw.map((heading, index) => {
    return {
      index,
      id: heading.id,
      html: heading.firstChild?.textContent || '',
    }
  })
}

export function updateHeadings(
  headings: Footnote[],
): number {
  const visibleHeading = [
    ...document.getElementsByClassName('heading'),
  ].filter((heading) => {
    const top = heading.getBoundingClientRect().top
    return top > 0 && top < innerHeight
  })

  const smallestNegativeHeading = [
    ...document.getElementsByClassName('heading'),
  ]
    .filter((heading) => {
      const top = heading.getBoundingClientRect().top
      return top < 0
    })
    .reduce((prev: undefined | Element, curr) => {
      if (typeof prev === 'undefined') return curr
      const prevTop = prev.getBoundingClientRect().top
      const top = curr.getBoundingClientRect().top
      return top > prevTop ? curr : prev
    }, undefined)

  // if visibleHeading present, return the corresponding
  // heading data
  // if not, find the heading that has a negative top
  // but is closest to zero
  const trackedHeadingId =
    visibleHeading.length > 0
      ? visibleHeading[0]?.id
      : smallestNegativeHeading?.id

  return headings.findIndex(
    (heading) => heading.id === trackedHeadingId,
  )
}
