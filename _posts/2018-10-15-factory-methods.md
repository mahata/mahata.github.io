---
layout: post
title: Factory Methods vs. Constructors
category: Java
---

(This post is an excerpt of "Effective Java, 3rd Edition")

## Super straight-forward example of a factory method

An example of a static factory method that returns `Boolean`, which is a boxed primitive class of `boolean`:

```java
public static Boolean valueOf(boolean b) {
    return b ? Boolean.TRUE : Boolean.FALSE;
}
```

 (By the way, it's nothing to do with the so-called "Factory Method pattern" of GoF)

## Merits of static factory methods compared with conventional constructors

* They have names
* They are not required to create a new object each time they're invoked
  * For example: `Boolean.TRUE` described above doesn't create an instance
* They can return an object of any subtype of their return type
  * The class of the returned object can vary from call to call as a function of the input parameters.
    * EnumSet provides only static factories: In OpenJDK, the factory method returns either `RegularEnumSet` or `JumboEnumSet` based on the number of elements

## Demerits of static factory methods compared with conventional constructors

* Static factory methods without public or protected constructors cannot be subclassed
* Static factory methods do not stand out in API documentation

Actually, "Being unable to create subclasses without public or protected constructors" can be thought as a merit as well, because composition is preferred to inheritance generally.

## Conclusion

In many cases, static factories are preferred to public constructors. Let's think about the differences between them and make a right choice!
