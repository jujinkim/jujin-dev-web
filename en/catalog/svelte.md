# Svelte

Compile components; update at runtime.

ID: svelte
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/svelte/

## Why: the goal or problem

Interactive components need coordinated updates. Handwritten DOM changes scatter the relationship between data and displayed content.

## How: work toward a solution

Two Field notes cards start unsaved. Save on A17 changes only its label to Saved; B04 stays unsaved. Saving B04 changes the shared count from one to two. Repeating Save leaves two records: each ID counts once. The diagram separates compilation from runtime updates. Reset or reload clears both cards. There is no persistent storage here.

## What: the concept

Svelte compiles declarative components into browser code. Compilation prepares the UI; later clicks still run state updates. SvelteKit has a broader application scope.

Add routing and persistence as separate decisions.

[Source](https://svelte.dev/docs/svelte/overview)
