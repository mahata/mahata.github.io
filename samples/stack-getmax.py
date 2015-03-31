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
