# Microservices

Release capability services independently.

ID: microservices
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/microservices/

## Why: the goal or problem

Stable business capabilities need different release schedules or owners. One shared release can force unrelated teams to coordinate every change.

## How: work toward a solution

1. Fictional reading app: one team; Catalog, Library and Billing each v1. A17 has no tag.
2. Deploy only Library v2 with a compatible tag feature; Catalog and Billing stay v1.
3. Library queries Catalog over the network, then writes `travel` to its own store. A lookup timeout before writing leaves no tag; report failure and retry after recovery.

## What: the concept

Microservices are independently deployable capability services with explicit contracts and owned data. Separate processes alone do not ensure independence. [Lewis and Fowler](https://martinfowler.com/articles/microservices.html)

Network failures and cross-service data require coordination. Remaining capabilities can stay a modular monolith.
