# Monospace

Compare the same text specimen.

ID: monospace
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/catalog/monospace/

## Why: the goal or problem

Code and text tables rely on aligned positions. Variable Latin character widths make those positions drift.

## How: work toward a solution

All five specimens share a sentence, iiiWWW 0123, and the same numbers. Edit the specimen, adjust its size, and show measured width guides or tabular digits. Text remains shaped as one string. Reset or reload restores the initial text at 48px. Supported Latin characters share an advance width; fallback characters may differ.

## What: the concept

Monospaced Latin glyphs share an advance width even when their ink shapes differ.

CJK, emoji, combining marks, and fallback faces can break that model; inspect the supported character set.

[W3C](https://www.w3.org/TR/css-fonts-3/)
