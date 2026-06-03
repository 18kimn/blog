<script lang="ts">
  import {enhance} from '$app/forms'
  import {prettyDate} from '$lib/utils/string'
  import type {PageData, ActionData} from './$types'

  interface Props {
    data: PageData
    form: ActionData
  }

  let {data, form}: Props = $props()

  let user = $derived(data.session?.user)
</script>

<svelte:head>
  <title>guestbook ⋅ Nathan Kim</title>
</svelte:head>

<h2>guestbook</h2>
<p class="intro">
  Sign in to leave a note and say hi! (Sign-in is necessary
  so I can ban people if needed)
</p>

<div class="account">
  {#if user}
    <span class="who">
      {#if user.image}
        <img class="avatar" src={user.image} alt="" />
      {/if}
      signed in as {user.name ?? user.email}
    </span>
    <form method="POST" action="/signout">
      <button type="submit" class="btn">sign out</button>
    </form>
  {:else}
    <div class="signin-options">
      {#each data.oauthProviders as provider (provider.id)}
        <form method="POST" action="/signin">
          <input
            type="hidden"
            name="providerId"
            value={provider.id}
          />
          <button type="submit" class="btn"
            >sign in with {provider.name}</button
          >
        </form>
      {/each}
      <span class="or">or</span>
      <form
        method="POST"
        action="/signin"
        class="email-form"
      >
        <input
          type="hidden"
          name="providerId"
          value="email"
        />
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <button type="submit" class="btn"
          >email me a link</button
        >
      </form>
    </div>
  {/if}
</div>

{#if user}
  <form
    method="POST"
    action="?/create"
    use:enhance
    class="composer"
  >
    <textarea
      name="body"
      rows="3"
      maxlength={data.maxLength}
      placeholder="Leave a note…"
      required
    ></textarea>
    <div class="composer-footer">
      <label class="identity-toggle">
        <input
          type="checkbox"
          name="showIdentity"
          checked={data.viewerShowIdentity}
        />
        Show my name/email publicly on my posts
      </label>
      {#if form?.error}
        <span class="error">{form.error}</span>
      {/if}
      <button type="submit">post</button>
    </div>
  </form>
{/if}

<ul class="comments">
  {#each data.comments as comment (comment.id)}
    <li class="card">
      <div class="comment-head">
        {#if comment.authorImage}
          <img
            class="avatar"
            src={comment.authorImage}
            alt=""
          />
        {/if}
        <span class="author">{comment.authorName}</span>
        <span class="date"
          >{prettyDate(comment.createdAt)}</span
        >
        {#if comment.canDelete}
          <form
            method="POST"
            action="?/delete"
            use:enhance
            class="delete-form"
          >
            <input
              type="hidden"
              name="id"
              value={comment.id}
            />
            <button
              type="submit"
              class="delete"
              title="delete">×</button
            >
          </form>
        {/if}
      </div>
      <p class="body">{comment.body}</p>
    </li>
  {:else}
    <li class="empty">No notes yet. Be the first.</li>
  {/each}
</ul>

<style>
  .intro {
    color: #555;
    max-width: 40rem;
  }

  .account {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
  }

  .who {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
  }

  .avatar {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .btn {
    font: inherit;
    color: #222;
    padding: 0.4rem 0.9rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    white-space: nowrap;
    transition: all ease-in-out 200ms;
  }

  .btn:hover {
    color: var(--color);
    border-color: var(--color);
  }

  .signin-options {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .or {
    color: #888;
    padding-bottom: 0.5rem;
  }

  .email-form {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .email-form input {
    font: inherit;
    padding: 0.4rem 0.6rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
  }

  .composer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .composer textarea {
    font: inherit;
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
    resize: vertical;
  }

  .composer-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  .identity-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-right: auto;
    color: #555;
    font-size: 0.9rem;
  }

  .composer button {
    font: inherit;
    color: #222;
    padding: 0.4rem 1.2rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all ease-in-out 200ms;
  }

  .composer button:hover {
    color: var(--color);
    border-color: var(--color);
  }

  .error {
    color: #c0392b;
    font-size: 0.9rem;
  }

  .comments {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card {
    border: var(--border);
    background: rgba(255, 255, 255, 0.55);
    padding: 1rem 1.25rem;
  }

  .comment-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .author {
    font-weight: bold;
  }

  .date {
    color: #888;
  }

  .delete-form {
    margin: 0 0 0 auto;
  }

  .delete {
    border: none;
    background: none;
    color: #888;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0 0.25rem;
  }

  .delete:hover {
    color: #c0392b;
  }

  .body {
    margin: 0.4rem 0 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .empty {
    color: #888;
  }
</style>
