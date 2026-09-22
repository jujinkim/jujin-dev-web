# Unreal Engine

Actors combine components and events.

ID: unreal-engine
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/unreal-engine/

## Why: the goal or problem

A team needs reusable world objects and visible gameplay event flows. Scattered one-off event handlers make collaboration difficult.

## How: work toward a solution

The schematic contains a player, floor, camera, and one collectible Actor. Move to item triggers an authored overlap guard: score changes from zero to one and the Actor disappears. Repeat contact cannot score again. Disable contact before moving to demonstrate a missed collection: score stays zero. Reset or reload restores everything. This is a concept simulation.

## What: the concept

Unreal Engine places Actors in levels. Components supply capabilities, while Blueprint graphs can define gameplay events and actions in reusable classes.

Keep graph responsibilities and score ownership explicit.

[Source](https://dev.epicgames.com/documentation/en-us/unreal-engine/actors-in-unreal-engine) · [Source 2](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-blueprints-visual-scripting-in-unreal-engine)
