# Static hosting

Public files and private writes separate.

ID: static-hosting
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/static-hosting/

## Why: the goal or problem

Public articles do not change for each request. Running application logic for every read adds work that file delivery can avoid.

## How: work toward a solution

Read article follows the file path. Save A17 follows a separate API path into an external store. Repeat Save keeps one record under the example’s reader/article key. Fail next save returns failure without changing storage. Restart handler keeps the record because storage is outside the handler. Reset or reload clears this page-memory simulation, including its illustrated store.

## What: the concept

Static hosting delivers prebuilt HTML, CSS, and JavaScript. Browser interaction remains possible, but public files do not store private reader records.

Pair generated files with an authenticated API for personal writes.

[Source](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
