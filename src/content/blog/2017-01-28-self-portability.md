---
title: Self portability
date: 2017-01-28
---

I've been thinking about code portability. How can we write code that works across different environments?

## Key Principles

1. **Abstract platform-specific code** - Use interfaces to hide platform differences
2. **Dependency injection** - Pass in dependencies rather than creating them directly
3. **Feature detection** - Check for feature availability before using it

## Example

```python
# Instead of:
import platform
if platform.system() == 'Windows':
    path = 'C:\\temp\\file.txt'
else:
    path = '/tmp/file.txt'

# Use:
import os
path = os.path.join(os.temp_dir(), 'file.txt')
```

Writing portable code from the start saves time later.
