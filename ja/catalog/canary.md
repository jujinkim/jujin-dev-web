# Canary

Evaluate limited exposure against control.

ID: canary
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/canary/

## Why: the goal or problem

A release may work in testing yet fail for real users. Exposing everyone at once makes that uncertainty expensive.

## How: work toward a solution

The synthetic window contains 1,000 requests per cohort: v1 has two errors, v2 thirty. Next computes 0.2% and 3%, then applies this exercise’s stop rule above 1%. Candidate traffic returns to v1. Select No samples: zero requests means insufficient evidence, never success. Previous revisits calculations; Reset or reload restores the fixture.

## What: the concept

Canary releases expose a limited population to a candidate and compare outcomes with a control before expanding. Useful signals need representative samples.

This threshold is illustrative; combine evaluation with rolling or blue-green.

[Source](https://sre.google/workbook/canarying-releases/)
