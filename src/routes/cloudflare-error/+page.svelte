<script>
  import OutLink from "$lib/OutLink.svelte"
</script>

<div class="container">
  <section class="fallback">
    <h2>Temporarily unavailable</h2>
    <p>
      It looks like my personal website isn't working at the
      moment, sorry! It runs on a home server I have -- so
      it's a little finnicky and I don't always have
      physical access (it's not at my house) to it, and that
      means it often accrues problems that can persist for
      several days. I have alerts configured for this kind
      of thing so I hopefully will be able to fix it soon.
    </p>
    <p>
      The page you're viewing right now is being served by a
      Cloudflare Worker that I have configured to
      automatically take over when needed.
    </p>
    <p>
      Here's some information you might have been looking
      for?
    </p>
    <ul>
      <li>
        <OutLink
          href="https://www.si.umich.edu/people/nathan-kim"
        >
          UMSI website profile for me
        </OutLink>
      </li>
      <li>
        <OutLink
          href="https://calendar.app.google/7GC6scMDvFwNwCsG8"
        >
          link to meet with me
        </OutLink>
      </li>
      <li>
        <OutLink
          href="https://drive.google.com/file/d/1FO4nBdJUNPqu2AeUDMnOWE0VN9aJorS_/view?usp=sharing"
        >
          a copy of my CV
        </OutLink>
      </li>
      <li>Contact me: nathanckim18[at]gmail[dot]com</li>
    </ul>
  </section>
</div>

<style>
  .container {
    display: flex;
    place-content: center;
  }

  .fallback {
    max-width: 72ch;
  }
</style>
