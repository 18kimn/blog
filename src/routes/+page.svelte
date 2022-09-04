<script lang="ts">
  import {fade} from 'svelte/transition'
  import {onMount} from 'svelte'
  import {firstRender} from '../store'
  import Icons from '$lib/Icons.svelte'
  import ResizingBox from '$lib/ResizingBox.svelte'

  type Info = {
    display: string
    info: string
    link?: string
  }

  type Currently = {
    listening: {
      singer: string
      title: string
      link: string
    }
    reading: {
      author: string
      title: string
      link: string
    }
    thinking: string
  }

  export let data: {
    info: {[type: string]: Info[]}
    currently: Currently
  }

  const tagline = [
    'anti-imperialist',
    'web developer',
    'data analyst',
    'researcher',
    'student',
  ].join(', ')

  let showing: Info[] = []

  let showInfo = false
  onMount(() => {
    showInfo = true
    setTimeout(() => firstRender.set(false), 1000)
  })

  $: ({currently, info} = data)
</script>

<div class="meta">
  <span class="tagline">
    {tagline}
  </span>
  <Icons />
</div>
{#if showInfo}
  <div class="info">
    <div class="section-container">
      {#each Object.entries(info) as section, index}
        <section
          in:fade={{
            delay: $firstRender ? 200 * index : 100,
            duration: $firstRender ? 400 : 100,
          }}
          class="topic"
        >
          <h2>{section[0]}</h2>
          <div class="items">
            {#each section[1] as item}
              <span
                on:click={() => {
                  if (showing[index] !== item) {
                    showing[index] = item
                  } else {
                    showing[index] = undefined
                  }
                }}
                class="item"
              >
                {@html item.display}
              </span>
            {/each}
          </div>
          <ResizingBox content={showing[index]} />
        </section>
      {/each}
      <section
        in:fade={{
          delay: $firstRender ? 600 : 100,
          duration: $firstRender ? 400 : 100,
        }}
      >
        <h2>currently...</h2>
        <ul class="currently">
          <li>
            reading
            <a
              target="__blank"
              rel="noreferrer"
              href={currently.reading.link}
            >
              <em>{currently.reading.title}</em>
            </a>
            by {currently.reading.author}
          </li>
          <li>
            listening to
            <a
              target="__blank"
              rel="noreferrer"
              href={currently.listening.link}
            >
              <em>{currently.listening.title}</em>
            </a>
            by {currently.listening.singer}
          </li>
          <li>
            thinking about {currently.thinking}
          </li>
        </ul>
      </section>
    </div>
  </div>
  <em class="guide">click on any keyword to reveal more.</em
  >
{/if}

<style>
  .meta {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    place-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .tagline {
    font-style: italic;
    font-size: 1rem;
    text-align: center;
  }

  .info,
  .section-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3rem 2rem;
    flex-grow: 1;
  }

  .section-container {
    justify-content: space-between;
  }

  .info div {
    flex: 1;
  }

  section {
    border-radius: 0.5rem;
    max-width: 50ch;
    flex-grow: 1;
    /* to control when wraps */
    flex-basis: 40%;
  }

  h2 {
    font-size: 2em;
  }

  .guide {
    align-self: flex-end;
  }

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    place-items: center;
  }

  .item {
    cursor: pointer;
    background-color: #ededed;
    transition: all ease-in-out 400ms;
    border: solid 1px #c9c9c9;
    border-radius: 0.5rem;
    padding: 0.3rem;
    margin: 0.3rem;
    box-sizing: border-box;
    position: relative;
    user-select: none;
  }

  .item:hover {
    color: var(--color);
  }

  .currently {
    margin-block: 0;
    list-style-type: none;
    padding-inline: 0;
  }

  .currently li {
    display: block;
    font-size: 1rem;
    margin: 0.3rem 0;
  }

  .guide {
    margin: 1rem 0;
  }
</style>
