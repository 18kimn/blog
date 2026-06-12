<script lang="ts">
  import type {Post} from "$lib/utils/types"
  import {resolve} from "$app/paths"
  import {fade} from "svelte/transition"

  interface Props {
    items: Post[]
    children?: import("svelte").Snippet
  }

  let {items, children}: Props = $props()
</script>

<div class="container">
  <div class="content">
    {@render children?.()}
    <div class="list">
      {#if !items}
        Loading...
      {:else}
        {#each items as item, index (item.path)}
          <p in:fade|global={{delay: 10 * index}}>
            <span class="date">
              {new Date(item.date)
                .toISOString()
                .slice(0, 10)}:
            </span>
            <span class="content">
              <a href={resolve(item.path as `/${string}`)}>
                {@html item.title}
              </a>
              <br />
              {#if item.subtitle}
                <span class="subtitle">
                  {item.subtitle}
                </span>
              {/if}
            </span>
          </p>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    font-size: 1.2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    place-items: center;
  }

  .content {
    width: min(100%, 60ch);
    max-width: max-content;
  }

  .date {
    min-width: 10ch;
    margin-right: 1rem;
    text-align: right;
  }

  .list {
    display: grid;
    overflow-wrap: break-word;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1rem;
    display: flex;
    justify-content: flex-start;
    margin: 0.5rem 0;
  }

  a {
    color: black;
    cursor: pointer;
  }

  a:hover {
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  /** force empty spans to still have height */
  .subtitle:before {
    content: "\200b";
  }

  .content :global(code) {
    color: #7c00aa;
  }
</style>
