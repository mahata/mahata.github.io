---
layout: post
title: Kotlin Puzzlr - Elvis Operator Priority
categories: [Kotlin]
---

I'm taking a course named [Kotlin for Java Developer](https://www.coursera.org/learn/kotlin-for-java-developers/) from Coursera. I'm in the middle fo week 3, and I'd say it's a fantastic course to take if you're new to Kotlin.

Yes, I'm one of the new comers of Kotlin. As a newbie, I got puzzled by an example given the course as follows:

```Kotlin
val x: Int? = 1
val y: Int = 2
val sum = x ?: 0 + y
println(sum)  // Guess what? ... `1` will be printed here!
```

I originally thought that `3` is printed with this code, as `x` is not null so `x ?: 0` should be 1, of course. But I was wrong... because I've missed to respect the order to evaluate the operators (aka: [Operator Precedence](https://kotlinlang.org/docs/reference/grammar.html)).

![Operator Precedence of Kotlin](/images/posts/screenshots/kotlin-operator-precedence.png)

Given the table above, it's apparent that `+` and `-` operators have higher precedence than `?:`. So, `x ?: 0 + y` is evaluated as `x ?: (0 + y)`. That's why, the code snippet above prints out `1`.

It was mind-boggling at first, as a beginner of Kotlin. I just wanted to share the same feeling to you, if you're in the same situation ;-)
