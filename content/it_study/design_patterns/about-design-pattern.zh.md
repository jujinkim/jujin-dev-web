---
publish: true
lang: zh
title: "关于设计模式"
---

设计模式很重要。
无论怎么学习，有时还是会违反模式或错误地混合使用，从而创建出低效的代码结构。因此，需要不断地回顾和思考。

在开发过程中，很多时候我们会在不知不觉中应用了某种设计模式。
但之所以需要学习，是因为随心所欲创建的东西通常会有漏洞或效率低下的可能性很高。设计模式是众多开发者经过长时间共同打磨出来的模式，因此具有以下优点：
1. 只要知道是什么模式，就能在一定程度上了解其实现形态。 -> 方便开发者之间的沟通。这里的开发者也包括“过去的自己”。
2. 高效。它不是几个小时思考出来的结构，而是历史上经过长期打磨的结构，因此问题较少。

即使是经验丰富的资深开发者，也常常会错误地应用设计模式。甚至在明知故犯的情况下。因此，不仅是初级开发者，资深开发者也应该不断学习和努力理解。更进一步，研究新的模式也是一个好主意。

首先，在“学习”设计模式之前，我们需要了解为什么任何人都能实现的解决方案会经过长时间的打磨，并以“模式”之名固定下来。原因在于，设计模式不仅仅是一种方法论。
为了理解这一点，我们首先需要了解 `SOLID` 原则。之后，我们会意识到，所有的设计模式最终都是为了**在遵守SOLID原则的前提下实现**各种实现方法而创建的，并且我们应该养成时刻思考这一原则的习惯。即使应用了设计模式，如果没有遵守SOLID原则，也可以看作是错误应用的模式。

总之，目录如下。

1. [[solid-principle|SOLID]]
2. 创建型(Creational)设计模式
	1. Singleton
	2. Factory
	3. Abstract Factory
	4. Builder
	5. Prototype
3. 结构型(Structural)设计模式
	1. Adapter
	2. Bridge
	3. Composite
	4. Decorator
	5. Facade
	6. Flyweight
	7. Proxy
4. 行为型(Behavioral)设计模式
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
