<script lang="ts">
  import OutLink from "$lib/OutLink.svelte"
  import {resolve} from "$app/paths"
  import media from "./media.json"
  import uncvBbt from "./uncv.bbt.json"
  import {parseSections} from "../../hooks/CV/subcollections"

  const {sections, byCitekey} = parseSections(uncvBbt)
  const topicOrder = new Map(
    sections.map((s) => [s.name, s.order]),
  )
  const unresolved = media.filter(
    (item) =>
      !byCitekey.has(item["citation-key"] ?? item["id"] ?? ""),
  )
  if (unresolved.length) {
    throw new Error(
      "Press items not in any numbered un-cv subcollection: " +
        unresolved
          .map((i) => i["citation-key"] ?? i["id"])
          .join(", ") +
        ". File them under a topic, or remove from un-cv if they belong only on the CV.",
    )
  }
  const topicOf = (item: {"citation-key"?: string; id?: string}) =>
    (byCitekey.get(item["citation-key"] ?? item.id ?? "") ?? [])[0]
      ?.name ?? "Other"

  type Item = (typeof media)[0] & {
    date: Date
    status: string
    topic: string
  }
  type DT = {
    [topic: string]: {[status: string]: Item[]}
  }

  let dt: DT = (
    media.map((item) => {
      const dateParts = item.issued["date-parts"][0]
      item["date"] = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2]),
      )
      item["topic"] = topicOf(item)
      item["status"] = [
        ...item.author,
        ...(item.editor || []),
      ].filter((a) => {
        if (a["literal"])
          return a["literal"] === "Nathan Kim"
        return (
          a["given"] === "Nathan" && a["family"] === "Kim"
        )
      }).length
        ? "Wrote"
        : "Quoted in"
      return item
    }) as Item[]
  )
    .sort((a, b) => {
      return (
        (topicOrder.get(a.topic) ?? 0) -
          (topicOrder.get(b.topic) ?? 0) ||
        b.status.localeCompare(a.status) ||
        Number(b.date) - Number(a.date)
      )
    })
    .reduce((p, c) => {
      // media = {Tenants: {Wrote: [items], "Quoted in": [items]}}, Org: {}}
      if (p[c.topic] && Object.entries(p[c.topic]).length) {
        p[c.topic][c.status] = p[c.topic][c.status]
          ? [...p[c.topic][c.status], c]
          : [c]
      } else {
        p[c.topic] = {[c.status]: [c]}
      }
      return p
    }, {})
</script>

<main>
  <div class="container">
    <h2>In the press</h2>
    <p>
      Some interviews (most very short) and some writing
      involving me. Didn't fit in my CV page but felt useful
      to collect somewhere. See also <a
        href={resolve("/writing")}>/writing</a
      > for other writing.
    </p>
    {#each Object.entries(dt) as [topic, statusGroups] (topic)}
      <h3>
        {topic}
      </h3>
      <hr />
      {#each Object.entries(statusGroups) as [status, items] (status)}
        <h4>{status}:</h4>
        {#each items as item (item.URL)}
          <p class="item">
            <OutLink
              href={item.URL}
              style="display: inline;"
            >
              {item.title}
            </OutLink> <br />
            {item.author
              .map((a) => {
                if (a.literal) {
                  return a.literal
                }
                return a.given + " " + a.family
              })
              .join(", ")}{#if item["container-title"]}
              , <em>{item["container-title"]}</em>
            {/if}.
            {item.date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}.
          </p>
        {/each}
      {/each}
    {/each}
  </div>
</main>

<style>
  main {
    display: flex;
    place-content: center;
  }

  .container {
    max-width: 72ch;
  }

  .item {
    margin-left: 3ch;
    max-width: 60ch;
  }

  hr {
    fill: black;
    height: 1px;
    width: 100%;
  }

  h3 {
    font-size: 1.4rem;
    margin: 1rem 0 0 0;
  }

  h4 {
    font-size: 1.1rem;
    font-style: italic;
  }

  hr,
  p {
    margin: 0 0 0.5rem 0;
  }
</style>
