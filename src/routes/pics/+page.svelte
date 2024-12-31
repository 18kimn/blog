<script lang="ts">
  import img2 from './personal_images/signal-2024-12-29-175848_002.jpeg'
  import img3 from './personal_images/signal-2024-12-29-175848_003.jpeg'
  import img4 from './personal_images/signal-2024-12-29-175848_004.jpeg'
  import img5 from './personal_images/signal-2024-12-29-175848_005.jpeg'
  import img6 from './personal_images/signal-2024-12-29-175848_006.jpeg'
  import img7 from './personal_images/signal-2024-12-29-175848_007.jpeg'
  import img8 from './personal_images/ai_workshop.jpg'
  import img9 from './personal_images/amsterdam.jpg'
  import img10 from './personal_images/awkward_korean.jpeg'
  import img11 from './personal_images/banpo.jpg'
  import img12 from './personal_images/end_occupation.jpeg'
  import img13 from './personal_images/galaxy_frog_fighting.jpg'
  import img14 from './personal_images/galaxy.jpg'
  import img15 from './personal_images/galaxy_sleeping.jpg'
  import img16 from './personal_images/pierson.jpg'
  import img17 from './personal_images/incheon.jpg'
  import img18 from './personal_images/rio.jpg'
  import img19 from './personal_images/moths.jpg'
  import img20 from './personal_images/pike_place.jpg'
  import img21 from './personal_images/wendys.jpeg'
  import {onMount} from 'svelte'
  import {setupDialog} from '$lib/utils/dialog'

  let width = $state()

  let activeImg: (typeof imgs)[number] = $state({
    caption: '',
    path: '',
  })
  let dialog: HTMLDialogElement = $state()

  const imgs = [
    {
      caption: 'Me drinking coffee, somewhere in boston',
      path: img2,
    },
    {
      caption:
        'I believe this is in Pierson College at Yale',
      path: img3,
    },
    {
      caption:
        "In front of a bookstore in Yunbocho ('Book Town') in Tokyo.",
      path: img4,
    },
    {
      caption:
        'My girlfriend Anne and I near Mt. Fuji in Japan',
      path: img5,
    },
    {
      caption:
        'In my apartment, holding my cat Galaxy. An AATU logo is present on the water bottle, and a poster for GEO in the background.',
      path: img6,
    },
    {
      caption:
        "Also in my apartment -- holding Galaxy (center) and two of my friend's cats, which I was taking care of at the time the picture was taken",
      path: img7,
    },
    {
      caption:
        'Speaking as a workshop hosted by myself and friends, "AI is Not Inevitable", November 2024.',
      path: img8,
    },
    {
      caption:
        'My girlfriend Anne and I, in a canal in Amsterdam. July 2024.',
      path: img9,
    },
    {
      caption:
        'Awkwardly holding a banner that reads "Yoon Suk Yeol must step down", December 2024.',
      path: img10,
    },
    {
      caption:
        'Anne and I at Banpo bridge in Seoul, June 2023',
      path: img11,
    },
    {
      caption:
        'Holding a banner that reads "End the occupation" at a pro-Palestine rally; I believe January 2024.',
      path: img12,
    },
    {
      caption:
        "My cat Galaxy jumping on my friend's cat Frog, who I am taking care of. January 2024",
      path: img13,
    },
    {
      caption: 'My cat Galaxy and myself, February 2024',
      path: img14,
    },
    {
      caption:
        "My cat Galaxy sleeping on my girlfriend Anne's arm. November 2024",
      path: img15,
    },
    {
      caption:
        'A friend and I studying in the common room of Pierson College at Yale. November 2022.',
      path: img16,
    },
    {
      caption:
        'My girlfriend Anne and I in Incheon, Korea. June 2022',
      path: img17,
    },
    {
      caption:
        'Myself and some grads in Rio, June 2024. For the FAccT conference.',
      path: img18,
    },
    {
      caption:
        "Getting tattoos from Michigan Ave Tattoo in Ypsi, August 2024. Three moths, a reference to Marx's Paris Manuscripts of 1844",
      path: img19,
    },
    {
      caption:
        'My girlfriend Anne at Pike Place, Seattle, June 2024',
      path: img20,
    },
    {
      caption: "Late night Wendy's. Sometime in 2024.",
      path: img21,
    },
  ]

  function resizeGridItem(item: HTMLDivElement) {
    const grid = document.querySelector('.image-grid')
    const rowHeight = parseInt(
      getComputedStyle(grid).getPropertyValue(
        'grid-auto-rows',
      ),
    )
    const rowGap = parseInt(
      getComputedStyle(grid).getPropertyValue(
        'grid-row-gap',
      ),
    )
    const rowSpan = Math.ceil(
      (item.querySelector('div').getBoundingClientRect()
        .height +
        rowGap) /
        (rowHeight + rowGap),
    )
    item.style.gridRowEnd = 'span ' + rowSpan
  }

  function resizeGrid() {
    const items = document.querySelectorAll(
      '.image-container',
    )
    items.forEach(resizeGridItem)
  }

  let loaded = $state(false)
  onMount(() => {
    resizeGrid()
    const items: NodeListOf<HTMLDivElement> =
      document.querySelectorAll('.image-container')
    items.forEach((item) => {
      const img = item.querySelector('img')
      const imgCb = () => {
        loaded = true
        resizeGridItem(item)
      }

      if (img.complete) {
        imgCb()
      } else {
        img.onload = imgCb
      }
    })

    setupDialog(dialog, () => {
      activeImg = {caption: '', path: ''}
    })
  })

  $effect(() => {
    width && resizeGrid()
  })
</script>

<div class="page" bind:clientWidth={width}>
  <dialog bind:this={dialog}>
    <img alt={activeImg.caption} src={activeImg.path} />
    <span>
      {activeImg.caption}
    </span>
  </dialog>
  <div class="image-grid">
    {#each imgs as { caption, path }}
      <div
        class="image-container"
        style:opacity={loaded ? 1 : 0}
        style:transition-delay={`${Math.random() * imgs.length * 50}ms`}
      >
        <div>
          <button
            onclick={() => {
              activeImg = {caption, path}
              dialog.style.opacity = '0'
              dialog.style.display = 'flex'
              dialog.showModal()
              dialog.style.opacity = '1'
            }}
          >
            <img alt={caption} src={path} />
          </button>
          <span>
            {caption}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .page {
    overflow: hidden;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(250px, 1fr)
    );
    grid-auto-rows: 20px;
    gap: 2rem;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    place-items: center;
    flex: 1;
    gap: 1rem;
    transition-property: opacity, grid-row-end;
    transition-duration: 400ms;
  }

  .image-container img {
    max-width: min(40ch, 100%);
    height: auto;
  }

  dialog img {
    max-width: min(80vw, 80%);
    height: auto;
    max-height: 80vh;
  }

  dialog {
    display: none;
    opacity: 0;
    transition: all ease-in-out 200ms;
    border: var(--border);
    border-radius: 0.2rem;
    box-shadow: 3px 3px;
    position: fixed;
    top: 0;
    bottom: 0;

    flex-direction: column;
    place-items: center;
    gap: 1rem;
    max-width: 70vw;
  }

  dialog span {
    max-width: 40ch;
  }

  dialog[open] {
    display: flex;
    opacity: 1;
  }
</style>
