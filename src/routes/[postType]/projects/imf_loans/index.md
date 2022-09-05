---
title: 'The IMF and Global Dispossession'
date: 2021-05-16
banner: site-preview.png
---

This post is an explainer to a class project titled _The IMF
and Global Dispossession,_ created for the Fruits of Empire
seminar in Spring 2021, led by Professor Gary Okihiro and
Erich Kessel. See
[here](https://github.com/18kimn/imf_loans/raw/main/text/paper.pdf)
to read a paper that is essentially a long-form explanation
of this same blog post, minus the notes here on learning
code.

<p align="center">
  <iframe title="Website for senior project" src="https://imfdispossession.info" width="90%" height={800}>
  </iframe>
  <br />
  <a href="https://imfdispossession.info"> To view the full visualization, click here.</a>
</p>

Under the stated purpose of ensuring loan repayment and
financial stability, the IMF maintains a policy of
_conditionality_ with **Structural Adjustment Programs
(SAPs)**

My project focuses on specifically the stipulation to move
the country towards the export of manufactured goods. John
Smith contends in _Imperialism in the Twenty-First Century_
that these transformed trade relationships recapitulate old
forms of economic subjugation: where colonizers in the
metropole would extract resources from periphery colonies
that they had formal control over, today the Global North
extracts manufactured goods from the Global South. Laborers
in the Global South produce these goods but are provided
often-inhumane wages, while the value from these goods is
realized in the Global North both as GDP and as corporate
profit.

How do the import-export relationships John Smith discusses
come to be? My project locates one answer in the IMF's
predatory lending practices and policy packages. This turn
not only asks us to consider the international policy
maneuvers creating long-term economic subjugation but also
the racial logic of debt behind them. I wrote about this in
the paper linked above as a form of _racialized accumulation
by dispossession,_ or a part of the violent social processes
privatizing public and indigenous resources to generate
profit. I contend that IMF loans in particular are a
manifestation of debts that cannot be repaid, not because
there will always be outstanding loan amounts but because
SAPs create new dependency relationships from the Global
South to the Global North -- social debts that are meant to
be in place forever. The implementaiton of these permanent
social debts rely on what Denise Ferreira da Silva terms
_analytics of raciality_ that cast some to lack moral and
intellectual attributes necessary to be proper economic
subjects. Debts that cannot be repaid require improper
economic subjects for whom supposedly universal rules do not
apply.

This map displays these relationships by showing loan
recipient countries in red, each recipient’s top five
increased export destinations over the next five years in
blue, and lines connecting these countries to show the flow
of goods from the Global South to Global North. Users can
zoom in with the mouse wheel or by double-clicking, flick or
slowly drag to move the map, and change the year displayed
through the slider at the top of the page.

This project represented a challenge for me. I had
previously worked in d3.js (see a project
[here](https://korean-music-map.info)), but this project
still meant overcoming both technical and academic hurdles
to turn something coherent in:

- **The enter-update-exit paradigm and selection
  paradigms:** I previously wrote that these essential
  paradigms of d3 were what I focused on and tried to grasp
  as I hashed out another visualization project. But even as
  I began making this map, I found myself forgetting the
  order of first selecting, then adding data, then entering,
  then appending elements. My previous project did not
  really heavily on the enter-update-exit paradigm, so this
  wasn't a large concern then, but this project requires
  continual update of selections as the user changes the
  year that the loan was received.
  [This blog post](https://bost.ocks.org/mike/selection/) by
  Mike Bostock helped greatly understand what was actually
  going on and what I had to select at which times. I feel
  much, much more comfortable in these paradigms now that I
  have finished this project.

- **d3.geo and d3.inertia** were two of the completely new
  tools to this project, but tools that I hope to use for
  many tools in the future. d3.geo refers to the set of
  digital cartography tools in d3, which translate
  geographic coordinates to pixels on the screen. Learning
  how to choose the right projection, format my data
  correctly, and create a smooth auto-rotation took a few
  more minutes that I would have liked, but they worked
  eventually. d3.inertia takes these features further by
  allowing the user to drag the globe and adding "inertia"
  when the user releases the mouse, to prevent the globe
  rotation to come to a stop smoothly. This was actually
  quite annoying to work with because the localhost or
  127.0.0.1 server on my computer did not produce a smooth
  drag, but this issue seems fixed now that I have pushed
  everything onto its own website.

- **Jargon, post-Marxist critical theory, and the analytics
  of raciality.** The third "coding" challenge was a
  decoding challenge-- working through literature that was
  much more abstract than I was used to and trying to apply
  it to the data I had. Thank you to Erich Kessel (TF for
  the seminar this project was completed in) for helping
  with readings and understanding new text!

At the very beginning of a project involving unfamiliar
code, I find myself constantly referencing StackOverflow
answers, copy and pasting code that looks useful, and
debugging. As I learn more about how the
code/language/library works, I feel more comfortable writing
the code myself and eventually look to online resources to
fix existing code instead of provide code from scratch. When
I began the map of Korean musicians, I was clueless about d3
and even what the DOM was, and had to look up code for every
single part of the project; now that I have finished this
project, I feel that I've grasped the essential tools of d3
that allow many different projects to be built without
constant use of a reference tool.
