<script lang="ts">
  import Header from '$lib/Header.svelte'
  import {onMount} from 'svelte'
  import type {Post} from '../utils/types'

  export let type: 'projects' | 'writing'

  let items: Post[]

  onMount(async () => {
    items = await fetch(`/${type}.json`).then((res) =>
      res.json(),
    )
    console.log(items)
  })
</script>

<div id="container">
  <Header selected={`/${type}`} />
  <slot />
  <div id="list">
    {#if !items}
      Loading...
    {:else}
      {#each items as item}
        <p>
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

<style>
  #container {
    width: 100%;
  }

  .date {
    min-width: 10ch;
    margin-right: 1rem;
    text-align: right;
  }

  #list {
    width: min(100%, 47ch);
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
