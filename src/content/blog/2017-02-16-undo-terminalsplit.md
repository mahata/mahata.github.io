---
title: Undo terminalsplit
date: 2017-02-16
---

How to implement an "undo" feature for text splitting operations?

## Approach

Store the original string along with split information:

```python
class TerminalSplit:
    def __init__(self, text):
        self.original = text
        self.parts = text.split()
    
    def undo(self):
        return self.original
    
    def redo(self):
        return ' '.join(self.parts)
```

## Usage

```python
ts = TerminalSplit("hello world from python")
print(ts.parts)  # ['hello', 'world', 'from', 'python']
print(ts.undo()) # "hello world from python"
```

This pattern is useful for implementing reversible text operations.
