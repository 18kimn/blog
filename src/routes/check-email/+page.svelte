<script lang="ts">
  import {resolve} from "$app/paths"
</script>

<svelte:head>
  <title>check your email ⋅ Nathan Kim</title>
</svelte:head>

<h2>check your email</h2>
<p>
  A sign-in link is on its way. Click the link in that email
  to finish signing in, then head back to the
  <a href={resolve("/guestbook")}>guestbook</a>.
</p>
<p class="hint">
  The link expires in 30 minutes. If it doesn't arrive,
  check your spam folder.
</p>

<style>
  .hint {
    color: #888;
    font-size: 0.9rem;
  }
</style>
