import type {CV} from "./types"

export default function filterEntries(
  query: string,
  sections: CV["sections"],
) {
  return sections.map((section) => ({
    ...section,
    entries: section.entries.filter((entry) => {
      if (!query) return true
      return Object.values(entry)
        .join("")
        .toLowerCase()
        .match(query.toLowerCase())
    }),
  }))
}
