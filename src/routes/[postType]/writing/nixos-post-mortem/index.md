---
title: 'NixOS: A personal post-mortem'
date: 2023-03-16
tags: [technical]
---

## Introduction

Until recently, I used an operating system called NixOS.
NixOS promises reproducibility, advanced dependency
management, and the ability to capture and roll back to any
state of the system, all facilitated by its programming
language Nix.

But using it for six months was a horrible experience, and I
have enough feelings about it that I want to document what
went wrong, the more general causes of the issues I faced,
and how I addressed these issues. I call this a
"post-mortem" because the intent is similar to post-mortems
issued after security advisories in the tech corporate
world. I want to be clear that this is a discussion of a
personal issue first and foremost, and despite the issues
that NixOS has at large I do see ways in which it could be
truly useful and ergonomic for many people. I'm simply not
one of those people.

## The system

NixOS is a bit of a unique take on the Linux operating
system. Most Linux distributions ("distros") use a
centralized store of apps and libraries, and calculate a
dependency graph to understand which tool needs another.
These are all managed through one-line commands, like
`apt-get install rstudio` for Ubuntu or Debian or
`pacman -S rstudio` for Arch.

In contrast, NixOS highly discourages the use of these kinds
of commands, instead recommending that you edit either the
file `/etc/nixos/configuration.nix` or files in the
`~/.config/nixpkgs` directory. And unlike configuration
files in most other distros that have a discrete number of
options and possibilities, the files NixOS draws from are
written in the Nix programming language. By insisting on
this kind of programmatic configuration, augmented by
strategies like the storage of packages by their hashes^[A
"hash" essentially means assigning an ID to a piece of
content based on its identity. Different pieces of content
can almost always be expected to have different hashes, so
hashes are often used as a content identity verification
tool.] and the functional programming paradigm Nix adheres
to, NixOS promises the ability to reproduce a package or
system configuration anywhere.

In addition to all of its promised practical benefits, the
emphasis on the infrastructure of the computer as a
programming environment in and of itself is a very
attractive aesthetic approach to how we use computers. It
invites an expansive imagination of the computer as an area
to tinker with, that in turn can contain uniquely configured
environments inside of it, unified through a single coherent
logic inscribed through the Nix language. No longer are the
per-package configuration files used in nearly every other
distro, each with their own syntax and unique placement; now
you have the `home-manager` tools that unifies these
different tools into a discrete number of files, with a
single logic, in a single place.

I fell for it. I read blog posts from
[Wesley Aptekar-Cassels](https://blog.wesleyac.com/posts/the-curse-of-nixos#fn1),
[Will Hatch](http://www.willghatch.net/blog/2020/06/27/nixos-the-good-the-bad-and-the-ugly/),
[Solène Rapenne](https://dataswamp.org/~solene/2021-01-22-nixos-personal-review.html),
and
[Xe Iaso](https://xeiaso.net/blog/nixos-desktop-flow-2020-04-25),
and too much Hacker News hype that convinced me to try it
out. The nature of the hype and some of the developers
promoting it positioned NixOS as a radically different and
almost subversive system, with a set of aesthetics rebelling
against the dominant way of doing things. I now think this
perspective I unknowingly held is nonsense, and it took me a
while to realize it.

## The issues

1. **Programming environments**

The largest pain point by far came from attempting to
integrate NixOS into programming projects, and especially
collaborative projects. I cannot force anyone to use NixOS,
and yet the way NixOS works often forces me to use Nix for a
given project in a way that is completely incompatible with
a project I work on. At best, I duplicate the amount of
configuration, and at worst, I am completely unable to work
on a project unless I find a way to break out of the Nix
paradigm. I was especially frustrated by all of this given
most Linux environments are arguably where programming
projects are the easiest to work with.

To give a concrete example, I work as a quantitative
research assistant for a sociology research project. The
project mostly uses R, a programming language that usually
stores all packages on a system in a single folder. Each
package is stored a single time, so there is always only one
version of a package on a given system. This can be
detrimental if you work across multiple projects that assume
you have different versions of packages, exacerbating a
serious reproducibility crisis in the social sciences. The
industry standard for this kind of solution is to use the
[`renv`](https://rstudio.github.io/renv/) package in your
project, which overrides the default package installation
commands in R and stores package alongside the project, and
records their hashes to ensure that those across different
machines can install the same version. This is essentially
what tools like `yarn`, `pnpm` and many other package
managers do for other languages.

But this is basically also what NixOS does with its own
package system, in a way that cannot interface at all with
`renv`. Nix wants you to install libraries for programming
projects straight from Nix itself, instead of from CRAN or
PyPi or anywhere else.^[ This is fairly unique in terms of
Linux distributions. This decision, and similar decisions
like keeping a separate copy of Python packages for
different versions of Python, contribute much to NixOS's
claims that it is the largest package repository in
existence. The size of the package repository is impressive,
but it comes from some 12,000 Haskell packages, 19,307 R
packages, and so on. See more discussion of this framing at
the following link
https://discourse.nixos.org/t/nixpkgs-has-been-the-largest-repository-for-months/10667/12
] `renv` has a recorded set of packages that Nix cannot
parse out-of-the-box, so to use these tools alongside each
other, you would have to record this set of packages
twice.^[Someone has suggested an `renv2nix` project to
convert between the two, but it does not exist yet. See
https://discourse.nixos.org/t/r-packages-the-renv-library-manager/5881/2
] I wanted to avoid the nightmare of manually listing each
set of packages in two different locations, one for `renv`
and one for Nix. So I was faced with a dilemma: either
choose the NixOS way and risk alienating collaborators who
know the industry standard, or abandon NixOS and its promise
of complete, integrated, and reproducible system management.
The decision is fairly easy here, as preserving ease of
collaboration for almost anyone is much more valuable than
adherence to an esoteric programming religion. But it still
pained me a bit to have to abandon the NixOS methods, for a
use case that seems extremely typical. Surely there should
be a "Nix way" to handle this.^[There is not.]

The problem continues. `renv` on a NixOS system cannot
install packages, because it searches for system libraries
that are either missing or in locations like `/nix/store/`
that `renv` is unaware of. You may have `gdal` on your
system, but `renv` and R packages like `sf` are ultimately
unaware of it and act as if they cannot find it. This occurs
for R projects in NixOS even for projects where `renv` is
not used, but in these cases you can simply install the
library with the Nix package manager instead of through R,
so it is not as painful. But, as mentioned above, for this
project I chose to use `renv` instead of the Nix package
manager, so I was forced to find a way to expose packages
and libraries correctly.

The solution here was to use NixOS to get out of NixOS --
that is, write a "flake" file for this project in the Nix
language that asks Nix to construct an FHS-compliant
programming environment, through the `buildFHSUserEnv`
command in Nix. This means that file names inside the
environment will appear in standard locations, like
`/usr/share`, instead of `/nix/store`, and C headers for
compiling R libraries can be found in their expected
locations. I bid goodbye to the Nix idea of managing all of
your R dependencies.

So at this point I had a workflow going in which I would add
system libraries like `gdal` and `geos` to the Nix flake
files, rebuild the development environment, and use `renv`
from within the development environment to compile R
packages. This combination of Nix and `renv` felt a lot like
a standard web development project, in which one might have
a `docker-compose.yml` file to set up the environment
alongside a `package-lock.json` file to manage packages at a
more granular level. You might have twice the amount of
configuration you might need with more sane development
tools, but the system still works. But Nix, unlike Docker,
makes a contradictory promise of granular and reproducible
management of all packages while preventing you from
actually using Nix for a given project. There are also an
incredible number of resources online for Docker, and any
pain of using Docker is easily mitigated by the ease of
integration into all of the other services and collaborators
that might be involved in a web development project. Nix
enjoys none of that, in other words making it a wholly
frustrating experience to use for this project.

I spoke about R in this section, where things are
particularly painful, but they really apply to most other
languages as well. In Python, the choice between a Python
package manager and Nix is even more annoying considering
there is already an incompatible jumble of tools in the
Python ecosystem. NodeJS projects often require different
versions of Node that have substantive differences across
versions, but the versions available through NixOS are
incomplete -- there is no NodeJS v17 on the Nix repository
to the best of my knowledge, for example. To install
command-line tools that were built in NodeJS, you
traditionally run the command `npm -g <tool-name>`, but in
NixOS the read-only store makes it impossible to do so. The
Wiki editors
[back up this behavior](https://nixos.wiki/wiki/Node.js#Using_npm_install_-g_fails):

> The store is read-only as it should be. Purity in Nix and
> NixOS makes it right not to allow installation using `-g`.

Which makes sense, but all of the alternatives the Wiki goes
on to discuss involve workarounds that essentially abandon
the Nix method of reproducibily managing your workflows in
the Nix language. In the name of purity invoked in the
spirit of functional programming paradigms, NixOS ultimately
forces you to choose a quite impure approach of mixing and
matching tools in unintended and hacky ways.

In sum, in most programming environments the "NixOS way" is
simply incompatible with existing development workflows and
require you to either make your project much worse or work
hard to find a way out of Nix for the project. Stick with
Nix and be forced to choose between collaboration and Nix,
between duplication and Nix, reproducibility and Nix. Try to
get out of Nix by using language-specific tools and be
unable to becuase of Nix's purity paradigms, clogging up
your project with even more configuration.

2. **Steam continues the `buildFHSUserEnv` issues**

At the heart of the `renv` solution lay a tool called
`buildFHSUserEnv`, which allowed me to create an isolated
development environment, which was within Nix but quite
unlike Nix. It felt hacky and as if I were breaking out of
the Nix paradigm, but it worked.

I suppose that's also why Steam is implemented using
`buildFHSUserEnv` as explained
[here](https://nixos.org/manual/nixpkgs/stable/#sec-steam).
Sometimes applications simply expect things Nix does not
provide, so there is no choice but to create a dedicated
environment for the said application.

However, what is truly annoying about all of this is that I
highly suspect the FHS configuration is incomplete. Games
I've tried to play have mysteriously crashed over and over,
despite trying many different versions of the Proton tool
Steam provides for Linux gaming, and despite changing
various environment variables and graphics drivers. There
are often error messages that certain headers cannot be
found, but it is unclear from reading through online crash
reports whether this is truly the cause of the problems I
have.

Of course, the elephant in the room for this scenario is
that gaming on Linux is already a niche hobby with
incomplete support, so it makes sense from a high level that
gaming on NixOS is even more so a niche hobby with almost
nonexistent support. However, Valve has been providing truly
incredible Linux support through the development of the
Proton tool and reviews of games played on the Steam Deck (a
Linux-based console) are stellar. So it is frustrating to
install a game expecting it to work fine and then have it
crash with either no error message or an incomprehensible
deluge of warning and error messages in the verbose Proton
logs, most of which are just noise. And of course, there is
no way to tell if a game will work in advance, so I spend
money to buy a game only to never be able to play it at all.

In case anyone's wondering, games that worked:

- Persona 5 Royal
- Hades
- Bloons TD 6
- Civilization VI
- Civilization IV

And games that did not work:

- Stray
- Hi-Fi Rush
- To the Moon

3. **Hosts and the internet**

I've been traveling a bit recently, so that means I've been
doing a lot of work in cafes, hotels, train stations, and
airports. Often I have to connect to public Wifi that
requires an online sign-in -- you're probably familiar with
this. What you might not be as familiar with is that these
authentication sites often block you from visiting any
domain at all, and then to access the authentication site on
their own domain you must explicitly link their domain to an
IP address through the `/etc/hosts` file.^[I'm assuming on
Mac and Windows this is taken care of for you somehow and it
is a non-problem.] However, this file is impossible to edit
on NixOS, because it is symlinked to a file in the read-only
`/nix/store` directory. To edit it, you must edit your
system Nix configuration in `/etc/nixos/configuration.nix`
and then rebuild your system, which --get this -- requires a
network connection to complete! So somehow, to connect to
the Internet, you must be able to connect to the Internet.

This obviously isn't just a NixOS problem but a Linux
problem in general, since there theoretically shouldn't be a
need to edit `/etc/hosts` in the first place. It also could
have been more painless if I simply knew a bit more about
networking. But like the issue with programming
environments, it exposes Nix's perverse balance of forcing
you to tinker and preventing you from tinkering at the same
time.

## The roots

The above situations were some of the more specific problems
from my struggles with NixOS, but they stem from some design
decisions that cause thousands of smaller pain points across
all types of situations. NixOS is not only unpleasant to use
for me because of the aforementioned points of aggravation,
but simply because I have to wrestle with it to do
absolutely anything.

The main issue, which many people have commented on, is that
NixOS invented a programming language called Nix to manage
the system, and that language is extremely frustrating. It
is difficult to learn because there are relatively few
guides available online to learn it, a compounding problem
given Nix's general difficulty arguably require more guides
for it than other high-level languages. Some design
decisions make the language aggravatingly
confusing.^[Example: True to the functional programming
form, functions can only take one parameter, and you must
use a sort of nested function pattern to include more. In
practice, you would use the argument set syntax to pass
multiple values to a single (unnested) function, so the
nested function pattern is almost entirely unnecessary. But
then why even promote the nested functions pattern, or
implement the "functions can only take one argument" rule,
save to make the language even more confusing? See more here
https://nixos.org/guides/nix-pills/functions-and-imports.html]
And the language syntactically does not really resemble any
popular high-level language.

The close coupling of the Nix language with the NixOS
operating system holds another set of issues. The language
will never be widespread because it is so domain-specific,
so it is forever crippled with the burden of being esoteric.
Given the domain-specific nature of the language, I would
have though there would have been greater integration
between the language and the system in terms of tooling, but
there is absolutely no autocomplete or type checking in
tools like [`vim-nix`](https://github.com/LnL7/vim-nix).
There is a clear and well-defined answer to what
subproperties belong to a given property in a Nix
expression, but one cannot expect the tooling to list the
available options and yyou must look up the answer on a web
browser every single time.

As a result, despite scores of hours editing and writing
Nix, I still have very little grasp of how the language and
the OS actually works. This isn't just me, I know; Wesley
Aptekar-Cassels has
[written that](https://blog.wesleyac.com/posts/the-curse-of-nixos#fn1):

> The vast majority of people using NixOS do not understand
> the language, and simply copy/paste example
> configurations, which mostly works until you need to do
> something complicated, at which point you're completely
> high and dry. There seem to be a handful of people with a
> deep understanding of the language who do most of the
> infrastructural work, and then a long tail of people with
> no clue what's going on.

Deep sigh. I read their blog post before embarking on my
NixOS adventure, but it rings truer than ever after
struggling for six months.

Perhaps the esoteric nature of the language would have been
worth it if Nix truly offered the full set of features that
it promised, but it really doesn't; see the discussion of
programming environments above. The list of incomplete or
malfunctioning features goes on: a much-discussed feature of
Nix is the ability to install any arbitrary version of a
package, but that is actually not quite true and much harder
than it needs to be, see
[this thread](https://github.com/NixOS/nixpkgs/issues/9682).
Another attractive benefit of Nix's hardline on
reproducibility is the ability to set up many different
machines, which
[Solène Rapenne](https://dataswamp.org/~solene/2022-09-03-managing-a-fleet-of-nixos-part2.html)
has written on and which does seem to work, but in my own
experience this point is effectively moot because NixOS is
such a niche architecture with such limited adoption that I
am unable to actually take advantage of the supposed
reproducibility. I want to set up development environments
reproducibly across different OSes, which Nix cannot do
because its architecture is so unique; I want to share
reproducible workflows with collaborators, which Nix cannot
do because nobody uses Nix; I want to run CI/CD pipelines
reproducibly, which Nix cannot do because of the lack of
support for it among other tooling.

I'm sure some of it isn't endemic to the language or the
system, and is simply its current state. Perhaps over the
next ten years, more documentation will be written, more
guides will be created, and the tooling for the language
will also improve dramatically. Perhaps the hype train will
continue and the community will reach a critical mass, and
at that point perhaps a wealth of contributors will improve
Nix in ways we cannot foressee. Perhaps the language isn't
as much of an issue for other programmers because AI tooling
will autocomplete the way to victory.^[I'm one of those
diehard I-will-never-use-ChatGPT people, personally.] And of
course, perhaps some of it is not an issue with the design
but my own unwillingness to really learn the innards of Nix
and NixOS.

Just to hammer home this point, that everything I am
discussing comes from a deeply personal perspective, I want
to highlight cases where I do think NixOS would be useful.
One example is in a small-to-mid-size tech company, which
must setup and distribute a fleet of similar computers to
its employees, and in which the employees can be trained to
have the same baseline knowledge. Nix will probably shine
here in its reproducibility and the barrier to collaboration
will be considerably lowered by the shared knowledge of how
it works. The company can invest in Nix expertise and have
it pay off in more stable products or research.
[Tweag](https://www.tweag.io) is one such example, and they
have several blog posts about NixOS that are enormously
helpful. There are many other cases in which NixOS would be
a better fit than it was for me: those who love functional
programming, those who have a homelab set up, those who
intend on maintaining a Windows or at least a somewhat
normal Linux distro on an alternate disk partition.

But that doesn't detract at all from the fact that right
now, I personally cannot be bothered to continue blindly
messing with the system.

## The end

So I am turning away from this project of unfulfilled ideals
and almost-beautiful systems, back towards a system that is
profoundly more ugly but ultimately much less frustrating;
that is, Arch Linux. I uninstalled NixOS and reverted to
Arch yesterday, in a mostly painless experience.^[Arch has a
reputation of being difficult to install, but I consider the
reputation to have mostly been constructed for memes. The
official guide does assume you know about `fdisk` and
networking and some other details, and like the rest of the
ArchWiki is a bit of a gatekeeper to new Linux users, but
most other guides on the internet explain these concepts as
they go along. And if you have some experience with the
Linux world these are concepts you are probably already
familiar with.] By far the longest period of time in the
whole process of setting up my system was simply copying
files from external storage back to my laptop; there was no
need to test and recompile, wrestle with a programming
language, or convert all of my development environments to a
specific form. One-liners issued from my terminal may not
feel right to everyone, but they feel right to me.
