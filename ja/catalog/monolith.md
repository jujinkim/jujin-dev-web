# Monolith

Release the server application as one unit.

ID: monolith
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/monolith/

## Why: the goal or problem

A small app needs manageable releases. Coordinating separate services can cost more than the problem warrants.

## How: work toward a solution

1. Fictional app v1: one team deploys Catalog, Library and Billing together; A17 has no tag.
2. Add tag support in Library; deploy app v2. Billing behavior stays unchanged, but ships in the same artifact. The app owns a shared database.
3. Library calls Catalog in-process, then writes `travel`. A Catalog error before writing leaves no tag; retry after recovery.

## What: the concept

A monolith deploys its server application as one unit. Replicas of that artifact remain a monolith; internal modules are allowed. [Lewis and Fowler](https://martinfowler.com/articles/microservices.html)

Releases and process failures are shared. Add explicit modules as boundaries matter.
