<script lang="ts">
  import type {RSSSource} from '$lib/utils/types'
  import {slide} from 'svelte/transition'
  export let source: RSSSource = {rssUrl: ''}

  let shouldExpand = false
</script>

{#if shouldExpand}
  <div class="expanded" transition:slide>
    <div class="header">
      <h3>{source.title}</h3>
      <svg
        on:click={() => {
          shouldExpand = false
        }}
        class="minimize"
        viewBox="8 8 12 16"><path d="M6 19h12v2H6z" /></svg
      >
    </div>
    {#if source.description}
      <p>{source.description}</p>
    {/if}
    <div class="links">
      <a
        href={source.rssUrl}
        target="__blank"
        rel="noreferrer">Link to feed</a
      >
      <a
        href={source.contentUrl}
        target="__blank"
        rel="noreferrer">Link to content</a
      >
    </div>
  </div>
{:else}
  <div
    class="default"
    on:click={() => {
      shouldExpand = true
    }}
    in:slide={{delay: 500}}
  >
    {source.title}
  </div>
{/if}

<style>
  .expanded {
    display: flex;
    flex-direction: column;
    margin: 1rem;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .minimize {
    height: 1.5rem;
    width: 2rem;
    padding-bottom: 1rem;
    cursor: pointer;
  }

  h3 {
    font-weight: bold;
  }

  .links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .default {
    cursor: pointer;
  }
</style>
