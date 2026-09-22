# Language, library, framework, engine

Stop comparing tools that do different jobs.

ID: tools
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/tools/

## Why: the goal or problem

“TypeScript, React or a game engine?” mixes choices that solve different problems. Picking a popular name first can leave the team without the required export target, publishing workflow or maintainable development setup. You need to describe the result and operating constraints before comparing tools that might contribute to it.

## How: work toward a solution

1. Write the output and one representative task. A public article catalog, an account-based dashboard and a miniature racing game have different needs. Specify target devices, offline behavior, interaction, content editing and who will maintain the result. Separate required capabilities from ideas for later.
2. Group candidates by responsibility. You may need a language, a way to organize the application, a renderer, storage and a delivery path. A tool can cover several roles, but compare alternatives within the role being decided. A language and a framework can belong to the same solution.
3. Check the awkward requirement first. For a game, try a small scene and export to the intended device. For a catalog, publish two languages and a nested article URL. A pleasing local demo does not prove that packaging, content updates or deployment will work.
4. Compare ongoing work, not only first setup. Record dependency updates, available documentation, test support, platform restrictions, build requirements and licensing conditions. Use current official documentation for capabilities. Avoid turning an unfamiliar tool into a confident recommendation without checking the needed path.
5. Choose the smallest useful experiment. Build one complete slice with the same inputs and success criteria for each serious candidate. Record what worked, what was not tested, and the cost of adopting or replacing the tool. Do not promise that a benchmark on an unrelated project predicts this one.

Ask AI to recommend within the confirmed constraints, explain alternatives and expose unresolved project decisions. Once the direction is agreed, it can select routine helper libraries and internal implementation details within that scope. Finish with a reproducible run/build instruction and a decision note tied to the demonstrated output, so a future maintainer can repeat the evaluation.

Record which required outcome each rejected candidate could not deliver, so a future change of constraints can reopen the decision with evidence.

## What: the concept

Languages express programs; libraries provide callable functions; frameworks organize applications; engines combine runtime systems. These roles overlap and can coexist. [Godot's introduction](https://docs.godotengine.org/en/stable/getting_started/introduction/introduction_to_godot.html) illustrates an engine's scope, while [Astro's islands](https://docs.astro.build/en/concepts/islands/) illustrate one web architecture. Neither establishes a universal winner: suitability follows the task and its maintenance constraints.
