---
title: Service Provider Interface
date: 2018-10-10
---

SPI (Service Provider Interface) is a pattern for decoupling service implementation from its usage.

## Java SPI Example

```java
// Service interface
public interface MessageService {
    String getMessage();
}

// Service provider
public class HelloMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "Hello!";
    }
}

// Service provider configuration (META-INF/services/com.example.MessageService)
com.example.HelloMessageService
```

## Usage

```java
ServiceLoader<MessageService> loader = ServiceLoader.load(MessageService.class);
for (MessageService service : loader) {
    System.out.println(service.getMessage());
}
```

This pattern is commonly used in Java for pluggable architectures (JDBC, SLF4J, etc.).
