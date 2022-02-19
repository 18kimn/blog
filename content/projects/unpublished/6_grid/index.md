---
title: 'Grid map of the Japanese cadastral survey'
date: 2021-01-10
banner: assembled_stanford.png
---

This past winter break, I made a few maps inspired by the
[30 day map challenge](https://github.com/tjukanovt/30DayMapChallenge).
This is one of them, responding to the prompt of "grid." The
maps in response to the challenge aren't too polished or
meaningful, but they were a fun chance to quickly create things
and try to learn some new technical skills.

I actually had to take quite a few days to make this following
graphic after trying several data sources and assembly methods.
My incomplete response for the prompt of "grid" is a collage of
Japanese land survey maps of Korea published in 1910. In brief,
the land survey was one of the first projects Japan undertook
after it colonized Korea in 1910, documenting every single plot
of land in Korea with its value, area, and ownership. The
survey was the first unified documentation of land ownership
covering all of Korea, and was important to Japan for
appropriating land from Korean peasantry as well as
systematically collecting land taxes and rent. The land survey
was also important in broader terms past economic use; it
formed an epistemplogical "backbone" against which further
development of all kinds was created, not just economic but
also cultural and political. The creation of some 800,000 maps
as part of the survey formed a corpus for building development,
sewer systems, parks and recreation centers, religious
institutiohns, and other structures that were led by the
Japanese Governor-General of Korea. These structures were
essential for the Japanese project of assmilating Koreans and
eliciting cultural consent, which were especially important
goals after the March First Movement for Korean independence of
1919, and labor strikes that occurred in the later years of
colonial rule.

![](./assembled_stanford.png)

This map is a "grid" in two ways. Most obviously it's a grid in
that the picture is made of several rectangular panels
(sixty-three in total). Although the Japanese land survey
published a huge number of maps that are still preserved by the
National Archives of Korea, I had a really tough time accessing
these records as I wasn't a Korean citizen and the digitization
of these maps was often low-quality. Publicly accessible maps
like these are often shown on a case-by-case basis or one or
two at a time instead of as a large catalog of searchable
items, which is interesting considering one of the hallmarks of
the survey was its almost overwhelming consistency and
adherence to methods that make them perfectly suited for items
in an API-esque query system. The tiles above all came from the
[Stanford University Library](https://searchworks.stanford.edu/view/jr172wm5846),
which is the most well-documented source for these maps that I
could find. I was able to dig through the website code a bit to
find how each map was hosted and in what dimensions, and then
programmatically downloaded, cropped, and assembled these maps
in R to produce the above graphic.

The second "grid" aspect can be seen in how each individual
tile was created. Cartography in Korea before 1900 definitely
has a strong and diverse history, but the history of these maps
is nearly disjoint from the evolution of the "scientific" maps
of the West -- Korean cartographers weren't intent on
scientifically measuring and documenting land with a unified
set of standards, and maps were artistic and cultural products
rather than economic ones.^[This doesn't mean that Korean maps
weren't detailed -- Korean cartographer Kim Chon-Ho produced a
series of *extremely* detailed maps, most notably the
*Territorial map of the Great East* that is still celebrated
today. But the adherence to scientific standards and
specifically geometric accuracy wasn't as present in Korean
cartographey, and thus Korean maps were incredibly diverse in
shape and form.] After Japan began encroaching on the Korean
Peninsula in 1876 and formally annexed the nation in 1910, this
changed -- the cartographic tradition in Korea was quickly
written over by the Land Survey Bureau's maps that all relied
on the longitude-latitude grid. This process took time,
millions of yen, and tens of thousands of workers, but Japan
saw the need to represent Korea in the same coordinate system
as itself in order to bring the colony into the empire. The
grid, however objective it might seem, thus served as a
colonizing force to standardize, unify, assimilate.

For more info:

Gragert, Edwin H. _Landownership under Colonial Rule: Korea's
Japanese Experience, 1900-1935._ University of Hawaii
Press, 1994.

[Wiki article](https://en.wikipedia.org/wiki/Korea_under_Japanese_rule#Japanese_migration_and_land_ownership)

[David Fedman's 2018 article on the subject](https://apjjf.org/2012/10/52/David-A.-Fedman/3876/article.html)
