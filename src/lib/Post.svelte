<script lang="ts">
  import type {Post} from '$lib/utils/types'
  import updateFloater, {
    getFootnotes,
    getHeadings,
    updateHeadings,
  } from './Footer'
  import type {Footnote} from './Footer'
  import {prettyDate} from '$lib/utils/string'
  import {last} from '$lib/utils/misc'
  import {onMount} from 'svelte'

  export let data = {} as Post

  let visibleFootnotes: Footnote[] = []
  let headings: Footnote[] = []
  let visibleHeading: number
  let shouldHideFloater = false
  let content: HTMLDivElement
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

    if (!content) return
    width = content.clientWidth
    const ro = new ResizeObserver(() => {
      width = content?.clientWidth
    })
    ro.observe(content)
  })

  function scrollToHeading(index: number) {
    const id = headings[index].id
    document.getElementById(id)?.scrollIntoView({
      block: 'center',
    })
  }

  $: ({title, subtitle, modified, date, tags} = data)
</script>

<div class="container">
  {#if data.title}
    {#if visibleHeading >= 1}
      <div
        style={`width: ${width}px; min-width: ${width}px;`}
        class="header"
      >
        {#if headings[visibleHeading - 1]}
          <span>
            <em>Prev.:</em>
            <button
              style="text-align: left;"
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
        <span style="text-align: center;">
          {headings[visibleHeading].html}
        </span>
        {#if headings[visibleHeading + 1]}
          <span style="text-align: end;">
            <em>Next:</em>
            <button
              style="text-align: end;"
              aria-label={`Navigate to ${
                headings[visibleHeading + 1]?.html
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
    <div class="content" bind:this={content}>
      <div id="frontmatter">
        <h1>{@html title}</h1>
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
      <div
        style={`width: ${width}px; min-width: ${width}px;`}
        class="footer"
      >
        {#if !shouldHideFloater}
          <button
            on:click={() => (shouldHideFloater = true)}
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M18 6.41 16.59 5 12 9.58 7.41 5 6 6.41l6 6z"
              />
              <path
                d="m18 13-1.41-1.41L12 16.17l-4.59-4.58L6 13l6 6z"
              />
            </svg>
          </button>
          <div class="footnotes">
            {#each visibleFootnotes as footnote}
              <li class="footnote">
                {footnote.index + 1}. {@html footnote.html}
              </li>
            {/each}
          </div>
        {:else}
          <button
            on:click={() => (shouldHideFloater = false)}
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M6 17.59 7.41 19 12 14.42 16.59 19 18 17.59l-6-6z"
              />
              <path
                d="m6 11 1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z"
              />
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    place-items: center;
    overflow-x: hidden;
  }

  .header,
  .content {
    max-width: 70ch;
  }

  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    white-space: normal;
    font-size: 2rem;
  }

  h1 :global(code) {
    background: none;
  }

  .header span {
    flex-basis: 50%;
  }

  .header button {
    padding: 0;
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
    border-top: solid 1px rgba(0 0 0 / 30%);
    border-bottom: solid 1px rgba(0 0 0 / 30%);
    background: white;
  }

  .footer {
    bottom: 0;
    padding: 0.5rem;
    display: flex;
  }

  svg {
    width: 1.5em;
    height: 1.5em;
  }

  .footer button {
    padding: 0 1rem;
    align-self: flex-start;
  }

  .header {
    top: 0;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  button {
    margin: 0;
    box-shadow: none;
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

  .content :global(.heading-link) {
    width: 100%;
  }
  .content :global(.heading-link:hover) {
    background: gray;
  }

  .content :global(h2) {
    font-size: 1.5rem;
  }

  .content :global(h3) {
    font-size: 1.2rem;
  }

  .content :global(a),
  button {
    font-family: var(--font);
    font-size: 1rem;
    margin: 0rem;
    color: #0015ab;
    text-decoration: none;
    transition: all ease-in-out 200ms;
  }

  button {
    font-size: 0.8rem;
  }

  .content :global(a:hover),
  button:hover {
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
    font-size: 0.8rem;
  }

  .content :global(pre) {
    font-size: 0.8rem;
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
