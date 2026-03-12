# Design — Strange Atlas

> Written in two stages: structural decisions during planning (Pass 1), component patterns during building (Pass 2).

## Pass 1 — Structure and Direction

### Layout Pattern

Full-viewport WebGL globe as the primary surface. No sidebar, no top nav in the traditional sense. The globe IS the app. UI elements float over the canvas: category toggles in a vertical strip (right-center), Atlas observation in a quiet bottom-left panel, tooltip appears on hover. Future Dashboard and About pages will add a shared nav component.

Single primary view + two secondary pages (Dashboard, About). Minimal chrome.

### Density and Tone

Light editorial. Clean, airy, maximum negative space. The globe is the content — everything else recedes. Information is revealed progressively through interaction (toggle → points appear → hover → tooltip). Not a dashboard. Not dense. Closer to an art piece with utility.

### Visual Language

- Light background (`#f5f5f5`) with subtle grey globe surface (`#eeeeee`)
- Dot-matrix continents in silver-grey (`#c0c0c0`), latitude-adjusted spacing
- Colored dots per phenomenon category
- Light ocean-blue atmosphere glow at globe edge (Fresnel rim shader)
- Country borders in `#aaaaaa` at 45% opacity for geographic context
- Clean negative space throughout

### Token System

```css
:root {
  --bg: #f5f5f5;
  --text: #1a1a1a;
  --text-dim: #999;
  --text-mid: #666;
  --panel-bg: rgba(255,255,255,0.85);
}
```

Category colors defined in JS `CATEGORIES` array (see `globe-template.html`).

Typography: Inter only (300/400/500/600 weights). No display font — typographic identity through weight and spacing.

### Atlas Panel

Not a chat bubble. More like a caption beneath a photograph — quiet, understated, part of the editorial feel. Sits in a fixed position (bottom-left), appears/updates when categories are toggled.

### Ambient State

Subtle auto-rotation when no interaction is happening. Planned: ambient dot pulse when no categories are selected.

---

## Pass 2 — Component Patterns

### Globe Rendering

- **Continent dots:** InstancedMesh SphereGeometry (radius 0.0015), silhouette-aware ShaderMaterial that discards fragments where the normal-to-view dot product < 0.1, with smoothstep fade 0.1–0.4. Prevents dots from peeking past the globe silhouette edge.
- **Category dots:** InstancedMesh SphereGeometry (radius 0.007), same silhouette shader. One mesh per category, toggled via `mesh.visible`.
- **Border lines:** LineSegments with similar silhouette discard (threshold 0.35, smoothstep 0.35–0.5). Rendered once per arc, not per country.
- **Atmosphere:** BackSide sphere at 1.04× scale, Fresnel rim shader (`power: 6.0, intensity: 0.45`), color `#8ecae6`.

### UI Components

- **Wordmark:** Fixed top-left. "Strange Atlas" in Inter 600, 1.4rem. Subtitle in Inter 300, 0.75rem, `--text-dim`.
- **Category toggles:** Fixed right-center, vertical strip. Each toggle: label + colored dot indicator + count. Active state: Inter 500, full opacity dot with glow. Inactive: Inter 400, `--text-dim`, dot at 30% opacity.
- **Atlas panel:** Fixed bottom-left. Inter 300, 0.82rem, `--text-mid`, max-width 480px.
- **Tooltip:** Fixed-position HTML div, backdrop blur, white bg at 85% opacity. Name (Inter 500), meta (Inter 400, dim), description (Inter 400, mid, 3-line clamp).

### Interaction

- Click-drag: rotation with inertia (velocity decay 0.95). Clamped to ±1.2 rad on x-axis.
- Scroll: zoom between distance 2.2–6.0.
- Auto-rotate: 0.0008 rad/frame, stops on first interaction.

### Deviations from Pass 1

- **Dark → Light:** Original direction was dark editorial (#0a0a0a background). Shifted to light (#f5f5f5) during build for a cleaner, more contemporary feel.
- **Flat map → Globe:** Original spec was equirectangular Canvas 2D projection. Pivoted to Three.js 3D globe during Phase 2 for stronger visual impact.
- **Playfair Display dropped:** Original plan used Playfair Display for the wordmark. Dropped in favor of Inter 600 for a more cohesive single-font system.
- **14 → 10 categories:** Tornadoes, caves, megaliths, storm events cut for performance and scope.
