<script lang="ts">
  import {onMount} from 'svelte'
  import {fade} from 'svelte/transition'
  import type {CV} from './types'
  import filterEntries from './filterEntries'
  import renderCSL from './renderCSL'

  // need a better way
  const order = [
    'Education',
    'Publications',
    'Presentations',
    'Misc. Work',
    'Work Experience',
    'Activities and Leadership',
    'Technical Skills',
  ]

  export let search: string
  export let csl: string
  export let isCompact: boolean
  export let fontsize = 14
  export let loaded: boolean
  let meta: CV['meta']
  let sections: CV['sections']

  onMount(async () => {
    // @ts-ignore
    ;({meta, sections} = await fetch('/cv.json').then(
      (res) => res.json(),
    ))
    sections = sections.sort((a, b) => {
      const aInd = order.findIndex(
        (item) => item === a.name,
      )
      const bInd = order.findIndex(
        (item) => item === b.name,
      )
      return aInd - bInd
    })
    loaded = true
  })

  $: sections = renderCSL(sections, csl)
</script>

<div
  class="cv"
  style="font-size: {fontsize}pt; --margin-multi: {isCompact
    ? 0.5
    : 1}"
>
  <div>
    {#if loaded}
      <div class="meta">
        <div class="links">
          <span>{meta.email}</span> |
          <a
            href={`https://${meta.website}`}
            rel="noopener"
            target="_blank">{meta.website}</a
          >
          |
          <a
            href={`https://twitter.com/${meta.twitter}`}
            rel="noopener"
            target="_blank"
          >
            @{meta.twitter}
          </a>
        </div>
      </div>
      {#each filterEntries(search, sections) as section, index}
        <section
          in:fade={{delay: 100 * index, duration: 300}}
        >
          <h2 class="section-name">{section.name}</h2>
          <hr />
          {#each section.entries as entry}
            <div class="entry">
              {#if entry.type === 'position'}
                <div class="position-meta">
                  <span class="position-title">
                    <strong>{entry.name}</strong>
                    {#if entry.role}
                      <em class="role"
                        >{@html entry.role}</em
                      >
                    {/if}
                  </span>
                  {#if entry.date}
                    <span class="date"
                      >{@html entry.date}</span
                    >
                  {/if}
                </div>
                {#if !isCompact}
                  <div class="entry-description">
                    {@html entry.description}
                  </div>
                {/if}
              {:else if entry.type === 'markup'}
                {@html entry.markup}
              {:else if entry.type === 'csl'}
                {@html entry.markup || ''}
              {/if}
            </div>
          {/each}
        </section>
      {/each}
    {/if}
  </div>
</div>

<style>
  /* margin-multi(plier) refers to a constant by which
     other margins should be scaled by
    --marg below is just a convenience variable
   */
  .cv {
    --marg: calc(var(--margin-multi) * 0.5em);
    padding: calc(var(--marg) - 0.5em)
      calc(var(--marg) - 0.8em);
    box-sizing: border-box;
    flex: 1;
    overflow-x: hidden;
  }

  .meta {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  .links {
    text-align: right;
  }

  .section-name {
    margin: calc(var(--margin-multi) * 0.5em) 0 0 0;
    white-space: break-word;
  }

  hr {
    width: 100%;
    margin: 0 0 calc(var(--margin-multi) * 0.5em) 0;
  }

  .entry {
    margin: 0 0 calc(var(--margin-multi) * 1em) 0;
  }

  .position-meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: calc(var(--margin-multi) * 0.2em) 0;
    flex-wrap: wrap;
  }

  .position-title {
    display: flex;
    flex-direction: column;
  }

  .role,
  .date {
    white-space: nowrap;
  }

  :global(.csl-entry) {
    margin-left: 2ch;
    text-indent: -2ch;
  }
</style>
