import {Cite} from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import {promises as fs} from "fs"
import {fileURLToPath} from "url"
import {dirname} from "path"
import type {CV, Entry} from "../../routes/cv/types"
const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function importCitations(): Promise<
  CV["sections"]
> {
  const zotbib = await fs.readFile(
    __dirname + "/personal.json",
    "utf-8",
  )
  const references = new Cite(zotbib).data as any[]

  const speechNotes = ["Workshop", "Other"]

  const categories = [
    {
      name: "Peer-reviewed publications",
      condition: (ref) =>
        [
          "article-journal",
          "paper-conference",
          "chapter",
          "book",
        ].includes(ref.type),
    },
    {
      name: "Manuscripts under review and in preparation",
      condition: (ref) => ref.type === "manuscript",
    },
    {
      name: "Public scholarship and policy writing",
      condition: (ref) =>
        [
          "article",
          "preprint",
          "report",
          "article-newspaper",
          "article-magazine",
          "post-weblog",
        ].includes(ref.type),
    },
    {
      name: "Conference presentations",
      condition: (ref) =>
        ref.type === "speech" &&
        !speechNotes.includes(ref.note),
    },
    {
      name: "Papers for conference workshops",
      condition: (ref) =>
        ref.type === "speech" && ref.note === "Workshop",
    },
    {
      name: "Invited lectures and presentations",
      condition: (ref) =>
        (ref.type === "speech" && ref.note === "Other") ||
        ["broadcast", "interview"].includes(ref.type),
    },
    {
      name: "Digital projects",
      condition: (ref) =>
        [
          "document",
          "webpage",
          "dataset",
          "software",
        ].includes(ref.type),
    },
  ]

  const describe = (ref) =>
    `${ref.id} (type: ${ref.type}${ref.note ? `, note: ${ref.note}` : ""})`

  const sectionsFor = (ref) =>
    categories
      .filter((cat) => cat.condition(ref))
      .map((cat) => cat.name)

  const uncategorized = references.filter(
    (ref) => sectionsFor(ref).length === 0,
  )
  if (uncategorized.length) {
    throw new Error(
      `No CV section matches ${uncategorized.map(describe).join("; ")}`,
    )
  }

  const overcategorized = references.filter(
    (ref) => sectionsFor(ref).length > 1,
  )
  if (overcategorized.length) {
    throw new Error(
      `Multiple CV sections match ${overcategorized
        .map(
          (ref) =>
            `${describe(ref)}: ${sectionsFor(ref).join(", ")}`,
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

  return categories.map((cat) => ({
    name: cat.name,
    entries: references
      .filter(cat.condition)
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
