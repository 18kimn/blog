---
title: Unix against the world
subtitle: Two perspectives on writing software
date: 2022-02-17
---

## Two perspectives

Here are two perspectives on writing software:

1. A piece of software should be restricted in scope to a
   single function. It should do one thing and do it well.
2. A piece of software should do what the user needs; if
   additional features are wanted, it should implement them.

The first principle is the core of the Unix philosophy. In a
sentence, Unix is a family of operating systems, the design
of which have made their way into the core of macOS, Linux,
and Android machines. Unix developers believe that by
attempting to keep things obscenely simple, even
prioritizing simplicity of implementation over
"correctness," software like Unix can live for a very, very
long time.

The second principle is what has come to represent... almost
everything else. Most software projects will acknowledge
that some things are out of scope and will refuse to
implement them if requested, but the reality is that people
want to do more with a piece of software than its creators
originally intended. Features are often added over time,
expanding a project's scope beyond what its original vision
or function.

These might not necessarily be conflicting if you really,
really tried hard to make them work together. But they're
pretty conflicting. Real projects building software often
demands we choose between these two principles to fit our
current needs.

## Example 1: Marked.js

Consider [marked.js](https://marked.js.org), a JavaScript
engine to render Markdown content into HTML. I use this
nearly every week to translate writer-friendly Markdown into
reader-friendly HTML, but often run into frustrating issues
that the creators are hesitant to implement. How should
marked.js render content like footnotes, which aren't part
of the [CommonMark specification](https://commonmark.org/)
that marked.js implements? How should marked.js handle YAML
metadata, which are used ubiquitously with Markdown
documents despite not being part of the Markdown language?
Should marked.js stick to the Unix philosophy by restricting
its scope to a single set of clearly-defined rules, or
should they try to be pragmatic and follow user requests for
features?

Marked.js has tried to follow the first paradigm somewhat,
adhering to its stated goal of implementing three things:
the CommonMark spec, the original markdown.pl implementation
that preceded it, and the slightly more featureful
Github-flavored Markdown (GFM). Ways to parse YAML metadata
is strictly out of scope. But the CommonMark and GFM have
evolved over time, with GFM even defining a set of rules for
footnotes last year. Now Marked.js is forced to expand in
scope; even as their stated purpose of implementing three
specifications doesn't change, the fact that these three
specifications themselves are changing mean that Marked.js
has to adapt and potentially complicate its codebase with
new features.

## Example 2: Front-end frameworks

The other big example in my mind lies in the architecture of
front-end frameworks. I'll compare Angular and React here,
two of the most popular.

React embodies the first perspective. The library does one
single thing of building a component tree, and requires
developers to take on additional dependencies for any common
task beyond that. Styling, routing, fast refresh and
developer tooling, and even rendering to the DOM itself are
considered out of scope for the core React library, which
does the single job of assembling components. React benefits
from this in being a fairly simple framework.^[or at least
much simpler than it could have been] The narrow scope of
the library means that React has more freedom to drastically
alter its language through features like hooks (with React
17), since it's still just changing one thing instead of
addressing every necessary change across styles,
transitions, server-side rendering, and so on. Finally,
being limited in scope means that those unimplemented
features are left to the React user community, which often
results in a proliferation of different appproaches that let
each project find its own best combination of packages.

Angular embodies the second perspective, serving as more of
a monolith that has many features out-of-the-box. All of the
above features that are missing from React are packed into
the library, and the project even goes as far as pushing
developers to use Typescript, in other words moving even
variable typing into its scope. The first iteration of
Angular (AngularJS) was heavily criticized for this
approach, most notably for having a larger-than-necessary
bundle size but more generally for trying to do too many
things at once and succeeding only partly. With the adoption
of tree-shaking and the more modular structure of Angular to
allow for removal of unused code during production, the
bundle size issue became much less of a problem, but
developers are still left with the conceptual issue of
breadth-against-focus.

React wins here for me, but there's still a pretty big
tradeoff. I get simplicity from the core framework, but in
return every React app I've built always involves additional
decisions, debates, and endless version increments for the
numerous packages I have to install alongside React itself.
The simplicity of the core framework means that the
complexity many modern web apps have is just offloaded to
the framework user.

## TLDR: Simple and complex always come together

The Unix philosophy is a bit of a paradox. By making their
tools supremely simple, limited in scope, and relying on
modularity rather than monolithic gigantic tools,
Unix-inspired tools are mostly successful in providing
consistently high-quality tools. But because these tools are
limited in scope, complexity is relegated to systems that
are built on top of them. Users of these programs often have
to mix and match often dozens of these tools to produce
software with the desired featureset.

Don't get me wrong: the simplicity afforded by the Unix
philosophy to me is invaluable, and I think preferring
modular and simple tools should be a value all developers
hold. Even when complex systems have to be built on top of
supposedly simple tools, the fact that the underlying tools
have been focused and rigidly defined in scope means that
they at least do their single purpose extremely well.

All I hope to share is the observation that all software
requires some compromise between these two perspectives. The
choice to focus a project's scope comes at a cost, often
requiring developers to make pragmatic decisions and choose
a monolith over a module based on their own needs.
Unix-inspired software is undoubtedly "better" in
maintainability and longetivity, but sometimes that's just
not what helps us most.
