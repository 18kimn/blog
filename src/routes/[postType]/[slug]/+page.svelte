<script lang="ts">
  import Post from '$lib/Post.svelte'
  import type {Post as PostType} from '$lib/utils/types'
  interface Props {
    data: PostType & {Post: any}
  }

  let {data}: Props = $props()
  const Article = data.Post.default
</script>

{#if data}
  <Post {data}>
    <Article />
  </Post>
{/if}
