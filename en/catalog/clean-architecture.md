# Clean architecture

Point source dependencies toward policy.

ID: clean-architecture
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/clean-architecture/

## Why: the goal or problem

Business rules should outlive a database or interface. If they import those details, replacing either forces policy changes too.

## How: work toward a solution

1. Fictional single process: R1, A17 unsaved. HTTP/CLI controller maps IDs into SaveArticle; SavedArticle validates them.
2. SaveArticle calls SaveRepository, implemented by memory/embedded-database adapters. Imports point inward: adapters → use-case contracts → domain; calls reach outward to storage. Only plain data crosses; ORM rows stay outside.
3. Saved: 0 → 1 entries; repeat → 1. Empty IDs or failure before writing → 0; retry after correction.

## What: the concept

Clean architecture directs source dependencies toward policy. Runtime calls can travel outward through inward-owned interfaces. [Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

Mapping costs maintenance. Combine with hexagonal ports. Four folders are not mandatory.
