---
title: Getmax Stack
date: 2015-04-01
---

Here's a Stack Overflow question I answered today.

> Implement a stack that has push, pop, and getmax operations. What is the complexity of each operation?

The answer is O(1) for all operations.

## Solution

```python
class Stack:
    def __init__(self):
        self.stack = []
        self.maxes = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.maxes or val >= self.maxes[-1]:
            self.maxes.append(val)
    
    def pop(self):
        val = self.stack.pop()
        if val == self.maxes[-1]:
            self.maxes.pop()
        return val
    
    def getmax(self):
        return self.maxes[-1]
```

The key is to maintain an auxiliary stack that keeps track of the maximum values seen so far.
