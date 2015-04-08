---
layout: post
title: Most wanted letter
category: CheckIO
---

How can we get a character which appears most frequently in a string? [There's a quiz to write a function for the purpose on CheckIO](http://www.checkio.org/mission/most-wanted-letter/).

Probably, it's not difficult to write a function for it naively. However, if you need to write a `one line` function for it, the difficulty goes up radically. I found a solution by [shiracamus](http://www.checkio.org/user/shiracamus/), which is one line. Amazing!

	#!/usr/bin/env python3

	checkio = lambda t: max('abcdefghijklmnopqrstuvwxyz', key = t.lower().count)

	if __name__ == '__main__':
		assert checkio("Hello World!") == "l", "Hello test"
		assert checkio("How do you do?") == "o", "O is most wanted"
		assert checkio("One") == "e", "All letter only once."
		assert checkio("Oops!") == "o", "Don't forget about lower case."
		assert checkio("AAaooo!!!!") == "a", "Only letters."
		assert checkio("abe") == "a", "The First."
		assert checkio("a" * 9000 + "b" * 1000) == "a", "Long."

This idea is awesome! `max` function can take `key=func` arg to specify which function to use for calculating `max`. `count` for string behaves as follows:

	>>> "We are what we repeatedly do".count("a")
	3

So, `checkio` function works as intended.
