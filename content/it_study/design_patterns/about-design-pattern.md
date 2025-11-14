---
publish: true
lang: ko
title: 디자인 패턴에 대해
---
디자인 패턴은 중요하다.
공부를 아무리 해도 가끔은 패턴을 위배하거나 잘못 섞어써서 비효율적인 코드 구조를 만들기 마련이다. 그래서 계속 봐주고 계속 고민해줘야한다.

만들다 보면 나도 모르게 이미 어떤 디자인패턴을 적용할 때가 많다.
하지만 공부를 해야하는 이유는, 내 멋대로 만든건 보통 어딘가 구멍이 있거나 비효율적일 확률이 높다. 디자인 패턴은 수많은 개발자들이 긴 시간동안 다같이 다듬어서 만든 패턴이기 때문에, 다음과 같은 이점이 있다.
1. 어떤 패턴인지만 알고 있어도 어느정도 구현 모양을 알 수 있다. -> 개발자들끼리 커뮤니케이션 편함. 여기서 개발자들이란 "과거의 나"도 포함.
2. 효율적이다. 몇시간 잠깐 생각해서 만든 구조가 아닌 역사적으로 오랫동안 다듬어진 구조이기 때문에, 문제가 적다.

아무리 노련한 시니어 개발자라도 디자인 패턴을 잘못 적용하는 경우가 잦다. 심지어 잘 알고있음에도. 그래서 주니어 뿐 아니라 시니어라도 항상 끊임 없이 공부하고, 이해하려고 노력해야한다. 더 나아가 새로운 패턴을 연구해보는 것도 좋다.

우선 디자인패턴을 "공부"하기 전에, 왜 누구든 구현할 수 있는 해결책 따위들이 오랜 기간동안 다듬어져서 패턴이라는 이름으로 정착되었는지 알아야 한다. 이 이유는, 디자인 패턴은 단순한 방법론이 아니기 때문이다.
이 것을 알기 위해서 우리는 `SOLID` 원칙을 먼저 알아야 한다. 이 후, 모든 디자인 패턴은 결국 여러 구현 방법을 **SOLID 원칙을 지키면서 구현**하기 위해 만들어 졌다는걸 깨닫고, 더 나아가 이 원칙을 항상 생각하는 습관을 들여야 한다. 디자인 패턴을 적용했더라도 SOLID원칙이 지켜지지 않았으면 잘못 적용된 패턴이라고 볼 수 있다.

아무튼, 목차는 아래와 같다.

1. [[solid-principle|SOLID]]
2. 생성(Creational) 디자인패턴
	1. Singleton
	2. Factory
	3. Abstract Factory
	4. Builder
	5. Prototype
3. 구조(Structural) 디자인패턴
	1. Adapter
	2. Bridge
	3. Composite
	4. Decorator
	5. Facade
	6. Flyweight
	7. Proxy
4. 행위(Behavioral) 디자인패턴
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
5. 아키텍처 패턴
	1. MVC
	2. MVP
	3. MVVM
	4. MVI

그래서 다음 글은 `SOLID` 원칙에 대해 하나하나 까보도록 하겠다.

추천 싸이트
- [Refactoring Guru - Design patterns](https://refactoring.guru/design-patterns)