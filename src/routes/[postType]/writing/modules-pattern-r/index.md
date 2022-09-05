---
title: The modules pattern in R
date: 2022-01-10
---

## What are modules?

A module is a file which runs code scoped only to that file,
and "exports" a discrete and consistent number of items for
use in another file. This usually meaning storing all logic
in functions, and then calling those functions from other
files so that the logic inside may be run.

Putting your code into modules allows you to component-ize
your code. Instead of one gigantic block of code, or an
unending `dplyr` sentence, you can divide your code up into
sections, place them in their appropriate files, and
recombine them.

Here's an example of what the pattern could look like in R.
Don't worry too much about the syntax, it'll be explained
later.

```r
library(tidyverse)
scrape_data <- source("scrape_data.R")$value
clean_string_cols <- source("clean_string.R")$value
clean_numeric_cols <- source("clean_numeric.R")$value
run_model <- source("run_model.R")$value

my_model <- scrape_data() %>%
  clean_string_cols() %>%
  clean_numeric_cols() %>%
  run_model()
```

`scrape_data.R`, `clean_string.R`, `clean_numeric.R`, and
`run_model.R` don't run any actual analysis or process data.
Instead, they express _logic_ to run code by defining a
single function. When you import them with `source`, you
assign those functions to functions you can use in an
assembler or index file.

There are two benefits here: readability and
reproducability.

### Readability

Someone reading the index file doesn't have see the minutia
of what's going on; they see the abstractions and conceptual
meaning of the code through the names the writer gave it.
Instead of seeing that R download a web page with `rvest`
and look for long and undecipherable Xpath or CSS tags, they
see `scrape_data`, and sees that R scrapes data. Instead of
seeing that R parse a complicated regular expression to pull
out patterns from strings, they see that R scrapes string
data. And so on.

When the user wants to see what is actually going on, they
can simply open up the imported files and see the logic of
that component. They don't have to look at the web scraping
hen they want to understand the data cleaning. They don't
have to look at the data cleaning if they want to understand
the model. Logic is broken up into chunks, organized into
functions in files and made interpretable through naming.

Perhaps most magical at all, we are now well on our way to
self-documenting code. We don't have to write a comment
saying "this code scrapes data from XYZ, cleans it by doing
ABC, and runs PQR model." The names of our functions
naturally imply this, and in the files defining each
function, comments can similarly be omitted or be made
considerably shorter through this form of expressive code.

Finally, the sort of converse of this process of making code
easier for readers to understand, is that it also forces the
writer to understand their own code. It requires the writer
to take a step back and analyze the logic of their code
instead of focusing on small details, and organize their
code in a way that expresses that logic. Organizing requires
reflecting; reflecting leads to understanding.

### Reproducibility

Firstly, by making your code more readable, you make your
code reproducible. That is fairly intuitive, I don't really
know how to explain it other than that.

But this pattern offers more reproducible code with two
items: scoped environments and pipe-able code. Let's take a
look at a contrived example of how a novice programmer might
write code with and without the tidyverse:

```r
dta <- read.csv("path_to_data.csv")
new_col <- dta$old_col * 2
dta$new_col <- new_col
dta <- dta[new_col > 5]
dta <- dta["new_col"]

# compare this to
library(tidyverse)
dta <- read_csv("path_to_data.csv") %>%
  mutate(new_col = old_col * 2) %>%
  filter(new_col > 5) %>%
  select(new_col)
```

You might notice that there are some readability
improvements that the pipe brings, letting you chain things
together and connecting logic. The pipe is like the word
"and" in English, connecting logical parts of code together
in ways we can more easily understand.

But it also makes code more _reproducible_ because it forces
there to be only one way to run the code. If you were the
novice programmer ran `dta <- read.csv(..)`, then
immediately ran `dta <- dta["new_col"]`, things would break;
R doesn't recognize "new_col". Even worse, if you forgot to
run `dta[new_col > 5]` before running `dta["new_col"]`, your
code would run but not in the way you meant it to. Your data
would have more rows without telling you anything went
wrong, maybe leading to more difficult problems later.
Finally, if you had an object already defined called
`new_col` in the global environment, it has now been
overwritten, preventing you from calling back to it and
potentially leading to a mistake if you did not realize this
happened.

The pipe solves this issue by turning many commands into
one. With the pipe, there is no way to run a chain of
commands besides all of them. There are no intermediary
variables, no ways to overwrite an existing dataset or
object. You cannot mess up the order, because the pipe does
not let you. In the modules pattern example, the pipe
similarly forces a single way to run your code: in order,
producing a single object at the end.

This is a somewhat contrived example. Experienced R users
might think that of course it makes sense to run all of your
code in order; of course it makes sense to manage your
environment, perhaps with a generous helping of
`rm(list=ls())`. But the truth is that as you write more
code, this becomes harder and harder. Projects with hundreds
of lines of code or much more can get out of hand. You might
clean many datasets, you might have to run many types of
models, endlessly overwriting variablaes called `dta` or
`mod`. If you didn't overwrite them, things might be even
messier, with the creation of variables like
`mod_with_controls_propensity_weights_logged`.

The general rule is this: the more intermediary objects you
have in your global environment, the less likely it is for
your code to be reproducible.

Two items help with this. The first is the pipe, as shown
above. But the second are _scoped environments_, where
variables created do not modify the global environment.
Here's an example:

```r
x <- 1
my_function <- function(y){
  x <- 2
}
x
```

`my_function` here contains its own scope; even though it
creates a variable called `x`, the global environment knows
nothing about it and is not bothered. When you have to make
intermediary variables, doing them inside of these scoped
areas can be helpful for preventing leakage to other
contexts.

The pipe and scoped environments work together. If you have
functions to contain scope but not a pipe, you might still
be making intermediary variables when you might not want
them. If you use pipes but no functions, then at some points
you run the risk of running long pipe chains that become
undecipherable. You might also run into cases where you
cannot use a pipe because a package you're using just
doesn't work well with it; `spreg` is one common example for
me. In these cases, if you do not have scoped environments
to contain them, you have to put items in the global
environment.

The modules pattern puts these together. You write functions
that possibly contain their own intermediary variables, but
they don't leak out to the global scope. The global scope
sees only these functions,

### Reusability

A common reason people advocate for this style of coding is
because it means one piece of code can be reused many times.
To some extent this is also useful in R; for example, if you
are writing a report and want to have a consistent style,
it's useful to have a theme defined somewhere. This way, you
can change the styling for many graphics with a single
change:

```r
theme_report <- function(base_size = 12, base_family = "Lato"){
  theme_bw(base_size = base_size, base_family = base_family) +
    theme(<more code here>)
}
```

To be honest, this doesn't really apply to most of the
projects I work on, since much of my code is only meant to
run once. I have to write code for a specific dataset that
has specific problems, often problems that will appear
nowhere else.

Having reusable code would be supremely helpful for larger
projects, though, when you repeat a common task many
differnt times. New Haven nonprofit
[DataHaven](https://www.ctdatahaven.org/), for example,
absolutely needs reusable code for its town-level reports,
so that it can repeat one general set of analyses for all of
the towns in Connecticut.

Even if you do not care about reusing your code elsewhere, I
hope the benefits of readability (naming and separating your
logic) and reproducibility (keeping your code contained to
its own environment) convince you of the usefulness of the
module pattern.

## Modularizing your code

### Step one: place your code into functions, and those functions in files

```r
# module.R
clean_data <- function(.data){
  .data %>%
    filter(<stuff>) %>%
    pivot_wider(<more stuff>) %>%
    select(<other logic>)
}
```

This is the fairly straightforward step. Cut parts of your
code and place them in separate files. Wrap them in calls to
`function`, and name those functions with what you see fit.
To be pipeable, the functions should receive a data.frame as
their first argument and return a data.frame. To fit
tidyverse conventions, you can name the first argument
`.data`.

You can also think about the generalizability or the
specificity of your code. If you are writing logic that may
be repeated several times elsewhere, you might want to add
additional parameters to your functions so that they can be
used in different and flexible ways. If you don't want to,
this step can take less than a minute.

### Step two: give each file their own scope

This can be fairly tricky, and exposes R's lack of a native
module system.

The intuitive way to separate code into files in R is to
simply call `source`. The problem is that within each file,
unwated logic may leak out into files that call them.

```r
# submodule.R
clean_data <- function(.data){
  <logic>
}

vaidate_data <- function(.data){
  <logic>
}

# module.R

source("submodule.R")
process_data <- function(.data){
  clean_data(.data) %>%
    <other logic>
}
```

Here, `module.R` only uses `clean_data`, but it has access
to `validate_data` as well. What if `validate_data`
overwrites a function with the same name?

A similar example:

```r
# index.R
source('module.R')
source('extra_cleaners.R')
process_data(dta)
```

Suppose `extra_cleaners.R` exports another function called
`clean_data`. Then the `process_data` function from
`module.R` would not work as intended, because it would use
the `clean_data` defined in `extra_cleaners` and not
`submodule`.

Of course, this is a contrived example. You might be able to
simply name your functions descriptively and specifically,
and avoid this problem. But as stated above, for large
projects this can get out of hand, and your variables might
become unreasonably long.

The "R" way to do this is to use the `local()` function
while writing a module and `local = TRUE` flag while
importing it.

```r
# module.R
local({
  clean_data <- source("submodule.R", local = TRUE)$value
  process_data <- function(.data){
    clean_data(.data) %>%
      <other logic>
  }
})

# index.R
process_data <- source("index.R", local = TRUE)$value
alternate_cleaner <- source("extra_cleaners.R", local = TRUE)$value
<more code>
```

`local()` evaluates an expression in its own scope. If the
last expression in `local()` is the definition of an object,
it'll put that object in an `$value`. `source`ing a file
with a `local` wrapper will produce an object with that
`$value` attribute; getting it will get the function we
want.

For some strange reason, `source` doesn't seem to respect
`local`, and instead runs code in the global environment by
default. `local = TRUE` fixes this.

With this syntax, the `clean_data` function that
`process_data` uses will always belong to the `submodule.R`
environment, and will not be overwritten no matter what is
called in the parent environment.

There are two disadvantages here. This first is that it is a
bit wordy. Do we really have to call `local = TRUE` every
time? Or `$value` every time? That seems like a hassle. I'm
not sure if there are any alternatives to `local = TRUE`,
but `$value` has two alternatives. The first is the `assign`
function, which can target the parent environment:

```r
# module.R
local({
  source("submodule.R", local = TRUE)
  process_data <- function(.data){
    clean_data(.data) %>%
      <other logic>
  }
  assign("process_data", process_data, pos = 2)
})

# index.R
source("module.R", local = TRUE)
# now process_data can freely be used here
process_data(...)
```

The key argument here is `pos = 2`, which specifies the
parent environment of `module.R`.

The drawback to this is that exports cannot be renamed;
another file exporting `process_data` in this way will
overwrite this one. It's a bit better than calling
`source()` with `local()`, since we still have some sense of
containers, but we are still left with the possibility of
conflict. I don't recommend this.

Another alternative is to use an immediately invoked
function expression, or IIFE. This was popular in languages
like JavaScript a few years ago. It goes like this:

```r
# module.R
(function(){
  source("submodule.R", local = TRUE)
  process_data <- function(.data){
    clean_data(.data) %>%
      <other logic>
  }
  process_data
})()

# index.R
process_data <- source("module.R", local = TRUE)
```

A function wrapped is created, but immediately invoked by
wrapping the declaration in parentheses and inserting a pair
of parentheses after the declaration. The wrapper
parentheses tell R "evaluate what's inside and give me the
result", which will simply give back a function, and the
parentheses at the end tell R to invoke that function. The
anonymous function will then return `process_data`, and when
called from another file allows it to be reassigned to
another variable if necessary. This is pretty close to
`local()`, and avoids the `$value` syntax, but I'm not sure
if it's any easier to read or write. Your preference!

The second drawback of this pattern is that you can only
have one export per file. We can force our way into having
multiple functions defined in a single file by putting them
all in a single list:

```r
# module.R
local({
  clean_data <- source("submodule.R", local = TRUE)$value
  process_data <- function(.data){
    clean_data(.data) %>%
      <other logic>
  }

  clean_data <- function(.data){
    <more stuff>
  }
  list(process_data = process_data, clean_data = clean_data)
})

# index.R
process_data <- source("module.R")$value$process_data
clean_data <- source("module.R")$value$clean_data
```

Unfortunately, that's still a bit wordy and obtuse.

The other slightly annoying part of this is in loading
libraries. To be truly scoped, we want to load a library
only for a particular module. There isn't really a nice way
to do this. You can technically load a library, execute
code, and detach the library if needed:

```r
# module.R
local({
  clean_data <- source("submodule.R", local = TRUE)$value
  process_data <- function(.data){
    already_has_dplyr <- ("package:dplyr" %in% search())
    library(dplyr)

    result <- clean_data(.data) %>%
      <other logic>
    if(!already_has_dplyr) detach("package:dplyr")
    return(result)
  }
})
```

But this to me is unreasonable and makes code harder to read
and write, not easier.

The alternative is to use the `::` notation, and use
`dplyr::select` and so on. This is what Google recommends in
their
[R style guide](https://google.github.io/styleguide/Rguide.html).
For infix functions like `%>%`, you can import them with
`%>% <- purrr::%>%`. There's likely a way to do this for
methods too, so that functions like `plot` and so on work
properly. But these strategies to me are still messy and
make code harder to read and write. I recommend either
loading libraries at the top of files that actually execute
functions and nowhere else, or at the top of every file that
uses a call to a function. You can also use the `conflicted`
package if you are worried about this scenario.

In any case, here is the point where we reach the ends of R.
R doesn't have a built-in module system, so trying to manage
scopes ourselves sometimes doesn't mesh well with the rest
of R syntax.

### Step three: organize an index file

Step one might be all you need to organize your code, and
step two might be all you need to keep your code squeaky
clean. But once you have your code organized into functions,
you usually need to write a few lines of code to actually
execute your code. We can finally write the code that I
placed at the top of this doc:

```r
library(tidyverse)
scrape_data <- source("scrape_data.R")$value
clean_string_cols <- source("clean_string.R")$value
clean_numeric_cols <- source("clean_numeric.R")$value
run_model <- source("run_model.R")$value

my_model <- scrape_data() %>%
  clean_string_cols() %>%
  clean_numeric_cols() %>%
  run_model()
```

And that's it! Thanks for reading :)

## Caveats

The caveats of this method were mentioned above, but in sum:

- it's a bit messy
- libraries and namespaces are difficult to manage

## Alternatives

The patterns described here are usable, but you might be
interested in any of the following approaches for when you
decide to write code.

### R markdown

Won't writing your code in Rmarkdown files, knitting as
necessary, and potentially including child documents be
better? Yep, this is a totally viable option. It sometimes
won't work in situations like package development, or
wouldn't be the right choice if you're running a data
analysis pipeline in production (there's no need for a
pandoc render step to slow you down), but it can be the
right choice in many other situations.

It can also be combined with this approach: write all of
your logic in plain R scripts through the modules pattern,
and use the R markdown file as an index file to combine all
of them together. This way, you can use R markdown to focus
on a narrative about your analysis and use the R modules to
containerize the code. You can definitely annotate the code
itself by writing the modules in R markdown, but it can
often be cleaner to have simply self-documenting code
through named logic in plain R files.

### Third-party packages

There are some packages created to handle this pattern,
namely the [`box`](https://github.com/klmr/box) package and
the [`import`](https://github.com/rticulate/import)
packages.

These provide ways to import functions from scripts and
packages into aliased forms without altering the search
path. If you don't mind adding a dependency to your package
or project, these are great.

### Writing your own personal package

I've seen this suggested in a few StackOverflow posts. It
works for some and not for others; the break point is up to
you.

One note is that modularizing your code can be thought of as
a precursor to creating a package for it. You've already
separated your code into named functions, a package is just
a few steps more than that.

A second note is that packages handle the messy library
situation quite well, being able to use functions from other
libraries without adding them to the search path or masking
existing functions.
