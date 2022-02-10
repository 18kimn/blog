<script lang="ts">
  import {onMount} from 'svelte'
  import Header from '../components/Header.svelte'
  import type {Post} from '../utils/types'
  export let type: string
  export let id: string

  let markup: Post = {
    data: undefined,
    toc: undefined,
    content: undefined,
  }
  let date = ''

  onMount(() => {
    const url = `/content/${type}/${id}/index.md`
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        markup = json
        const postDate = new Date(markup.data?.date)
        date = postDate.toDateString()
      })
  })

  $: ({data, toc, content} = markup)
  $: tocRendered =
    toc &&
    toc.reduce((acc, curr, i) => {
      const prefix = toc[i - 1]?.level < curr.level ? '<ul>' : ''
      const suffix = toc[i - 1]?.level > curr.level ? '</ul>' : ''
      const result = `<li><a href="#${curr.slug}" class="toc-link">${curr.title}</a></li>`

      return `${acc}${prefix}${result}${suffix}`
    }, '')
  $: console.log(tocRendered)
</script>

{#if markup.content}
  <Header />
  <div id="content">
    <div id="frontmatter">
      <h1>{data?.title}</h1>
      {#if data.subtitle}
        <h2>{data.subtitle}</h2>
      {/if}
      <span id="date">{date}</span>
    </div>
    {#if toc.length}
      <div id="toc">
        <i>In this post:</i>
        <ol>
          {@html tocRendered}
        </ol>
      </div>
    {/if}
    {@html content}
  </div>
{:else}
  <Header selected="/" />
  Loading content...
{/if}

<style>
  #content {
    width: 100%;
    overflow-x: auto;
    overflow-wrap: break-word;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: normal;
  }

  h1,
  h2 {
    margin: 1rem 0 0 0;
  }

  #frontmatter {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 1.5rem 0 2rem 0;
  }

  #date {
    margin-top: 0.5rem;
  }

  #toc {
    margin: 2rem 0;
  }

  ol {
    margin: 0.5rem;
  }

  #content :global(h2) {
    font-size: 1.5rem;
  }

  #content :global(h3) {
    font-size: 1.2rem;
  }

  #content :global(a) {
    font-size: 1rem;
    margin: 0rem;
    color: #0015ab;
    text-decoration: none;
    transition: all ease-in-out 200ms;
  }

  #content :global(a:hover) {
    color: red;
    text-decoration: underline;
  }

  #content :global(.heading-link) {
    margin: 0.3rem;
    opacity: 0;
    transition: opacity ease-in-out 200ms;
  }

  #content :global(.heading:hover a) {
    opacity: 1;
  }

  #content :global(sup a),
  #content :global(.backlink) {
    font-size: 0.7rem;
  }

  #content :global(pre) {
    white-space: pre-wrap;
  }

  #content :global(.caption) {
    font-size: 0.8rem;
    display: block;
    width: 100%;
    text-align: center;
  }

  #content :global(img) {
    max-width: 100%;
  }

  #content :global(iframe) {
    width: 100%;
    height: 100vh;
  }

  #content :global(blockquote) {
    background: #ebebeb;
    padding: 1rem;
    margin: 1rem;
    border-left: solid 5px black;
  }

  #content :global(blockquote > h1) {
    font-size: 1.3rem;
  }
</style>
