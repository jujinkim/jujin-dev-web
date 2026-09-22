# Hugo

Content and templates become files.

ID: hugo
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/hugo/

## Why: the goal or problem

Many content files need consistent pages. Editing repeated HTML by hand makes site-wide changes slow and error-prone.

## How: work toward a solution

Start with three Markdown articles and one layout. Next resolves templates, creates an index and three article pages, then sends files through hosting to the browser. Missing layout stops this example before output. A separate browser widget can call a Save API; the build tool never handles reader requests. Previous, Reset, or reload restores earlier states.

## What: the concept

Hugo combines content with templates to generate static files. Its Go implementation does not require authors to write articles as Go programs.

Plan template maintenance and personal storage separately.

[Source](https://gohugo.io/about/introduction/)
