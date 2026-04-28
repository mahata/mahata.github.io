---
title: Go's Error Wrapping and When to Use It
date: 2021-03-07
---

Go 1.13 introduced `%w` in `fmt.Errorf` and the `errors.Is` / `errors.As` functions, making it possible to build an error chain without reaching for third-party packages. I've been using these patterns daily and want to share what I've learned.

## Wrapping an error

Before 1.13, the common idiom was:

```go
return fmt.Errorf("loadUser: %v", err)
```

Using `%v` embeds the error message as plain text, so all context is lost — the caller can't inspect the original error type.

With `%w`, the original error is preserved inside the new one:

```go
return fmt.Errorf("loadUser: %w", err)
```

Now the caller can use `errors.Is` to check against sentinel errors anywhere in the chain:

```go
var ErrNotFound = errors.New("not found")

func loadUser(id string) error {
    // ... database call fails
    return fmt.Errorf("loadUser %s: %w", id, ErrNotFound)
}

func main() {
    err := loadUser("42")
    if errors.Is(err, ErrNotFound) {
        fmt.Println("user does not exist")
    }
}
```

## Unwrapping to a concrete type

`errors.As` lets you extract a specific error type even if it's wrapped several layers deep:

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

func validate(email string) error {
    if !strings.Contains(email, "@") {
        return &ValidationError{Field: "email", Message: "missing @"}
    }
    return nil
}

func createUser(email string) error {
    if err := validate(email); err != nil {
        return fmt.Errorf("createUser: %w", err)
    }
    return nil
}

func main() {
    err := createUser("notanemail")

    var ve *ValidationError
    if errors.As(err, &ve) {
        fmt.Printf("bad field: %s\n", ve.Field) // bad field: email
    }
}
```

## When *not* to wrap

Wrapping makes sense when the caller is expected to inspect or act on the underlying error. If you're writing an internal helper that will never be tested for a specific error type, plain `fmt.Errorf("...: %v", err)` keeps things simpler and avoids accidentally leaking implementation details.

A good rule of thumb: wrap at package boundaries, use `%v` inside.

## Bonus: printing the full chain

```go
import "errors"

func printChain(err error) {
    for err != nil {
        fmt.Println(err)
        err = errors.Unwrap(err)
    }
}
```

Clean error chains make debugging significantly easier, especially in production logs where you only have a single line to understand what went wrong.
