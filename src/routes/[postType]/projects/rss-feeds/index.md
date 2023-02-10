---
title: a list of RSS and Atom feeds I follow
date: 2023-02-09
---

<script>
  /* We can't pass props to MDSvex components (at least I don't
  think), but you can use context, which is the next best thing*/
  /* Stores work too, but context seems best practices 
  since it doesn't break the component hierarchy
  */
  import {getContext} from 'svelte'
  import {postDataKey} from '../../../../store'
  import {prettyDate} from '$lib/utils/string'
  import Source from '$lib/Source.svelte'

  const {date, sources} = getContext(postDataKey)
</script>

This one's not really a project, I suppose, but I thought it
would be fun to share anyway.

## What are RSS feeds?

**RSS (or Atom) feeds** are webpages published by blogs,
newspapers, magazines, journals, or any other source of
content that simply lists the available content on that
site. They're written in a machine-readable way, and
programs called RSS readers can digest them relatively
easily.

They're a fun way to keep track of various websites I find
interesting. I also feel somewhat of an ethical imperative
to use them; RSS feeds encourage a distributed and diverse
web compared to the Web 2-style of content production, where
massive amounts of content are located on only a few sites.
By virtue of the RSS format being completely open, you're
also not limited to a single reader or way to consume
content -- you can even write your own medium, as I did.

I also feel that publishing a piece of content on your own
website takes considerable more effort than pushing out a
Tweet or Instagram story, so the content ends up being a bit
more long-form and is published less frequently. My
hypothesis is that compared to spending time social media or
traditional news, following RSS feeds results in following a
fewer number of content publishers and consuming a much
lower amount of content overall, but each piece of content
requires a bit more deliberation and slow reading.

## My own collection

This list is dynamically generated and changes with my RSS
reader's list of sources. It was last updated on
{prettyDate(date)}.

Click any source to expand it and see more details.

Most of my sources are from tech sites; that's just who I
feel is the type to publish blogs with RSS feeds these
days.^[Yes, I follow Hacker News. Yes, it can be quite
cancerous at times.] In more recent months, I have found a
few left-y writers who publish on Substack, which provides
RSS feeds. Some of my favorite sites here are
[naked capitalism](https://www.nakedcapitalism.com/about),
[Origins of Our Time](https://ourtime.substack.com),
[web 3 is going just great](https://web3isgoinggreat.com),
and [Yihui Xie's blog](https://yihui.org/en/). The first
three links write about economics from a critical
mostly-leftist perspective; Yihui Xie's blog was the first
blog I really remember reading and definitely full of gems.
I'm happy to hear of suggestions or more links.

If any titles or descriptions appear to have an awkward
wording, that's because these were scraped from each RSS
Feed's `title` and `description` (or `subtitle`) properties
without only minor modification on my part. In some cases
the authors appear to have accepted the defaults given by
their hosting platform (e.g. Wordpress or Squarespace).
Please excuse the haphazard nature of all of this.

<ol>
  {#each sources as source}
    <li>
      <Source {source} />
    </li>
  {/each}
</ol>

If you're still here, here's a tip for any Svelte writers. I
knew when I set out to write this post that I wanted to have
the list of sites above be loaded dynamically, because I did
not want to hard code each site's information, I wanted the
list to update whenever my RSS reader changed its list of
sources, and I wanted a bit of interactivity in the list. I
also knew that I wanted to load the list of sources
server-side and avoid a client-side fetch request. But to do
so using the traditional SvelteKit `+page.server.ts`
methods, I need to pass a prop to this blog post, which
MDSvex (the most popular way of rendering Svelte-enabled
Markdown) doesn't allow -- MDSvex, I believe, doesn't allow
props at all in posts.

So my solution was to have the layout component for my posts
handle the data fetch and have the post retrieve it
[Svelte Context API](https://svelte.dev/tutorial/context-api).
This strategy also has the benefit of providing a mechanism
for any other post to retrieve JSON data, with no additional
changes to the layout component, but handle it in its own
way. Another way to do this would have been to use Svelte
stores, but the Context API allows the data to remain within
the component tree.
