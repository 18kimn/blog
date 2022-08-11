<script lang="ts">
  import {Cite, plugins} from '@citation-js/core'
  import {onMount, tick} from 'svelte'
  import type {CV} from './types'
  import CVBody from './CVBody.svelte'

  type CSL = {
    name: string
    key: string
    me?: string
    path?: string
  }
  let csls: CSL[] = []

  onMount(() => {
    ;[
      {name: 'APA', me: 'N. Kim'},
      {
        name: 'Chicago',
        path: '/csl/chicago.csl',
        me: 'N. Kim',
      },
      {name: 'ASA', path: '/csl/asa.csl'},
      {name: 'MLA', path: '/csl/mla.csl'},
      {name: 'IEEE', path: '/csl/ieee.csl'},
      {name: 'Harvard', key: 'harvard1'},
    ].forEach(async (csl) => {
      if (csl.path) {
        const template = await fetch(csl.path).then((res) =>
          res.text(),
        )
        const config = plugins.config.get('@csl')
        config.templates.add(
          csl.name.toLowerCase(),
          template,
        )
      }
      csls = [
        ...csls,
        {...csl, key: csl.key || csl.name.toLowerCase()},
      ]
    })
    csl = csls[0].key

    // what a pain in the butt
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect()
      const x = e.clientX
      const y = e.clientY
      const isWithin =
        x < rect.right &&
        x > rect.left &&
        y > rect.top &&
        y < rect.bottom
      if (!isWithin && e.target !== opener) {
        dialog.close()
        setTimeout(() => {
          dialog.style.display = 'none'
        }, 200)
      }
    })
  })

  let opener: HTMLButtonElement
  let dialog: HTMLDialogElement
  let bubble: HTMLOutputElement

  let csl: string
  let isCompact = false
  let fontsize = 14
  let search: string

  /*
  - search
  - show navigation header
  -
  - open/minimize sections
  - preview for websites
  - search only for first-authored papers ?? not right now
  */
  $: fontsize &&
    bubble &&
    (bubble.innerHTML = `${fontsize}pt`)
</script>

<button
  class="opener"
  bind:this={opener}
  on:click={() => {
    dialog.style.display = 'flex'
    // to trigger a layout recalculation; otherwise the display flex
    // change and the showModal changes will be batched together,
    // but we want the display to be set to flex first
    dialog.getBoundingClientRect()
    dialog.showModal()
  }}
>
  Controls
</button>
<dialog bind:this={dialog}>
  <div class="row">
    <label for="fontsize">Font size:</label>
    <input
      id="fontsize"
      bind:value={fontsize}
      min={5}
      max={32}
      type="range"
    />
    <output bind:this={bubble}>&nbsp;</output>
  </div>
  <div class="row">
    <label for="compact">Compact mode:</label>
    <input
      id="compact"
      type="checkbox"
      bind:checked={isCompact}
    />
  </div>
  <div class="row">
    <label for="csl">Citation style:</label>
    <select id="csl" name="citations" bind:value={csl}>
      {#each csls as csl}
        <option value={csl.key}>{csl.name}</option>
      {/each}
    </select>
  </div>
  <div class="row">
    <label for="search">Filter entries:</label>
    <input id="search" bind:value={search} />
  </div>
</dialog>
<CVBody {search} {csl} {isCompact} {fontsize} />

<style>
  .opener {
    border: var(--border);
    border-radius: 0.2rem;
    cursor: pointer;
    width: fit-content;
  }

  dialog {
    display: none;
    flex-direction: column;
    gap: 1rem;
    opacity: 0;
    transition: all ease-in-out 200ms;
    border: var(--border);
    border-radius: 0.2rem;
    box-shadow: 3px 3px;
    /* just copying the user agent stylesheet state
       for when it's opened
     */
    position: fixed;
    top: 0;
    bottom: 0;
    max-width: calc((100% - 6px) - 2em);
    max-height: calc((100% - 6px) - 2em);
  }

  dialog[open] {
    display: flex;
    opacity: 1;
  }

  dialog::backdrop {
    transition: all ease-in-out 200ms;
    cursor: pointer;
  }

  .row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  input,
  select {
    cursor: pointer;
  }
</style>
