# Godot

Nodes compose reusable scenes.

ID: godot
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/godot/

## Why: the goal or problem

A game repeats objects made from smaller parts. Rebuilding each object separately makes shared behavior hard to maintain.

## How: work toward a solution

The schematic contains a player, floor, camera, and one collectible instance. Move to item triggers authored contact logic: score changes from zero to one and the item disappears. Repeat contact cannot score again. Disable contact before moving to demonstrate a missed collection: score stays zero. Reset or reload restores the player and item. This is a concept simulation.

## What: the concept

Godot organizes nodes into scenes that can be instantiated inside other scenes. A scene can be a reusable collectible or the game entry point.

Test gameplay and exports separately.

[Source](https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html)
