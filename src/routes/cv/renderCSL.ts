import type {Cite as CiteType} from "@citation-js/core"
import type {CV, CSL} from "./types"

let citePromise: Promise<typeof CiteType> | null = null
export function loadCite(): Promise<typeof CiteType> {
  if (!citePromise) {
    citePromise = Promise.all([
      import("@citation-js/core"),
      import("@citation-js/plugin-csl"),
    ]).then(([core]) => core.Cite)
  }
  return citePromise
}

const SPACE = "[\\s\\u00A0]+"
const NOT_NAME_CHAR = "(?![\\w'’-])"
const NOT_AFTER_NAME_CHAR = "(?<![\\w'’-])"

const givenFirstName = new RegExp(
  `${NOT_AFTER_NAME_CHAR}(?:Nathan|N\\.)${SPACE}Kim${NOT_NAME_CHAR}`,
  "g",
)
const familyFirstName = new RegExp(
  `${NOT_AFTER_NAME_CHAR}Kim,${SPACE}(?:Nathan${NOT_NAME_CHAR}|N\\.)`,
  "g",
)

type NameMatch = {index: number; text: string}

const toNameMatches = (
  matches: RegExpMatchArray[],
): NameMatch[] =>
  matches.map((m) => ({index: m.index!, text: m[0]}))

const overlaps = (a: NameMatch, b: NameMatch) =>
  a.index < b.index + b.text.length &&
  b.index < a.index + a.text.length

const isInsideTag = (html: string, index: number) =>
  html.lastIndexOf("<", index) >
  html.lastIndexOf(">", index)

function boldAuthorName(html: string): string {
  const givenFirst = toNameMatches([
    ...html.matchAll(givenFirstName),
  ])
  const familyFirst = toNameMatches([
    ...html.matchAll(familyFirstName),
  ]).filter(
    (match) =>
      !givenFirst.some((other) => overlaps(match, other)),
  )

  return [...givenFirst, ...familyFirst]
    .filter(({index}) => !isInsideTag(html, index))
    .sort((a, b) => b.index - a.index)
    .reduce(
      (result, {index, text}) =>
        result.slice(0, index) +
        `<strong>${text}</strong>` +
        result.slice(index + text.length),
      html,
    )
}

export default async function renderCSL(
  sections: CV["sections"],
  csl: CSL,
): Promise<CV["sections"]> {
  if (!csl || !sections) return sections
  const Cite = await loadCite()
  return sections.map((section) => ({
    ...section,
    entries: section.entries.map((entry) => {
      if (!("type" in entry)) return entry
      if (entry.type !== "csl") return entry

      const cite = new Cite(entry.csl)
      const formatted = cite.format("bibliography", {
        format: "html",
        template: csl.key,
      })

      if (formatted.match(/n\.d\./)) {
        console.error(`Missing date for ${formatted}`)
      }

      const withLinks = formatted
        .replace(
          // basic url matching
          /http.*?(?=\.<)/,
          '<a href="$&" rel="noopener" target="__blank">$&</a>',
        )
        // assume nd entries are mistakes
        .replaceAll(/ n\.d\./g, ".")
        .replaceAll(/,”\./g, ".”")

      // Bold "N. Kim" and so on
      const reprocessed = boldAuthorName(withLinks)
        // super hacky
        .replace(
          new RegExp('class="csl-entry">'),
          entry.csl.note && entry.csl.type == "manuscript"
            ? `$&<em>(${entry.csl.note}) </em>`
            : "$&",
        )

      return {
        ...entry,
        markup: reprocessed,
      }
    }),
  }))
}
