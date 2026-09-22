# Modular monolith

Keep module ownership inside one release unit.

ID: modular-monolith
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/modular-monolith/

## Why: the goal or problem

Features interfere, but separate services add unwanted operating work. You need boundaries within one deployment.

## How: work toward a solution

1. Fictional app v1: one team deploys Catalog, Library and Billing together; A17 has no tag.
2. Library adds tag storage in its owned tables. Deploy app v2; Billing behavior stays unchanged. One database holds module-owned tables; direct cross-module access is forbidden.
3. Library calls Catalog's API in-process, then writes `travel`. A lookup error leaves no tag; retry after recovery.

## What: the concept

A modular monolith combines one deployment with deliberate internal boundaries. Module APIs protect owned internals. It is still a monolith. [Fowler](https://martinfowler.com/bliki/MonolithFirst.html)

Enforce boundaries beyond folders; releases and process failures remain shared. Modules can use hexagonal ports.
