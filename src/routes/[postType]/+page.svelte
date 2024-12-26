<script lang="ts">
  import List from '$lib/List.svelte'
  import Projects from './Projects.svelte'
  import Writing from './Writing.svelte'
  import {page} from '$app/stores'

  export let data

  function getComponent(type: string) {
    switch (type) {
      case 'projects':
        return Projects
      case 'writing':
        return Writing
    }
  }
</script>

<List items={data.sorted}>
  <svelte:component
    this={getComponent($page.params.postType)}
  />
</List>
