<script>
  // for some reason mdsvex hates lang="ts"
  import Post from '$lib/Post.svelte'

  export let title
  export let subtitle
  export let date
</script>

<Post type="/writing" data={{title, subtitle, date}}>
  <slot />
</Post>
