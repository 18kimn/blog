---
title: You should use markdown
date: 2022-02-05
subtitle:
  Because it is simple, powerful, and represents a better
  future.
---

## What is markdown?

Markdown is a plaintext writing format created by John
Gruber with help from Aaron Swartz.

A file in "plaintext" format means that the content inside
is just text, with no special algorithms needed to represent
or make it readable. It is just text. Formats that are
plaintext are most files of code, `.txt` files, HTML files,
and many others. Formats that are not plaintext are
Microsoft Word documents, videos, pictures, video games, and
so on -- files that need special encoding and data
structures to represent its content.

In Markdown, formatting is represented by a string of
characters. You can represent italic text with one asterisk
(like `*this*`), and bold text with two (like `**this**`).
In Microsoft Word, there is a fairly complex hierarchy of
XML tags for every conceivable configuration of font sizes,
fonts, portrait and landscape modes, page sizes, and so on.

Here's a quick example. The following markdown content:

```
# About me

Hi, my name is *Nathan Kim*, and I'm interested in
**better tools for a better world**. Read more about me
on my [about page](https://nathan-kim.org/about)
```

Represents text of the form:

> <h1> About me </h1>
>
> Hi, my name is _Nathan Kim_, and I'm interested in
> **better tools for a better world**. Read more about me on
> my [about page](https://nathan-kim.org/about)

## Markdown is simple

That syntax can be intimidating if you've never seen it
before. But I believe Markdown is simple, and I hope I can
convince you of this as well.

For starters, Markdown is purposely designed to have a small
number of rules. The number of rules you have to learn to
write in Markdown is far, far fewer than the number of
actions you have to "learn" to be proficient with the same
tasks in Microsoft Word. The difference is that most of us
have been trained to use point-and-click applications like
Word all of our lives, so much so that the mental work to do
them seems trivial.

More importantly, the nature of being plaintext means that
Markdown bypasses complications intrinsic to file formats
like Microsoft Word. Word Documents are huge in terms of
file size, having an inordinate amount of annotations and
metadata for every possible form of text you inserted. These
complications are hidden away from the users, but they are
nonetheless there. In contrast, Markdown is so simple that
it needs no such curtain to hide behind, and its syntax is
designed to be readable and communicate intent.

## Markdown is powerful

That simplicity means that Markdown is powerful. I can use
Markdown to make slideshows, or to write an academic paper,
or to write a blog post (like this one). Sometimes I can
even use the same Markdown document for all three!

I'm only able to do so because the rules for Markdown are
few and well-defined, so that tools to use Markdown
documents in a particular way are much, much easier to write
than the corresponding task for other file formats.

## Markdown represents a better world

But the above two aspects of Markdown to me are just subsets
of the real benefit of Markdown: it is a more ethical,
sustainable, and democratic way to write.

Markdown is ethical; the simplicity of Markdown means that
those who wish to write in it don't need to depend on any
corporation to use it. You don't have to buy anything or
even install anything to write in Markdown; you can simply
open any text editor and write. You're not beholden to any
gigantic profit-driven corporation by the desire to write.

Markdown is sustainable; that freedom, along with the
simplicity and the well-defined nature of its rules mean
that Markdown can persist for a very long time. If we lost
the internet today, along with every tool used to process
and parse Markdown, we could still open a Markdown document
and read and write. The number of rules is small enough that
we could recreate those parsers in a day, and Markdown
documents are so simple that we can just read without
relying on even any parsers.

Markdown is democratic in that it is transparent to the
user; it needs no abstraction to hide any complex logic
behind, because the logic itself is limited, simple, and
readable. This transparency and the well-defined nature of
its rules empower users to turn Markdown documents into any
flavor they'd like,

Markdown represents the future I'd like to live in. One
driven not by endless desires to build more complex things,
but driven by simple, stable, and free tools.

---

## Caveats

I've tried to discuss the points of Markdown very concisely,
so I skipped most of its details. If you'd like to read
about using Markdown, I'd recommend reading through the
[CommonMark specification](https://commonmark.org),
[these remarks from creator John Gruber](https://daringfireball.net/2004/03/dive_into_markdown),
and [The Markdown Guide](https://www.markdownguide.org).

Those sources can discuss the syntax of Markdown much more
clearly than I can. I do feel that I'm in a place to discuss
a few of Markdown's caveats, though:

### Usability

I've tried to discuss how I feel Markdown is simpler in a
sense than Word, but the truth is that one can still get
frustrated by its syntax because it is not familiar to what
we have already learned throughout our lives. The various
build systems around Markdown all take a bit of time to
learn as well; after we write in Markdown, we might want to
render it to a publishable PDF file, and that takes time to
learn. The creators of Markdown tried hard to make it easy,
but I concede that it can still be difficult, and especially
for those of a non-technical background.

### The fractured nature of Markdown editors

I mostly think that Markdown not being owned by any
particular group is a good thing, because it represents
something useful and beautiful that could be created when
people work together without any profit incentive or
corporate directive. But this has also resulted in many
different "flavors" or Markdown that have their own quirks
and slightly different rendering mechanisms. For instance,
the popular note-taking app [Obsidian](https://obsidian.md)
uses double brackets to represent a link from one file to
another. Most implementations of Markdown don't use that
idea, and one could be confused when switching from Obsidian
to another Markdown editor.

My first response is to say that this fractured-ness is
actually a good thing. Specific apps for specific tasks can
implement their own specific features for Markdown; that
specificity and flexibility is what makes Markdown great. My
second response is that these differences usually aren't
large problems; it takes about two seconds to learn another
rule, and most implementations of Markdown do pretty much
the same thing save for tiny quirks. My third response is to
argue that these differences have been much less
migraine-inducing for me than analogous issues in other file
formats, for instance between Word 2007 and Word 2010,
because of Markdown's general simplicity.

But I'll concede that this is still an issue. Minute
differences are still differences, and it's extra work to
consider each option separately rather than to have one
reliable system simply work the same way each time.
