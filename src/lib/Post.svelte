<script lang="ts">
  import type {Post} from '../utils/types'
  import Header from './Header.svelte'
  import updateFloater, {
    getFootnotes,
    getHeadings,
    updateHeadings,
  } from './Footer'
  import type {Footnote} from './Footer'
  import {prettyDate} from '../utils/string'
  import {last} from '../utils/misc'
  import {onMount} from 'svelte'

  export let type: '/projects' | '/writing'
  export let data = {} as Post

  let visibleFootnotes: Footnote[] = []
  let headings: Footnote[] = []
  let visibleHeading: number
  let width = 0
  onMount(() => {
    const footnotes = getFootnotes()
    visibleFootnotes = updateFloater(footnotes)

    headings = getHeadings()
    visibleHeading = updateHeadings(headings)
    document.addEventListener('scroll', () => {
      visibleFootnotes = updateFloater(footnotes)
      const newHeading = updateHeadings(headings)
      visibleHeading =
        newHeading > -1 ? newHeading : visibleHeading
    })

    const main = document.querySelector('main')
    if (!main) return
    width = main.clientWidth
    const ro = new ResizeObserver(() => {
      width = main.clientWidth
    })
    ro.observe(main)
  })

  function scrollToHeading(index: number) {
    const id = headings[index].id
    document.getElementById(id)?.scrollIntoView({
      block: 'center',
    })
  }

  $: ({title, subtitle, modified, date, tags} = data)
</script>

<Header selected={type} />
{#if data.title}
  {#if visibleHeading >= 1}
    <div style={`width: ${width}px`} class="header">
      {#if headings[visibleHeading - 1]}
        <span>
          Prev.:
          <button
            aria-label={`Navigate to ${
              headings[visibleHeading - 1]
            }`}
            on:click={() =>
              scrollToHeading(visibleHeading - 1)}
          >
            {headings[visibleHeading - 1]?.html}
          </button>
        </span>
      {/if}
      <span>{headings[visibleHeading].html}</span>
      {#if headings[visibleHeading + 1]}
        <span>
          Next:
          <button
            aria-label={`Navigate to ${
              headings[visibleHeading + 1]
            }`}
            on:click={() =>
              scrollToHeading(visibleHeading + 1)}
          >
            {headings[visibleHeading + 1]?.html}
          </button>
        </span>
      {/if}
    </div>
  {/if}
  <div class="content">
    <div id="frontmatter">
      <h1>{title}</h1>
      {#if subtitle}<h2>{subtitle}</h2>{/if}
      <div class="meta">
        <span id="date">
          {#if modified?.length && last(modified) !== date}
            <em>Created:</em>
          {/if}
          {prettyDate(date)}
        </span>
        {#if modified?.length && last(modified) !== date}
          <span id="modified">
            <em>Last modified: </em>
            {prettyDate(last(modified))}
          </span>
        {/if}
        {#if tags?.length}
          <span id="tags">
            <em> Tagged with: </em>
            <code>{tags.join(', ')}</code>
          </span>
        {/if}
      </div>
    </div>
    <slot />
  </div>
  {#if visibleFootnotes.length}
    <div style={`width: ${width}px`} class="footer">
      {#each visibleFootnotes as footnote}
        <li class="footnote">
          {footnote.index}. {@html footnote.html}
        </li>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .footer,
  .header {
    z-index: 1;
    font-size: 0.8rem;
    position: fixed;
    padding: 1rem 2rem;
    /* so ugly */
    width: 100%;
    margin: 0 -3rem;
    box-sizing: border-box;
    border: var(--border);
    background: white;
  }

  .footer {
    bottom: 0;
  }

  .header {
    top: 0;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .header button {
    margin: 0;
    background: white;
    border: none;
    cursor: pointer;
  }

  .footnote {
    display: block;
  }

  .content {
    width: 100%;
    overflow-x: auto;
    overflow-wrap: break-word;
  }

  .content :global(h2) {
    font-size: 1.5rem;
  }

  .content :global(h3) {
    font-size: 1.2rem;
  }

  .content :global(a),
  .header button {
    font-family: var(--font);
    font-size: 1rem;
    margin: 0rem;
    color: #0015ab;
    text-decoration: none;
    transition: all ease-in-out 200ms;
  }

  .header button {
    font-size: 0.8rem;
  }

  .content :global(a:hover),
  .header button:hover {
    color: red;
    text-decoration: underline;
  }

  .content :global(.heading-link) {
    margin: 0.3rem;
    opacity: 0;
    transition: opacity ease-in-out 200ms;
  }

  .content :global(.heading:hover a) {
    opacity: 1;
  }

  .content :global(sup a),
  .content :global(.backlink) {
    font-size: 0.7rem;
  }

  .content :global(pre) {
    white-space: pre-wrap;
  }

  .content :global(.caption) {
    font-size: 0.8rem;
    display: block;
    width: 100%;
    text-align: center;
  }

  .content :global(img) {
    width: 100%;
  }

  .content :global(iframe) {
    width: 100%;
    height: 100vh;
  }

  .content :global(blockquote) {
    background: #ebebeb;
    padding: 1rem;
    margin: 0.5rem 1rem;
    border-left: solid 5px black;
  }

  .content :global(blockquote > h1) {
    font-size: 1.3rem;
  }
</style>
