# React

State changes drive rendered labels.

ID: react
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/react/

## Why: the goal or problem

Several controls reflect the same changing data. Updating each label separately risks showing contradictory states.

## How: work toward a solution

Two Field notes cards start unsaved. Save on A17 changes only its label to Saved; B04 stays unsaved. Saving B04 changes the shared count from one to two. Repeating Save leaves two records: each ID counts once. The diagram traces event, state update, and rendering. Reset or reload clears both cards. There is no persistent storage here.

## What: the concept

React components receive props and describe UI from state. A state setter requests rendering; changing an ordinary variable does not provide that mechanism.

Add persistence separately.

[Source](https://react.dev/learn)
