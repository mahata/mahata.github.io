---
title: Kotlin APIs for Collections
date: 2018-11-02
---

Kotlin provides excellent APIs for working with collections. Let me highlight some useful functions.

## Transform

```kotlin
// map - transform each element
val numbers = listOf(1, 2, 3, 4, 5)
val squared = numbers.map { it * it }  // [1, 4, 9, 16, 25]

// flatMap - transform and flatten
val words = listOf("hello", "world")
val chars = words.flatMap { it.toList() }  // [h, e, l, l, o, w, o, r, l, d]
```

## Filter

```kotlin
val evens = numbers.filter { it % 2 == 0 }  // [2, 4]
val firstEven = numbers.firstOrNull { it % 2 == 0 }  // 2
```

## Aggregate

```kotlin
val sum = numbers.reduce { acc, n -> acc + n }  // 15
val sumOrZero = numbers.fold(0) { acc, n -> acc + n }  // 15
val joined = words.joinToString(", ")  // "hello, world"
```

## Chaining

```kotlin
val result = numbers
    .filter { it > 2 }
    .map { it * 2 }
    .take(2)  // [6, 8]
```

These functions make collection processing concise and readable.
