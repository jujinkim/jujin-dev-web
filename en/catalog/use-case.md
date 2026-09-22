# Use case

Describe a goal through success and failure paths.

ID: use-case
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/use-case/

## Why: the goal or problem

Success-only descriptions omit failed writes and retries. You need to trace how a goal succeeds or remains unmet.

## How: work toward a solution

Fictional setup: signed-in commuter, A17 unsaved, available storage.

1. Reader requests saving A17’s link.
2. System validates A17.
3. System persists one entry.
4. System confirms success.

If persistence fails before writing: report unsaved, then retry from step 1. Repeating a successful save keeps one entry. A saved link does not promise offline reading.

## What: the concept

A use case describes interactions toward an actor’s goal, including success and failure paths. A diagram alone is not that narrative. [Source](https://alistaircockburn.com/Unifying%20us%20uc%20sm.pdf)

Split delivery into user stories; record motivation with a job story. Quality requirements still need separate treatment.
