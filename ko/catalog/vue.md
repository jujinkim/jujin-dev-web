# Vue

Reactive state updates templates.

ID: vue
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/vue/

## Why: the goal or problem

Templates and changing data must stay synchronized. Updating visible fields individually creates duplicate work and inconsistent screens.

## How: work toward a solution

Two Field notes cards start unsaved. Save on A17 changes only its label to Saved; B04 stays unsaved. Saving B04 changes the shared count from one to two. Repeating Save leaves two records: each ID counts once. The diagram connects reactive state to the template. Reset or reload clears both cards. There is no persistent storage here.

## What: the concept

Vue binds templates to reactive state. A single-file component can colocate logic, template, and styles; it is an authoring format, not a network-file guarantee.

Define shared ownership and external persistence separately.

[Source](https://vuejs.org/guide/introduction.html)
