---
title: Is balanced tree?
date: 2016-09-23
---

How to check if a binary tree is balanced?

A balanced tree is defined as a tree where the height of the left and right subtrees of any node differ by at most 1.

```python
class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root):
    def check(node):
        if not node:
            return 0
        
        left = check(node.left)
        if left == -1:
            return -1
        
        right = check(node.right)
        if right == -1:
            return -1
        
        if abs(left - right) > 1:
            return -1
        
        return max(left, right) + 1
    
    return check(root) != -1
```

This solution runs in O(n) time complexity as it visits each node once.
