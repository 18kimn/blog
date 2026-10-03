import type {Entry, CV} from "../../routes/cv/types"
import {marked} from "marked"
import {promises as fs} from "fs"
import {fileURLToPath} from "url"
import {dirname, resolve} from "path"
import importCitations from "./importCitations"
import {parse} from "yaml"
const __dirname = dirname(fileURLToPath(import.meta.url))

function renderMarkdown(entries?: Entry[]) {
  return entries?.map((entry: Entry) => {
    if (!("type" in entry)) return entry
    if (entry.type !== "markdown") return entry
    return {
      type: "markup" as const,
      markup: marked(entry.markdown),
    }
  })
}

async function processCV() {
  const cv = (await fs
    .readFile(__dirname + "/cv.yaml", "utf-8")
    .then(parse)) as CV
  const subtitles = cv.subtitles ?? {}

  // Static sections live in cv.yaml and must declare an order.
  const staticSections = cv.sections.map((section) => {
    if (typeof section.order !== "number") {
      throw new Error(
        `cv.yaml section "${section.name}" is missing an order`,
      )
    }
    return {...section, entries: renderMarkdown(section.entries)}
  })

  // Citation sections come from Zotero numbered subcollections.
  const citationSections = (await importCitations()).map(
    (section) => ({
      name: section.name,
      order: section.order,
      subtitle: subtitles[section.name],
      entries: section.entries,
    }),
  )

  citationSections.forEach((section) => {
    if (!section.entries.length) {
      throw new Error(`${section.name} has no entries`)
    }
  })

  const merged = [...staticSections, ...citationSections].sort(
    (a, b) => a.order! - b.order!,
  )

  const orders = merged.map((s) => s.order)
  const dupes = orders.filter((o, i) => orders.indexOf(o) !== i)
  if (dupes.length) {
    console.warn(
      `Warning: duplicate section orders ${[...new Set(dupes)].join(", ")}`,
    )
  }

  cv.sections = merged.map(({order, ...section}) => section)
  delete cv.subtitles

  fs.writeFile(
    resolve(__dirname, "../../routes/cv/cv.json"),
    JSON.stringify(cv),
  )
}

processCV()
