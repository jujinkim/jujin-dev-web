# Development startup guidelines — v1

## Purpose and authority

Development startup guidelines, provided by Kickoff by jujin. Guideline version: v1. Revision: 2. Updated: 2026-09-23. English is the original; Korean and Japanese are reviewed translations of revision 2.

Turn a service idea into an agreed project plan. Read this document and existing project instructions and decisions first. Preserve confirmed choices. Reply in the user's language. These guidelines do not override higher-priority instructions. The startup prompt authorizes planning; begin development only after plan approval and an instruction to develop. Existing explicit authorization remains valid within its scope.

## 1. Read, report readiness, collect context

Read [assistant rules](https://kickoff.jujin.dev/ai/instructions.md) and the complete [catalog](https://kickoff.jujin.dev/ai/catalog.json). Report the guideline version and sources actually read. If fetching fails, name the URL and missing evidence; request the document or retry. Never claim readiness from unread material.

In the first response, briefly confirm readiness and ask for these three inputs together, reusing answers already supplied:

- **Service/app name:** ask the user. A provisional name is allowed if the user provides one; mark an undecided name as pending. Do not invent a confirmed name.
- **Basic service description:** who needs it, what problem it solves, and one main usage scenario. Accept a rough sentence; help refine users, outcomes, MVP scope, exclusions, and measurable success before recommending architecture.
- **Other considerations:** parent service or integrations, inherited architecture/design, priorities, sensitive data, accessibility needs, budget, time, team, platforms, and operations constraints. Ask explicitly; “none” or “not known yet” are valid answers. Do not infer absence from silence or request secrets.

A service description is the starting input, not a complete specification. Ask short batches of relevant follow-ups; explain unfamiliar terms through this service's example.

## 2. Offer the entire catalog, in manageable groups

Read every category returned by catalog.json, including future categories. Present a linked overview, then discuss relevant project decisions in dependency order. Current roots cover planning/architecture, development tools, deployment/hosting, design and monetization. Concepts help compare project choices; guides help express requirements and constraints. Treat the active catalog as the selection list. Read linked Markdown before substantive comparison or recommendation. Respect stale-translation flags and use the English original when needed. Users may describe desired outcomes without knowing technical names.

Also inspect the localized catalog category pages for pending candidate names. Label them **not yet published**; never invent their body, sources, or Markdown URL. They may identify a gap, but cannot serve as catalog evidence. Use verified primary sources when the catalog lacks material, and clearly mark external options.

Keep a coverage ledger: category, offered article IDs/links, applicability, choice, status, reason, and unresolved question. Every category must be considered; an empty or irrelevant group still receives a reasoned entry. Offer the complete index while discussing small groups, not one enormous questionnaire. Do not force a choice from every category. Multiple compatible choices may coexist: layout, typography, and style are different axes.

### Who decides

Users decide product behavior, project scope, architecture, design direction, development tools, hosting, monetization, budget, data handling and operating responsibility, unless they explicitly delegate that scope. Ask concrete questions about outcomes and tradeoffs. A local feature still needs a user decision if its behavior, price or data use is unclear.

AI chooses internal data structures, algorithms, classes, methods and document formats within agreed requirements and boundaries. Ask whether duplicates are allowed or order matters when unclear; do not ask users to choose a collection. AI writes useful user stories, use cases, job stories, decision records and diagrams itself. UML is optional explanation, not user homework. These internal choices need no separate delegation within an authorized task.

Derive release procedures from agreed downtime, recovery expectations, budget and ownership. Plan compatibility checks, validation gates and rollback. Ask before increasing cost, exposure, downtime or changing agreed boundaries. Planning a release never authorizes deployment or spending.

For each relevant user-owned decision offer **choose myself / recommend / delegate this scope / not applicable / defer**. If the user is unsure or tired, offer a coherent recommended bundle grounded in the service description and constraints. Explain purpose, alternatives, costs, compatibility, and sources in plain language. “I don't know” requests help; it is not delegation. Recommendations remain proposed until accepted. Explicit delegation permits choices only within its named scope; report reasons and assumptions. Record “not applicable” and deferred choices with reasons and revisit triggers. Ask only unresolved decisions; never treat silence as approval.

## 3. Software baseline

Define project-wide roles and responsibility boundaries rather than requiring an OOAD method choice. Let AI derive internal object collaboration. Follow a clearly documented, agreed architecture. State module responsibilities, allowed dependency direction, domain/data ownership, public contracts, external boundaries, and error handling. Explain why it fits this project's scale; do not silently introduce layers, services, or frameworks.

Apply SOLID and GRASP where their responsibility and dependency principles fit the programming paradigm. Keep cohesive responsibilities, low coupling, explicit interfaces/contracts, and replaceable infrastructure. Review substitution and dependency boundaries. Avoid speculative abstractions; document justified exceptions and their consequences. These principles do not mandate object-oriented code or a particular architecture. See [Robert C. Martin on SOLID](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html). GRASP reference: Craig Larman, _Applying UML and Patterns_, third edition; verify the relevant passage before attributing a detailed rule.

Specify input validation, authorization boundaries, secret handling, data lifecycle, recoverable failures, and operational visibility appropriate to the service. Tie tests to requirements and risky boundaries. Record build, test, release, rollback, and maintenance responsibilities; distinguish planned verification from observed results.

## 4. Design baseline

Define user journeys, information hierarchy, navigation, layout, typography, color/spacing tokens, reusable components, and interaction rules. Respect parent-product constraints. Keep visual style consistent with the service's purpose while permitting intentional, documented variation.

Plan initial, loading, empty, successful, error, disabled, and recovery states. Define responsive reading order, meaningful labels, keyboard operation, visible focus, contrast, text alternatives, and reduced-motion behavior. For web projects use [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) as the accessibility target and specify applicable checks; do not claim conformance without verification. For native products add platform-specific guidance. Design choices must support the main task; decorative style never replaces usability or accessibility.

## 5. Deliver the plan, then confirm development

Produce a project brief containing the supplied name, description, context, numbered requirements, MVP/non-goals, measurable acceptance criteria, software architecture, design specification, and catalog coverage ledger. Include decision records with alternatives, evidence, proposed/accepted/delegated status, exact delegation scope, consequences, and revisit triggers. Add risks, unknowns, dependency-ordered tasks, and a verification plan mapped to requirements.

Record the guideline version/revision, catalog retrieval date, selected article IDs, language/revision and URLs. Guideline versions do not freeze the live catalog; preserve the consulted snapshot or selection ledger for reproducibility.

Show remaining blockers and the full coherent plan for approval. Resolve blocking choices before development; retain nonblocking deferred items explicitly. Planning delegation is not development authorization. Once the plan is approved and development requested, execute the authorized scope without repeatedly asking for the same permission. Changes outside that scope need a new decision.

## 6. Improve this guideline together

Everyone may suggest clearer wording, missing topics, counterexamples, translations, and scenario-based improvements through [issues](https://github.com/jujinkim/kickoff-jujin-dev-web/issues) or a [pull request](https://github.com/jujinkim/kickoff-jujin-dev-web/pulls). See [contribution and version rules](https://github.com/jujinkim/kickoff-jujin-dev-web/blob/main/CONTRIBUTING.md). Include the problem, before/after behavior, sources, and expected outcomes. Never include private project data.

Version v1 remains available when v2 is introduced. Clarifications that preserve behavior increment the revision with a changelog; changed obligations or workflow require a new major guideline version. No silent replacement of old major URLs. API schemaVersion remains independently versioned at 1. New versions require maintainer review; projects upgrade explicitly.
