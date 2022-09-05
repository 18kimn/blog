---
title: About this site
subtitle: And my web development values
date: 2022-09-04
---

I seem to be redesigning my website every few months, so in
the full recognition that more change may be coming, this
post will be quite short for the amount of work behind it.
You can view my
[Gitea repository](http://git.nathan-kim.org/18kimn/blog)
for more information and the code.

## Priorities and values

I care most about functionality. If the site does not load,
nothing can be read, nothing can be judged. So I put a lot
of work into optimizing load times, mostly in the choice to
use Svelte and SvelteKit to render routes server-side and
avoid sending unnecessary JavaScript to the client.

I care just as much about readability and accessibility. I
tried to make text large, readable, and stable. Rectangular
and top-to-bottom text is best to me. The animations that do
occur are slow, even down to the fade-in and fade-out of the
audio on the first page.

I care about style, but it's secondary to me to that first
goal of functionality and readability. The font used,
[Lora](https://fonts.google.com/specimen/Lora?query=lora),
reflects this goal, in being sort of a subtle and readable
cousin of Garamond. The gradient in the background is
something I added to make the site look nice, but I tried
hard to keep it from being distracting by reducing the
saturation in the colors.

## Technical

The engine behind this site is Svelte, a JavaScript
framework for making light and fast UIs. But I like Svelte
less for its performance benefits and more because it is
just very, very pleasant to write in. I mostly attribute
this to scoped styles, an enforced rule of
one-component-per-file, easy transitions, and two-way state
bindings.

On top of Svelte, I use SvelteKit, a framework for packaging
Svelte applications. It especially offers a fairly intuitive
filesystem-based router and various methods for configuring
server-side rendering and static site generation.

I don't use any styling or CSS library for this site. Svelte
actually performs a lot of that work through
[scoped styling](https://svelte.dev/docs#component-format-style),
and I prefer not to use Tailwind, Bootstrap, or any styling
solution. It's actually quite fun for me to do frontend
coding, so I don't mind wrestling with CSS minutia, and it
feels better to me to have less dependencies on the client.
The two exceptions here are icons, which for the most part
come from
[Material Icons](https://mui.com/material-ui/material-icons/)
and [Iconify](https://iconify.design), and the rendering of
Svelte-augmented markdown content, which come from
[`mdsvex`](https://mdsvex.com) and underneath that,
[`remark`](https://remark.js.org). Perhaps one day I'll
write my own markdown parser.

## Easter eggs, fun bits, and things I'm proud of

What I meant by "quite fun for me:"

- the "currently" section is automatically updated. It
  interacts with the SQLite database used by Calibre, my
  ebook application, to get my last read book. It queries
  Spotify for the music.
- you get an Atom (or RSS, for the last two) feed at any of
  the following routes:

  - `/atom`
  - `/feed`
  - `/atom.xml`
  - `/index.xml`
  - `/rss`
  - `/rss.xml`

  This was inspired by getting frustrated by having to
  guess-and-check for the correct route on too many websites
  I wanted to follow.

- there is an animation, as well as a fade-in and fade-out
  when played and paused, for the audio element on the home
  page
- on the CV page, you can change the citation style (!),
  enable a "condensed" view format, and change font sizes
- on posts, footnotes and guides travel with the reader as
  they scroll
- as of september 2022, this is deployed on a lonely laptop
  hanging out at my parents' house. You are establishing a
  connection to that home instead of a data center in
  visiting this website
