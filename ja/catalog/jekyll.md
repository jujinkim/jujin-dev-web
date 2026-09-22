# Jekyll

Ruby builds; hosting serves files.

ID: jekyll
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/jekyll/

## Why: the goal or problem

A text-first publishing team needs reusable layouts and predictable builds. Rewriting complete pages for each post wastes effort.

## How: work toward a solution

Start with three Markdown articles and one layout. Next runs the Ruby build, creates an index and three article pages, then sends files through hosting to the browser. Missing layout stops this example before output. Reading these files needs no Ruby request handler. Personal Save records need a separate API. Previous, Reset, or reload restores earlier states.

## What: the concept

Jekyll transforms Markdown and layouts into a static site using a Ruby build workflow. Generation and hosting are separate choices.

Maintain build dependencies separately from hosting.

[Source](https://jekyllrb.com/docs/)
