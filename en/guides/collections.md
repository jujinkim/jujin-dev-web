# Array, list, map, set: pick by operation

Order, lookup, and uniqueness are different jobs.

ID: collections
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/collections/

## Why: the goal or problem

A saved-book list shows duplicates, changes order unexpectedly, or cannot find the right entry after a title is edited. Choosing a familiar data structure will not resolve those ambiguities. First decide what counts as the same book, whether order matters, and what repeated actions should mean. Then choose a representation that preserves those rules.

## How: work toward a solution

1. Describe the visible behavior with a few identifiers. Save A17, save B04, then save A17 again. Suppose the agreed result is two entries, in their original insertion order. A title is display text; a stable ID distinguishes identity from later edits or two books sharing a name.
2. List the operations. Reading in sequence, locating an item by ID, checking membership and counting repeated purchases are different jobs. Do not discard duplicates if they represent quantity. A cart with two copies is not the same requirement as a collection of unique bookmarks.
3. Let AI choose an initial structure. An array can hold an ordered sequence. A map associates each key with a value. A set records unique membership. In JavaScript, maps and sets iterate in insertion order, but that language-specific behavior should not be assumed for every collection in every language.
4. Test identity explicitly. Two separately created JavaScript objects are different keys even if both contain the same book ID. Use the agreed stable ID as the lookup key when that is the product's identity rule. Define missing-item and deletion behavior instead of treating every lookup as a success.
5. Keep a second index only when needed. If an ordered list and lookup map both exist, every insertion, deletion and update must keep them consistent. Prefer one authoritative representation until measurements or required operations justify the synchronization work.

Verify the sequence above, deletion, a renamed title, an unknown ID and repeated requests. Check saved data after reload separately: an in-memory collection is not durable storage. Users decide meaningful ordering and duplicate behavior; AI can select the implementation without a questionnaire about internal container names.

Write the expected IDs after each action so a change in order or membership is visible before choosing an optimization.

## What: the concept

These are collection semantics: sequence, keyed lookup and uniqueness. Arrays, maps and sets provide different combinations of those operations. [MDN explains JavaScript keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections). The useful starting point is the behavior to preserve; optimization comes after representative measurements, not from a universal ranking of container types.
