# Serverless functions

Invocations use external durable state.

ID: serverless-functions
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/serverless-functions/

## Why: the goal or problem

An occasional request needs server-side work, but your team does not want to operate a continuously listening process itself.

## How: work toward a solution

Read article invokes a handler. Save A17 invokes another handler and writes an external store. Repeat Save keeps one record under the example’s reader/article key. Fail next save returns failure without changing storage. Restart handler discards execution state but retains that record. Reset or reload clears this page-memory simulation, including its illustrated store.

## What: the concept

Serverless functions run managed handlers in response to events or requests. The platform manages servers; application correctness still belongs to the developer.

Design duplicate handling and persistence explicitly; never assume a warm instance.

[Source](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
