---
title: 'Visualizing my brain'
date: 2022-01-15
---

<iframe src="https://reverent-noether-16414c.netlify.app"></iframe>

## what is this

Try clicking or dragging a circle. An associated document will pop up
in the sidebar. You can move the entire screen by dragging, or zoom in
by scrolling. Also check out the controls in the top left, to adjust
the forces in this document.

Each circle is a document or folder containing documents. They
represent a single thought, or a point where multiple thoughts
converge. Sometimes these are free-form or prose written in markdown;
other times they're more structured thoughts in Typescript/JavaScript
in R that I wrote for a project.

Each line between circles is a connection between these thoughts. A
lot of them are "structural" connections, meaning parent folders
connected to document children. Some of them are conceptual
connections, where I linked to another document while I was writing.

## why is this

Together, these lines and circles are my attempt to make a map of my
brain.

I feel like I've been going insane over the past year. I can't
remember things, I can't speak or think coherently, I always lose my
train of thought.

I started to organize my thoughts into text, trying to pin down things
that were floating around and make them permanent and structured.
Permanent in the sense that I can look back and remember what my brain
alone cannot, structured in the sense that there are unique places for
each thought and a way for them to relate to each other.

Brains are chaotic and incomprehensible; maps by nature try to assign
order to things and make things comprehensible by assigning value to
locations. So this is my map of my brain.

## how is this

This website was made through Svelte, which I think is the ... sort of
sustainable future for web development, on the opposite end of most
web3/crypto tech. The actual graph was made through d3-force, with
help from d3-zoom and d3-drag.

Source code can be viewed on Gitlab
[here](https://gitlab.com/18kimn-personal/notes), and the actual notes
repository can be viewed on Github
[here](https://github.com/18kimn/vault).

## last thoughts

I'm hoping to turn this into a more general tool, e.g. you could point
it at a folder on your computer and it makes this for you. But I'm
kinda tired of working on this now, so I'm not sure.
