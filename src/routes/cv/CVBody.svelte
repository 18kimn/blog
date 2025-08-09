<script lang="ts">
  import {fade} from 'svelte/transition'
  import type {CSL, CV} from './types'
  import filterEntries from './filterEntries'
  import renderCSL from './renderCSL'
  import CVDataRaw from './cv.json'
  import {onMount} from 'svelte'
  import ResizingBox from '$lib/ResizingBox.svelte'

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
    fontsize = 10,
    children,
  }: Props = $props()
  let meta: CV['meta'] = $state(CVData.meta)
  let sections: CV['sections'] = $derived(
    renderCSL(CVData.sections, csl),
  )

  // needed for transition-on-load
  let ready = $state(false)
  onMount(() => {
    ready = true
  })
</script>

{#if ready}
  <div class="cv-container" bind:this={node}>
    <div
      class="cv"
      id="print-source"
      style="font-size: {fontsize}pt; --margin-multi: {isCompact
        ? 0.5
        : 1}"
    >
      <div>
        <div class="meta">
          {@render children?.()}
          <div class="meta-info">
            <div class="print-title">
              <h1>Nathan Kim</h1>
              <span>Curriculum Vitae</span>
            </div>
            <div class="links">
              <span>{meta.email}</span> |
              <a
                href={`https://${meta.website}`}
                rel="noopener"
                target="_blank">{meta.website}</a
              >
              |
              <a
                href={`https://bsky.app/profile/${meta.bluesky}.bsky.social`}
                rel="noopener"
                target="_blank"
              >
                @{meta.bluesky}
              </a>
            </div>
            <div>
              <em>Last updated {meta.last_updated}</em>
            </div>
          </div>
        </div>
        {#each filterEntries(search, sections) as section, index}
          <section
            in:fade|global={{
              delay: 100 * index,
              duration: 300,
            }}
          >
            <div class="section-title">
              <h2 class="section-name">{section.name}</h2>
              <hr />
            </div>
            {#each section.entries as entry}
              <div
                class="entry"
                in:fade|global={{
                  delay: 100 * index,
                  duration: 300,
                }}
              >
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
                  <ResizingBox
                    content={{
                      info: section.entries
                        .map((e) => e['markup'])
                        .join(''),
                    }}
                  >
                    {#if entry.markup}
                      {@html entry.markup || ''}
                    {:else}
                      <span class="loading-message">
                        Loading...
                      </span>
                    {/if}
                  </ResizingBox>
                {/if}
              </div>
            {/each}
          </section>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* margin-multi(plier) refers to a constant by which
     other margins should be scaled by
    --marg below is just a convenience variable
   */
  .cv,
  .cv-container {
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

  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    align-items: flex-end;
  }

  .links {
    text-align: right;
  }

  .section-title {
    break-inside: avoid-page;
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

  /* Pulsing loading animation */
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  .loading-message {
    animation: pulse 1.5s infinite ease-in-out;
  }

  .print-title {
    display: none;
  }

  .print-title h1 {
    font-size: 18pt;
  }

  @page {
    size: 8.5in 11in;
    margin: 0.8in;
  }

  @media screen {
    :global(.pagedjs_page) {
      border: solid 1px black;
      margin: 1rem 0;
    }
  }

  @media print {
    :global(.pagedjs_page),
    :global(.pagedjs_page *) {
      visibility: visible !important;
      page-break-after: always;
      overflow: hidden;
    }

    /* Allow child containers to overflow if necessary */
    :global(.pagedjs_page > .content),
    :global(.pagedjs_page *) {
      overflow: visible !important;
    }

    :global(.cv) {
      padding: 1rem;
      overflow: visible !important;
      max-width: unset !important;
    }

    *,
    *::before,
    *::after {
      opacity: 1;
    }

    :global(.entry) {
      orphans: 0;
    }

    :global(.box) {
      height: unset !important;
    }

    .meta {
      justify-content: center;
    }

    .meta-info {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }

    .print-title {
      display: block;
    }
  }

  :global(.pagedjs-pages) {
    display: none;
  }
</style>
