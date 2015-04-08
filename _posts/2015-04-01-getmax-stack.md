---
layout: post
title: Create a Stack class which has a method to return the biggest number in O(1)
category: Algorithms
---

## What to achieve?

One of my friends told me that there's a common interview question like following:

* Write a Stack class which have `push()` and `pop()` method
  * Add `get_max()` method which returns the biggest element in the stack
  * `get_max()` must return the result in O(1)

It sounds interesting, doesn't it?

## An example to fulfill the requirement

There's no description about memory space. How about using 2 stacks inside the Stack class to implement the trick? Let's call the stacks as *Stack A* and *Stack B*. *Stack A* works as a normal stack, while *Stack B* is used to track the biggest number. The top of *Stack B* is always the biggest number and peeping the value of a stack is O(1).

Here's how it works.

### Assume that *3* is the first number to push

<img src="/images/posts/getmax-stack/1st.jpg" alt="1st" width="680px" />

As the iamge above shows, *3* is pushed to *Stack B* when it's empty.

### Assume that *2* is the second number to push

<img src="/images/posts/getmax-stack/2nd.jpg" alt="2nd" width="680px" />

*2* is pushed to *Stack A* since it's just a normal stack.

However, *Stack B* behaves differently. When it's not empty, the value is compared with the value of the stack top. In this case, *2* is compared with *3* and *Stack B* won't accept *2* since it's smaller than *3*.

### Assume that *4* is the third number to push

<img src="/images/posts/getmax-stack/3rd.jpg" alt="3rd" width="680px" />

*4* is pushed to *Stack A* since it's just a normal stack.

*4* is pushed to *Stack B* as well because it's bigger than the stack top of it, which is *3*.

Like this way, the top of *Stack B* is always the biggest value of *Stack A*.

### How to pop()?

`pop()` is relatively easy. `pop()` always retrieves the top of *Stack A*. If and only if the value retrieved from *Stack A* is the same as the top of *Stack B*, the top of *Stack B* is also popped.

## Sample Code in Python

Here's my sample code :)

{% highlight python %}
#!/usr/bin/env python3


class MyStack(object):
    def __init__(self):
        self.stack_a = []
        self.stack_b = []

    def get_max(self):
        """
        It needs to be O(1)
        """
        return self.stack_b[-1]

    def push(self, val):
        """
        1) Push val to self.stack_a *always*
        2) Push val to self.stack_b when it's bigger than the stack top of the self.stack_b
        """
        self.stack_a.append(val)
        if 0 == len(self.stack_b) or self.stack_b[-1] < val:
            self.stack_b.append(val)

    def pop(self):
        """
        1) Pop val from self.stack_a *always*
        2) Pop val from self.stack_b when the val of 1) is same as the top of the self.stack_b
        """
        stack_top = self.stack_a.pop()
        if stack_top == self.stack_b[-1]:
            self.stack_b.pop()

        return stack_top


if __name__ == "__main__":
    stack = MyStack()
    stack.push(3)  # [3]
    stack.push(2)  # [3, 2]
    stack.push(4)  # [3, 2, 4]
    stack.push(5)  # [3, 2, 4, 5]
    stack.push(4)  # [3, 2, 4, 5, 4]
    stack.push(1)  # [3, 2, 4, 5, 4, 1]

    print(stack.get_max())  # 5
    stack.pop()  # [3, 2, 4, 5, 4]
    print(stack.get_max())  # 5
    stack.pop()  # [3, 2, 4, 5]
    print(stack.get_max())  # 5
    stack.pop()  # [3, 2, 4]
    print(stack.get_max())  # 4
    stack.pop()  # [3, 2]
    print(stack.get_max())  # 3
    stack.pop()  # [3]
    print(stack.get_max())  # 3
    stack.pop()  # []
{% endhighlight %}
