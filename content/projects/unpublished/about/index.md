---
title: 'About this site'
date: 2021-08-04
banner: preview.png
---

## Motivation

Earlier in 2021, I was interested in data visualization,
especially interactive viz projects for the web. I first
started this in R with the `r2d3` package and deploying this in
the Shiny framework, but I quickly realized this wouldn't be
sustainable. I was working with a subset of resources that made
things clunkier, often leading to frustrating roadblocks and
compromises on things I wanted to make. I could be more
creative and learn more if I worked in JavaScript, since it
handles HTML manipulation and browser rendering almost
natively.

I've learned a lot since then. I'm glad to have had many
opportunities to work on cool projects this year with
organizations I work with and to have had the time to do
projects of my own as well. So this site is sort of a
culmination of all of that -- the actual things I've worked on,
design thinking through the presentation of my website, and
reflections to tie it all together.

## Technical things

This website is built through
[Gatsby](https://www.gatsbyjs.com/), a web development
framework in turn built on the very popular React framework.
Gatsby offers the advantage of server-side static site
rendering, which means that users could experience faster load
times than client-rendered sites, but I just chose it because
it was recommended by the official React team. :)

Animations on this site are created mostly with
[d3.js](https://d3js.org/), with the card transition on the
home page done through
[React Spring](https://react-spring.io/). I initially wanted to
handle most animations in React Spring, as it seemed a "better"
solution in being built specifically for React, but the API was
a little too inflexible for me. I also had a bit more
experience with d3 so I used it after creating the home page
card transition.

Styling and layouts are handled through the
[Material UI](https://material-ui.com/) framework, which is in
turn built on the Material Design system (elaborated a bit
below).

The source code for the website can be found at
[https://github.com/18kimn/blog](https://github.com/18kimn/blog).
The blog is deployed from this link with
[Netlify](https://www.netlify.com/).

## Design things

I know very little about design; I'm learning a bit about both
principles and practical considerations through creating this
website.

In a word, this site is designed around the concept of _paper_.
This combines Material Design's
[concept of Material surfaces](https://material.io/design/environment/surfaces.html##material-environment)
and
[Ethan Schoonover's](https://ethanschoonover.com/solarized/)
idea of contrast in natural light. I tried to bring these
together in this website. I paired white modern-looking
material surfaces with the yellowed background of Schoonover's
Solarized color palette, because both represent paper in
different contexts. For many headings, I use a "light" font
weight of 300 and a low opacity for line strokes on the
background animation to mimic pencils on paper. Also in the
background of the site, blurred circles track the mouse like
watercolor on a canvas.

Trying to use that idea of paper takes me away from both
Material Design and Schoonover a bit. Schoonover's idea of low
contrast to reflect natural light goes too far in my opinion,
because a decent amount of contrast is needed to read easily. I
use his Solarized color palette in many different cases, but I
often look for higher-contrast versions or tweak the palette if
I can. The only surface of this website where text appears is
white, not the classic yellowish hue of Solarized. And Material
Design in general has stricter principles than apply for this
website. For instance, shapes in the Material system are one
component of UI, and Material therefore doesn't recommend a
blur or transparency on shapes because they detract from
functional use. This contrasts with my more liberal use of
shapes in the background animation on the site, where lines are
animated and circles heavily blurred in order to make them
interesting without making them distracting.

I chose this concept mostly because I thought it could be cool,
but I also wanted a design concept that reflects who I am. The
faded background almost has the aesthetic of a historical
document, which is a backdrop to the modern-looking surface on
top. This parallels my interest in history and web development
together.

## Content

This website doesn't have a lot of things right now. I'm okay
at starting projects, not so great at finishing them :') you
can look in the [Projects](/projects) page if you want to see
things I've made so far.
