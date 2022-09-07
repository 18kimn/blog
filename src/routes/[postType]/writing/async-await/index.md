---
title: A comment on <code>async/await</code> patterns
date: 2022-08-20
tags: [technical, other]
---

This'll be a short one.

`async/await` is a pattern -- in some languages syntactic
sugar, in other languages embedded and complicated
functionality (_cough_ rust) that allows you to write
asynchronous code as if it were synchronous.

In JavaScript, the syntax lets you take:

```js
let data
fetch("/endpoint-with-data")
  .then(res => res.json())
  .then(...x amount of preprocessing code...)
  .then(animate)

function animate(data){
  ...animation code here...
}
```

Into:

```js
const fetched = await fetch('/endpoints-with-data')
const data = await fetched.json()

...your other preprocessing code...

animate(data)
```

In other words, it lets you avoid nesting and make your code
readable by keeping everything on the same indentation
level!

Anyhow, if you're a JavaScript developer, you probably
already knew that. **My comment** is just that using
`async/await` _shouldn't prevent you_ from using
`.then`-style callbacks. `async/await` helps keep things
readable, but overusing it can make things less readable.
You need a balance.

For instance, say we add error handling to the above
scenario:

```js
let data
try {
  const fetched = await fetch('/endpoints-with-data')
  data = await fetched.json()
} catch(e){
  data = []
}

...your other preprocessing code...

animate(data)
```

That's actually not very readable! From the beginning, any
insistence on using only `async/await` meant you have to
create a separate variable for the fetched response and for
your data. Adding error handling, _which you should do
literally all the time_, makes this take up many more lines
of code, with roundabout logic necessary to deal with
JavaScript's scoping rules. That's not very nice at all.

It's _much_ more ergonomic for me to do a hybrid:

```js
const data = await fetch("/endpoint-with-data")
  .then(res => res.json())
  .catch(error => [])

...other preprocessing code...

animate(data)
```

Balance makes things nicer.
