---
title: Stay in touch
subtitle: if we know each other IRL
date: July 21, 2026
tags: [personal]
---

I owe far too many people far too many things. I have been
given so much generosity by people from every space I've
been in, so much patience, so much understanding, so much
undeserved time and energy and kindness. I don't think I
will ever be able to really repay that (not that that makes
any sense), but I do want to avoid dropping off of the face
of the earth and taking for granted that kindness. I want to
keep and grow these relationships!

I've unfortunately been notoriously bad at that (keeping and
growing relationships). I am in a period of flux and think I
will be for a while (mid-20s, nature of academic work, etc)
that makes it hard to maintain these long-term
relationships, but it's definitely also my own fault and
being frazzled or mesmerized by what is immediately in front
of me.

So I have set up a email listserv I will write a message to
every six months or so, sending updates on where I am in
life, things I am thinking about, struggling through, what
my goals are, asking questions about where you are, etc. If
you would like to participate, please enter your name,
email, and/or address (for holiday cards and such) below.

A few maybe obvious caveats: obviously I will be checking
this list and will remove anyone who I don't recognize. Also
I will remove anyone I don't want to be sending these
messages to.

<script>
  import SignupForm from "./SignupForm.svelte"
</script>

<SignupForm />

Also, notes on privacy and how this will work on a technical
sense (it is nothing special and it's just submitting an
email, but whatever):

- Overview: This website is self-hosted at a machine I
  built, and your response will be stored encrypted. T
- Clicking "submit" first encrypts these requests app-side
  through a public key. Anyone can see the public key, but
  only I have the private key to decrypt them. Then it sends
  them to the server I have running this
  - Cloudflare is a free service that helps with bot
    prevention, helps with performance if the site is ever
    under load, and covers my IP somewhat from public
    access. It is very useful for me, and it is one of the
    Big Internet Companies that will be evil and do evil
    things as a virtue of its structural position commanding
    much of the Internet ecosystem (see for instance the
    whole
    [Kiwifarms saga](https://arstechnica.com/tech-policy/2022/09/cloudflare-explains-why-kiwi-farms-was-its-most-dangerous-customer-ever/))
  - This basically means that the request is safe from being
    read by Cloudflare, but because Cloudflare is still
    proxying the request (and once Cloudflare gets it, they
    remove basic TLS encryption), they could technically
    overwrite the request content. To me this is fine / not
    a real possibility and easy to respond to
- It then lives on my server in its encrypted form. Nobody
  has a user account on this server but me, but because it's
  at a location I don't frequent very often, there's a
  possibility that someone will have obtained physical
  access and done something. But that has a limited impact
  for this case because the decryption key is stored
  separately.
- I write this to disk. When I want to send a message, I
  decrypt the addresses, and from there I will copy the
  email addresses and send emails from my Proton email
  address
