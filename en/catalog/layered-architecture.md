# Layered architecture

Separate responsibilities with explicit dependency rules.

ID: layered-architecture
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/layered-architecture/

## Why: the goal or problem

Screen changes, business rules and storage edits are tangled together. Separate responsibilities so a change has a clearer home.

## How: work toward a solution

1. Fictional single process: reader R1, A17 unsaved; memory or embedded database.
2. HTTP or CLI presentation imports and calls application validation, which imports and calls persistence. This closed-layer example forbids skipping layers.
3. Saved returns upward: 0 → 1 entries; repeat → 1. Empty IDs or failure before writing → 0; retry after correction.

Switching HTTP to CLI leaves validation in place.

## What: the concept

Layered architecture separates responsibilities and constrains dependencies. Logical layers need not be separate machines. [Microsoft](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier)

Pass-through layers add ceremony. Ports can invert storage dependencies. Folder names alone enforce nothing.
