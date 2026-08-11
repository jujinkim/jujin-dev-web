---
publish: true
lang: en
title: "About Design Patterns"
---

Design patterns are important. No matter how much you study, sometimes you inevitably violate patterns or mix them incorrectly, leading to inefficient code structures. Therefore, you need to continuously review and ponder them.

As I create, I often find myself unknowingly applying certain design patterns. However, the reason for studying them is that what I create on my own usually has some flaws or is likely to be inefficient. Design patterns are refined by many developers over a long period, offering the following advantages:

1. Knowing just the pattern allows you to understand the general implementation structure. -> Facilitates communication among developers. Here, "developers" also includes "my past self."
2. They are efficient. Because they are structures refined over a long history, not something hastily conceived in a few hours, they have fewer problems.

Even experienced senior developers often misapply design patterns, even when they know them well. Therefore, not only juniors but also seniors should constantly study and strive to understand them. Furthermore, researching new patterns is also beneficial.

First, before "studying" design patterns, you need to understand why solutions that anyone could implement have been refined over a long period and settled as patterns. The reason is that design patterns are not just simple methodologies. To understand this, we must first know the `SOLID` principles. Afterward, you will realize that all design patterns were ultimately created to **implement various methods while adhering to the SOLID principles**, and furthermore, you should develop the habit of always considering these principles. Even if a design pattern is applied, if the SOLID principles are not followed, it can be considered a wrongly applied pattern.

Anyway, the table of contents is as follows.

1. [[solid-principle|SOLID]]
2. Creational Design Patterns
   1. Singleton
   2. Factory
   3. Abstract Factory
   4. Builder
   5. Prototype
3. Structural Design Patterns
   1. Adapter
   2. Bridge
   3. Composite
   4. Decorator
   5. Facade
   6. Flyweight
   7. Proxy
4. Behavioral Design Patterns
   1. Chain of Responsibility
   2. Command
   3. Interpreter
   4. Iterator
   5. Mediator
   6. Memento
   7. Observer
   8. State
   9. Strategy
   10. Template
   11. Visitor
5. Architectural Patterns
   1. MVC
   2. MVP
   3. MVVM
   4. MVI

So, in the next post, I will delve into each of the `SOLID` principles.

Recommended Sites

- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)
