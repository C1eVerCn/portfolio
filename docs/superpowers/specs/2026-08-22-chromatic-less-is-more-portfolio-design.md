# Chromatic Less-is-More Portfolio Redesign

## Intent

Replace the current cream paper-score presentation with a restrained contemporary portfolio that uses meaningful negative space, modern typography, and a limited 2026-inspired chromatic system. The site remains a browsable portfolio first and an interview demonstration tool second.

## Design principles

- Less is more means fewer elements with stronger hierarchy, not large empty areas filled with microtype.
- Each viewport has one visual protagonist: slogan, capability chain, Hermes system, BHMS evidence, principles, or contact.
- The golden ratio is an invisible composition rule. Desktop layouts use a 61.8/38.2 split; the ratio is never drawn or labelled.
- Color creates structure. No full-site cream field, pure-black inversion, rainbow palette, or equal-width swatch strips.
- Classical music and Nordic mythology remain in pacing, movement names, Bravura glyphs, threads, and the opening-book gesture. They do not dictate antique typography.

## Color system

Use three screen-calibrated colors inspired by the 2026 WGSN/Coloro and Pantone fashion reports rather than copying proprietary physical swatches:

- `Blue Aura` field: `#AFC7DA` — primary canvas and open space.
- `Transformative Teal` field: `#0D6966` — structural counter-field, navigation, and strong project surfaces.
- `Muskmelon` signal: `#E79061` — interaction, current state, and brief transitions only; never more than roughly 5% of a viewport.
- Text uses tinted navy `#203044` on light fields and pale blue `#E5EEF2` on teal fields. Neither pure black nor pure white is used.

The homepage hero is 61.8% Blue Aura and 38.2% Transformative Teal. Hermes shifts toward Muskmelon against navy-blue interface plates. BHMS shifts toward teal against Blue Aura. Coda uses Blue Aura with one teal contact block.

## Typography

- Use the existing self-hosted Geist variable font for Chinese and English display, navigation, and body copy.
- Display headings use weights 720–820, tighter tracking, and line-height between `0.88` and `1.02`.
- Body copy uses weights 480–560 and never falls below `0.92rem` on desktop or `0.9rem` on mobile.
- Newsreader is limited to brief English movement numbers or italic annotations. Noto Serif SC no longer drives Chinese headings.
- Bravura remains only for semantic music glyphs.

## Homepage structure

### Prelude

- Preserve the mythic book entrance, but recolor it with Blue Aura, teal, and Muskmelon.
- After the opening, the hero shows only the role, bilingual slogan, one concise engineering statement, and a scroll cue.
- The name stays in the header. Remove the redundant folio strip and bottom byline from the hero.
- Use a wide `min(92vw, 1480px)` canvas with a 61.8/38.2 split. The slogan occupies the left field and the statement plus scroll cue occupy the right field.

### Engineering times and capabilities

- Keep the three Norns as a single horizontal sequence with large readable labels and only essential supporting copy.
- Present six capabilities as an editorial chain rather than an indented stair-step. Use alternating field accents without card containers.

### Projects

- Keep both technical product demonstrations and case links.
- Give Hermes and BHMS distinct full-bleed chromatic movements; do not frame them as floating cream paper cards.
- Maintain readable interface diagrams at interview distance. Labels and data cannot rely on microtype.

### Principles and coda

- Reduce decorative metadata and give each principle a strong numbered row.
- Coda contains the short about statement, email, GitHub, and a single music glyph.

## Motion

- Content is visible in CSS by default.
- Remove the single document-length scrub timeline that initializes all later chapters at `opacity: 0`.
- Use section-local ScrollTriggers. Each reveal starts only when its own section enters the viewport.
- Reveal text with clipped `yPercent` movement and short opacity interpolation; never leave whole sections transparent while waiting for global scroll progress.
- Motion duration is `0.65–0.95s` with `power3.out` or the existing paper ease. Stagger is `0.045–0.08s`.
- The hero entrance uses one chromatic field wipe, slogan mask reveal, and line draw. Project visuals use transform-only settling and diagram-line progression.
- Reduced motion and missing WebGL render the final composition immediately.

## Responsive behavior

- At widths below `768px`, the 61.8/38.2 split stacks into content-first vertical blocks.
- The slogan uses `clamp(3.6rem, 21vw, 6rem)` and never forces horizontal overflow.
- Project interfaces remain scroll-free horizontally; grids collapse and labels remain at least `0.75rem`.
- Color fields remain present on mobile through stacked sections rather than disappearing into a neutral background.

## Acceptance criteria

- `localhost:3000/zh` visibly differs from the previous cream-paper design after Docker rebuild.
- No cream full-page canvas, pure-black page, serif Chinese hero, tiny folio strip, or redundant hero byline remains.
- The hero contains the role, bilingual slogan, one statement, and a scroll cue only.
- All later chapter content is readable without completing a document-length scrub animation.
- Desktop, tablet, and mobile have no horizontal overflow.
- Reduced motion, keyboard navigation, direct project routes, tests, lint, typecheck, build, and Docker route checks pass.
