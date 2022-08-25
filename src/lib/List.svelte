<script lang="ts">
  import {onMount} from 'svelte'
  import type {Post} from '../utils/types'
  import {fade} from 'svelte/transition'

  export let type: 'projects' | 'writing' | 'notebook'

  let items: Post[]

  onMount(async () => {
    items = (
      await fetch(`/${type}-posts`).then((res) =>
        res.json(),
      )
    ).filter(
      (item: Post) => typeof item.date !== 'undefined',
    )
  })
</script>

<div id="container">
  <div class="content">
    <slot />
    <div id="list">
      {#if !items}
        Loading...
      {:else}
        {#each items as item, index}
          <p in:fade={{delay: 10 * index}}>
            <span class="date">
              {new Date(item.date)
                .toISOString()
                .slice(0, 10)}:
            </span>
            <span class="content">
              <a id={item.path} href={item.path}>
                {item.title}
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
  #container {
    font-size: 1.2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    place-items: center;
  }

  .content {
    width: min(100%, 80ch);
    max-width: max-content;
  }

  .date {
    min-width: 10ch;
    margin-right: 1rem;
    text-align: right;
  }

  #list {
    display: grid;
    overflow-wrap: break-word;
  }

  p {
    display: flex;
    justify-content: flex-start;
    margin: 0.5rem 0;
  }

  a {
    color: black;
    text-decoration: underline;
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
    content: '\200b';
  }
</style>
