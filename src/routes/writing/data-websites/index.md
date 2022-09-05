---
title: Seven performance tips for data viz websites
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
to optimize their visualizations by default.^[In fact, this
post was heavily edited to be more pragmatic -- I originally
commented on serverless functions, caring about your bundle
size, and using Workers or even WASM modules to handle
computation-heavy tasks.] This post is instead for those who
are looking for high-level guides, strategies, and easy
rules of thumb to follow that don't require architectural
changes to websites. And especially for people for whom
"running a server" can be intimidating and overcomplicate
things, because of any of limited expertise, limited hours,
or limited manpower. There are still lots of easy and
responsible ways to get your story out there!

_These tips are organized "chronologically:" from the steps
your (potential) server uses to give data to the actual user
experience. They're also non-authoritative,
non-comprehensive, and brief -- tips to give you food for
thought, with linked resources for further reading._

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

Geographic data is used as an example here for where data
files are simply too large, but there are many other
scenarios when data must be compressed or reworked to reduce
size.

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
code. This includes the
[_server-sent events_ API](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events),
in which a server continually passes discrete "events"
(data) to the client. You can also use the
[WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API),
essentially a more powerful and slightly more complex
version that can pass data back and forth. WebSockets also
supports sending binary data to the client, whereas
server-sent events do not.

However, if you don't run your own server, you can actually
_still stream your data!_ The best way to do so is to save
your data in formats like [`ndjson`](http://ndjson.org) or
CSV, that enable line-by-line reading. Some formats, like
the web-canonical JSON, are hard to conceptualize as a
stream because it is impossible to tell when one piece of
data begins and the next begins. Saving your data to the
newline-delimited JSON, or "ndjson," format or the CSV
format solves this by letting you simply consider one line
as one piece of data. `ndjson` is usually quite an easy
change to make, at least on your data pipeline side -- it's
just like JSON, but you put each record on a new line!

Then, without writing any server code, you can `fetch` the
data and write some relatively simply rules to handle the
response packet-by-packet instead of waiting for all of the
data to load at once. Here's a sketch:

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
For more on the "streams with fetch" pattern, see
[this article by Jake Archibald](https://developer.chrome.com/articles/fetch-streaming-requests/),
or use a utility like
[`can-ndjson-stream`](https://canjs.com/doc/can-ndjson-stream.html)
to wrap this for you (accompanying article
[here](https://davidwalsh.name/streaming-data-fetch-ndjson).

To me, NDJSON- and CSV-formatted streams are the easiest and
most correct solutions to streaming data without a server.
But if this isn't attractive to you for any reason, there's
no problem! You can try out a more general no-server method
in the streaming spirit, which is to simply use incremental
fetch calls. For our initial render, we can simply fetch a
very simplified set of data, and initiate another call once
it is received to fetch another set of data. For example,
let's say we save our dataset into ten "buckets," from
'1.json' to '10.json.' Then we can "stream" them like this:

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
streaming is a single source continually passing over data;
this solution would actually request ten different sources
in ten different fetches. Ten different fetches means ten
times as much time establishing the connection and
performing the TCP handshake. That means that fetching all
of the data can actually take _longer_ than if you were to
simply fetch all at once. This gets worse for users with old
hardware or (very) old browsers, which can limit the amount
of connections at once.^[Okay, I'm exaggerating a bit. The
TCP handshake is reused after the initial connection to the
site nowadays, and the point on parallel connections is also
made better by multiplexed connection support in HTTP 2.0
and beyond, which most static hosting providers (probably
yours) will use by default.] So you should do this
cautiously, if at all.

But you get to load the first bit of data in up to ten times
less time than fetching it would take fetching it all at
once. Best of all, this is _really_ easy to do; much easier
logistically than trying to get your own server (you can
just use a free Netlify or Github Pages plan), and easier
than trying to write custom streamers for the `ndjson` or
CSV file formats. You don't need a single extra library and
the simplest solutions can take less than ten lines of code.
If you're still not convinced, you can still the general
principle of that snippet with you beyond the artificial
divisioning through which I presented it. Example: It makes
a lot of sense to fetch first the shapefiles for counties in
your data map's viewport, perhaps only touching a handful of
files, and then scale up once you have data to show on the
screen.

## Use the browser cache

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
the
[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
API, which has a limit of around 5 to 10 megabytes depending
on what browser you use. If that isn't enough and you don't
mind writing even more (somewhat obtuse) code, you may also
consider the
[`IndexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
route, which can have a much higher storage limit of 500Mb
or higher depending on your browser.

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
  showing what the user has clicked on, to the set of data
  the user has shifted their visualization port to.

  As I stated above, many frameworks that data scientists
  and friends are familiar with -- Django, Flask, Shiny --
  depend on the server generating and sending a response. If
  the user clicks on a new data point, the canonical method
  is to request that additional data from the server and
  send more HTML to the client. Instead of going this route,
  as long as it is possible, I recommend keeping everything
  on the client for these tasks. A network request is
  costly, and interactions like click events on a graph
  should have instantaneous results instead of waiting a
  second or more for a request to be sent and a response be
  received.

## Be verbose about data operations

So far all of those tips have focused on technical problems
and technical solutions. But data-heavy websites aren't only
technically difficult, in the end, and the solutions we
offer can't just rely on code either. So allow me to comment
on design decisions to help your site overcome the "bulky
and slow" perception.

Firstly, _be verbose_. Lots of times in designing websites,
it does well to be terse and concise, communicating through
subtle iconography or simply maintaining an air on mystique.
The word "verbose" even has a connotation of needless
banality, that one is saying more than is needed. But for
data websites, it does well to go straight back against that
advice and simply be as verbose as possible. Users, even
technical users, really have no idea what goes on behind the
curtains when they go to your website, or why on earth it's
taking so long to see a single map. To them, your website is
simply slow.

Being a little verbose can help remedy that: we inform the
user that the website is not actually broken, that if the
user just wait 1.3 seconds longer, they'll see the
healthcare information you were looking for. That things are
happening behind the scenes constantly and steadily so that
the user can see what they need. Simple messages and status
updates, and associated color and iconography changes, can
help.

We can also design a more verbose site through technical
means. This is one huge benefit of streams, and especially
formats like `ndjson` that begin the stream by informing
(through response headers) the client of the total amount of
data that will eventually be sent over the wire. This lets
you add in accurate and specific loading bars instead of
generic spinners, and stagger UI changes depending on what
percent of data has been received.

## Use the canvas

This tip is a lot less conceptual. _Use the canvas_ for
visualization. That's it!

Let's back up for a second to give background information.
Traditionally, most data visualizations on the web use the
DOM, or more specifically the scalable vector graphics (SVG)
data structure which could conveniently be embedded in the
DOM. Libraries like `d3` made this approach popular, and it
is in fact a good strategy for many data visualizations. You
get a lot of things for free this way: zooming doesn't
compromise detail or create fuzzy artifacts, it's easier to
integrate text, accessibility can be delivered for free to
an extent, and you can bring all of your CSS styling and
transitions knowledge to SVG since it's simply another
component in the DOM.

But when you are struggling for performance, and especially
if you are working with animations, SVG transitions will
feel sluggish fairly quickly. If you go to your browser's
developer tools and simulate a device with less
computational power (in other words, any one of your users),
you can feel this strain yourself. If you are in this
position, there is almost a magical silver bullet for you:
_just use the HTML canvas_. In my personal experience, from
things like maps to force networks to plain old scatter
plots, the canvas can easily add a safe 20fps to my sites.

Of course, "magical silver bullet" is a bit of a stretch.
Code using the canvas is often more difficult to read or
write since it does not use any of the traditional DOM APIs
that web developers know. The accessibility benefits of SVG
are lost immediately once you transition.^[This is a bit of
a stretch, since large SVG visualizations lose the "freebie"
accesssilbity hints they gain from being part of the DOM,
and thus are pretty much on par with canvas-based
visualizations.] These two points make an undeniably high
price to transition to canvas code. And you should be most
cautious of all of the fact that _canvas might not solve
your problem_; canvas helps with rendering in a browser, but
if your user becomes impatient while waiting for a model, or
they are staring at a blank page while data loads, or you
simply aren't displaying a lot of data at once, then
rendering is not the issue you need to solve in the first
place. Some diagnostic profiling in the developer tools
panel will help you answer this question to a good degree of
confidence and can help you avoid sinking hours into a
potentially unhelpful change to your codebase.

That being said, canvas is not that difficult to use once
you learn it -- just as many would say for the SVG model of
building data graphics. And you can use the canvas
incrementally, for example containing your most intense
animations only, or holding only your non-interactive
portions that are more easily dealt with in SVG. So give the
canvas a try!

In a few years, I hope I can revise this comment to be _use
the GPU._ There are already some promising libraries and
WASM abstractions to harness the forthcoming Web GPU API.
However, if the Web GPU ecosystem turns out anything like
WebGL, I'll say they're a little too complicated for the
pragmatists this post is aimed at.

## Use requestAnimationFrame()

This last piece of advice is perhaps also the simplest. You,
or the animation library you use, might already be doing
this. And it might not even apply to you if you use CSS
transitions, or rely on `d3`'s
[transition API](https://github.com/d3/d3-transition) for
your animations. But this tip is so simple and effective
that it deserves a mention. Use `requestAnimationFrame`.

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
simply executes code, and queues more code to run as soon as
the browser can do it.^[To be more specific, it queues code
to run **before the next repaint cycle**.] That's all it
does -- it's not even limited to animations alone. But
laying just underneath that simple appearance is an
extremely valuable offering -- a consistent timing API, and
what is effectively asynchronous code.

Asynchronous animations are useful and necessary because
they allow your animation cycles to without interfering with
your site's other functionality, from scroll behavior to
button clicks. You probably hate it when you can't click a
button on a screen for some reason, or when clicking it
doesn't do what it usually does -- that's often because code
that could be asynchronous isn't, and the browser has to
finish that non-asynchronous task before it could respond to
the button press.

You can actually build your own asynchronously-run chains
simply with a bit of `async` or `Promise` syntax. But the
difference between those and `requestAnimationFrame` is that
`requestAnimationFrame` provides standardized, accurate, and
precise timestamps for you to anchor your animations to.
Accurate timing is actually a nontrivial problem, with
`async` code in general, and with `setInterval` and
`setTimeout` in particular; you can even incur drift over
time that makes all of your animations
[inconsistent and delayed](https://blog.bitsrc.io/how-to-get-an-accurate-setinterval-in-javascript-ca7623d1d26a).
`requestAnimationFrame` solves that. Although your modified
code won't exactly run faster, and it's not even truly
"asynchronous"^[It just runs immediately before the next
repaint cycle and thus allows your synchronous code to run
unblocked until then.], it will allow your site to function
without blocking any other functionality and while giving
you accurate timing.

This addition can be as simple as:

```js
function animate(time){
  <lots of complicated logic>
  requestAnimationFrame(animate)
}

animate(0)
```

And there you have it! A simple implementation to conclude
what were hopefully seven simple and pragmatic tips for data
websites.
