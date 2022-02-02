<script lang="ts">
  import {onMount} from 'svelte'
  import Header from '../components/Header.svelte'

  export let id: string

  let markup = {data: undefined, content: undefined}
  let date = ''

  onMount(() => {
    const url = `/content/projects/${id}/index.md`
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        markup = json
        date = new Date(markup.data?.date)
        date = date.toDateString()
      })
  })

  $: ({data, content} = markup)
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
    {@html markup.content}
  </div>
{:else}
  <Header selected="/" />
  Loading content...
{/if}

<style>
  #content {
    width: 100%;
  }

  #content :global(pre) {
    white-space: pre-wrap;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.4rem;
    font-weight: normal;
  }

  h1,
  h2 {
    margin: 0.5rem 0 0 0;
  }

  #frontmatter {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 1.5rem 0 4rem 0;
  }

  #date {
    margin-top: 1rem;
  }
  #content :global(a) {
    margin: 0;
  }
</style>
