# Design — Strange Atlas

> Written in two stages: structural decisions during planning (Pass 1), component patterns during building (Pass 2).
> Note: Design direction is intentionally loose — Tony is driving design with inspiration references and will refine during build.

## Pass 1 — Structure and Direction

### Layout Pattern

Full-viewport canvas map as the primary surface. No sidebar, no top nav in the traditional sense. The map IS the app. UI elements float over or beside the canvas: category toggles in a panel (likely left-aligned vertical strip), Atlas observation in a quiet bottom panel, tooltip appears on hover near the cursor. "About This Project" is a separate page, not a panel.

Single primary view + one secondary page. Minimal chrome.

### Density and Tone

Dark editorial. High contrast, maximum negative space. The map is the content — everything else recedes. Information is revealed progressively through interaction (toggle → points appear → hover → tooltip). Not a dashboard. Not dense. Closer to an art piece with utility.

### Design References

Tony is providing inspiration images and will refine direction during build. The established direction from the brief:

- Pure black background (`#0a0a0a`)
- Dot-matrix continents in dark grey, variable-density halftone pattern — denser toward coastlines/landmass centers, fading at edges
- Colored glowing dots per phenomenon, with subtle radial bloom
- Overlap zones: brightness intensification + blended color halo
- No arcing lines, no connection paths — just scatter points
- Clean negative space throughout

### Reference Interpretation

The dot-matrix world map aesthetic is the visual foundation. What to keep: the halftone texture, the feeling of data-as-material, the restraint. What to drop: any generic map UI patterns, tile-based map chrome, standard GIS interface elements. This should feel crafted, not like a tool.

### Token System

Keeping this loose for now — will firm up during build. Starting point from the brief:

```css
:root {
  /* Background */
  --bg-primary: #0a0a0a;
  --bg-continent: #2a2a2a; /* to #1a1a1a for halftone range */

  /* Category Colors */
  --color-ufo: #4FC3C3;
  --color-volcanoes: #E8863A;
  --color-bigfoot: #5A8A5A;
  --color-haunted: #9B7BB8;
  --color-megaliths: #C4A96B;
  --color-meteorites: #C8C8C8;
  --color-tornadoes: #5A7A9B;
  --color-caves: #A0614A;
  --color-ghost-towns: #B87878;
  --color-shipwrecks: #3A8A8A;
  --color-earthquakes: #B89B3A;
  --color-fireballs: #D4623A;
  --color-thermal: #6A9B6A;
  --color-storms: #7A8A9B;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing, radii, shadows, motion — TBD during build */
}
```

Typography: Playfair Display for "Strange Atlas" wordmark only. Inter for all UI text. No logo — typographic identity only.

### Atlas Panel

Not a chat bubble. More like a caption beneath a photograph — quiet, understated, part of the editorial feel. Sits in a fixed position (likely bottom of viewport), appears/updates when categories are toggled.

### Ambient State

Consider a subtle ambient animation on the map with no categories selected — very slow dot pulse, barely perceptible — gives the page life before the user interacts.

---

## Pass 2 — Component Patterns

<!-- Populate as components are built and solidify during BUILD phase. -->

### Component Vocabulary

### Spacing and Rhythm

### Responsive Behavior

### State Patterns

<!-- Loading, empty, error states. -->

### Deviations from Pass 1

<!-- Any changes from the original direction, and why. -->
