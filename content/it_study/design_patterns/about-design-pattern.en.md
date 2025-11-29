---
publish: true
lang: en
title: "About Design Patterns"
---

Design patterns are important.
No matter how much you study, sometimes you inevitably violate patterns or mix them incorrectly, creating inefficient code structures. That's why you need to keep reviewing and thinking about them.

As I create things, I often find myself applying certain design patterns unconsciously.
However, the reason to study is that what I've made on my own often has flaws or is inefficient. Design patterns have been refined by many developers over a long period, offering the following advantages:
1. Just knowing what a pattern is allows you to understand its general implementation shape. -> Easier communication among developers. This includes "past me."
2. They are efficient. Since they are structures refined over a long history, not just thought up in a few hours, they have fewer problems.

Even seasoned senior developers often misapply design patterns, even when they know them well. Therefore, not only juniors but also seniors should constantly study and strive to understand them. Furthermore, it's good to research new patterns.

First, before "studying" design patterns, we need to understand why solutions that anyone could implement have been refined over a long period and settled under the name of "patterns." The reason is that design patterns are not just simple methodologies.
To understand this, we must first learn the `SOLID` principles. After that, we realize that all design patterns are ultimately created to implement various methods while **adhering to the SOLID principles**, and furthermore, we must develop the habit of always considering these principles. Even if a design pattern is applied, if the SOLID principles are not followed, it can be considered a misapplied pattern.

Anyway, the table of contents is as follows:

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

So, the next article will delve into each of the `SOLID` principles.

Recommended Site
- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)
