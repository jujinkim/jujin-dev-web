# Hexagonal architecture

Keep application behavior behind technology-independent ports.

ID: hexagonal-architecture
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/hexagonal-architecture/

## Why: the goal or problem

Testing a business rule should not require a live database or web server. External tools need replaceable connection points.

## How: work toward a solution

1. Fictional single process: R1, A17 unsaved. HTTP or CLI adapters call SaveArticle through its input port.
2. SaveArticle validates IDs, then calls a memory or embedded-database adapter through SaveRepository. Both storage adapters depend on this application-owned port; the application imports neither implementation.
3. Saved: 0 → 1 entries; repeat → 1. Empty IDs or failure before writing → 0; retry after correction.

## What: the concept

Hexagonal architecture connects an application through ports and technology-specific adapters. Six sides do not mandate six components. [Cockburn](https://alistair.cockburn.us/hexagonal-architecture)

Ports add indirection. Clean dependency rules can organize internal policy.
