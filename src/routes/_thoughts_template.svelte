<script>
  // for some reason mdsvex hates lang="ts"
  import Post from '$lib/Post.svelte'

  export let created
  export let modified
  export let title
  export let tags
</script>

<Post
  type="/projects"
  data={{title, date: created, modified, tags}}
>
  <slot />
</Post>
