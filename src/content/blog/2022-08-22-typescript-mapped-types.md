---
title: TypeScript Mapped Types in Practice
date: 2022-08-22
---

TypeScript's mapped types let you derive a new type from an existing one by iterating over its keys. I reach for them often, so I want to walk through a few patterns I use regularly.

## The basic form

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

Both of these ship in TypeScript's standard library, but writing them yourself is a good way to understand the mechanics: `K in keyof T` iterates over each key of `T`, and `T[K]` looks up the value type at that key.

## Making every field optional for updates

When building a REST API client, I often need an "update" variant of a model where every field is optional:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;

// Equivalent to:
// {
//   name?: string;
//   email?: string;
// }
```

`Omit` removes the keys I never want updated, then `Partial` makes the rest optional.

## Strongly typed event maps

Instead of keeping separate type declarations for every event, I define them in one object and derive the handler type automatically:

```typescript
interface AppEvents {
  userLoggedIn: { userId: string; timestamp: Date };
  pageViewed: { path: string };
  errorOccurred: { message: string; stack?: string };
}

type EventHandlers = {
  [K in keyof AppEvents]: (payload: AppEvents[K]) => void;
};

function on<K extends keyof AppEvents>(
  event: K,
  handler: EventHandlers[K]
): void {
  // wire up the handler
}

on('userLoggedIn', ({ userId, timestamp }) => {
  console.log(`${userId} logged in at ${timestamp}`);
});
```

Now adding a new event type automatically propagates to the handler signature.

## Conditional value types

Mapped types can also change the value type based on a condition:

```typescript
type Stringify<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

type SerializedUser = Stringify<User>;
// {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;  <-- Date becomes string
// }
```

This is handy when serializing objects to JSON and you want the types to reflect reality.

Mapped types feel a bit abstract at first, but once they click they replace a lot of repetitive type definitions.
