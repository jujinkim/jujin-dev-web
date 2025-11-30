---
publish: true
lang: en
title: "About Design Patterns"
---

Design patterns are important.
No matter how much you study, sometimes you inevitably violate a pattern or mix them incorrectly, leading to inefficient code structures. Therefore, you need to keep reviewing and pondering them.

As I build things, I often unknowingly apply certain design patterns.
However, the reason why I need to study them is that what I've made on my own usually has some flaws or is likely to be inefficient. Design patterns are patterns created and refined by numerous developers over a long period, so they have the following advantages:
1. Just knowing what pattern it is, you can get a sense of the implementation. -> Easier communication among developers. This includes "my past self."
2. They are efficient. Since they are structures refined over a long history, not just something thought up in a few hours, they have fewer problems.

Even experienced senior developers often misapply design patterns, even when they know them well. Therefore, not only juniors but also seniors must constantly study and strive to understand them. Furthermore, it is good to research new patterns.

First, before "studying" design patterns, you need to understand why solutions that anyone can implement have been refined over a long period and settled as patterns. This is because design patterns are not just simple methodologies.
To understand this, we must first know the `SOLID` principles. Afterwards, we will realize that all design patterns are ultimately created to **implement various solutions while adhering to the SOLID principles**, and furthermore, we must develop the habit of always thinking about these principles. Even if a design pattern is applied, if the SOLID principles are not followed, it can be seen as an incorrectly applied pattern.

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

So, the next article will delve into each of the `SOLID` principles.

Recommended Site
- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)
