import {Cite} from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import {promises as fs} from "fs"
import {fileURLToPath} from "url"
import {dirname} from "path"
import type {Entry} from "../../routes/cv/types"
import {parseSections} from "./subcollections"
const __dirname = dirname(fileURLToPath(import.meta.url))

export type CitationSection = {
  name: string
  order: number
  entries: Entry[]
}

export default async function importCitations(): Promise<
  CitationSection[]
> {
  const zotbib = await fs.readFile(
    __dirname + "/personal.json",
    "utf-8",
  )
  const references = new Cite(zotbib).data as any[]

  const bbt = JSON.parse(
    await fs.readFile(__dirname + "/personal.bbt.json", "utf-8"),
  )
  const {sections, byCitekey} = parseSections(bbt)

  const keyOf = (ref) => ref["citation-key"] || ref.id
  const sectionsFor = (ref) => byCitekey.get(keyOf(ref)) ?? []
  const describe = (ref) => `${keyOf(ref)} (type: ${ref.type})`

  const uncategorized = references.filter(
    (ref) => sectionsFor(ref).length === 0,
  )
  if (uncategorized.length) {
    throw new Error(
      `No numbered subcollection matches ${uncategorized
        .map(describe)
        .join("; ")}`,
    )
  }

  const overcategorized = references.filter(
    (ref) => sectionsFor(ref).length > 1,
  )
  if (overcategorized.length) {
    throw new Error(
      `Multiple numbered subcollections match ${overcategorized
        .map(
          (ref) =>
            `${describe(ref)}: ${sectionsFor(ref)
              .map((s) => s.name)
              .join(", ")}`,
        )
        .join("; ")}`,
    )
  }

  function convertIssuedToDate(
    issued: [string, number, number?][],
  ) {
    const date = issued["date-parts"][0]
    return new Date(
      `${date[0]}-${date[1]}-${date[2] || ""}`,
    )
  }

  return sections.map((section) => ({
    name: section.name,
    order: section.order,
    entries: references
      .filter((ref) =>
        sectionsFor(ref).some((s) => s.key === section.key),
      )
      .map(({_graph, _abstract, ...csl}) => ({
        type: "csl",
        csl,
      }))
      .sort((a, b) => {
        // if has no date, assume it's in-progress and list it first
        if (!a.csl.issued) {
          return -1
        } else if (!b.csl.issued) {
          return 1
        }
        if (!a.csl.issued["date-parts"]) {
          throw new Error(JSON.stringify(a.csl.issued))
        }
        const aDate = Number(
          convertIssuedToDate(a.csl.issued),
        )
        const bDate = Number(
          convertIssuedToDate(b.csl.issued),
        )
        // more recent listed first
        return bDate - aDate
      }) as Entry[],
  }))
}
