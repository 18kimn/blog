type BbtCollection = {
  key?: string
  name: string
  items?: (number | string)[]
}
type BbtItem = {
  itemID?: number | string
  citationKey?: string
  "citation-key"?: string
  citekey?: string
  collections?: string[]
}
export type Bbt = {
  collections?: Record<string, BbtCollection>
  items?: BbtItem[]
}

export type Section = {order: number; name: string; key: string}

// 10. Media appearances -> [10, Media Appearances]
const SECTION_RE = /^\s*(\d+)\s*[.)-]\s*(.+?)\s*$/

const citekeyOf = (item: BbtItem): string | undefined =>
  item.citationKey ?? item["citation-key"] ?? item.citekey

export function parseSections(bbt: Bbt): {
  sections: Section[]
  byCitekey: Map<string, Section[]>
} {
  const collections = bbt.collections ?? {}
  const items = bbt.items ?? []

  const sectionByKey = new Map<string, Section>()
  for (const [key, coll] of Object.entries(collections)) {
    const match = SECTION_RE.exec(coll.name)
    if (!match) continue
    const k = coll.key ?? key
    sectionByKey.set(k, {
      order: Number(match[1]),
      name: match[2],
      key: k,
    })
  }

  const citekeyByItemID = new Map<string, string>()
  for (const item of items) {
    const ck = citekeyOf(item)
    if (ck != null && item.itemID != null) {
      citekeyByItemID.set(String(item.itemID), ck)
    }
  }

  // citekey -> (sectionKey -> Section), deduped across both join shapes
  const collected = new Map<string, Map<string, Section>>()
  const add = (ck: string | undefined, sectionKey: string) => {
    const section = sectionByKey.get(sectionKey)
    if (!ck || !section) return
    if (!collected.has(ck)) collected.set(ck, new Map())
    collected.get(ck)!.set(sectionKey, section)
  }

  for (const item of items) {
    const ck = citekeyOf(item)
    for (const key of item.collections ?? []) add(ck, key)
  }
  for (const [key, coll] of Object.entries(collections)) {
    const sectionKey = coll.key ?? key
    for (const id of coll.items ?? []) {
      add(citekeyByItemID.get(String(id)), sectionKey)
    }
  }

  const sections = [...sectionByKey.values()].sort(
    (a, b) => a.order - b.order,
  )
  const byCitekey = new Map<string, Section[]>()
  for (const [ck, sectionMap] of collected) {
    byCitekey.set(ck, [...sectionMap.values()])
  }
  return {sections, byCitekey}
}
