---
layout: post
title: Kotlin Collection APIs
categories: [Kotlin]
---

Here's a list of snippets that may be a good reference for Kotlin newbies like me ;-) Basically, they're coming from a lecture from [Kotlin for Java Developer](https://www.coursera.org/learn/kotlin-for-java-developers/) from Coursera.

```kotlin
enum class Gender { MALE, FEMALE }

data class Hero(
    val name: String,
    val age: Int,
    val gender: Gender?
)

fun main() {
    val heroes = listOf(
        Hero("The Captain", 60, Gender.MALE),
        Hero("Frenchy", 42, Gender.MALE),
        Hero("The Kid", 9, null),
        Hero("Lady Lauren", 29, Gender.FEMALE),
        Hero("First Mate", 29, Gender.MALE),
        Hero("Sir Stephen", 37, Gender.MALE)
    )

    println(heroes.last().name)  // "Sir Stephen"
    println(heroes.firstOrNull { it.age == 30 }?.name)  // null
    // println(heroes.first { it.age == 30}.name )  // NoSuchElementException
    println(heroes.map { it.age }.distinct().size )  // 5
    println(heroes.filter { it.age < 30 }.size )  // 3

    val (youngest, oldest) = heroes.partition { it.age < 30 }
    println(youngest.size)  // 3
    println(oldest.size)  // 3

    println(heroes.maxBy { it.age }?.name)  // The Captain
    println(heroes.all { it.age < 50})  // false
    println(heroes.any { it.gender == Gender.FEMALE })  // true

    val mapByAge: Map<Int, List<Hero>> = heroes.groupBy { it.age }
    val (age, group) = mapByAge.maxBy { (_, group) -> group.size }!!
    println(age)  // 29

    val mapByName: Map<String, Hero> = heroes.associateBy { it.name }
    println(mapByName["Frenchy"]?.age)  // 42

    val unknownHero = Hero("Unknown", 0, null)
    println(mapByName.getOrElse("unknown") { unknownHero }.age)  // 0

    val (first, second) = heroes
        .flatMap { heroes.map { hero -> it to hero } }
        .maxBy { it.first.age - it.second.age }!!
    println(first.name)  // The Captain

    // Same as above
    val allPossiblePairs = heroes
        .flatMap { first ->
                heroes.map { second -> first to second }
        }
    val (oldest2, youngest2) = allPossiblePairs
        .maxBy { it.first.age - it.second.age }!!
    println(oldest2.name)
}
```
