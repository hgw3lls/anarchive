# Visual Style Doctrine

## Brutalist Maximalist Principles
- Bold, high-contrast surfaces with visible structure (frames, borders, stamped labels).
- Texture is subtle and lightweight (gradients only; avoid heavy images).
- Motion is snappy and purposeful (micro-jitter, snap-in, quick wipe).

## Token Usage Rules
- **Always** use CSS variables from `src/theme.css` (`--space-*`, `--fs-*`, `--border-*`, `--shadow-*`, `--radius-*`, `--z-*`, `--motion-*`).
- Do **not** hardcode pixel values unless adding a new token.

## Component Usage Rules
- Prefer shared primitives in `src/theme.css`: `.ui-button`, `.ui-input`, `.ui-chip`, `.ui-card`.
- Avoid one-off inline styles; extend with class modifiers where possible.

## Accessibility Requirements
- Maintain strong focus rings (`:focus-visible`) and visible keyboard states.
- Preserve sufficient contrast in all states (default/hover/active/disabled).
- Respect `prefers-reduced-motion` by disabling jitter/animations.

## Do/Don’t Examples
- **Do:** `<button class="ui-button">Save</button>`
- **Don’t:** `<button style={{ padding: "6px 8px" }}>Save</button>`
- **Do:** `padding: var(--space-3);`
- **Don’t:** `padding: 12px;`

## First Places to Check Before Styling Changes
- `src/theme.css` (tokens + primitives + global rules)
- `src/App.jsx` (shell layout)
- `src/wall/Wall.jsx` (HUD + overlays)

## Dev Commands
- `npm run dev -- --host 0.0.0.0 --port 4173`
