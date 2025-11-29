---
publish: true
lang: zh
title: "关于设计模式"
---

设计模式很重要。
无论如何学习，有时我们还是会违反模式或错误地混合使用模式，从而创建低效的代码结构。因此，我们需要不断地审查和思考。

在开发过程中，我经常在不知不觉中应用了某种设计模式。
但学习它的原因是，我随意创建的东西通常会有漏洞或效率低下。设计模式是无数开发人员经过长时间共同打磨而成的模式，因此它具有以下优点：
1. 即使只知道某种模式，也能大致了解其实现形式。-> 方便开发人员之间的沟通。这里的开发人员包括“过去的自己”。
2. 高效。这不是经过几个小时的短暂思考就创建的结构，而是经过长期历史打磨的结构，因此问题较少。

即使是经验丰富的资深开发人员也常常错误地应用设计模式。即使他们很了解。因此，不仅是初级开发人员，资深开发人员也应该始终不断学习并努力理解。更进一步，研究新的模式也是很好的。

首先，在“学习”设计模式之前，我们需要了解为什么任何人都可以实现的解决方案，经过长时间的打磨，最终以模式的名义固定下来。原因是设计模式不仅仅是一种简单的方法论。
为了理解这一点，我们首先需要了解 `SOLID` 原则。之后，我们会意识到所有设计模式最终都是为了**在遵循 SOLID 原则的情况下实现**各种实现方法，并进一步养成始终考虑这些原则的习惯。即使应用了设计模式，如果未能遵循 SOLID 原则，也可以认为是错误的应用。

总之，目录如下：

1. [[solid-principle|SOLID]]
2. 创建型设计模式
	1. Singleton
	2. Factory
	3. Abstract Factory
	4. Builder
	5. Prototype
3. 结构型设计模式
	1. Adapter
	2. Bridge
	3. Composite
	4. Decorator
	5. Facade
	6. Flyweight
	7. Proxy
4. 行为型设计模式
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
5. 架构模式
	1. MVC
	2. MVP
	3. MVVM
	4. MVI

因此，下一篇文章将逐一探讨 `SOLID` 原则。

推荐网站
- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)
