# OOAD: give each object a job

Model behavior and ownership before drawing a forest of classes.

ID: ooad
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/ooad/

## Why: the goal or problem

An order can be marked paid on one screen but remain editable on another. Validation is copied between buttons, handlers and database code, so a rule change fixes one path and misses another. You need one owner for each business rule and a clear account of how the owners cooperate, including when a step fails.

## How: work toward a solution

1. Begin with one operation: confirm an order. Write what must be true before and after it, such as a nonempty order and a recorded outcome. Keep product policy separate from the technology used to save or transmit it.
2. Name responsibilities in a small table. Order guards its confirmation rule. Inventory decides whether stock can be reserved. The payment adapter translates requests to the provider. A coordinator decides the order of calls and what to do when one fails. Names should clarify ownership, not force every noun into a class.
3. Walk through a failure. Stock is reserved but payment fails. Who releases the reservation, records the failure and makes retry safe? Avoid putting the same recovery decision inside several objects. If automatic recovery is impossible, define a visible pending state and an owner for follow-up.
4. Protect the rules at their owner. Calling the same operation from a browser, a command-line tool or a background task should not bypass the rule merely because the interface changed. Pass the information needed for a decision rather than handing every collaborator unrestricted access to private state.
5. Implement one path and test it before generalizing. If the operation is a short, stable sequence, a transaction script may be enough. Add a richer model when repeated rules and state transitions justify it. Extra objects and indirection have a maintenance cost too.

Ask AI to derive useful classes, methods and tests from this responsibility model. Users confirm behavior and project-wide boundaries, not every class diagram. A sketch helps when collaborators misunderstand a boundary; otherwise a table and executable examples can carry the same agreement. Review whether a rule has one owner and whether every entry path reaches it.

When adding another entry point, reuse the rule tests to check that the new path still reaches the same owner.

## What: the concept

Object-oriented analysis identifies domain concepts and constraints; object-oriented design assigns responsibilities to collaborating objects. A [domain model](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model) can keep rules together. It is useful when those rules warrant it, and does not require splitting the application into microservices or drawing UML for every change.
