<script module lang="ts">
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
  import {slide} from "svelte/transition"
  import {prettyDate, printList} from "$lib/utils/string"
  import {onMount} from "svelte"
  import OutLink from "$lib/OutLink.svelte"

  interface Props {
    entry: Entry
  }

  let {entry}: Props = $props()

  let shouldExpand = $state(false)
  let isHover = $state(false)
  let firstRender = $state(true)

  onMount(() => {
    firstRender = false
  })

  let {title, subtitle, abstract, date, link, creators} =
    $derived(entry)
  let names = $derived(
    creators.map(
      (creator) =>
        `${creator.firstName} ${creator.lastName}`,
    ),
  )
</script>

{#if entry}
  {#if shouldExpand}
    <div class="expanded" transition:slide|global>
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
        <button
          onclick={() => {
            shouldExpand = false
            isHover = false
          }}
          aria-label="expand entry"
        >
          <svg class="minimize" viewBox="8 8 12 16"
            ><path d="M6 19h12v2H6z" /></svg
          >
        </button>
      </div>
      {#if abstract}
        <p><em>Abstract: </em>{@html abstract}</p>
      {/if}
      <div class="links">
        {#if link}
          <OutLink href={link}>see more</OutLink>
        {/if}
      </div>
    </div>
  {:else}
    <button
      class="default"
      onclick={() => {
        shouldExpand = true
      }}
      onmouseenter={() => {
        isHover = true
      }}
      onmouseout={() => {
        isHover = false
      }}
      onblur={() => {
        isHover = false
      }}
      style={isHover ? "background: violet;" : ""}
      in:slide|global={{delay: firstRender ? 0 : 500}}
    >
      <span style="font-weight: bold;">{title}</span>
      <div>
        <span class="creators">
          {printList(names, true)}
        </span>
      </div>
    </button>
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

  button {
    width: 100%;
  }
</style>
