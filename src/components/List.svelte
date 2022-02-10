<script lang="ts">
  import Header from '../components/Header.svelte'
  import {pages} from '../store'

  export let type = ''

  interface Item {
    name: string
    title: string
    subtitle: string
    content: string
    date: Date
  }
  let items: Item[]

  pages.subscribe((fetched) => {
    if (!fetched || !fetched[type]) return
    items = fetched[type]
      .map((item: Item) => {
        item.date = new Date(item.date)
        return item
      })
      .sort((a: Item, b: Item) => b.date.getTime() - a.date.getTime())
  })
</script>

<div id="container">
  <Header selected="/items" />

  <div id="list">
    {#if !items}
      Loading...
    {:else}
      {#each items as item}
        <p>
          <span class="date">
            {item.date.toISOString().slice(0, 10)}:
          </span>
          <span class="content">
            <a id={item.name} href={item.name}>
              {item.title}
            </a>
            <br />
            <span class="subtitle">
              {item.subtitle || ''}
            </span>
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
