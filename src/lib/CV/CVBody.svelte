<script lang="ts">
  import {onMount} from 'svelte'
  import type {CV} from './types'
  import renderCSL from './renderCSL'
  import filterEntries from './filterEntries'

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
  let meta: CV['meta']
  let sections: CV['sections']

  onMount(async () => {
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
  })

  $: sections = renderCSL(sections, csl)
</script>

<div
  class="cv"
  style="font-size: {fontsize}pt; --margin-multi: {isCompact
    ? 0.5
    : 1}"
>
  {#if meta}
    <div class="meta">
      <h1>{meta.name}</h1>
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
  {/if}
  {#if sections}
    {#each filterEntries(search, sections) as section}
      <h2 class="section-name">{section.name}</h2>
      <hr />
      {#each section.entries as entry}
        <div class="entry">
          {#if entry.type === 'position'}
            <div class="position-meta">
              <span class="position-title">
                <strong>{entry.name}</strong>
                {#if entry.role}
                  <em class="role">{@html entry.role}</em>
                {/if}
              </span>
              {#if entry.date}
                <span class="date">{@html entry.date}</span>
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
    {/each}
  {/if}
</div>

<style>
  .cv {
    --marg: calc(var(--margin-multi) * 0.5em);
    margin: calc(var(--marg) - 0.5em)
      calc(var(--marg) - 0.8em);
  }

  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    white-space: nowrap;
    margin-top: calc(var(--margin-multi) * 1em);
    margin-bottom: calc(var(--margin-multi) * 0.5em);
  }

  .links {
    text-align: right;
  }

  .section-name {
    margin: calc(var(--margin-multi) * 0.5em) 0 0 0;
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
