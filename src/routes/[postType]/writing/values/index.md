---
title: Writing code, writing values
date: 2022-02-17
---

Usually we think of code in pretty dry, limited, functional
terms. I'm writing a piece of code to fetch data from an
API. I'm writing a piece of code to parse an XML string. I'm
writing a piece of code to run a linear model.

I want to offer one more perspective on looking at code more
critically: when we write code, we are writing values. In
the immediate sense, we value the data we obtain, we value
the parsed object we get from XML, we value the results of
the linear model. In the more meaningful sense, we
constantly make choices about what we value as developers,
both in the sense of style and form and in the sense of our
morals as human beings.

I'm writing this blog through the Svelte JavaScript
framework, partly because I value its simplicity and ease of
use ^[previously the blog was written in React; Svelte was
definitely a bit of additional learning that might be
perceived as a complication, but I think Svelte makes up for
it by just being so much simpler]. But I also chose Svelte
for the kinds of features it focused on: being able to load
on any bandwidth, elminating structures like the virtual DOM
so that the framework essentially has no performance
overhead. Svelte views HTML, CSS, and JavaScript -- the
structure, style, and interactive content -- of a website as
an integrated entity and thus provides a developer interface
to work with all three at once. These are values that go
beyond pragmatic functions I want, and into the future I
believe in for a better web.

These values are translated from transient feelings into my
head into more permanent forms -- first as plaintext Svelte
files, then as a minified JavaScript bundle, and then as
structures someone else on the internet can see.^["Minified"
refers to the elimination of whitespace characters and
condensing variable names as tightly as possible. This
reduces the amount of code sent to the user of the website,
hopefully getting the website to load faster.] In other
words, I take the values from my head and I write them as
text; as I write code, I write my values.

Importantly, the values we write aren't always ours. If
you're hired to work on a team that uses Svelte, you may
know nothing about it and the values influencing the
decision to use Svelte might not be yours. But as you go
throughout your job and create Svelte components, you still
encode a set of values -- those values of simplicity, of
small bundle sizes, of integrated aspects of the web. You
put them into action, and give them meaning through the
projects you carry out using Svelte.

Svelte is just an example here. Every piece of software we
use reflects values, sometimes not obvious at first and
sometimes not reflected in any piece of documentation, but
undoubtedly present. Sometimes those values are consciously
ours, and sometimes those values are of the people who wrote
the tool you use or another person who did make the decision
to use these tools. But we as developers put these values
into text as we code, giving them weight and consequence.
