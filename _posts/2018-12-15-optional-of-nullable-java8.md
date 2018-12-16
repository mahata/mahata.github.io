---
layout: post
title: Optional.ofNullable to replace old-fashioned null checks
categories: [Java]
---

As someone who's coming from an ancient Java world, I confess that I've written code like following recently:

```java
if (obj != null && obj.getSomething() != null) {
    return obj.getSomething().getAnotherThing().equals("MyString");
}
```

Indeed it works. However, checking `null` repeatedly in the if-expression is not beautiful, and nested if blocks are harmful for readability. `Optional.ofNullable()` can help solving the issue.

I should have written the code above like following:

```java
return Optional.ofNullable(obj)
    .map(Obj::getSomething)
    .map(Something::getAnotherThing)
    .filter(thing -> thing.equals("MyString"))
    .isPresent();
```

`Optional.ofNullable()` creates a wrapper object of its argument, whose type is `Optional`. `Optional` type is a type which adds nice interface for `null`. For example, `str.length()` in the following code never throws `NullPointerException` because the expression is inside `strOpt.ifPresent()`:

```java
Optional<String> strOpt = Optional.ofNullable("MyString");
strOpt.ifPresent(str -> System.out.println(str.length())); // => 8
```

It's common to call `map()` to return a value from `Optional`. `map()` returns a value which is also of `Optional` type, so [method chain technique](https://en.wikipedia.org/wiki/Method_chaining) is applicable with `Optional`. Methods like `filter()` are available by `Optional`. I don't write about it in this article because it's easy to guess what it means.

Let's stop writing `if (something != null)` and embrace `Optional.ofNullable()`!
