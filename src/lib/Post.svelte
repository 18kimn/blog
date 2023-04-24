<script lang="ts">
  import type {Post} from '$lib/utils/types'
  import {getHeadings, updateHeadings} from './footnotes'
  import type {Footnote} from './footnotes'
  import setupSidebar from './setupSidebar'
  import {prettyDate, adjustDate} from '$lib/utils/string'
  import {last} from '$lib/utils/misc'
  import {onMount, setContext} from 'svelte'
  import {fade} from 'svelte/transition'
  import {postDataKey} from '../store'

  export let data = {} as Post
  setContext(postDataKey, data.postData)

  let rows: {
    node: Element
    footnotes?: Footnote[]
  }[] = []
  let headings: Footnote[] = []
  let visibleHeading: number
  onMount(() => {
    rows = setupSidebar()

    headings = getHeadings()
    visibleHeading = updateHeadings(headings)
    document.addEventListener('scroll', () => {
      const newHeading = updateHeadings(headings)
      visibleHeading =
        newHeading > -1 ? newHeading : visibleHeading
    })
  })

  function insertElement(
    target: HTMLElement,
    {elm}: {elm: HTMLElement | HTMLElement[]},
  ) {
    if (!Array.isArray(elm)) elm = [elm]
    elm.forEach((el) =>
      target.insertAdjacentElement('afterbegin', el),
    )
  }

  let windowWidth: number
  $: ({title, subtitle, modified, date, tags} = data)
</script>

<svelte:window bind:innerWidth={windowWidth} />
<div class="container">
  {#if data.title}
    <div class="content">
      <div class="article">
        <div class="section-container">
          <div class="section-wrapper">
            <h1>{@html title}</h1>
            {#if subtitle}<h2>{subtitle}</h2>{/if}
            <div class="meta">
              <span id="date">
                {#if modified?.length && last(modified) !== date}
                  <em>Created:</em>
                {/if}
                {prettyDate(adjustDate(date))}
              </span>
              {#if modified?.length && last(modified) !== date}
                <span id="modified">
                  <em>Last modified: </em>
                  {prettyDate(adjustDate(last(modified)))}
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
        </div>
        <div class="spacer" />
        {#each rows as row, index}
          <div class="section-container">
            <div
              class="section-wrapper"
              in:fade={{delay: index * 50}}
            >
              <div
                use:insertElement={{
                  elm: row.node,
                }}
              />
            </div>
          </div>
          {#if windowWidth > 1250}
            {#if row.footnotes}
              <div
                class="footnotes"
                in:fade={{delay: index * 50 + 100}}
              >
                {#each row.footnotes as footnote}
                  <div class="footnote">
                    {footnote.index + 1}
                    {@html footnote.html}
                  </div>
                {/each}
              </div>
            {:else}
              <div class="spacer" />
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  {/if}
  <div class="content article-shadow">
    <slot />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    place-items: center;
    overflow-x: hidden;
  }

  .article-shadow {
    display: none;
  }

  .article {
    display: grid;
    grid-template-columns: 3fr 2fr;
    place-items: center;
    overflow: hidden;
    --section-width: 70ch;
    gap: 0 4rem;
  }

  @media (max-width: 1250px) {
    .article {
      /* min of 100%, max of 65ch */
      grid-template-columns: minmax(
        100%,
        var(--section-width)
      );
    }
  }

  .section-container {
    justify-self: flex-end;
    width: var(--section-width);
    max-width: 100%;
    overflow: hidden;
  }

  /* Makes sure text is left-aligned within a container */
  .section-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .footnotes {
    justify-self: flex-start;
    max-width: 40ch;
    overflow: hidden;
  }

  .footnote {
    font-size: 0.8rem;
    margin: 0 1rem;
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

  .content :global(a) {
    font-family: var(--font);
    font-size: 1rem;
    margin: 0rem;
    color: #0015ab;
    text-decoration: none;
    transition: all ease-in-out 200ms;
  }

  .content :global(a:hover) {
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
    font-size: 0.5rem;
  }

  .content :global(pre) {
    font-size: 0.8rem;
    white-space: pre-wrap;
    width: 100%;
    box-sizing: border-box;
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

  .content :global(hr) {
    height: 1px;
  }

  .content :global(p) {
    margin: 0.7rem 0 0 0;
  }

  /* hacky; necessary to have line show up separating footnotes from contnet */
  .section-container:nth-last-child(2)
    .section-wrapper
    div {
    width: 100%;
  }
</style>
