---
title: leftist-quotes
subtitle: an API for interacting with communist quotes
date: 2021-08-30
banner: preview.png
---

As a celebration for the end of summer (joke), I threw together a super, super simple API to interact with 778 communist/leftist quotes, all from marxists.org.

There are three endpoints:

**/** (the root): returns a random quote

**/daily** : returns a single quote every day, matches with the marxists.org quote-a-day page

**/all-quotes** : returns all quotes.

Quotes are returned as objects in the form:

- body: the text of the quote
- link: the link to a page on marxists.org with the associated reading
- attribution: the name of the author and often the date or title of the original text

The first two routes return a single object, and the last route returns an array of objects.

Source code is hosted at [github.con/18kimn/leftist-quotes](https://www.github.con/18kimn/leftist-quotes)

### notes

This tool was built through express.js, with the data preprocessed through R and the entire site hosted on Heroku. It's incredibly simple, so I just threw everything in the root directory instead of creating src/ or static/ folders and so on.

This is my first API that I've built, which was exciting and definitely a learning experience. Two basic those things I learned:

- backend architecture: how do we set up GET requests? Where does this deploy?
- Web architecture in general: what are DNS requests and forwarding?

The second point was especially confusing and tedious, as I had to reroute https://leftist-quotes.com, www.leftist-quotes.com, and so on all to the same root site.

The other thing I realized while scraping the marxists.org webpage was that the marxists.org website was built in the stone ages. Every single quote was placed inside of a `document.write(<p>...</p>)` statement, and the entire page was essentially a single `switch` statement that was nearly eight hundred clauses long. On one hand, that must have taken a ridiculously long time to make since every quote had to be manually coded and formatted. On the other hand, it's not performant as the page has to load a few megabytes more than it needs and anyone editing it in the future would probably be extremely frustrated.
