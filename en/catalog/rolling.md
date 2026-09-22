# Rolling

Replace ready replicas in sequence.

ID: rolling
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/rolling/

## Why: the goal or problem

A replicated service needs an update without replacing every instance simultaneously. Mixed old and new versions must remain compatible.

## How: work toward a solution

Start with four ready v1 replicas and one spare slot. Next adds v2, checks readiness, then removes one v1. Repeat until four v2 remain. Fail readiness stops replacement before removing an old replica. Previous revisits the prior step; Reset or reload restores four v1. This authored policy uses zero unavailable replicas; readiness is not proof of correctness.

## What: the concept

Rolling releases replace replicas progressively. Old and new versions coexist, so their contracts and shared data must remain compatible.

A canary gate can precede replacement.

[Source](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
