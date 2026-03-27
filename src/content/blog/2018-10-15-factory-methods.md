---
title: Factory methods
date: 2018-10-15
---

Factory methods provide a way to create objects without specifying the exact class of object that will be created.

## Simple Factory

```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

def animal_factory(animal_type):
    if animal_type == "dog":
        return Dog()
    elif animal_type == "cat":
        return Cat()
    raise ValueError(f"Unknown animal type: {animal_type}")

# Usage
pet = animal_factory("dog")
print(pet.speak())  # Woof!
```

## Factory Method Pattern

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass

class AnimalFactory(ABC):
    @abstractmethod
    def create_animal(self):
        pass

class DogFactory(AnimalFactory):
    def create_animal(self):
        return Dog()
```

This pattern is useful when a class can't anticipate the class of objects it must create.
