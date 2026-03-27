---
title: Checkio Median
date: 2014-07-14
---

[CheckIO](http://www.checkio.org/) is a site for python programmers. You can improve your skills by solving challenges. Let's see one of the missions.

The mission name is "Median". You are given a list of numbers. You need to find the median.

According to Wikipedia, the median is "the value separating the higher half from the lower half of a data sample". In other words, it's the middle value after sorting.

CheckIO's official solution is as follows:

```python
def checkio(data):
    data.sort()
    half = len(data) // 2
    if len(data) % 2 == 0:
        return (data[half - 1] + data[half]) / 2.0
    else:
        return data[half]
```

However, I think following is better:

```python
def checkio(data):
    return sorted(data)[len(data) // 2] if len(data) % 2 == 1 \
        else sum(sorted(data)[len(data) // 2 - 1: len(data) // 2 + 1]) / 2.0
```

Why? Because it's shorter! Actually, the code above is even wrong... Let's fix it:

```python
def checkio(data):
    s = sorted(data)
    l = len(s)
    return s[l//2] if l%2==1 else (s[l//2 - 1] + s[l//2]) / 2.0
```

This one is wrong... I'll try to shorten it again. I think the official solution is good enough. I'll stop here.
