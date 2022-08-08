---
title: About this site
subtitle: And my web development values
date: 2022-02-18
---

My journey in web development began while I was googling an
error related to RMarkdown, and stumbled across
[Yihui Xie's blog](https://yihui.org/). Xie is a cornerstone
of the R community, as the creator of packages like `knitr`,
`Rmarkdown`, `bookdown`, `xaringan`, and many others. A
common theme in his work is in creating ways to use the R
language outside of its original, narrowly described scope
of statistical analysis. One of these has been in
establishing ways to use R and RMarkdown to render documents
for the web, through the `blogdown` package. So my first
iteration began by following his guides, trying to set up a
website that had my interests and my extracurricular
activities.^[I believe this was the summer before I got to
college. Why was I even making a website to publicize
myself? An modicum of humility seems always to be in order
for me.]

My second iteration came after some months of work with the
[Anti-Eviction Mapping Project](https://antievictionmap.com),
a group to which I owe a lot of my current political
orientation and my knowledge in web development. I took my
first steps into using Node.js, React, the Material UI
design library, made my first-ever pull requests, and met
people I now consider my mentors and comrades. This was the
summer after my junior year, by which time I had a few
publications from my work with Professor Emma Zang of Yale
Sociology, a handful of more affiliations with other groups,
and a steadily mounting pressure to be able to find a job.
So that felt like an opportune time to practice and learn
more in web development, and so I rewrote my blog in ReactJS
and specifically the Gatsby framework for static sites.

That site can be seen
[here](https://617ab20f5f8a2b0007cd3ac0--nathankimname.netlify.app).
It's alright, and I was able to do some things I thought
were cool, like putting a map of New Haven in the background
and writing in some animations and transitions. But I became
slightly frustrated with the Gatsby framework, React in
general, and the Material UI styling system. It felt like
too much, like I was trying to fit convoluted APIs that just
felt like too much code for what should have been a simple
task. Some of that complexity appeared to leak out into the
user experience too; some animations fell below 60 frames
per second, and the site could take a few seconds to load on
slow connections. I grew frustrated with this.

So this is the third iteration, built on two principles that
I hope are more sustainable: ownership, and simplicity. I
switched to the Svelte component framework instead of React,
cut down on styling everywhere, relied on Svelte's
integrated styling instead of using React and a CSS-in-JS
library, and worked on optimiziing transitions to be either
strictly CSS transitions or to use the HTML Canvas, and if
that didn't push them to work consistently at 60 frames per
second without layout shifts, to completely delete them.^[I
also switched to using the `requestAnimationFrame` API over
the d3.timer, and from using `d3.select` and other tools to
using either vanilla JavaScript or Svelte functions for
accessing the DOM.] The new version of the site doesn't have
any dependencies, thanks to Svelte's compilation step and
some custom build logic with `marked.js` that make much of
the site logic happen at build time rather than at runtime.
The site is deployed on Netlify, but I've begun work on a
Rust backend so that I can deploy it from a laptop I'm using
as a home server.

I feel that the keys to a better web are in these sorts of
choices. Choosing things that work, and work well, and work
on any bandwidth, over things that are cool and look
beautiful.^[and this is in no way meant to disrespect anyone
that invests in styling for websites; the sites I have in
mind are indeed beautiful] Choosing less dependencies over
additional functionality, and being willing to write your
own logic if it means avoiding being locked into any
particular vendor. Choosing sites with a large sans font
over choices like 8pt Garamond.

These choices aren't universal; different sites require
different choices, and sometimes you may want to invest more
in typography or animation or anything else. But these are
the choices I've made, to fit my use case for this site:
somewhere to display my thoughts and things I've worked on,
that can be easily read and accessed.

The source code is hosted
[here](https://github.com/18kimn/blog). Let me know of
questions and comments!
