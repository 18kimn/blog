<script lang="ts">
  import type {Entry} from './Entry.svelte'

  interface Props {
    updateFilteredEntries: (entries: Entry[]) => Entry[];
    entries: Entry[];
  }

  let { updateFilteredEntries, entries }: Props = $props();
  let option = $state('')
  console.log(entries.length)

  let term = $state('')
  /* search */
  let searchedEntries = $derived(entries.filter((entry) => {
      if (term === '') {
        return true
      }
      const creators = entry.creators
        .map((creator) => {
          return `${creator.firstName} ${creator.lastName}`
        })
        .join(' ')
      const str =
        `${creators} ${entry.title} ${entry.date} ${entry.subtitle}`.toLowerCase()

      return str.match(term.toLowerCase())
    })
  );

  $effect(() => {
    const sortedEntries = option === '' ? searchedEntries : searchedEntries.sort((a, b) => {
        switch (option) {
          case 'publication_date':
            return (
              Number(new Date(a.date)) -
              Number(new Date(b.date))
            )
          case 'author':
            return a.creators[0].firstName.localeCompare(
              b.creators[0].firstName,
            )
          case 'title':
            return a.title.localeCompare(b.title)
        }
      })
    updateFilteredEntries(sortedEntries)
  })
</script>

<div class="controls">
  <div>
    <label for="options">Sort by: </label>
    <select name="options" id="options" bind:value={option}>
      <option value="author">Author</option>
      <option value="title">Title</option>
      <option value="publication_date"
        >Publication date</option
      >
    </select>
  </div>
  <div>
    Search for:
    <input bind:value={term} />
  </div>
</div>

<style>
  .controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  input,
  select,
  option {
    font-family: var(--font);
  }
</style>
