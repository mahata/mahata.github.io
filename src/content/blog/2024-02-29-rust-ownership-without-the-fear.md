---
title: Rust Ownership Without the Fear
date: 2024-02-29
---

Rust's ownership system is the feature most cited as a barrier to entry. After working through several small projects, I think it clicks faster once you stop thinking about it as a restriction and start seeing it as a set of rules the compiler applies on your behalf.

## The three rules

Every value in Rust follows three rules:

1. Each value has exactly one *owner*.
2. When the owner goes out of scope, the value is dropped.
3. There can be either many immutable references **or** exactly one mutable reference — never both at the same time.

That's it. The borrow checker is just enforcing these three rules automatically.

## Moving vs. copying

Primitive types like integers implement the `Copy` trait, so they're duplicated when assigned or passed to a function:

```rust
let x = 5;
let y = x;   // x is still valid — integers are Copy
println!("{x}");
```

Heap-allocated types like `String` are *moved* instead:

```rust
let s1 = String::from("hello");
let s2 = s1;   // ownership moves to s2
// println!("{s1}");  // compile error: s1 was moved
```

This is how Rust guarantees there's only one owner without a garbage collector.

## Borrowing

Most of the time you don't want to transfer ownership — you just want to look at a value. That's what references are for:

```rust
fn print_length(s: &String) {
    println!("length: {}", s.len());
}

let s = String::from("world");
print_length(&s);   // we borrow s
println!("{s}");    // s is still valid here
```

The `&` creates an immutable reference. The function can read `s` but not modify it, and ownership stays with the caller.

## Mutable references

If you need to modify a value without taking ownership:

```rust
fn make_uppercase(s: &mut String) {
    s.push_str(" (SHOUTING)");
}

let mut greeting = String::from("hello");
make_uppercase(&mut greeting);
println!("{greeting}"); // hello (SHOUTING)
```

The rule that you can't have a mutable reference alongside any other reference exists to prevent data races at compile time — something no amount of testing can fully guarantee.

## Slices: borrowing part of a collection

```rust
let words = vec!["one", "two", "three"];
let first_two = &words[0..2];   // &[&str] — a slice
println!("{:?}", first_two);    // ["one", "two"]
// words is still valid here
```

Once you see ownership as the compiler keeping track of lifetimes for you, the error messages start reading less like accusations and more like helpful reminders.
