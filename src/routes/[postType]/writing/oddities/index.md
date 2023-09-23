---
title: Data oddities
date: 2023-09-09
tags: [technical]
---

This week I've been working with a property dataset because
of work with the Anti-Eviction Mapping Project. I thought to
share a few funny things we've found since we started
working with it.

Context: we are working with data from Regrid, a property
data company that cleans municipal data from across the
country and standardizes it into a cleaner form. Sometimes
that standardization process itself produces weird things,
and sometimes there are oddities left over only because the
standardization could not resolve them.

1. Some properties can be in multiple cities at once -- or
   at least can be listed as such. We noticed this while
   trying to come up with proxy measures for the
   owner-occupied status of a given property; we noticed
   that the owner's mailing address and the property address
   referred to the same property, but would have different
   cities. Weird.
2. Many addresses aren't parcels, many parcels might have
   multiple addresses, multiple buildings might exist on a
   single parcel, a parcel might not have a mailing address,
   a building very often has many mailing addresses (any
   multifamily building), etc. You really can't tell whether
   these issues exist or how prevalent they are, or even
   what your assumptions about these measures are, until you
   make a bunch of boolean variables and then tabulate
   everything, and notice that some gaps you expected to be
   empty aren't actually empty.
3. Condos are such a weird case to consider. They are
   individually traded parcels, but they can also be rented
   out just like multifamily units. Should they be included
   in the category of "multifamily rental units" or
   "single-family residences"? The answer is no in both
   cases.
4. Lots of corporations register under several names but
   have a common mailing address -- a sign we take as
   effectively being one corporate network that owns a set
   of properties under different identities or faces.
   Looking past these facades is a key goal of our current
   project and of our tool
   [_Evictorbook_](https://evictorbook.com). Here are two
   other interesting things about corporations and
   addresses:
   - Corporations, for some reason, often list the parcel
     address for an apartment they own as "Apt 1", as in
     "123 Main Street Apt 1". Our naive initial proxy for
     identifying condos, by looking for which parcels
     (independently bought and traded, so not traditional
     apartment rental units) have an apartment number, can
     be wrong.
5. A surprising number of properties are owned by nonlocal owners. More
   about this in our report!
