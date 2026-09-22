# Always-on server

Process lifetime differs from data lifetime.

ID: always-on-server
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/always-on-server/

## Why: the goal or problem

Requests need a process whose runtime you control. Managed handlers alone may not provide the process lifecycle your service needs.

## How: work toward a solution

Read article and Save A17 enter the listening process. Save writes an external store. Repeat Save keeps one record under the example’s reader/article key. Fail next save returns failure without changing storage. Restart handler replaces the process while retaining the stored record. Reset or reload clears this page-memory simulation, including its illustrated store.

## What: the concept

An always-on server intends to keep a process listening for requests. It can restart; its name does not guarantee continuous availability.

Keep durable data external; assign supervision, capacity and recovery to an owner.

[Source](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
