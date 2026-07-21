<script lang="ts">
  import {PUBLIC_STAY_IN_TOUCH_KEY} from "$env/static/public"

  type Status = "idle" | "sending" | "done" | "error"

  let name = $state("")
  let email = $state("")
  let address = $state("")
  let website = $state("")
  let status = $state<Status>("idle")
  let message = $state("")

  async function seal(payload: string): Promise<string> {
    const sodium = (await import("libsodium-wrappers"))
      .default
    await sodium.ready
    const key = sodium.from_base64(
      PUBLIC_STAY_IN_TOUCH_KEY,
      sodium.base64_variants.ORIGINAL,
    )
    const sealed = sodium.crypto_box_seal(
      sodium.from_string(payload),
      key,
    )
    return sodium.to_base64(
      sealed,
      sodium.base64_variants.ORIGINAL,
    )
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    if (status === "sending") return
    if (!email.trim()) {
      status = "error"
      message = "email's required."
      return
    }

    status = "sending"
    message = ""
    try {
      const ciphertext = await seal(
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          address: address.trim(),
        }),
      )
      const res = await fetch("/api/stay-in-touch", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({ciphertext, website}),
      })
      if (!res.ok) throw new Error(await res.text())
      status = "done"
    } catch (error) {
      status = "error"
      message =
        error instanceof Error
          ? error.message
          : "Something went wrong — try again?"
    }
  }
</script>

<div class="signup-root">
  {#if status === "done"}
    <p class="thanks">
      thanks! Will email you in uhhh who knows. Probably a
      few months.
    </p>
  {:else}
    <form class="signup" onsubmit={submit}>
      <label>
        <span>Name</span>
        <input bind:value={name} autocomplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          bind:value={email}
          autocomplete="email"
          required
        />
      </label>
      <label>
        <span>Address <em>(optional, for cards)</em></span>
        <textarea
          bind:value={address}
          rows="3"
          autocomplete="street-address"
        ></textarea>
      </label>

      <label class="hp" aria-hidden="true">
        Leave this empty
        <input
          bind:value={website}
          tabindex="-1"
          autocomplete="off"
        />
      </label>

      <div class="row">
        <button
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "encrypting…" : "submit"}
        </button>
        {#if status === "error"}
          <span class="error">{message}</span>
        {/if}
      </div>
    </form>
  {/if}
</div>

<style>
  .signup {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 32rem;
    margin: 1.5rem 0;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  label > span {
    font-size: 0.9rem;
    color: #555;
  }

  label em {
    color: #888;
    font-style: normal;
  }

  input,
  textarea {
    font: inherit;
    padding: 0.5rem 0.6rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
    box-sizing: border-box;
    resize: vertical;
  }

  .hp {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    font: inherit;
    color: #222;
    padding: 0.45rem 1.4rem;
    border: var(--border);
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all ease-in-out 200ms;
  }

  button:hover:not(:disabled) {
    color: var(--color);
    border-color: var(--color);
  }

  button:disabled {
    cursor: default;
    color: #999;
  }

  .error {
    color: #c0392b;
    font-size: 0.9rem;
  }

  .thanks {
    margin: 1.5rem 0;
    color: var(--color);
  }
</style>
