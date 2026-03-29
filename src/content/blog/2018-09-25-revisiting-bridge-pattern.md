---
title: Revisiting Bridge Pattern
date: 2018-09-25
---

The Bridge Pattern decouples an abstraction from its implementation so that the two can vary independently.

## Example

```python
from abc import ABC, abstractmethod

# Implementation
class DrawAPI(ABC):
    @abstractmethod
    def draw_circle(self, x, y, radius):
        pass

# Concrete implementations
class RedCircle(DrawAPI):
    def draw_circle(self, x, y, radius):
        print(f"Drawing red circle at ({x}, {y}) with radius {radius}")

class GreenCircle(DrawAPI):
    def draw_circle(self, x, y, radius):
        print(f"Drawing green circle at ({x}, {y}) with radius {radius}")

# Abstraction
class Shape(ABC):
    def __init__(self, draw_api):
        self.draw_api = draw_api
    
    @abstractmethod
    def draw(self):
        pass

class Circle(Shape):
    def __init__(self, x, y, radius, draw_api):
        super().__init__(draw_api)
        self.x = x
        self.y = y
        self.radius = radius
    
    def draw(self):
        self.draw_api.draw_circle(self.x, self.y, self.radius)

# Usage
red_circle = Circle(1, 2, 3, RedCircle())
red_circle.draw()
```

This pattern is useful when you want to avoid a permanent binding between an abstraction and its implementation.
