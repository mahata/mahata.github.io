---
title: Remove an element in ArrayList without ConcurrentModificationException
date: 2019-01-02
---

When iterating over an ArrayList and trying to remove elements, you might encounter ConcurrentModificationException. Here are safe ways to handle it.

## Using Iterator.remove()

```java
List<String> list = new ArrayList<>(Arrays.asList("a", "b", "c", "d"));
Iterator<String> iterator = list.iterator();

while (iterator.hasNext()) {
    if (iterator.next().equals("c")) {
        iterator.remove();
    }
}
// Result: [a, b, d]
```

## Using removeIf() (Java 8+)

```java
list.removeIf(s -> s.equals("c"));
```

## Using Stream API

```java
List<String> filtered = list.stream()
    .filter(s -> !s.equals("c"))
    .collect(Collectors.toList());
```

Note: This creates a new list rather than modifying in place.

## Using ListIterator

```java
ListIterator<String> iterator = list.listIterator();
while (iterator.hasNext()) {
    if (iterator.next().equals("c")) {
        iterator.remove();
    }
}
```

The key is to use the iterator's remove method when modifying during iteration.
