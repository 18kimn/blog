<script lang="ts">
  import Post from '$lib/Post.svelte'
  export let data
  const Article = data.Post.default
</script>

{#if data}
  <Post {data}>
    <Article />
  </Post>
{/if}
