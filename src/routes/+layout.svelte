<script lang="ts">
  import {page} from "$app/state"
  import Nav from "$lib/Nav/Nav.svelte"
  import {stripHTML} from "$lib/utils/string"
  interface Props {
    children?: import("svelte").Snippet
  }

  let {children}: Props = $props()

  let title = $derived(stripHTML(page.data.title || ""))
</script>

<svelte:head>
  <title>{title} ⋅ Nathan Kim</title>
</svelte:head>
<div class="page">
  <Nav showLinks={!page.data.hideNavLinks} />
  <div class="container">
    <div class="component">
      <main>
        {@render children?.()}
      </main>
    </div>
  </div>
</div>

<style>
  @import "../globals.css";

  .page {
    width: 100%;
    max-width: 100vw;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  .component,
  .container {
    position: relative;
    display: grid;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
  }

  .component {
    transition: opacity ease-in-out 200ms;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  main {
    position: relative;
    z-index: 1;
  }

  @media print {
    .page {
      padding: 0;
      overflow: visible !important;
    }

    .component,
    .container {
      position: relative;
      display: block !important;
      width: 100%;
    }
  }
</style>
