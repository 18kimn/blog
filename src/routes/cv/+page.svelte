<script lang="ts">
  import {onMount} from 'svelte'
  import CVBody from './CVBody.svelte'
  import {plugins} from '@citation-js/core'
  import '@citation-js/plugin-csl'

  type CSL = {
    name: string
    key: string
    me?: string
    path?: string
  }
  let csls: CSL[] = []

  onMount(async () => {
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
      /* if click isn't on gear or the dialog itself, close it
       */
      if (!isWithin && e.target !== opener) {
        dialog.close()
        setTimeout(() => {
          dialog.style.display = 'none'
        }, 200)
      }
    })
  })

  let opener: SVGElement
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

<div class="container">
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
  <CVBody {search} {csl} {isCompact} {fontsize}>
    <svg
      viewBox="0 0 24 24"
      class="opener"
      bind:this={opener}
      aria-label="edit the CV settings"
      on:click={() => {
        dialog.style.display = 'flex'
        /* to trigger a layout recalculation;
          otherwise the display flex
        change and the showModal changes will
        be batched together, but we want the
        display to be set to flex first
        */
        dialog.getBoundingClientRect()
        dialog.showModal()
      }}
    >
      <path
        class="opener"
        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
      />
    </svg>
  </CVBody>
</div>

<style>
  .container {
    display: flex;
    place-content: center;
    overflow-x: hidden;
    width: min(100%, 80ch);
  }

  .opener {
    cursor: pointer;
    height: 2rem;
    width: 2rem;
    min-width: 2rem;
    box-sizing: border-box;
    margin: 1rem;
    position: sticky;
    top: 1rem;
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
