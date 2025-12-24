<script lang="ts">
  import {onMount} from 'svelte'
  import {firstRender} from '../store'
  import Icons from '$lib/Icons.svelte'
  import ResizingBox from '$lib/ResizingBox.svelte'
  import {prettyDate} from '$lib/utils/string'
  import OutLink from '$lib/OutLink.svelte'

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
      url: string
    }
    thinking: string
    time: number
  }

  interface Props {
    data: {
      info: {[type: string]: Info[]}
      currently: Currently
    }
  }

  let {data}: Props = $props()

  let showing: Info[] = $state([])

  let audio: HTMLAudioElement
  let canPlayAudio = $state(false)
  onMount(() => {
    setTimeout(() => firstRender.set(false), 1000)

    audio = new Audio(
      data?.currently?.listening?.preview_url,
    )
    audio.volume = 0
    audio.addEventListener('canplaythrough', () => {
      canPlayAudio = true
    })
  })

  let isPlayingAudio = $state(false)
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

  let {currently, info} = $derived(data)
</script>

<div class="page-container">
  <div class="overview">
    <p>
      I am a PhD candidate at the University of Michigan
      School of Information, advised by <a
        href="https://tisjune.github.io">Justine Zhang</a
      >
      and
      <a href="https://lisanakamura.net">Lisa Nakamura</a>.
      I'm interested in the political economy of Silicon
      Valley, especially with regards to the evolving
      relationship between the Valley and logics of state
      security after the Cold War. That leads me to draw
      from critical studies of race, finance, logistics, and
      tech infrastructures. If you're interested in
      collaborating, talking, organizing, or working with me
      in any way, <strong>please</strong>
      reach out (contact info on right).
    </p>
    <p>
      I am interested in social movements broadly and
      supporting the work of organizers through my research
      and technical work. I helped build
      <OutLink href="https://evictorbook.com"
        >Evictorbook</OutLink
      >, a tool to perform landlord research for tenant
      organizers, with <OutLink
        href="https://antievictionmap.com"
      >
        the Anti-Eviction Mapping Project
      </OutLink>. I currently work as a research intern for
      <OutLink href="https://www.dair-institute.org">
        the DAIR Institute
      </OutLink>, specifically for <OutLink
        href="https://www.alex-hanna.com"
      >
        Dr. Alex Hanna
      </OutLink>
      on a project studying and documenting campus-based protest
      movements in the 2010s. <OutLink
        href="https://journals.sagepub.com/doi/10.1177/23780231241297447"
      >
        One article
      </OutLink> from this work, focusing on top-line trends in
      the database we built, is out with <em>Socius</em> now.
    </p>
    <p>
      I am a department steward with the
      <OutLink href="https://geo3550.org/">
        Graduate Employees' Organization at the University
        of Michigan (AFT Local 3550)
      </OutLink>. I also was an organizer with the
      <OutLink href="https://tahrirumich.org/">
        TAHRIR Coalition
      </OutLink>
      at the University of Michigan. With TAHRIR, I mostly performed
      research on the UM endowment and relations of power within
      the university. We published
      <OutLink
        href="https://tahrirumich.org/research/endowment-guide"
      >
        a report on the University endowment
      </OutLink>
      and a series of articles on the political allegiances of
      the Board of Regents, available <OutLink
        href="https://tahrirumich.org/research"
      >
        here
      </OutLink>. I am also an active organizer with the <OutLink
        href="https://annarbortenants.org/"
      >
        Ann Arbor Tenants Union,
      </OutLink> through which I've worked on standing up several
      tenant associations and building citywide power for tenants.
      My work as an organizer generally focuses on creating the
      excitement and analysis needed for formations of workers
      or tenants to systematically expand and make decisions together
      -- in other words, the positive practice of organizing necessary
      to achieve wins while avoiding "leadership" representing
      or advocating on behalf of members in a union.
    </p>
    <p>
      Before I became a graduate student at UMich, I was an
      undergraduate student at Yale University, where I
      double majored in Ethnicity, Race, & Migration and
      Statistics and Data Science. My senior thesis, <OutLink
        href="https://raw.githubusercontent.com/18kimn/imf_loans/refs/heads/production/content/text/paper/thesis.pdf"
      >
        <em>The IMF and Global Dispossession</em></OutLink
      >, was advised by Professor Lisa Lowe. I also learned
      from the late Gary Okihiro, through two courses and a
      term of independent study with him. These were
      challenging and transformative intellectual
      experiences for me, and I am extremely grateful for
      their illuminating guidance and their encouragement to
      pursue the work I am doing now. At Yale, I also worked
      with groups like <OutLink
        href="https://ctdatahaven.org/">DataHaven</OutLink
      >
      and <OutLink href="https://www.leapforkids.org"
        >LEAP</OutLink
      >.
    </p>
    <p>
      I am a communist. I am interested in broad questions
      about racial capitalism and our moment in history, and
      I see my research and technical work as part of an
      open-ended project to make sense out of our current
      material conditions so that we can act against racism,
      imperialism, and capitalism. "Acting" nearly always
      means wielding collective power built through mass
      organizing.
    </p>
  </div>
  <div class="section-container">
    <section class="topic">
      <Icons />
    </section>
    {#each Object.entries(info) as section, index}
      <section class="topic">
        <h2>{section[0]}</h2>
        <div class="items">
          {#each section[1] as item}
            {#if item?.link && !item?.info}
              <span class="item">
                <OutLink href={item.link}>
                  {@html item.display}
                </OutLink>
              </span>
            {:else}
              <button
                onclick={() => {
                  if (
                    showing[index]?.display !== item.display
                  ) {
                    showing[index] = item
                  } else {
                    showing[index] = undefined
                  }
                }}
                class="item"
              >
                {@html item.display}
              </button>
            {/if}
          {/each}
        </div>
        {#if showing[index]?.info}
          <ResizingBox content={showing[index]} />
        {/if}
      </section>
    {/each}
    {#if currently}
      <section>
        <h2>currently...</h2>
        <ul class="currently">
          {#if currently.reading}
            <li>
              reading
              {#if currently.reading.url}
                <OutLink href={currently.reading.url}>
                  <em>{currently.reading.title}</em>
                </OutLink>
              {:else}
                <em>{currently.reading.title}</em>
              {/if}
              by {currently.reading.author}
            </li>
          {/if}
          <li>
            listening to
            <OutLink href={currently.listening.link}>
              <em>{currently.listening.title}</em>
            </OutLink>
            by {currently.listening.singer}
            <button onclick={handleAudio}>
              <svg
                class="audio-button"
                class:isPlayingAudio
                class:canPlayAudio
                viewBox="0 0 24 24"
                role="button"
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
            </button>
          </li>
          <li>
            thinking about {currently.thinking}
          </li>
          <em class="update-time">
            This section is updated via automation every few
            days. Last updated on {prettyDate(
              currently.time,
            )}.
          </em>
        </ul>
      </section>
    {/if}
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: space-around;
    overflow-x: hidden;
    margin: 1rem 0;
  }

  .overview {
    max-width: min(65ch, 100%);
  }

  .section-container {
    display: flex;
    flex-direction: column;
    place-items: center;
    align-items: end;
    gap: 2rem;
    max-width: min(40ch, 100%);
  }

  section {
    border-radius: 0.5rem;
    min-width: min(30ch, 100%);
    max-width: 50ch;
    flex: 0;
  }

  h2 {
    font-size: 2rem;
  }

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    place-items: center;
    color: black;
  }

  .item {
    font-size: 1rem;
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
</style>
