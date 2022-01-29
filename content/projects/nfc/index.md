---
title: 'making things with NFCs'
subtitle: 'to clarify, not NFTs'
date: 2021-10-15
banner: nfc.png
---

Near the beginning of the semester a class I had (Coded Design,
ART750) was talking about locations and embedding data into fairly
low-tech devices. Two examples of these are QR codes and NFCs. They're
both simple devices that can hold a tiny amount of information, like a
piece of text or a link to a website, and can display that information
when asked by a mobile phone.

These are interesting because they are very, very simple and cheap to
produce but can convey a lot of information if used correctly. For
instance, if I placed a QR code at my house, I'd know that anyone who
scans it would be at my house. The QR code doesn't broadcast the
location of the person who scans it, but by just keeping track of what
QR codes are placed in which locations I could keep track of scanners'
locations without asking for permission.

Another scenario: Imagine that at a parking lot, there is a sign
asking you to scan a a QR code to get a website where you can pay for
parking. You pay $15.00, only to exit the garage and to realize that
website was a scam! You actually had to pay at a machine near the
exit, not at some random website.

It's not a big security issue really. You can do this without QR codes
and NFC tags too, by just putting up a poster that has a link to a
website, and so on. But the QR codes and NFC tags kind of act as
vessels to wrap tiny pieces of information inside of a sort of clock
of legitimacy. They make something more credible, aesthetically.

To play with this idea, we were given some NFC tags and asked to make
something. I made a website available at
[https://nfc-homework.glitch.me](https://nfc-homework.glitch.me) that
has two functions: a keyboard and a sort of "lockchain." The keyboard
has five NFC tags taped on it, and each holds just a single letter.
When the user enters the website and holds their (Android) phone to
the keyboard, a sound corresponding to the note plays.

![the keyboard](nfc.png)

The "lockchain" aspect is a bit more complicated. You begin the
lockchain by scanning a NFC tag, then trying to find a corresponding
"lock" (another NFC tag) that this "key" can unlock.

The idea with both of these is that all of their functionality comes
in the interpretive medium, and not really the NFC tags. The NFC tags
are just five white circles with five letters of the alphabet embedded
inside of them. But the interpretive medium can decide what those
letters mean -- if "C" is like the musical note corresponding to "C",
or if "C" is a "key" to the "D" lock, or alternatively the "lock" to
the "G" key.

---

I also helped my friend Yifan Wang with a project on distress signals.
She made a book on the topic of signals for another class, discussing
histories of calling for help. I helped her add NFC tags to the book
itself, so that when users hold a phone to certain pages of the book,
sounds begin playing -- a person dialing in mayday, or the SOS Morse
Code emergency distress signal.

<video width="320" height="240" controls>
  <source src={Video} type="video/mp4" />
</video>

Here again, the NFC tags themselves are very simple, just containing a
string ("mayday", "sweep up", etc). They produce sounds only when the
user is on the website and scans the tag, and the website can then
begin to interpret and produce a response to the signal of the NFC
tag.

[Github repository](https://github.com/18kimn/distress-signals)

[The website](https://distres-signals.org)
