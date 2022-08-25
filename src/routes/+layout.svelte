<script lang="ts">
  import {onMount} from 'svelte'
  import Nav from '$lib/Nav.svelte'

  onMount(() => {
    /* below is for header ::after animation */
    ;(
      document.querySelector('.header') as HTMLElement
    )?.style?.setProperty('--header-border-width', '100%')
  })
</script>

<div class="page">
  <Nav />
  <div id="container">
    <div id="component">
      <main>
        <slot />
      </main>
    </div>
  </div>
</div>

<style>
  @import '../globals.css';

  .page {
    width: 100%;
    height: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  #component,
  #container {
    position: relative;
    display: grid;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
  }

  #component {
    transition: opacity ease-in-out 200ms;
    box-sizing: border-box;
  }

  main {
    position: relative;
    z-index: 1;
    height: fit-content;
    box-sizing: border-box;
  }
</style>
