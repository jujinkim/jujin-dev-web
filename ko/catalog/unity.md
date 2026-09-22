# Unity

Components supply object behavior.

ID: unity
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/unity/

## Why: the goal or problem

Many game objects share capabilities but combine them differently. One large script per object repeats responsibilities.

## How: work toward a solution

The schematic contains a player, floor, camera, and one collectible. Move to item triggers authored contact logic: score changes from zero to one and the item disappears. Repeat contact cannot score again. Disable contact before moving to demonstrate a missed collection: score stays zero. Reset or reload restores the player and item. This is a concept simulation.

## What: the concept

Unity GameObjects contain components. Transform, rendering, collision, and authored scripts provide distinct responsibilities; an object name alone does not implement gameplay.

Keep score ownership clear and test component references.

[Source](https://docs.unity3d.com/Manual/GameObjects.html)
