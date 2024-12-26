<script lang="ts">
  import Post from '$lib/Post.svelte'
  import type {Post as PostType} from '$lib/utils/types'
  export let data: PostType & {Post: any}
  const Article = data.Post.default
</script>

{#if data}
  <Post {data}>
    <Article />
  </Post>
{/if}
