---
title: 'Documentation: Git as archive'
date: 2022-02-10
---

_This post is the first in a series on documentation. They're
my attempts to navigate one set of junctures between tech tools
and thinking in the humanities._

## Intro

The official and commonly-repeated summary perspective on Git
is that it is a "distributed version control system." That's
absolutely true, but it's also not meaningful unless you have
prior experience with version control, and especially unhelpful
to humanists and non-tech people.

So this post is an attempt to understand Git another way, as a
tool for creating, managing, and sharing historical archives
simultaneously along the events of actual history. Though
normally a tool for managing software projects, I feel that
Git's features enable us to maintain historical archives in
ways traditional tools do not.

## What is Git?

First, a tiny bit on background information on Git, to give the
rest of this post some context.

A project in Git is a single folder, called a **repository**,
which can have as many subfolders inside of it as wanted. A
project develops or grows with more content added or deleted in
files, and when a sufficient amount of changes to a Git project
have been made to form a cohesive logical unit, the project
manager should **commit** these changes with a message. This
stores the changes you've made into timestamped, annotated,
discrete steps.^[Under the hood, Git saves only the changes
you've made between each commit, not the contents of the entire
project (which can often be thousands of times greater). With
this approach, Git can be an extremely compact way of storing
all states of a project.]

A project can contain many different concurrent versions
through Git's **branches**, which can be split and merged with
other branches in many different ways. A branch is born by a
splitting another branch, and begins with the exact same
history as that origin branch. Committing to the new branch
makes that branch diverge from its origin and embark on a new
history. The origin branch and the new branch can be switched
back to with ease, allowing you to work a bit on a new version
but switch back to the main version with no loss to the changes
you've made.

Projects managed through Git can be shared with others through
a platform like Github or Gitlab. Other people can download the
copy of the project and its history by **cloning** it. Because
of this pattern of having all collaborators keep a
comprehensive copy of a project's history, Git is known as a
_distributed_ system.^[In other words, by its original design,
Git has no single source of truth. One does emerge by the
common pattern of having a single place to host the files like
Github or Gitlab]. Once collaborators make changes, they can
commit directly to the repository, or submit **pull or merge
requests** on Github or Gitlab that others can review and then
merge.

The last thing I'll say in this section is that Git is
incredibly popular. Some 90% of the world's software engineers
say that it's their version control system of choice^[Though
others exist, like Subversion, Bitkeeper (which Git was
designed to replace), and Concurrent Versions System, Git is by
far the most popular], and it's pretty much a requirement to
know your way around it if you are a programmer.

That's about all of the Git knowledge this post requires, but
more can definitely be read through thousands of other sources
online --
[the Gitlab guide to Git](https://docs.gitlab.com/ee/topics/git/)
and the official [Git book](https://git-scm.com/book/en/v2) are
great options.

## Curated histories

The essential feature that makes Git a useful tool for archival
creation is its concept of a commit.

There are lots of software out there that people are more
familiar with, that keep track of previous versions of files
and allow you to roll back to them. Google Drive, Dropbox, Box,
-- really any enterprise tool for file storage can do this. The
difference between these tools and Git is threefold:

1. Git forces you to pick a finite number of points that can be
   returned to, rather than simply keeping track of every
   possible previous point in time
2. Git forces you to annotate these points with specific
   messages
3. Git forces you to take snapshots of the entire project's
   state, rather than any specific file

To someone who is just looking for backups, these are
limitations, because it requires you to do extra work and
creates a discrete number of states instead of noting every
single file change comprehensively. But to a historian or an
archivist, these are features. Git forces you to give extra
meaning to your changes, by selectively marking events to
record, by annotating these changes, by recording information
not about a change to a single file but synthesizing
information about many changes about the project as a whole.

Meaning is theoretically lost, because you may make many
changes to a file that are lost if you erase them without
attaching them to a commit. But meaning is gained through all
of the above strategies. That's the essential task of a
historian: to take the infinite amount of events that have
happened in the past and record them in a way that is useful
and meaningful.

## Multiplicitous histories

The other defining nature of Git, especially in contrast to
other version-control systems, is its inherently distributed
nature. In a few different ways elaborated below, this
distributed system encourages a perspective on history that
allows many histories to exist at once -- what I see as
mulitplicitous histories.

The first and most general aspect comes from its concept of
branches. A Git project with branches means that it has several
concurrent histories of the same project. Traditional archives
don't provide a method or format to keep track of these
parallel strands of events as different versions of a
historical process. That role is often left to the realm of
archival perusal, not archival creation.^[This isn't to say
that the creation of different strands of history by the
archivist is necessarily a good thing. What constitutes a
strand of history anyhow, that they can be so cleanly separate
into different things by Git? This question is fairly easy for
software projects, but unanswerable for history at large.]

The second aspect of its distributed nature comes from the use
of Git across different machines, none of which Git privileges
over another. When building a software project, many people
could have different ideas for a new feature, and develop them
independently across their own laptops. There is no single
source of truth that Git might privilege by letting only one
branch overwrite another branch's idea.

There is still a hierarchy of knowledge in Git projects, as all
events are incorporated into the structure of the Git index.
Other events that are part of the creative process are often
not logged to this index -- meeting notes, journal entries,
good conversations with friends might all help push forth a
project, but none of them are incorporated into Git's history.
Even with this hierarchy, Git encourages copying, dispersal of
the information it holds with no sense of one "authoritative"
copy against other modifications. On the other hand, while
there are many archives that could be created of a single
historical event or topic, traditional archives encourage no
such distribution of a piece of knowledge. There are many map
collections in the world, but the Yale Map Collection (or any
other single archive) does not allow researchers to clone the
archive into their own version that has all the legitimacy of
the original in the way that Git encourage.

## On documentation, and doing history

So far I've talked a bit abstractly and interchangeably used
the words "repository," "history," and "archive." This can be a
bit confusing, given history's events and history's explanation
or recording might be thought of as two separate things. Is Git
a tool for historians, or for the actors of history? Is Git for
the creation of an archive, or for the creation of history?

The pragmatic answer Git gives (and any historian would scream
out) is that these are sort of ill-formed questions, since the
two sides of actor and historian aren't separate things. The
actor of history necessarily records and gives meaning to
history's events, just the same as the historian does. In a
broader sense, both are obviously the curators of knowledge,
and as much as there might be some logistical or circumstantial
distinction between the two groups, the archive created has
been

This is to me the largest difference between Git and
traditional archives; Git recognizes that these two parties are
in fact one and the same, whereas traditional archives by
structure do not. From the outset, Git forces the actor or
subject of history to index and give meaning to events, or in
other words peform the duty of a historian. Indexing and giving
meaning to archives happens no matter the format; Git is unique
in encoding that into its structure and format of the archive.

The sort of elephant in the room with using Git as an archive
is that it it's very limited in scope, recording only the
events of discrete file changes. It's hard to record even the
meeting you had yesterday or the conference you attended and
the insights you gained; you can only record the files you
create after-the-fact. Forcing the roles of actor of history
and archivist into one is also not just not useful in most
cases: most historian's day jobs are studying the past, not
recording and making meaning of the present,^[While
acknowledging that the past and present are also not separable,
in reality most historians seem to be discussing the past in
their day jobs.] and even when they are discussing the present,
they are often reflecting on other's actions from a distance,
not consciously serving as an actor of history.

So I'm not advocating for Git as an archive in the sense that
we should use it for most the things we use archives for. It
just offers no benefit to store pictures from some event last
year using Git compared to any other file format storage. Git
is only useful as an archive when the process of archival
creation is itself an interesting subject of history.

## An example: my thesis

For me, a useful area where I've been using Git in this way has
been in writing my thesis. I'm writing about the IMF and the
Asian Financial Crisis, and as often the case for the
dressed-up projects like a senior thesis, I've had to present
it in a few places, alter the format several times, and develop
a coherent body of knowledge from scratch.

Git has been useful mostly in a practical sense, as a project
management system. I can workshop an idea a few different times
across different branches, ultimately picking the version that
speaks to me most. I also use branches for project
presentations, making a slideshow once and modifying it a few
times as needed for different events.

But I'd like to look back and reflect on my growth, since this
is sort of my first big self-guided intellectual project. What
was I thinking last month? How did things change from when I
hurriedly submitted a project proposal at the beginning of the
year? When did I write most, and when did I take a three-month
break? These questions refer to a history too; maybe not as
consequential as the Asian Financial Crisis, but meaningful
nonetheless.
