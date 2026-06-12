<script lang="ts">
  import {onMount} from "svelte"
  import {setupDialog} from "$lib/utils/dialog"

  let width = $state()

  let activeImg: (typeof imgs)[number] = $state({
    caption: "",
    path: "",
  })
  let dialog: HTMLDialogElement = $state()

  const imgs = [
    {
      caption:
        "Me drinking coffee, somewhere in Boston. November 2022.",
      path: "/personal_images/signal-2024-12-29-175848_002.webp",
    },
    {
      caption:
        "I believe this is in Pierson College at Yale. Probably November 2022",
      path: "/personal_images/signal-2024-12-29-175848_003.webp",
    },
    {
      caption:
        "In front of a bookstore in Jimbocho ('Book Town') in Tokyo.",
      path: "/personal_images/signal-2024-12-29-175848_004.webp",
    },
    {
      caption:
        "My girlfriend Anne and I near Mt. Fuji in Japan",
      path: "/personal_images/signal-2024-12-29-175848_005.webp",
    },
    {
      caption:
        "In my apartment, holding my cat Galaxy. An AATU logo is present on the water bottle, and a poster for GEO in the background.",
      path: "/personal_images/signal-2024-12-29-175848_006.webp",
    },
    {
      caption:
        "Also in my apartment -- holding Galaxy (center) and two of my friend's cats, which I was taking care of at the time the picture was taken",
      path: "/personal_images/signal-2024-12-29-175848_007.webp",
    },
    {
      caption:
        "Speaking at a workshop hosted by myself and friends, \"AI is Not Inevitable\", November 2024.",
      path: "/personal_images/ai_workshop.webp",
    },
    {
      caption:
        "My girlfriend Anne and I, in a canal in Amsterdam. July 2024.",
      path: "/personal_images/amsterdam.webp",
    },
    {
      caption:
        "Awkwardly holding a banner that reads \"Yoon Suk Yeol must step down\", December 2024.",
      path: "/personal_images/awkward_korean.webp",
    },
    {
      caption:
        "Anne and I at Banpo bridge in Seoul, June 2023",
      path: "/personal_images/banpo.webp",
    },
    {
      caption:
        "Holding a banner that reads \"End the occupation\" at a pro-Palestine rally; I believe January 2024.",
      path: "/personal_images/end_occupation.webp",
    },
    {
      caption:
        "My cat Galaxy jumping on my friend's cat Frog, who I was taking care of. January 2024",
      path: "/personal_images/galaxy_frog_fighting.webp",
    },
    {
      caption: "My cat Galaxy and myself, February 2024",
      path: "/personal_images/galaxy.webp",
    },
    {
      caption:
        "My cat Galaxy sleeping on my girlfriend Anne's arm. November 2024",
      path: "/personal_images/galaxy_sleeping.webp",
    },
    {
      caption:
        "A friend and I studying in the common room of Pierson College at Yale. November 2022.",
      path: "/personal_images/pierson.webp",
    },
    {
      caption:
        "My girlfriend Anne and I in Incheon, Korea. June 2022",
      path: "/personal_images/incheon.webp",
    },
    {
      caption:
        "Myself and some friends (other grads) in Rio, June 2024. For the FAccT conference.",
      path: "/personal_images/rio.webp",
    },
    {
      caption:
        "Getting tattoos from Michigan Ave Tattoo in Ypsi, August 2024. Three moths, a reference to Marx's Paris Manuscripts of 1844",
      path: "/personal_images/moths.webp",
    },
    {
      caption:
        "My girlfriend Anne and I at Pike Place, Seattle, June 2024",
      path: "/personal_images/pike_place.webp",
    },
    {
      caption: "Late night Wendy's. Sometime in 2024.",
      path: "/personal_images/wendys.webp",
    },
  ]

  function resizeGridItem(item: HTMLDivElement) {
    const grid = document.querySelector(".image-grid")
    const rowHeight = parseInt(
      getComputedStyle(grid).getPropertyValue(
        "grid-auto-rows",
      ),
    )
    const rowGap = parseInt(
      getComputedStyle(grid).getPropertyValue(
        "grid-row-gap",
      ),
    )
    const rowSpan = Math.ceil(
      (item.querySelector("div").getBoundingClientRect()
        .height +
        rowGap) /
        (rowHeight + rowGap),
    )
    item.style.gridRowEnd = "span " + rowSpan
  }

  function resizeGrid() {
    const items = document.querySelectorAll(
      ".image-container",
    )
    items.forEach(resizeGridItem)
  }

  let loadedStates: boolean[] = $state([])
  onMount(() => {
    resizeGrid()
    const items: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".image-container")
    items.forEach((item, index) => {
      const img = item.querySelector("img")
      const imgCb = () => {
        loadedStates[index] = true
        resizeGridItem(item)
      }

      if (img.complete) {
        imgCb()
      } else {
        img.onload = imgCb
      }
    })

    setupDialog(dialog, () => {
      activeImg = {caption: "", path: ""}
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
    {#each imgs as {caption, path}, index (path)}
      <div
        id={`container-${index}`}
        class="image-container"
        style:visibility={loadedStates[index]
          ? "visible"
          : "hidden"}
        style:opacity={loadedStates[index] ? 1 : 0}
        style:transition-delay={`${Math.random() * imgs.length * 50}ms`}
      >
        <div>
          <button
            onclick={() => {
              activeImg = {caption, path}
              dialog.style.opacity = "0"
              dialog.style.display = "flex"
              dialog.showModal()
              dialog.style.opacity = "1"
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
    gap: 1rem;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    place-items: center;
    flex: 1;
    gap: 1rem;
    transition-property: opacity;
    transition-duration: 400ms;
  }

  .image-container img {
    max-width: min(40ch, 100%);
    height: auto;
  }

  dialog img {
    max-width: 60vw;
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
