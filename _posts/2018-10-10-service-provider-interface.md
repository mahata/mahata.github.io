---
layout: post
title: Service Provider Interface (SPI)
category: Java
---

What's Service Provider Interface (SPI)? It's an interface which is meant to be used by `java.util.ServiceLoader`. It's sort of a generalization of [Factory Method pattern](https://en.wikipedia.org/wiki/Factory_method_pattern). You can create objects needed without `new` operator.

## How to use Service Provider Interface?

4 components are needed to make use of Service Provider Interface:

1. Service Provider Interface itself (which is just an `interface` of Java)
2. Classes that implement the interface
3. Files under `META-INF/services` of the Java project
4. Service Access API (`java.util.ServiceLoader`)

With Service Provider Interface, we can specify service classes to use just by tweaking a file under `META-INF/services`. We don't need to modify implementation itself.

Let's take a look at a concrete example (By the way, you can download the example [here](/files/posts/spi-example.zip)).

### Service Provider Interface

Here's an example of Service Provider Interface:

```java
public interface Greeting {
    public String hello();
}
```

There's nothing mysterious. It's just an `interface` of Java.

### Classes that implement the interface

Let's imagine that we have 2 classes that implements the `Greeting` interface that we've defined above.

```java
public class GreetingEn implements Greeting {
    public String hello() {
        return "Hello.";
    }
}
```

```java
public class GreetingJa implements Greeting {
    public String hello() {
        return "こんにちは";
    }
}
```

They're  straightforward and self-explanatory enough 😉

### Files under `META-INF/services` of the Java project

Actual file for this example is located: `META-INF/services/Greeting`. The file name `Greeting` needs to match with the name of the `interface` defined previously.

Let's put records as follows:

```
GreetingJa
GreetingEn
```

Each line corresponds to the class that we expect the Service Access API to load.

### Service Access API (`java.util.ServiceLoader`)

`java.util.ServiceLoader` class works as an accessor of the classes for Service Provider Interface. See the following example:

```java
import java.util.ServiceLoader;

public class Main {
    public static void main(String[] args) {
        // ServiceLoader reads "META-INF/services/Greeting" and finds classes that matches the records
        // (and the classes must implement Greeting)
        ServiceLoader<Greeting> loader = ServiceLoader.load(Greeting.class);

        for (Greeting greeting: loader) {
            System.out.println(greeting.getClass());
            System.out.println(greeting.hello());
        }
    }
}
```

Here's the result of the code above:

```sh
$ java *.java
$ java Main
class GreetingJa
こんにちは
class GreetingEn
Hello.
```

It's apparent from the result that the iterator in the following block loads objects of both `GreetingJa` and `GreetingEn`. It's because they're listed in `META-INF/services/Greeting`.

```java
        for (Greeting greeting: loader) {
            System.out.println(greeting.getClass());
            System.out.println(greeting.hello());
        }
```

### Summary

Let's say, we want to provide a service in multiple regions. We may need to localize the service a little bit based on the regions. Do we want to build software for the service for each region? Probably not. Service Provider Interface can be one of the solutions in that situation. Once it's built, we just need to replace the files under `/META-INF/services` as needed.

Yes, we can achieve the same thing with DI containers. One advantage of using `java.util.ServiceLoader` though is that this class is "Java Native" since Java 6, which means we don't need to rely on 3rd party tools.
