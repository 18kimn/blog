<script lang="ts">
  import List from '$lib/List.svelte'
  import Projects from './Projects.svelte'
  import Writing from './Writing.svelte'
  import {page} from '$app/state'

  let {data} = $props()

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
  {@const SvelteComponent = getComponent(
    page.params.postType,
  )}
  <SvelteComponent />
</List>
