---
title: "Hexagons"
date: 2020-01-04
---

For day four ("hexagons"), I made two hexagonal maps of the Connecticut Senate and House Districts. Hexagonal maps let us represent areas equally and contiguously, which is helpful for representing electoral districts that may have disproportionate areas but an equal number of votes in a legislature. Hexagonal maps also provide a more "continuous" picture of space compared to square grid maps, which create straight lines and could exaggerate geographical divisions. 

{{< figure src="house.png" title="Connecticut House of Representatives." >}}

Connecticut has a bit of a unique system in that each Senate District (of which there are 36) and each House District (151) elects just one representative. This lets us assign each district just one name and one color for the associated party, providing a fairly neat map. 

{{< figure src="senate.png" title="Connecticut Senate." >}}

Still, the map was fairly difficult to code. I could have done this in Photoshop or Figma more easily, but I was set on programmatically creating hexagons and assigning existing districts to new shapes in a one-to-one fashion. Though this took a while to figure out, eventually I was able to set up a method to assign an arbitrary set of polygons each to their own new hexagon. I'll clean it up someday and put on Github, along with all of the other source code for this map series. 


