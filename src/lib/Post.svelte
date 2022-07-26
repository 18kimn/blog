<script lang="ts">
  import type {Post} from '../utils/types'
  import Header from './Header.svelte'

  export let type: '/projects' | '/writing'
  export let data: Post
</script>

<Header selected={type} />
<div id="content">
  <div id="frontmatter">
    <h1>{data?.title}</h1>
    {#if data.subtitle}
      <h2>{data.subtitle}</h2>
    {/if}
    <span id="date">{new Date(data?.date)?.toDateString()}</span>
  </div>
  <slot />
</div>

<style>
  #content {
    width: 100%;
    overflow-x: auto;
    overflow-wrap: break-word;
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
    width: 100%;
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
