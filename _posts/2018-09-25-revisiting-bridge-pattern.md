---
layout: post
title: Re-visiting Bridge Pattern
category: Java
---

Now that I need to write some Java code at my work place, I've started re-learning Java's typical design patterns. 

I'm going to summarize what the "Bridge Pattern" is in this article.

Let's imagine that a class is inherited by 2 classes to implement an abstract method in the super class. More concretely, we can draw a diagram for that as follows:

![First Diagram](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuKfCAYufIamkKKZEIImkLb1o1b6EIWg9nGeGfa8rLpLCKMrkQab6VegZXgOrLoqN5rHBS6aIHAaXM1k22zIANuCHgWOZ30rG9zZKwEeYcOjTs8ZB8JKl1UGd0000)

Let's assume that we want to implement a new feature for `methodA()` and revise the method by overriding it. We can't just add a new class to override the method. It'd end up like following:

![Second Diagram](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuKfCAYufIamkKKZEIImkLb1o1b6EIWg9nGeGfa8rLpLCKMrkQab6VegZXgOrLoqNThrE2BrEUFH2jGIN9a6iCGHhGt21Ml5hC4BLO4H8WnF41WINe0OZL0sODa03oAP6LnV9vTY5ZL2LGupaWb0G8OJBi0iRSJcavgK0umm0)

We already have a concrete method "methodA()" in `SubClassA1` and `SubClassA2` for `ClassA`, so we need the counterparts of them for `ClassB` as well (They're expressed as `SubClassB1` and `SubClassB2` in the diagram above).

The whole architecture gets complicated unnecessarily. That's why we want to introduce "Bridge Pattern" to make it simple.

## Concrete Example

Let's assume that we're trying to create a `Parser` class. We want to parse `XML` and `JSON`.

```java
public abstract class ClassA {
    public abstract DataObj parse(String txt);
}
```

```java
public class SubClassA1 extends ClassA {
    public DataObj parse(String xmlTxt) { /* Let's assume that this one parses XML string */ }
}
```

```java
public class SubClassA2 extends ClassA {
    public DataObj parse(String jsonTxt) { /* Let's assume that this one parses JSON string */ }
```

Now, what would you do if you want to add a feature to measure the time to run `parse()` in `ClassA`. The easiest way is subclassing `ClassA` and override `parse()` as follows:

```java
public abstract class ClassB extends ClassA {
    public DataObj timerParse(String txt) {
        long start = System.currentTimeMillis();
        DataObj dataObj = parse(txt);
        long end = System.currentTimeMillis();

        System.out.println("time:"+(end - start));
        return dataObj;
    } 
}
```

Here's a big problem: To use `timerParse()`, `parse()` method needs to be re-implemented in the subclasses of `ClassB`, because `SubClassA1 ` and `SubClassA2` are the subclasses of `ClassA`, not `ClassB`.

In other words, we'd need to implement following stuff:

![Third Diagram](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuKfCAYufIamkKKZEIImkLb1o1b6EIWg9nGeGfa8rLpLCKMr1Ob5ngeQcDLSj5tQTJWYTJa2T9PcvgKK1I9gWQeDBao2c6uBL8xX0FGLub1kXAZV2hzm9OZg2Iq2v4QfoTDEXuM5JewkBv6BimaQeoY46Sa4eY132LTY5ZRWSKlDIW5440000)

This is ridiculous. How come we need to implement 4 concrete `parse()` methods when we just want to have 2 types of parsers (one is for XML, and the other one is for JSON).

## Bridge Pattern is here to help

Here's how to adopt Bridge Pattern:

1. Create a class that has an "implementation object" as a member (see below)
2. Create an abstract "Impl (Implementation)" class that inherits the class
3. Create concrete classes that inherits the "Impl" class and override methods in it

For our case, the architecture would look like following:

![Fourth Diagram](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuKhEIImkLb0AI2mgJYrIKaWiLe0m5Qgv2i0Cpzo272u8MqFJcgkMYoingRYaA36vH06c5wuEh1_11PfH3LDSYsm2L6D4RWwQNeW8GZiMJLx5-Nbeka12EBKXITZewa9TXo9Q0nH6iHXT5iq2BeVKl1HWs040)

With this architecture, `Parser` class can be implemented as follows:

```java
public class Parser {
    private ParserImpl parserImpl;
    public Parser(ParserImpl parserImpl){
        // parserImpl can be an object of XmlParserImpl or JsonParserImpl
        this.parserImpl = parserImpl;
    }

    public void parse(String txt){
        parserImpl.parse(txt);
    }
}
```

Apparently, `ParserImpl` is working as a proxy (a.k.a. Bridge) so `Parser` can transparently accept objects of any subclasses of `ParserImpl`.

<!-- https://gist.github.com/mahata/2c4bcf624894e933257165b1c7f947c0 -->
