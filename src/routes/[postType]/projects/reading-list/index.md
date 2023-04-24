---
title: "What I'm reading this year"
date: 2023-04-22
---

<script>
  /* We can't pass props to MDSvex components (at least I don't
  think), but you can use context, which is the next best thing*/
  /* Stores work too, but context seems best practices 
  since it doesn't break the component hierarchy
  */
  import {getContext} from 'svelte'
  import {fade} from 'svelte/transition'
  import {postDataKey} from '../../../../store'
  import {prettyDate} from '$lib/utils/string'
  import Entry from './Entry.svelte'
  import Controls from './Controls.svelte'

  const {date, entries} = getContext(postDataKey)
  let filteredEntries = entries
</script>

## context

My learning journey has been a bit haphazard so far, driven
mostly by my momentary interests and the groups and people
around me. As I gear up to attend graduate school and shift
into academic mode, I've decided to steer a bit more
consciously my journey of learning, and especially in terms
of reading practice.

So, three weeks ago I decided to read around one book a week
for the next year. The goals here are to:

1. Form a foundation of knowledge in the terrain of science
   and technology studies, and specifically critical race
   and digital studies.^[I plan to reflect more specifically
   on my academic/intellectual interests in a separate
   post.]
2. To build a habit of reading into my daily life, because I
   feel like it will be useful and necessary in my graduate
   career.
3. To help me build a general strength of focusing for
   sustained periods on difficult topics, a practice that I
   feel is lacking from my current rhythm of life.^[This is
   one reason why I am choosing books for this reading
   journey instead of articles.]

I consider myself to be more free of obligations compared to
any future point in my working life, so I want to take
advantage of this limited amount of time to really learn and
grow. This of course means reading a substantial amount, but
I I want to avoid barreling through these books for the sake
of reading, forgetting things immediately after, or failing
to build a sustainable habit of reading. So that has shaped
my reading plan so far. To start, I know I won't read every
word of every book or to even read every book on this list.
Some books will be longer but (I imagine) very rewarding,
like _Palo Alto_, so I wouldn't mind spending two weeks on
those books. Other books, especially those from media
studies, might require me to struggle a bit more and read
selectively for what is most useful to me. To also help me
reflect and learn, I've been writing a response for each
book, containing a summary of the text and any criticisms I
had.

The process thus far has worked quite well. I spend an hour
a day or so reading, usually before bed, armed with a
highlighter and pen (I recently bought an iPad and plan to
annotate there, but it hasn't arrived yet^[Two notes for a
little more context: Firstly, I ordered an iPad, but the box
it came in was empty! Someone had packed and sent an empty
box, or the iPad was removed in transit! Thankfully, I was
able to work it out with customer support and received
another one at no additional cost. Secondly, mostly for
financial reasons, I plan to pirate these texts (except for
a few that are not published by academic presses), which
requires me to read electronically, and hence the motivation
for buying the iPad.]). Each Saturday, I've been walking
over to [Uncle Bobbie's](https://www.unclebobbies.com), a
local coffee and justice-oriented bookstore which I highly
recommend, ordering a cold brew, and writing up my response
to each book. It's been quite nice.

## what I'm reading

<!-- Hack to force width on below -->
<div>
  <p>
  The reading list is below. Click on an item in the list to
  expand it. Please excuse some typos in the book abstracts;
  they came straight from Google Books (some elaboration
  below).
  </p>
  
    <br />
    <Controls {entries} bind:filteredEntries={filteredEntries} />
    <ol>
      {#each filteredEntries as entry, i}
        <li>
          <Entry {entry} />
        </li>
      {/each}
    </ol>
</div>

## implementation notes

If you're still reading this, I have a few implementation
notes for this whole process that I think might be fun to
share. The summary:

1. I wrote down books in a markdown document during my
   initial brainstorming process
2. I parsed the markdown file into an array, searched for
   each title on Google Books, and sent them to Zotero
3. I used Zotero's web API and SvelteKit's Context API to
   list them on this page

I first assembled this list by writing titles and authors
into a markdown document. I did this simply for convenience;
as I have written elsewhere on this blog, at this point it
is very comfortable for me begin typing thoughts out without
waiting for a web browser or writing application to load.

I then realized I needed a way to keep track of ebooks from
the internet and especially to sync them to my iPad
efficiently, where I would read them. I had previously used
Calibre to manage these books and sent them to my Kindle for
reading, but I honestly find the Kindle a bit clunky for
reading and this workflow means I have to repeat the copying
process for each new book.^[I still think the Kindle is
great, but because turning pages and searching for things is
quite slow, it's most useful for books you would like to
read from cover to cover, rather than books where certain
sections are much more relevant to my interests than others,
and for books that involve flipping back and forth often to
reference different parts of the text. It also isn't as
useful if you'd like to annotate books, as I knew would be
helpful for me for this reading journey.] So I decided to
switch to Zotero for this task, after seeing positive
feedback on Twitter to Zotero's iOS app.

Because I was not enthused by the idea of creating Zotero
entries one by one, as there were around 45 entries, I wrote
a script to parse the markdown document for each book, to
search for them on Google Books, and then to use Zotero's
[connector API](https://www.zotero.org/support/dev/client_coding/http_integration_protocol)
to send these titles to a local Zotero collection. The
script to find titles on Google Books was not exact, because
Google Books was missing certain books or because its search
engine returned unexpected titles for a top result. So some
manual pruning was necessary. The process to add these
titles to Zotero was much smoother, thanks to Zotero's
connector APIs that recognize metadata on Google Books
entries quite easily.

To print this list on my blog, I set up a build hook that
queries Zotero's web API to list all of the books and
provide it as data to this site. I was very happy to see
that Zotero does not require authentication for
public-facing resources on its web API. Because this script
is set up to run at build time, I can fairly easily update
the list shown above if I add or remove books, or if I mark
a book as being finished. The data is provided through the
same mechanism as I used for my post on
[my RSS feeds](/projects/rss-feeds), i.e. through
SvelteKit's Context API and my blog's practice of storing
`data.json` documents alongside each post when needed.

I want to be very clear that these scripts were fairly easy
to write, but they still took up a few hours each to get
working, enough to make this whole process definitely not be
worth it from a time use perspective. I made this mostly
because I think this is fun. Those who engage in this kind
of work are likely familiar with this time-wasting desire --
a few XKCD comics might be relevant, like
[#378, _real programmers_](https://xkcd.com/378/), and
[#1319, _automation_](https://xkcd.com/1319/).
