<script lang="ts">
  import type {RSSSource} from "$lib/utils/types"
  import {slide} from "svelte/transition"
  import OutLink from "./OutLink.svelte"
  interface Props {
    source?: RSSSource
  }

  let {source = {rssUrl: ""}}: Props = $props()

  let shouldExpand = $state(false)
</script>

{#if shouldExpand}
  <div class="expanded" transition:slide|global>
    <div class="header">
      <h3>{source.title}</h3>
      <button
        aria-label="expand RSS source"
        onclick={() => {
          shouldExpand = false
        }}
      >
        <svg class="minimize" viewBox="8 8 12 16"
          ><path d="M6 19h12v2H6z" /></svg
        >
      </button>
    </div>
    {#if source.description}
      <p>{source.description}</p>
    {/if}
    <div class="links">
      <OutLink href={source.rssUrl}>Link to feed</OutLink>
      {#if source.contentUrl}
        <OutLink href={source.contentUrl}
          >Link to content</OutLink
        >
      {/if}
    </div>
  </div>
{:else}
  <button
    class="default"
    onclick={() => {
      shouldExpand = true
    }}
    in:slide|global={{delay: 500}}
  >
    {source.title}
  </button>
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
