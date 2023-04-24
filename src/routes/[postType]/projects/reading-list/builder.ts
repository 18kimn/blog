/* Script that runs at prebuild time (since it's listed in project-wide build.js) */
import {promises as fs} from 'fs'
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'

async function main() {
  const url = 'https://api.zotero.org/groups/5006123/'
  let {numItems} = (
    await fetch(url).then((res) => res.json())
  ).meta

  const collections = (
    await fetch(`${url}/collections`).then((res) =>
      res.json(),
    )
  ).reduce((prev, curr) => {
    return {
      ...prev,
      [curr.key]: curr.data.name,
    }
  }, {})

  const entries = {}

  while (numItems > 0) {
    const limit = Math.min(numItems, 100)

    const raw = await fetch(
      `${url}/items?limit=${limit}&start=${
        Object.values(entries).length
      }`,
    ).then((res) => res.json())

    /* Can't think of a cleaner way */
    raw.forEach((curr) => {
      if (curr.data.linkMode === 'linked_url') {
        const key = curr.data.parentItem
        entries[key] = {
          ...(entries[key] || {}),
          link: curr.data.url,
        }
      } else {
        const key = curr.key
        entries[key] = {
          ...(entries[key] || {}),
          creators: curr.data.creators,
          title: curr.data.title.split(':')[0],
          subtitle: curr.data.title.split(':')[1],
          abstract: curr.data.abstractNote,
          date: curr.data.date,
          collection: collections[curr.data.collections[0]],
        }
      }
    })

    numItems = numItems - limit
  }
  const filteredEntries = Object.values(entries).filter(
    (entry: any) => entry.title,
  )

  const __dirname = fileURLToPath(dirname(import.meta.url))
  fs.writeFile(
    resolve(__dirname, 'data.json'),
    JSON.stringify({
      date: new Date(),
      entries: filteredEntries,
    }),
  )
}

main()
