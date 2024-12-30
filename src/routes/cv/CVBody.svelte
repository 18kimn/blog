<script lang="ts">
  import {fade} from 'svelte/transition'
  import type {CSL, CV} from './types'
  import filterEntries from './filterEntries'
  import renderCSL from './renderCSL'
  import CVDataRaw from './cv.json'
    import { onMount } from 'svelte'
  
  const CVData = CVDataRaw as CV

  interface Props {
    node: HTMLElement
    search: string
    csl: CSL
    isCompact: boolean
    fontsize?: number
    children?: import('svelte').Snippet
  }

  let {
    node = $bindable(),
    search,
    csl,
    isCompact,
    fontsize = 12,
    children,
  }: Props = $props()
  let meta: CV['meta'] = $state(CVData.meta)
  let sections: CV['sections'] = $derived(renderCSL(CVData.sections, csl))
  
  // needed for transition-on-load
  let ready = $state(false)
  onMount(() => {
    ready = true
  })
</script>

{#if ready}
<div
  class="cv"
  style="font-size: {fontsize}pt; --margin-multi: {isCompact
    ? 0.5
    : 1}"
  bind:this={node}
>
  <div>
      <div class="meta">
        {@render children?.()}
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
        {#if section.entries.filter(entry => !(entry["type"] === 'csl' && typeof entry["markup"] === 'undefined')).length}
        <section
          in:fade|global={{
            delay: 100 * index,
            duration: 300,
          }}
        >
          <h2 class="section-name">{section.name}</h2>
          <hr />
          {#each section.entries as entry}
            <div class="entry">
              {#if !('type' in entry)}
                <div class="position-meta">
                  <span class="position-title">
                    {#if 'role' in entry}
                      <!-- content here -->
                      <strong>{entry.name}</strong>
                      <em class="role"
                        >{@html entry.role}</em
                      >
                    {:else}
                      {entry.name}
                    {/if}
                  </span>
                  {#if entry.date}
                    <span class="date"
                      >{@html entry.date}</span
                    >
                  {/if}
                </div>
                {#if !isCompact && entry.description}
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
          {/if}
      {/each}
  </div>
</div>
{/if}

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
    max-width: min(100%, 70ch);
  }

  section {
    margin: 1.5em 0;
  }

  .meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .links {
    text-align: right;
  }

  .section-name {
    margin: calc(var(--margin-multi) * 0.5em) 0 0 0;
    white-space: break-word;
    font-size: 1.5em;
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

  /* hanging indent */
  :global(.csl-entry) {
    margin-left: 2ch;
    text-indent: -2ch;
  }
</style>
