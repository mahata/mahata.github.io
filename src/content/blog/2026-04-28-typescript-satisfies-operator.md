---
title: "TypeScript's satisfies Operator: Type Safety Without Widening"
date: 2026-04-28
---

TypeScript 4.9 introduced the `satisfies` operator, a small but powerful addition that solves an annoying trade-off that many developers hit when working with typed objects.

## The Problem

Suppose you have a palette of colors where each color can be represented either as an RGB tuple or a CSS hex string:

```typescript
type Color = [number, number, number] | string;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};
```

Without any annotation, TypeScript infers the narrowest possible type for each value, which is great for autocomplete. But if you add a type annotation to enforce the shape, the inferred types get widened:

```typescript
const palette: Record<string, Color> = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};

// TypeScript no longer knows that `red` is a tuple — it's just `Color`
palette.red.toUpperCase(); // no error! (should be an error at runtime)
```

You lose the specific type information the moment you attach a type annotation.

## The satisfies Solution

The `satisfies` operator validates that a value matches a type **without changing the inferred type**:

```typescript
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, Color>;

// TypeScript still knows the specific types
palette.red.map((v) => v * 2); // ✅ [number, number, number]
palette.green.toUpperCase();   // ✅ string
palette.red.toUpperCase();     // ❌ Error: Property 'toUpperCase' does not exist on type 'number[]'
```

You get the best of both worlds: the constraint check from the annotation *and* the narrow type from inference.

## A Real-World Example: Route Configuration

One place where `satisfies` shines is route or configuration maps. Consider a simple Express-like route registry:

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RouteConfig {
  method: HttpMethod;
  path: string;
  handler: () => void;
}

const routes = {
  listUsers:   { method: "GET",    path: "/users",      handler: () => {} },
  createUser:  { method: "POST",   path: "/users",      handler: () => {} },
  deleteUser:  { method: "DELETE", path: "/users/:id",  handler: () => {} },
} satisfies Record<string, RouteConfig>;

// TypeScript knows `routes.listUsers.method` is exactly "GET", not just HttpMethod
const m = routes.listUsers.method; // type: "GET"
```

If you accidentally typo a method name — say `"GETT"` — TypeScript catches it immediately, while the individual route objects retain their literal types.

## satisfies vs. Type Assertions (`as`)

It is worth noting the difference from `as`:

```typescript
// `as` silences TypeScript — it does not check the value
const bad = { red: "not-a-color" } as Record<string, Color>; // no error!

// `satisfies` checks the value — you get an error when something is wrong
const good = { red: "not-a-color" } satisfies Record<string, Color>; // ❌ Error
```

`satisfies` is a validation, whereas `as` is a promise (that you might break).

## Summary

| | Type annotation | `as` | `satisfies` |
|---|:---:|:---:|:---:|
| Validates value matches type | ✅ | ❌ | ✅ |
| Preserves narrow inferred type | ❌ | ❌ | ✅ |

Reach for `satisfies` whenever you want to enforce a shape constraint without giving up the precise types that TypeScript infers for you. It is especially useful for configuration objects, lookup tables, and any other value where you know the structure up front but want to keep specific literal or tuple types accessible downstream.
