---
title: <code>reso</code>
subtitle: An esoteric R-based programming style
date: 2021-09-05
banner: banner.png
---

### Introduction

Have you ever been frustrated at R, maybe after reading too
many rude StackOverflow or R-help threads? (me too) Well,
what if we took R and instead of helping making it
accessible and fun, made all of those esoteric, argon-y,
incredibly annoying, and unreadable parts much worse?

Enter `reso`, a library and R-based programming style. Only
the following symbols from R are allowed:

<p style="text-align:center">
  (), [, ], !, 0, +, and “,” (the comma).
</p>

Along with four functions to make `reso` “go.” They are
really just simplified and narrower versions of existing R
utilities:

- s(): An alias for `substr(string, i)`. Used to get a
  letter from a string

- p(): An alias for `paste(..., collapse = "")`, to
  concatenate strings

- x(): Interpret and execute a string as an R expression

- d(): an alias for
  [deparse()](https://www.rdocumentation.org/packages/base/versions/3.6.2/topics/deparse)

And that’s it! Not even spaces, line breaks, or tabs are
allowed! Happy programming :)

### Setup and installation

For now, you can install the package from the R console with
`devtools::install_github("18kimn/reso")`. I've submitted
the package to CRAN, so hopefully this can soon be updated!

You can view the package implementation details at
[github.com/18kimn/reso](https://github.com/18kimn/reso).

### How it works

There’s a few more things that should be said.

This style is able to work because R is able to interpret
strings as expressions, and through hacky (some might say c
l e v e r) tricks you can grab those strings from native R
objects that are available to you.

The general pattern using this is as follows:

1.  Find a hacky way to coerce values to built-in objects,
    like `FALSE` or `logical(0)`
2.  Interpret that value as a string with `d()`, so that
    `FALSE` becomes `"FALSE"` and so on.
3.  Pull a letter of that string out with `s()`
4.  Repeat and combine with `p()` until we can make a
    function name
5.  Evaluate the string as an R expression with `x()`.
6.  If that worked, you have a new function available to
    you! Repeat ad infinitum until your code is completely
    nonsensical.

### Caveats

There are some things that I’m not sure if the style can do
as of now. Probably the biggest issue is that a programmer
can’t save variables to the namespace. The `reso_validate()`
function is super hacky, so much so that it just marks as
valid those strings or file expressions which have only
`reso` characters. This means that assignment to new
characters is not allowed. It’d also break because the `d()`
function operates in the parent frame instead of in the
global environment with no escape hatch. The parent frame
would most often be the context inside of `x()` and would be
“forgotten” after execution, meaning that variables can’t
really be saved.

### A demonstration

**Goal: Generate the output `[1] 0 1`**

In other words, create the output we would receive if we
were typing `c(0, 1)` in vanilla R.

Let’s start by getting just the letter “c” as a string,
which we can do by:

1.  Produce `character(0)` by generating an empty string
    with R’s `paste` or reso’s `p`, then get the 0th element
    of that result.

2.  Convert the value `character(0)` into character, e.g. 
    `"character(0)"`. This can be done with R’s `deparse` or
    reso’s `d`.

3.  Get the first letter of “character(0)”, via R’s `substr`
    or reso’s `s`.

Those steps as code:

```r
p()[0]
#> character(0)
d(0[0])
#> [1] "numeric(0)"
s(d(p()[0]))
#> [1] "c"
```

Next, we’d want to turn this string into the R expression
`c(0, 1)`. To do this, we can:

1.  Force R to interpret “c” as the native function `c`, by
    using `parse` and then `eval` in R, or using the `x`
    function^[for “execute”, or “expression.” Your choice
    :)] in reso.
2.  Generate 1 by coercing 0 to `TRUE` with `!0`, and
    combining `TRUE` with `numeric(0)` to force `TRUE` to be
    numeric (or 1). This requires our new version of `c()`.
3.  Combine all of our above steps with a set of parens and
    a 0!

```r
x(s(d(p()[0])))
#> function (...)  .Primitive("c")
x(s(d(p()[0])))(!0,0[0])
#> [1] 1
x(s(d(p()[0])))(0,x(s(d(p()[0])))(!0,0[0]))
#> [1] 0 1
```

Yay!

### Expanding to almost the entire R universe

#### Part 1: The alphabet

This could have been a bit of a puzzle to figure out, and
potentially impossible. R has a fair number of native
values, but many letters are just hard to figure out or
produce via type coercion.

Luckily, R provides an object that makes this almost
trivial: the `letters` array!

To get it, we need:

1.  “l”, from `logical(0)`
2.  Two “e”s, from `integer(0)`
3.  Two “t”s, from `integer(0)`
4.  One “r”, from `integer(0)`
5.  One “s”, from the eleventh letter of the deparse
    function expression for `s()`.^[If you can think of a
    better way, let me know :’)]

The code representation of this is below. `c()` and numbers
are used instead of their `reso` equivalents for
readability.^["readability" means nothing in this context]

```r
s(d(!0[0])) # the first letter of "logical(0)", or "l"
#> [1] "l"
c() + !0 # makes integer(0) by adding TRUE and NULL
#> integer(0)
s(d(c() + !0), 4) # turns integer(0) -> "integer(0)" -> "e"
#> [1] "e"
s(d(c() + !0), 3) #"t"
#> [1] "t"
s(d(c() + !0), 7) #"r"
#> [1] "r"
s(d(s)[1], 11) #"s"
#> [1] "s"

#combining
x(p(
  s(d(!0[0])),
  s(d(c() + !0), 4),
  s(d(c() + !0), 3),
  s(d(c() +  !0), 3),
  s(d(c() + !0), 4),
  s(d(c() + !0), 7),
  s(d(s)[1], 11)
))
#>  [1] "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z"
```

We can subset letters from here in order to form arbitrary
words, and thus nearly all R commands.

### Part 2: Non-alphabetical characters

The last trick in getting this to be an almost-all-of-R
style is in using the `builtins` vector. `builtins` contains
the names of all built-in functions in R, many of which
include non-alphabetical operators like +, -, (, :, and so
on. You could subset the builtins array for these, which
would then unlock the door to almost all of R.

### Some notes about motivation and learning

This is not meant to be a useful or practical programming
tool. It is meant to show the opposite, that being esoteric
is useless and using simpler, abstracted logic can be way
more helpful.^[of course, it was also just a fun/silly
little side project for myself.]

Compared to languages like JavaScript, R stands out in being
more accessible and friendly. Sometimes programmers attempt
to be as concise as possible, preferring syntax like arrow
functions to jam as much code as possible into a single
line. Logical operators like ‘&&’ and ‘\|\|’ are used via a
side effect as if statements themselves instead of as just
logical operators.

In contrast, the R community tends to view being verbose as
a feature. The base R libraries export thousands of
functions to handle many general cases and provide a higher
level of abstraction. Pipes in R are encouraged in order to
demystify code and reduce mistakes, and tools like the R
linter even encourage placing every statement after a pipe
on a new line to encourage even more readability.

Of course, R still has lots of room to improve in becoming
accessible. Let’s help each other get there by making the R
community welcoming and fun!
