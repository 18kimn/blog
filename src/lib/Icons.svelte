<script>
  import OutLink from './OutLink.svelte'
</script>

<div class="contact">
  <span>nathanckim18[at]gmail.com</span>
  <span class="spacer">⋅</span>
  <span>Signal: nathanckim18.49</span>
  <span class="spacer">⋅</span>
  <div class="icons">
    <a
      href="/feed"
      target="_blank"
      aria-label="link to this website's Atom feed"
    >
      <svg
        aria-label="link to this website's Atom feed"
        viewBox="0 0 24 24"
      >
        <circle cx="6.18" cy="17.82" r="2.18" />
        <path
          d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"
        />
      </svg>
    </a>
    <span class="spacer">⋅</span>
    <OutLink
      href="https://bsky.app/profile/nathanckim.bsky.social"
      aria-label="link to Bluesky account"
    >
      <svg
        aria-label="link to Bluesky account"
        viewBox="9.99 9.65 580 510"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
        />
      </svg>
    </OutLink>
    <span class="spacer">⋅</span>
    <OutLink
      href="https://github.com/18kimn"
      aria-label="link to github account"
    >
      <svg
        aria-label="link to github account"
        viewBox="93 97 192 185"
        ><path
          d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
        /></svg
      >
    </OutLink>
    <span class="spacer">⋅</span>
    <OutLink
      aria-label="link to gitlab account"
      href="https://gitlab.com/18kimn"
    >
      <svg
        aria-label="link to gitlab account"
        viewBox="0 0 380 380"
      >
        <g>
          <path
            style="fill: #171321;"
            d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"
          />
        </g>
      </svg>
    </OutLink>
  </div>
</div>

<style>
  .contact {
    display: flex;
    place-items: center;
    place-content: center;
    font-size: 1rem;
    flex-wrap: wrap;
    margin: 0.5rem;
  }

  .icons {
    display: flex;
    place-items: center;
  }

  .icons a {
    margin: 0.5rem 0;
  }

  svg {
    width: 1.5em;
    height: 1.5em;
  }

  .spacer {
    margin: 0 0.3em;
  }
</style>
