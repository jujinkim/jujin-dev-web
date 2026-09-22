# Requirements: agree on what done means

Describe the behavior; AI writes requirements and decision records.

ID: srs
Language: en
Revision: 4
Translation source revision: 4
Canonical: https://kickoff.jujin.dev/en/guides/srs/

## Why: the goal or problem

“Make a shopping cart” sounds clear until the same book is added twice. One person expects two rows, another expects quantity two, and a third expects duplicates to be blocked. Code can implement any of these correctly and still disappoint the user. You need an agreement about visible behavior before choosing the internal representation.

## How: work toward a solution

1. Start with one outcome: a reader can prepare an order without losing selected books. Identify who acts, where the action begins, and what is outside this first release. Recommendations and discount campaigns can wait if they are not part of the agreed goal.
2. Walk through a concrete example. An empty cart receives book A once, then again. Agree that it shows one row with quantity two. Decide whether removing one copy leaves quantity one and whether unavailable stock leaves the cart unchanged. These are product decisions; an array or map is an implementation choice for AI.
3. Add the inconvenient paths. What does the person see during saving, after a network failure, or when they press twice? Separate a deliberate second addition from delivery of the same request twice. If the behavior is unresolved, ask about that outcome rather than silently inventing it.
4. Turn each decision into a check: given the initial cart and stock, perform the action and compare the resulting rows, quantities and feedback. Replace “fast” with an agreed condition and measurable threshold. Do not invent a universal performance target.
5. Have AI write the scenarios, open questions and accepted decisions. Give requirements stable identifiers so implementation tasks and checks can refer back to them. When scope changes, update the affected checks and record the reason; do not keep an obsolete test as the hidden authority.

Try reviewing only these examples with a collaborator. If both predict the same outcome for success, failure and repetition, the feature is ready for a more concrete implementation plan. A long document with unresolved behavior does not pass this check.

## What: the concept

This is requirements specification: describing observable behavior and constraints with verifiable acceptance criteria. An SRS is one way to organize that agreement; stories and scenarios are supporting formats, not choices the user must master. [NASA’s requirements checklist](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/) supports clear, checkable requirements. AI can record significant decisions using [context and consequences](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), while the user retains product decisions.
