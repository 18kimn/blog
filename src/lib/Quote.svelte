<script lang="ts">
  import {onMount} from 'svelte'

  let quote: {
    body: string
    link: string
    attribution: string
  }

  let animated = false
  function updateQuote() {
    animated = true

    fetch('http://leftist-quotes.com/')
      .then((res) => res.json())
      .then((json) => {
        quote = json
      })

    setTimeout(() => {
      animated = false
    }, 400)
  }

  onMount(updateQuote)
</script>

<div class="quote">
  {#if quote}
    <blockquote class="quote-body">{quote.body}</blockquote>
    <div class="bottom-row">
      <button
        class="refresh"
        class:animated
        on:click={updateQuote}
      >
        <em>Refresh quote</em>
      </button>
      <a class="attribution" href={quote.link}
        ><cite>&mdash;{quote.attribution}</cite></a
      >
    </div>
  {/if}
</div>

<style>
  .quote {
    margin: 1rem;
  }

  .bottom-row {
    display: flex;
    place-items: center;
    justify-content: space-between;
  }

  .refresh {
    width: fit-content;
    align-self: flex-end;
    background: none;
    border: solid 1px black;
    padding: 0.2rem 0.5rem;
    margin: 0.5rem;
    cursor: pointer;
    font-family: var(--font);
    font-size: 1rem;
    border-radius: 0.2rem;
    white-space: nowrap;
  }

  .animated {
    animation: flash 400ms ease-in-out;
  }

  @keyframes flash {
    0% {
      background: white;
    }

    50% {
      background: #c5c1c1;
    }

    100% {
      background: white;
    }
  }

  .attribution {
    margin: 0 1rem !important;
    text-align: right;
  }
</style>
