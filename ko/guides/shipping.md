# Delivery and operations: where it runs, how it recovers

Choose target devices and operating constraints; AI plans the release procedure.

ID: shipping
Language: en
Revision: 4
Translation source revision: 4
Canonical: https://kickoff.jujin.dev/en/guides/shipping/

## Why: the goal or problem

“It works on my computer” does not tell a user how to obtain the product or who restores it after a failure. A browser page, downloadable game and online multiplayer service have different delivery and operating needs. You need to connect the intended user experience to a repeatable release and a recoverable running system.

## How: work toward a solution

1. Name where users will run the product and how they will receive it. A public catalog opens at a URL; a desktop game may use a package or store. Online features may also require a service that keeps running independently of the installed client.
2. Agree on constraints before selecting infrastructure: budget, available operating time, acceptable interruption, data-loss tolerance and recovery ownership. These are project decisions. AI can derive release mechanics within them, but additional paid capacity or changed availability needs an applicable decision.
3. Follow one release from source to user. Build a reproducible artifact, validate it in a preview or test environment, and record the version and configuration used. Verify the deployed route or installed package, not only the development process. Keep secrets and environment-specific settings out of public artifacts.
4. Plan failure before the switch. Decide which signal stops the release, who responds and how to restore the previous usable state. Returning traffic to an old program does not automatically undo new database writes. Check compatibility and recovery for data separately from replacing application files.
5. If gradual exposure is useful, define the comparison, measurement window and evidence required to expand. No requests or missing telemetry means uncertainty, not a successful release. A small site may need a simpler preview-and-switch process instead of a large rollout system.

Leave a short runbook: artifact, target, checks, stop conditions, recovery steps and owner. Practice the relevant recovery in a safe environment when feasible, and record any untested part honestly. A release plan is complete when another responsible person can follow it and recognize failure. Planning itself does not authorize deployment; carry out only the release actions covered by the user's authorization.

## What: the concept

Runtime is where software executes, distribution is how users obtain it, and hosting serves files or services. Deployment and release procedures connect these responsibilities. [Google SRE's canary guidance](https://sre.google/workbook/canarying-releases/) explains evaluation during limited exposure. Choose procedures that satisfy the agreed recovery and operating constraints, rather than treating a hosting product or rollout label as the whole plan.
