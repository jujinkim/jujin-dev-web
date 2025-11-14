---
publish: true
lang: en
title: "About Design Patterns"
---

Design patterns are important.
No matter how much you study, you're bound to violate patterns or mix them incorrectly, creating inefficient code structures. That's why you need to keep reviewing and thinking about them.

Often, while coding, you might find yourself applying a design pattern without even realizing it.
However, the reason for studying them is that a solution you create on your own is likely to have flaws or be inefficient. Design patterns have been refined by countless developers over a long period, offering the following advantages:
1. Just by knowing the pattern, you can understand the implementation's general shape. -> This facilitates communication among developers. "Developers" here also includes "your past self."
2. They are efficient. They are not structures created after a few hours of thought but have been historically refined over a long time, so they have fewer problems.

Even experienced senior developers often misapply design patterns, even when they know them well. Therefore, not just juniors but also seniors must constantly study and strive to understand them. It's also good to go further and research new patterns.

Before "studying" design patterns, you need to understand why solutions that anyone could implement have been refined over a long period and established under the name of "patterns." This is because design patterns are not just simple methodologies.
To understand this, we must first know the `SOLID` principles. Afterward, you will realize that all design patterns were ultimately created to implement various solutions **while adhering to the SOLID principles**. Furthermore, you should make it a habit to always think about these principles. Even if a design pattern is applied, if the SOLID principles are not followed, it can be considered a misapplied pattern.

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

So, in the next post, I will break down the `SOLID` principles one by one.

Recommended Site
- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)
