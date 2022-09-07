/* utility functions to format strings */

/** receives number as day, prints appropriate suffix */
export function nth(d: number): string {
  if (d > 3 && d < 21) return d.toString() + 'th'
  switch (d % 10) {
  case 1:
    return d.toString() + 'st'
  case 2:
    return d.toString() + 'nd'
  case 3:
    return d.toString() + 'rd'
  default:
    return d.toString() + 'th'
  }
}

export function prettyDate(date: number | string | Date) {
  const asDate = new Date(date)
  const year = asDate.getFullYear()
  const month = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(asDate)
  const day = asDate.getDate()
  return `${month} ${nth(day)}, ${year}`
}

const tag = /<.*?>/g
export function isHTML(str: string): boolean {
  return !!str.match(tag)
}

export function stripHTML(str: string): string {
  return str.replaceAll(tag, '')
}
