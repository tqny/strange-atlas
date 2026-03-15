# Architecture — Strange Atlas

> Technical realization of the spec.

## Stack

- Three.js r128 (CDN) — WebGL globe rendering
- Vanilla JavaScript — no framework
- Custom TopoJSON decoder — no D3 dependency
- CSS custom properties for design tokens
- Static JSON data files (pre-split by category, inlined at build time)
- GitHub Pages for deployment

## Current Structure

The project is currently a single-file prototype (`globe-template.html`) built via a Python script into `globe-preview.html`. This is intentional for rapid iteration. Phase 9 refactors into modules.

### Build Pipeline

```
globe-template.html          ← edit this (source of truth)
  + data/world-110m.json     ← TopoJSON land geometry
  + data/countries-110m.json ← TopoJSON country borders
  + data/*.json              ← 10 category data files
        ↓
  scripts/build-globe.py     ← inlines all data as JSON
        ↓
  globe-preview.html         ← ~21MB, self-contained, do not edit
```

### Key Components (within globe-template.html)

1. **TopoJSON Decoder** — `topoToPolygons()`, arc decoding. Converts TopoJSON to polygon rings for PIP testing and border rendering.

2. **Land Polygon Preparation** — Builds `landPolygons` array from world geometry. Handles three antimeridian cases:
   - Small wrapping polygons (Fiji-like): filtered out
   - 2-wrapping-edge polygons (Eurasia): split into sub-polygons via `splitAtAntimeridian()`
   - 1-wrapping-edge polar polygons (Antarctica): closed via `fixPolarPoly()`

3. **Point-in-Polygon (PIP)** — Standard ray-casting. Used to determine which grid points are land for dot-matrix rendering.

4. **Continent Dot Grid** — InstancedMesh spheres at 0.4° spacing, latitude-adjusted. ~74K dots. Silhouette-aware ShaderMaterial discards fragments at globe edge.

5. **Country Borders** — LineSegments rendered once per arc (not per country) to avoid double-drawing shared borders.

6. **Category Points** — InstancedMesh per category. Toggle visibility via UI buttons.

7. **Globe Surface Shader** — Custom Fresnel ShaderMaterial creates an edge-darkened gradient (center #f0f0f0, edge #bababa). Smoothstep falloff at 0.55 facing threshold. Replaces flat MeshBasicMaterial.

8. **Atmosphere Glow** — BackSide sphere with Fresnel rim shader. Light ocean blue halo. Currently disabled (code preserved, commented out).

9. **Mouse / Touch Interaction** — Desktop: click-drag rotation with inertia, scroll zoom, auto-rotate. Mobile: single-finger touch rotate, zoom disabled, fixed camera distance (4.2z). Double-click restarts auto-rotate.

10. **UI Overlay** — HTML elements positioned over the WebGL canvas: wordmark, category toggles, tooltip. Chevron wiggle animation draws attention to collapsed controls (3s, 5s, 7s, 9s, 11s, then every 5s; stops once opened).

11. **Landing Wave Animation** — Temporary InstancedMesh with US-bounded category points. Per-instance longitude and color attributes. Gaussian wave shader sweeps west-to-east. Self-disposing on completion. Fires 1s after page load.

12. **Ambient Ripple** — Radial pond-ripple on continent dots. Computed in vertex shader: dots scale 2.5x and flash toward white at the wave front. Random origin each cycle, continuous. First ripple begins from West Africa when the landing wave finishes.

13. **Mobile Responsive** — Viewport meta locks scale. Chat mode: globe stays full-viewport at full opacity, chat overlays as z-index 15 layer. iOS keyboard handled via visualViewport API + body position:fixed scroll lock. Controls panel uses column layout with chevron above options, fixed at 28% from top. Nav links in row layout.

## Data

- **Source:** `strange_places_v5.2.json` (CC BY 4.0, 354K records, 14 original categories)
- **Current:** 10 categories, ~99K total points (tornadoes, caves, megaliths, storm events cut for performance/scope)
- **Geometry:** `world-110m.json` (55KB, land PIP), `countries-110m.json` (108KB, border lines)
- **Build-time inlining:** All data is embedded in the built HTML file. No runtime fetching in the current prototype.

## File / Folder Layout

```
strange-atlas/
├── index.html              # Redirect → globe-preview.html (GitHub Pages entry)
├── globe-template.html     # Source — edit this
├── globe-preview.html      # Built output — do not edit
├── preview.html            # Original 2D flat map prototype (superseded)
├── scripts/
│   ├── build-globe.py      # Template → built HTML with inlined data
│   ├── split-data.js       # Source JSON → per-category JSON files
│   └── screenshot.mjs      # Playwright screenshot (limited by software WebGL)
├── data/
│   ├── world-110m.json     # TopoJSON land geometry
│   ├── countries-110m.json # TopoJSON country borders
│   ├── ufo-sightings-2010.json
│   ├── volcanoes.json
│   ├── bigfoot.json
│   ├── haunted-places.json
│   ├── meteorites.json
│   ├── ghost-towns.json
│   ├── shipwrecks.json
│   ├── earthquakes.json
│   ├── fireballs.json
│   └── thermal-springs.json
├── worker/
│   ├── proxy.js           # Cloudflare Worker — Kimi API proxy
│   └── wrangler.toml      # Worker deployment config
├── about.html              # About page — static, no build step
├── docs/
│   ├── spec.md
│   ├── architecture.md
│   ├── design.md
│   └── tasks.md
├── AGENTS.md
├── README.md
└── V3-master-prompt.md
```

## AI Chat Mode (Phase 6)

The globe page has two modes, toggled via nav links:

1. **Atlas mode** (default) — full-viewport 3D globe with category toggles and Atlas narrator
2. **Chat mode** — globe zooms out to top ~50% of viewport, chat UI rises from bottom. Kimi 2.5 API. Context-aware of active categories.

**Transition mechanics:**
- Camera lerps from current z to ~8.0, y shifts up. ~800ms ease-out via lerp in animate loop.
- Chat container slides up from `translateY(100%)` to `translateY(0)` via CSS transition.
- Scroll zoom disabled, drag rotation stays enabled, auto-rotate re-enabled.
- Atlas narrator hidden. Category toggles remain functional.
- "Atlas" nav click reverses all transitions.

**API integration:**
- Moonshot Kimi API (`moonshot-v1-8k` model) via Cloudflare Worker proxy (`worker/proxy.js`)
- API key stored as Worker secret (server-side, never in browser)
- `build-globe.py` injects `CHAT_API_URL` env var (proxy URL) via `%%CHAT_API_URL%%` marker
- System prompt includes dataset summary and currently active categories
- Character-by-character typing animation with adaptive speed
- Tony plug (witty hire-me aside) appended client-side every 3rd question

**Rate limiting:**
- Client-side: 30 messages per session
- Server-side: 60 requests/hour per IP (in-memory Map in worker)
- max_tokens capped at 512 in worker

## About Page (Phase 7)

`about.html` — static HTML, no build script. Shares nav markup and design tokens (Inter font, `--bg`, `--text`, `--text-dim`, `--text-mid`) with the globe page via inline CSS. Product-focused: data sources, design intent, how it works. Footer links back to portfolio site for the full build story.

The Phase 9 modular refactor converts the single-file prototype into ES modules with runtime data fetching.

## Boundaries and Swap Points

- **Atlas Narrator** is the primary swap point: Phase 2 replaces static lookup with live Claude API calls. The interface stays the same.
- **Data loading** is isolated so the current build-time inlining can switch to runtime fetch when the project modularizes (Phase 9).
- **Globe rendering** is self-contained in `globe-template.html`. The About page shares nav/tokens without coupling to the globe code.
- **Chat mode** is a UI state within the globe page, not a separate page. Camera position and chat container visibility are the only state changes. All globe functionality (categories, overlap, tooltips) remains active.
