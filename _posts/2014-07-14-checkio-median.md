---
layout: post
title: Calculation of median
category: CheckIO
---

When I was playing with [a CheckIO question](http://www.checkio.org/mission/median/), I found an interesting answer for calculating the median by [melpon](http://www.checkio.org/user/melpon/).

You can see the original answer online once you solve it by yourself. Here's the one which I've dumbed down a bit.


	#!/usr/bin/env python3

	checkio = lambda d: (lambda t, n: t[n] + t[-n - 1])(sorted(d), len(d) // 2) / 2

	# Test cases
	if __name__ == '__main__':
		assert checkio([1, 2, 3, 4, 5]) == 3, "Sorted list"
		assert checkio([3, 1, 2, 5, 3]) == 3, "Not sorted list"
		assert checkio([1, 300, 2, 200, 1]) == 2, "It's not an average"
		assert checkio([3, 6, 20, 99, 10, 15]) == 12.5, "Even length"
		print("Start the long test")
		assert checkio(list(range(1000000))) == 499999.5, "Long."
		print("The local tests are done.")


I guess it's not easy to grasp what it does at first glance.

When the array has an odd number of entities, the median is the middle value of the sorted array. If the array contains an even number of entities, then there is no single middle value, instead the median becomes the average of the two numbers found in the middle. In other words, there'll be a condition to branch the logic based on the number of the array elements. In the previous answer, however, there's no `if`. How it's possible? The keys are `//` and `t[n] + t[-n - 1]`.


`//` is super hard to google. It's actually called as a *floor division operator* according to the [Python Documentation](https://docs.python.org/2/reference/expressions.html). `//` works as follows:

	>>> 3 // 2
	1
	>>> 4 // 2
	2
	>>> 5 // 2
	2
	>>> 6 // 2
	3

In short, `//` discards remainder and returns only an integral result. With this, you can do the following trick:

	>>> odd_number_list = [1, 2, 3]
	>>> even_number_list = [1, 2, 3, 4]
	>>> odd_idx = len(odd_number_list) // 2
	>>> odd_number_list[odd_idx]
	2
	>>> odd_number_list[-odd_idx - 1]
	2
	>>> even_idx = len(even_number_list) // 2
	>>> even_number_list[even_idx]
	3
	>>> even_number_list[-even_idx - 1]
	2

So, when the number of elements in the list is odd, `t[n]` and `t[-n -1]` are the same, whereas they're the 2 middle values when the number is even. With it, the answer removed `if` from its logic. So clever!
