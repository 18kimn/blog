<script context="module" lang="ts">
  export type Entry = {
    abstract: string
    collection: string
    creators: {
      firstName: string
      lastName: string
    }[]
    date: string
    link: string
    title: string
    subtitle: string
  }
</script>

<script lang="ts">
  import {slide} from 'svelte/transition'
  import {prettyDate, printList} from '$lib/utils/string'
  import {onMount} from 'svelte'

  export let entry: Entry

  let shouldExpand = false
  let isHover = false
  let firstRender = true

  onMount(() => {
    firstRender = false
  })

  $: ({title, subtitle, abstract, date, link, creators} =
    entry)
  $: names = creators.map(
    (creator) => `${creator.firstName} ${creator.lastName}`,
  )
</script>

{#if entry}
  {#if shouldExpand}
    <div class="expanded" transition:slide>
      <div class="header">
        <div class="meta">
          <h3>{title}</h3>
          {#if subtitle}
            <h4>{subtitle}</h4>
          {/if}
          <span>
            by {printList(names)}
          </span>
          <span>
            Published {prettyDate(date)}
          </span>
        </div>
        <svg
          on:click={() => {
            shouldExpand = false
            isHover = false
          }}
          class="minimize"
          viewBox="8 8 12 16"
          ><path d="M6 19h12v2H6z" /></svg
        >
      </div>
      {#if abstract}
        <p><em>Abstract: </em>{@html abstract}</p>
      {/if}
      <div class="links">
        {#if link}
          <a href={link} target="__blank" rel="noreferrer"
            >see more</a
          >
        {/if}
      </div>
    </div>
  {:else}
    <div
      class="default"
      on:click={() => {
        shouldExpand = true
      }}
      on:mouseenter={() => {
        isHover = true
      }}
      on:mouseout={() => {
        isHover = false
      }}
      on:blur={() => {
        isHover = false
      }}
      style={isHover ? 'background: violet;' : ''}
      in:slide={{delay: firstRender ? 0 : 500}}
    >
      <span style="font-weight: bold;">{title}</span>
      <div>
        <span class="creators">
          {printList(names, true)}
        </span>
      </div>
    </div>
  {/if}
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
    margin: 0;
  }

  .meta {
    display: flex;
    flex-direction: column;
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

  h3,
  h4 {
    margin: 0;
  }

  .links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-style: italic;
  }

  .default {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0 4rem;
    transition: background 200ms ease-in-out;
  }

  .default :first-child {
    text-align: left;
  }
  .default :last-child {
    text-align: right;
    max-width: 30ch;
    word-wrap: wrap;
  }
</style>
