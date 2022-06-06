<script lang="ts">
  import {onMount} from 'svelte'
  import {pages} from '../store'
  import type {SvelteComponent} from 'svelte/internal'
  import Circles from '$lib/Circles.svelte'

  onMount(async () => {
    pages.set(
      await fetch('/posts.json')
        .then((res) => res.json())
        .catch((err) => err),
    )
  })
  let onScreen: SvelteComponent
  let wrapper: HTMLElement

  /** short wrapper for delaying async-awaitly */
  async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /** page transitions */
  async function animate() {
    wrapper.classList.remove('intro')
    wrapper.classList.add('outro')
    await delay(200)

    wrapper.classList.remove('outro')
    wrapper.classList.add('intro')
    await delay(200)

    wrapper.classList.remove('intro')
  }

  $: onScreen && animate()
</script>

<div id="container">
  <Circles />
  <div id="component" class="outro intro" bind:this={wrapper}>
    <main>
      {#key onScreen}
        <slot this={onScreen} />
      {/key}
    </main>
  </div>
</div>

<style>
  @import '../globals.css';

  #component,
  #container {
    position: relative;
    display: grid;
    place-items: center;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
  }

  #component {
    width: fit-content;
    max-width: min(100%, 75ch);
    height: fit-content;
    margin: 3%;
    transition: opacity ease-in-out 200ms;
    box-sizing: border-box;
  }

  .outro {
    opacity: 0;
  }

  .intro {
    opacity: 1;
  }

  main {
    position: relative;
    z-index: 1;
    background: white;
    border: solid 1px black;
    padding: 2% 7%;
    box-shadow: 5px 5px;
    border-radius: 0.5rem;
    height: fit-content;
    box-sizing: border-box;
  }
</style>
