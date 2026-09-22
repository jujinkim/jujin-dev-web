# Astro

Static pages with optional islands.

ID: astro
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/astro/

## Why: the goal or problem

A content site needs a few interactive controls. Sending a full application for otherwise readable articles creates unnecessary work.

## How: work toward a solution

Start with three Markdown articles and one layout. Next builds an index and three article pages, then sends files through hosting to the browser. Enable the optional Save island: article text stays readable. Missing layout stops the build; static files alone cannot retain personal saves. Previous, Reset, or reload restores earlier states.

## What: the concept

Astro renders content into HTML and adds client interactivity through selected islands. This example uses static output; Astro also supports server rendering.

Pair an island with a separate storage API.

[Source](https://docs.astro.build/en/concepts/why-astro/)
