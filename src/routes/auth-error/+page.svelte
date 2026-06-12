<script lang="ts">
  import {page} from "$app/state"
  import {resolve} from "$app/paths"

  const messages: Record<string, string> = {
    Configuration:
      "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification:
      "That sign-in link has expired or has already been used.",
  }

  let error = $derived(
    page.url.searchParams.get("error") ?? "",
  )
  let message = $derived(
    messages[error] ??
      "Something went wrong while signing in.",
  )
</script>

<svelte:head>
  <title>sign-in error ⋅ Nathan Kim</title>
</svelte:head>

<h2>sign-in error</h2>
<p>{message}</p>
<p>
  <a href={resolve("/guestbook")}>Back to the guestbook</a>
</p>
