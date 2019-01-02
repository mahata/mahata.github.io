---
layout: post
title: How to remove an element of ArrayList in a loop without throwing ConcurrentModificationException
categories: [Java]
---

I found a weird trick of ArrayList to bypass `ConcurrentModificationException` even when removing an element of it in a loop. Let's think about a snippet like following:

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws Exception {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        for (String str : list) { // Exception!
            if ("A".equals(str)) {
                list.remove(str);
            } else {
                System.out.println(str);
            }
        }
    }
}
```

Here's the Runtime exception for the code:

```
Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.ArrayList$Itr.checkForComodification(ArrayList.java:1042)
	at java.base/java.util.ArrayList$Itr.next(ArrayList.java:996)
	at Main.main(Main.java:9)
```

Why `java.util.ConcurrentModificationException`? It's because `ArrayList` isn't Thread Safe, so iterating over an object of `ArrayList` while deleting elements of it may result in a weird state. Java Runtime throws this exception even when it's running in a single thread.

Here's what [the official JavaDoc](https://docs.oracle.com/javase/8/docs/api/java/util/ConcurrentModificationException.html) is saying:

> This exception may be thrown by methods that have detected concurrent modification of an object when such modification is not permissible.

So, my next question is: "How concurrent modification is detected?".

It seems that extended for loop checks whether the object to iterate over has been changed or not *right after* it continues to loop. I guess, my explanation here isn't clear enough. Let's see following example.

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws Exception {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        for (String str : list) {
            if ("B".equals(str)) {  // Here's the difference!
                list.remove(str);
            } else {
                System.out.println(str);
            }
        }
    }
}
```

It outputs `A` and exits without exception! Note that `C` won't be output. What happened?

The trick is: `list.remove(str)` removes `B` in the `list` variable. So, the cursor of the iterator must be:

<script src="https://gist.github.com/mahata/393968548c3710518e7292c509dd402a.js"></script>

Now, the cursor reached to the end of the ArrayList object, so Java Runtime exits the loop without detecting the possibility of "concurrent modification". Ha.
