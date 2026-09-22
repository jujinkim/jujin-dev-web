# Name the layout you are pointing at

Header, sidebar, grid, dialog: give your feedback coordinates.

ID: layout
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/layout/

## Why: the goal or problem

A screen can contain every required feature while making the main task difficult to find. On a narrow device, sidebars squeeze text and controls jump out of reading order. You need to organize information around what the reader is trying to accomplish before deciding how many columns or cards look attractive.

## How: work toward a solution

1. Choose one task, such as finding and comparing two catalog items. List what the person needs first, what supports the decision and what can wait. Give navigation, filters, results and supporting detail distinct responsibilities. Do not make every region compete as the main action.
2. Sketch a single-column reading order. Put the page identity and purpose before its controls, followed by results and supporting material. Start with realistic long titles, translated labels and an empty result; short placeholder text conceals spacing problems.
3. Add columns only when simultaneous visibility helps. Persistent filters can sit beside a long list on a wide screen. At smaller widths, stack regions in a meaningful order before either becomes cramped. A breakpoint follows available content space, not the assumption that every phone or tablet has one fixed size.
4. Match the item presentation to comparison. Repeated text fields may work well as rows; similar visual entries can use aligned cards. A varied image collection may tolerate unequal heights, but keyboard order must still make sense. Keep the same information while comparing arrangements so decoration does not decide the result.
5. Test the states people actually encounter: loading, no matches, failure, long content and expanded details. Use only a keyboard to find controls and reach a result. If a modal is necessary, give it a clear name, a way to close, contained focus and a sensible return point.

Check the complete task at narrow and wide widths, with zoom and each supported language. A screenshot of the default state is only one piece of evidence. Ask whether people can identify where to start, predict what happens next and recover when there is nothing to show. Let those answers drive the next revision.

## What: the concept

Layout is the arrangement and reading order of regions and repeated content. [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) is one implementation tool; it is not the plan itself. The [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) covers modal behavior. Columns, lists and grids should support the task, and their tradeoffs remain visible when content or screen size changes.
