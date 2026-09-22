# Design decisions that leave a paper trail

Record why a choice won, and when it should stop winning.

ID: adr
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/adr/

## Why: the goal or problem

A new contributor sees generated HTML and proposes a server rewrite. Nobody remembers why the team avoided a server, which alternatives were considered, or whether private accounts were excluded deliberately. Repeating the debate costs time, while blindly defending an old choice is equally risky. You need the original reasoning and a clear condition for revisiting it.

## How: work toward a solution

1. Pick a significant decision, not every variable name. For a public catalog, the question might be how to publish pages within a small operating budget. Note the owner, date, requirements and constraints that actually shaped the decision.
2. Write the alternatives in terms of consequences. Pre-rendered pages simplify public delivery but need rebuilding when content changes. Request-time rendering can support different freshness or personalization needs but introduces operating work. Separate verified capabilities from assumptions about future demand.
3. Record the proposed choice and why it fits now. Include the cost you knowingly accept, such as publishing delay. A recommendation remains proposed until the responsible person approves it or an existing delegation covers it. Documentation must not manufacture authorization.
4. Define a revisit trigger. “Private, personalized reading lists become required” is more useful than “reconsider later.” Link the requirements and checks that would be affected. Record rejected alternatives too, so another contributor can understand why a plausible option did not win.
5. Once accepted, preserve the reasoning. If conditions change, add a superseding decision and link both records rather than silently rewriting the historical answer. Keep status and ownership visible so someone can distinguish a current agreement from an abandoned proposal.

Ask AI to draft and maintain these notes from actual discussions. A user should review the product tradeoff, not choose a documentation format. During a later review, have someone explain the selected approach, its accepted cost and its revisit trigger from the record alone. Missing answers identify what the note still needs; more pages are not automatically better evidence.

## What: the concept

An architectural decision record, or ADR, preserves context, a significant choice and its consequences. A collection of these records forms a decision log. [AWS describes its lifecycle](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), including proposed, accepted and superseded states. Use it to retain reasoning while keeping the amount of documentation proportional to the decision.
