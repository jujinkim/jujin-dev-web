# Themes and fonts without fifty shades of almost

Use shared tokens so one decision stays one decision.

ID: theme
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/theme/

## Why: the goal or problem

Changing a brand color should not mean hunting through dozens of components. Yet independent color and spacing choices drift, while a dark background can leave old text colors unreadable. You need shared visual decisions that preserve each element's role and can be checked in the actual combinations users will see.

## How: work toward a solution

1. Describe the intended tone and reading task before collecting colors. A long-form reference page and a playful control panel need different emphasis. Identify roles such as page background, surface, primary text, secondary text, border, action and focus, instead of assigning a favorite color to everything.
2. Give those roles reusable names. A card should refer to surface and text values rather than carry its own arbitrary copies. Changing the shared value then updates every participating component. Keep genuinely different roles separate even if they currently share a color.
3. Define light and dark values as deliberate pairs. Check text against its actual background, including translucent panels, selected states and disabled controls. Inverting colors mechanically does not establish sufficient contrast. Preserve visible keyboard focus and information that must remain clear without color.
4. Choose typography with real content. Compare headings, body text, numerals and ambiguous characters in every supported language. System fonts vary across devices; downloaded or self-hosted fonts add loading and licensing work. Test the fallback before assuming every visitor has the intended face.
5. Apply spacing, type and color roles to a small representative set: a long article, a card, an error and a form. Switch themes and reload. Decide whether the interface follows system preference, a user's explicit choice, or both, and make the resulting behavior predictable.

Inspect the hardest combinations rather than judging a palette in isolation. Can a user still find a focused control, read muted text and understand an error after the theme changes? Record these checks with the reusable values so future components inherit the agreement. AI may implement tokens and local styling within the chosen direction; a different visual identity is still a product decision.

Enlarge the text and check wrapping too; shared colors do not prevent a long label from hiding a control.

## What: the concept

A theme is a coordinated set of visual decisions; design tokens give shared decisions stable names. [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) can express them on the web. [W3C's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) explains why actual foreground/background pairs matter. Tokens improve consistency, but do not replace reviewing complete screens and their states.
