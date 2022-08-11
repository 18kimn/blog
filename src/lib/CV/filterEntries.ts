import type {CV} from './types'

export default function filterEntries(
  query: string,
  sections: CV['sections'],
) {
  return sections.map((section) => ({
    ...section,
    entries: section.entries.filter((entry) => {
      return Object.values(entry).join('').match(query)
    }),
  }))
}
