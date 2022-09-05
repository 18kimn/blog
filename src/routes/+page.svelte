<script lang="ts">
  import {fade} from 'svelte/transition'
  import {onMount} from 'svelte'
  import {firstRender} from '../store'
  import Icons from '$lib/Icons.svelte'
  import ResizingBox from '$lib/ResizingBox.svelte'
  import {prettyDate} from '../utils/string'

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
      preview_url: string
    }
    reading: {
      author: string
      title: string
    }
    thinking: string
    time: number
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

  let audio: HTMLAudioElement
  let canPlayAudio = false
  let showInfo = false
  onMount(() => {
    showInfo = true
    setTimeout(() => firstRender.set(false), 1000)

    audio = new Audio(
      data?.currently?.listening?.preview_url,
    )
    audio.volume = 0
    audio.addEventListener('canplaythrough', () => {
      canPlayAudio = true
    })
  })

  let isPlayingAudio = false
  function handleAudio() {
    if (!canPlayAudio) return

    /* fade in and out */
    const transitionTime = 1000
    const steps = 10
    const diff = isPlayingAudio ? -(1 / steps) : 1 / steps
    const interval = setInterval(() => {
      const newVol = audio.volume + diff
      if (newVol < 0 || newVol > 1) {
        clearInterval(interval)
        return
      }
      audio.volume = newVol
    }, transitionTime / steps)

    isPlayingAudio
      ? setTimeout(
          () => audio.pause(),
          transitionTime + diff,
        )
      : audio.play()
    isPlayingAudio = !isPlayingAudio
  }

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
      {#if currently}
        <section
          in:fade={{
            delay: $firstRender ? 600 : 100,
            duration: $firstRender ? 400 : 100,
          }}
        >
          <h2>currently...</h2>
          <ul class="currently">
            {#if currently.reading}
              <li>
                reading
                <em>{currently.reading.title}</em>
                by {currently.reading.author}
              </li>
            {/if}
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
              <svg
                class="audio-button"
                class:isPlayingAudio
                class:canPlayAudio
                on:click={handleAudio}
                viewBox="0 0 24 24"
              >
                {#if isPlayingAudio}
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                  />
                {:else}
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                  />
                {/if}
              </svg>
            </li>
            <li>
              thinking about {currently.thinking}
            </li>
            <em class="update-time">
              This section is updated via automation every
              few days. Last updated on {prettyDate(
                currently.time,
              )}.
            </em>
          </ul>
        </section>
      {/if}
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
    font-size: 2.5em;
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
    font-size: 1.2em;
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

  .audio-button {
    height: 1rem;
    width: 1rem;
    opacity: 0;
    transition: opacity ease-in-out 400ms;
  }

  .canPlayAudio {
    cursor: pointer;
    opacity: 1;
  }

  .isPlayingAudio {
    border-radius: 1rem;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
  }

  .update-time {
    font-size: 0.8rem;
  }

  .guide {
    margin: 1rem 0;
  }
</style>
