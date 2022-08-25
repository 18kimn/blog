---
title:
  Seven practical performance tips for data viz websites
date: 2022-08-17
---

**The scenario**: you are an academic, journalist, artist,
or other party (not necessarily an engineer) that is
building a site to visualize data you've collected.

**The problem:** You are struggling to put together a snappy
website. Data takes a long time to load, every user
interaction takes a while, and it's confusing to the user
why these things might be. Many problems endemic to web
projects as a whole become compounded when any more than the
smallest dataset is introduced, and that can be frustrating.

**The solutions**, or at least seven of them, will be
uncovered in this post.

And a foreword: This post is not for engineers or for
industry leaders in data viz and web development, that can
spend time iterating on architectures and have the know-how
to optimize their visualizations by default. This post is
instead for those who are looking for practical tips and
easy rules of thumb to follow that don't require
architectural changes to websites. That means people for
whom "running a server" can be intimidating and
overcomplicate things, because of any of limited expertise,
limited hours, or limited manpower. There are still lots of
easy and responsible ways to get your message out there!

_These tips are organized "chronologically:" from the steps
your (potential) server uses to give data to the actual user
experience._

## Slim and reshape your data

This first step should be done even before you touch any
code on the server or UI. It comes down to two main
strategies: eliminating overall size, and shifting
computation to build-time or before rather than executing at
runtime.

You can make your data smaller through strategies both
simple and complex. We can always try to eliminate unused
variables, which is easy enough and has substantial reward.
But there are also some more complex strategies that take
time and expertise to learn about or to execute well. For
example, geographic data in particular can result in large
data files, since encoding each coordinate of complex
boundaries requires simply a lot of coordinates. We can fix
this by "simplifying" our shapes to use a lower resolution,
or we can truncate each coordinate so that they consume a
smaller number of bytes. That means subjective decisions
about what resolution or precision is necessary. We also can
decide to use a compression format for geographic data, like
TopoJSON, or even further with methods like Geographic
Feature Encoding (GFE), Indexed Coordinate Encoding (ICE),
or Topological Arc Encoding (TAE), each of which can help
reduce verbosity and repetition but which must be considered
on a case-by-case basis.

Geographic data is used as an example of where data files
are simply too large, but there are many other scenarios
when data must be compressed or reworked to reduce size.

Secondly, you can shift time-intensive tasks to build-time
and save the results. This helps firstly so that client
requests only cost as much time as it takes to do a disk
read, and secondly so that both the server and client
browser aren't overloaded with extraneous work, potentially
making your site slow and unusable on low-memory devices.

## Stream your data

Even after you slim down your data and make it as small as
possible, your dataset may take a while to download. You can
address this by _streaming your data_, that is, sending data
bit by bit and trying your best to show something to the
user as soon as possible.

In my view, the "best" ways to show this rely on server-side
code. This includes the _server-sent events_ API, in which a
server continually passes discrete "events" (data) to the
client. You can also use the WebSockets API, essentially a
more powerful and slightly more complex version that can
pass data back and forth. WebSockets also supports sending
binary data to the client, whereas server-sent events do
not.

However, if you don't run your own server, you can actually
_still stream your data!_ The best way to do so is to save
your data in formats like `ndjson` or CSV, that enable
line-by-line reading. Some formats, like the web-canonical
JSON, are hard to conceptualize as a stream because it is
impossible to tell when one piece of data begins and the
next begins. Saving your data to the newline-delimited JSON,
or "ndjson," format or the CSV format solves this by letting
you simply consider one line as one piece of data.

Then, without writing any server-side code, you can `fetch`
the data and write some relatively simply rules to handle
the response packet-by-packet instead of waiting for all of
the data to load at once. Here's a sketch:

```js
const data = []
fetch('/my-data.csv')
   .then(response => handleStream(response))

function handleStream(response){
  const reader = response.body.getReader()
  reader.read().then({done, value} => {
    /* additional code to parse the response */
    const newItem = ...
    data.push(newItem)
    updateDataViz()
  })
}

renderDataViz()
```

Now, every time a new piece of data is received, we can
simply use `data.push(...)` to update our dataset, and call
a function to update the UI (here, that's `updateDataViz`).

The other no-server method in the streaming spirit is to
simply use incremental fetch calls. For our initial render,
we can simply fetch a very simplified set of data, and
initiate another call once it is received to fetch another
set of data. For example, let's say we save our dataset into
ten "buckets," from '1.json' to '10.json.' Then we can
"stream" them like this:

```js
const data = []

function getData(datasetNumber) {
  if (datasetNumber > 10) return
  fetch(`/${datasetNumber}.json`)
    .then((res) => res.json())
    .then((newData) => {
      data.push(...newData)
      updateUI()
      getData(datasetNumber + 1)
    })
}

getData(1)
```

This fetches the '1.json' file first, updates the UI, and
initiates the call for '2.json', which in turn fetches,
updates the UI, and initiates the next call.

I'm not going to lie, this is a bit of cheating and an
"incorrect" solution to the problem. It's not "streaming" if
streaming is a single source of data continually passed over
the data; this solution would actually ten different sources
in ten different fetches. Ten different fetches means ten
times as much time establishing the connection and
performing the TCP handshake. That means that fetching all
of the data can actually take _longer_ than if you were to
simply fetch all at once. This gets worse for users with old
hardware or (very) old browsers, which can limit the amount
of connections at once.^[This point is made better by
multiplexed connection support in HTTP 2.0, which most
static hosting providers (probably yours) will use by
default.] So you should do this cautiously, if at all.

But you get to load the first bit of data in up to ten times
less time than fetching it would take fetching it all at
once. Best of all, this is _really_ easy to do; much easier
logistically than trying to get your own server (you can
just use a free Netlify or Github Pages plan), and
technically easier than trying to write custom streamers for
the `ndjson` or CSV file formats. You don't need a single
extra library and the simplest solutions can take less than
ten lintes of code.

## Use the browser cache

(insert links into this section when on wifi)

After spending time coming up with a beautiful (or in some
cases, _extremely not beautiful_) solution to fetch your
data as fast and ergonomically as possible, the next step is
to make sure the code you spent your heart and soul on is
maybe never called again!

We do this by caching our data client-side. The first, and
more canonical, option is to use HTTP headers to tell your
browser to cache the fetched response. Specifically, you'd
want to set a high value for the `max-age` option in the
`Cache-Control`, or writing in the word `immutable` to
indicate that the data cached will never changed. If your
data has changed, you can

The specific ways to set these headers depends on your setup
and hosting provider, so I'd recommend doing (much) more
reading and investigating before going down this route. If
you'd rather not write your own headers, you can also use
the `localStorage` API, which has a limit of around 5 to 10
megabytes depending on what browser you use. If that isn't
enough and you don't mind writing even more (somewhat
obtuse) code, you may also consider the `IndexedDB` route,
which can have a much higher storage limit of 500Mb or
higher depending on your browser.

However, despite caching being a real and valid way to
ensure smooth user performance for your app, it may be worth
it to skip this step altogether. The oft-repeated aphorism
that "there are only two hard things in computer science:
naming things and cache invalidation" is especially
applicable here; it really can be hard to know when to fetch
and when to store. Most cloud hosting providers already
provide sensible defaults for the `Cache-Control` HTTP
header in the first place, and even if you choose to write
only JavaScript code, you still have to learn and work with
these headers that your provider writes onto your
transferred data. If you choose to go the JavaScript route
and don't overwrite any headers, then even outside of cache
invalidation, your codebase can become unreasonably complex
with checks to `localStorage` and the `IndexedDB`
everywhere. Finally, `IndexedDB` in particular has an
infamously difficult and irregular API, which is an
especially unwelcome cost for small teams or those from
non-technical backgrounds.

So, it's important to think critically about whether you
really need a specific caching solution. Perhaps some other
tips provide more bang for your buck -- onwards!

## Balance computational work on the server and client

That title offers more of a principle than a tip. "Balance"
can be hard to achieve or even define in detail; the browser
is really good for some things but putting too much weight
on the browser can result in sluggish app experiences.
Conversely, putting too much weight on the server may result
in long wait times from the user. And of course, depending
on your hosting provider you may be unable to make changes
to your server at all.

But there are still some specific guidelines we can rely on
to avoid overloading either the browser or the server.

- Keep visualization work on the client, not the server

  Some web frameworks^[RShiny, I'm looking at you!] depend
  on the server doing _everything_. For visualization, this
  sometimes means rendering a PNG or JPEG on the server and
  sending that over to the client. To me and likely many
  other web developers, this is an obscene misuse of the web
  and browser, as most browsers are actually pretty good at
  visualization. They do it fast, they can do it accessibly
  (if you cooperate), they can do it interactively, and they
  can do it (more) dynamically than server-based
  visualizations.^[To the credit of many of these frameworks
  there has literally been no other way to get the
  visualization to the client. The `webR` project and the
  recently-presented "Shiny in the browser" conversion
  project attempts to solve this issue using WebAssembly.]

- Keep (most) modeling work on the server, not the client

  The browser is fast, but processes like computing models
  are not ready to be done in the browser alone. They should
  be kept server-side, where they can rely on server-side
  languages like Python (and NumPy) and R (and tidymodels)
  to do things in a more paradigmatic and performant
  fashion.

- (Try to) keep state changes on the client

  A "state change" is a general concept involving any change
  on the UI. It can include anything from a new
  visualization (see the first point^[and in fact I
  originally wrote the first point, keeping visualization
  work on the client, as part of this, but thought it so
  important that I gave it its own space.]), to a display
  showing what the user has clicked on, to the

  As I stated above, many frameworks that data scientists
  and friends are familiar with -- Django, Flask, Shiny --
  depend on the server generating and sending a response. If
  the user clicks on a new data point, the canonical method
  is to request that additional data from the server and
  send more HTML to the client.

  Instead of going this route, as long as it is possible, I
  recommend keeping everything on the client for these
  tasks. A network request is costly, and interactions like
  click events on a graph should have instantaneous results
  instead of waiting a second or more for a request to be
  sent and a response be received.

## Be verbose about data operations

So far all of those tips have focused on technical problems
and technical solutions. But data-heavy websites aren't only
technically difficult, in the end, and the solutions we
offer can't just rely on code either.

## Give parallel content alongside your data fetches

## Use `requestAnimationFrame()`

Okay, I promised I would try to lean more towards

- This is kind of a given and not really a single "trick,"
  as the others are but I'm including it because it's still
  important to think about. Having lots of computing work
  that could happen when a user visits your site means time
  the user spends waiting to see the results. Doing it ahead
  of time means a faster response.
- examples...? This is kind of the same as #2, a bit.
- Eliminate unnecessary variables, simplify your shapes if
  you are working with geographic objects or prepare a
  progressive loading scheme, save to formats like TopoJSON
  to help with compression
- Precompute models (if they are of a finite size)

I feel like the above tips deserve priority, but general web
performance best practices also apply here too. Here are
some:

- Care about your bundle size
- not actually the limiting factor in most of these
- active memory cleanup
- shift work off of the main thread
- your interactions
- honorary mentions
- Canvas vs SVG
- DevTools bottleneck removal iterations
- serverless / lambda functions / Cloudflare Workers
- netlfiy functions, vercel, deno deploy
- Wary of such services as you can quite easily accumulate
  costs and become locked into architecture. Some of these
  platforms I still consider immature or unstable: existing
  services may change so that you may be forced to rewrite
  code, and even if existing services stay the same, new
  APIs and functions are being added at a breakneck pace,
  such that it's easy for your codebase to become "outdated"
  and for additional pressure to "modernize your codebase"
  to pile up.
- But still, websites like these are a prime opportunity to
  use services like these. These kinds of websites mostly
  can be operated as a static site (meaning without a
  designated server), in that they usually don't require
  user-specific content like social media sites would, or
  handle things like e-commerce, or have a seemingly
  infinite store of content like youtube. But there are
  definitely situations where a server would be nice, for
  example handling a modeling task for a user or doing a
  periodic data fetch. For these situations, "serverless"
  architectures may be a great fit, in that they can provide
  a much simpler interface for executing needed functions,
  and don't require either dedicated hardware or too much
  command-line and server architecture knowledge.

```

```
