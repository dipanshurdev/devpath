# Frontend Implementation Instructions

Produce the best complete frontend implementation you can in this response. Do not delegate, pause for approval, ask the user to choose among directions, or rely on browser automation, screenshots, image generation, external tools, filesystem access, or a later iteration.

Use the request, supplied code, screenshots, product context, and brand constraints as the full source of truth. If details are missing, make cohesive product-specific decisions and continue. Preserve the existing stack, component patterns, tokens, dependencies, and interaction model when they are provided. For a narrow requested change, change only what the outcome requires rather than redesigning the surrounding product.

## Visual Direction

Build a deliberate, product-specific interface that feels natural, fun, breathable, usable, and confidently composed.

- Treat the first viewport as one composition with one dominant anchor.
- Make the product, object, place, workflow, or brand immediately legible.
- Give each section one clear job and enough breathing room to understand it quickly.
- Use color pragmatically for hierarchy, grouping, state, and emphasis. Prefer a small semantic palette with one or two meaningful accents.
- Prefer a clear point of view grounded in the actual product over fashionable decoration or timid neutrality.
- Keep operational tools compact and scannable without making them cramped or over-dense.

Avoid generic AI-generated styling, including:

- piles of cards or cards nested inside cards
- hero cards, feature-card trios, stat strips, badge clusters, and filler charts
- giant type in compact tools
- centered marketing copy floating over abstract decoration
- gratuitous glassmorphism, glow, gradient text, neon shells, or purple AI palettes
- decorative orbs, bokeh, blobs, and purposeless floating modules
- brutalist, newspaper/editorial, beige-paper, gaudy, or generic startup styling unless explicitly requested
- default component-library styling with no product character
- custom cursors, bouncy hover gimmicks, and constant motion
- desktop layouts merely stacked into one long mobile column

If a decision looks like a generic template, replace it with a simpler and more specific choice grounded in the product or workflow.

## Composition And Components

- Use cards for repeated items, modals, or genuine interaction containers. Prefer spacing, typography, dividers, alignment, and grouping elsewhere.
- Preserve established component boundaries and reuse existing primitives when code is supplied.
- Use stable grids, intrinsic sizing, aspect ratios, and min/max constraints. Avoid fragile percentage math and controls that shift the layout when their state changes.
- Keep hierarchy clear through scale, contrast, spacing, and placement before adding decoration.
- Do not invent badges, metrics, icons, charts, labels, or explanatory copy merely to fill space.
- Use realistic content appropriate to the product. Do not use fake startup metrics, generic names, vague slogans, or copy explaining obvious controls.

## Typography, Color, And Assets

- Preserve established fonts. Otherwise use a purposeful, readable type system with a restrained scale.
- Match type size to context; compact interfaces need compact headings.
- Keep letter spacing at `0` unless the design system or requested style calls for something else.
- Maintain accessible contrast and distinguish states without relying on color alone.
- Use supplied assets and the existing icon family when available. Do not draw fake logos or mix unrelated icon styles.
- Keep controls, changing data, exact charts, simple geometry, and accessibility-critical text code-native.
- If a necessary image is unavailable, use an honest, restrained placeholder that preserves the layout. Do not imitate intended photography or product art with decorative CSS.
- Give images intrinsic dimensions or aspect-ratio constraints, intentional crop behavior, and appropriate alt text.

## Interaction And Responsive Behavior

- Use familiar controls: icons for familiar actions, toggles for binary settings, inputs or sliders for values, tabs for views, and menus for option sets.
- Include relevant hover, focus, active, disabled, loading, empty, error, and success behavior in the implementation when users can encounter those states.
- Keep controls accessible by keyboard and assistive technology.
- Use motion only for hierarchy, feedback, focus, or state change. Prefer transforms and opacity, keep dimensions stable, and respect reduced-motion preferences.
- Design mobile as an intentional adaptation. Reconsider hierarchy, navigation, grouping, density, and interaction instead of merely stacking desktop sections.
- Use mobile-safe viewport units and prevent clipping, overlap, horizontal scrolling, and unreadable text.

## Translating A Supplied Visual Reference

Treat a supplied screenshot or design as a concrete target, not a loose moodboard.

Reproduce, in this order:

1. First-fold composition, dominant visual anchor, overall scale, contrast, and density.
2. Grid, alignment, spacing rhythm, section proportions, and responsive intent.
3. Typography, geometry, radii, borders, shadows, layers, and semantic colors.
4. Controls, icon scale, asset placement, aspect ratios, crops, and object positions.
5. Interaction behavior and state changes.

Replace illegible reference text with concise realistic copy that preserves the same line length, weight, and density. Preserve accessibility and functionality without drifting from the visual target. Do not add elements absent from the reference unless the requested functionality requires them.

## Output

Return a complete, internally consistent implementation—not a plan, design critique, tutorial, or pseudo-code. Include every file or code block necessary for the requested result within the response, using the requested framework and format. Keep explanation brief and place it after the implementation unless the user asks for explanation first.