# Tasks — Strange Atlas

> Execution breakdown. Keep this current — it's the primary continuity document.

<!-- Status markers: [ ] pending, [→] in progress, [x] done -->

## Current Phase

BUILD — Deployment (Phase 8)

## Planning Tasks

- [x] Complete project brief
- [x] Draft spec.md
- [x] Draft architecture.md
- [x] Draft design.md (Pass 1 — structure and direction, kept loose per Tony's preference)
- [x] Draft tasks.md (this file)
- [x] Draft README.md
- [x] Review planning package with Tony → transitioned to build via preview prototype

## Build Tasks

### Phase 0: Data Preparation

- [x] **Acquire source data** — `strange_places_v5.2.json` (138MB, 354,770 records, 14 categories confirmed). CC BY 4.0.
- [x] **Write data split script** — `scripts/split-data.js`. 14 category JSON files in `data/`. Largest: tornadoes (71,813 records, 12.8MB).
- [x] **Acquire world geometry** — `data/world-110m.json` (TopoJSON, 55KB). Custom decoder in preview, no D3 dependency.
- [x] **Acquire countries geometry** — `data/countries-110m.json` (TopoJSON, 108KB) from world-atlas CDN. 177 countries for border lines.
- [x] **Filter UFO data** — `data/ufo-sightings-2010.json` (21,490 records, 5.2MB) filtered from 60,632 to 2010+.
- [x] **Cut bulk categories** — Removed tornadoes, caves, megaliths, storm events. 10 categories, ~99K total points.

### Phase 1: Flat Map Prototype (Superseded)

- [x] **preview.html** — Original 2D canvas prototype (620KB, all 14 categories inlined). Dot-matrix halftone map, toggles, Intersections mode, tooltips, additive blending. Still exists but superseded by globe.

### Phase 2: Globe Prototype

- [x] **Globe scaffold** — Three.js r128 from CDN. InstancedMesh for dots (replaced Points/ShaderMaterial which had rendering artifacts in headless).
- [x] **Template/build system** — `globe-template.html` + `scripts/build-globe.py` → `globe-preview.html` (~21MB). Avoids editing 21MB files directly.
- [x] **Dot-matrix continents** — InstancedMesh with SphereGeometry. DOT_SPACING=0.4°, DOT_RADIUS=0.0015. Latitude-adjusted spacing.
- [x] **Country border lines** — LineSegments from countries-110m.json. Color #aaaaaa at 45% opacity. Graticule wireframe removed.
- [x] **Category data points** — InstancedMesh per category (CAT_DOT_RADIUS=0.007). Toggle visibility via UI buttons. All 10 categories wired.
- [x] **Mouse interaction** — Click-drag rotation with inertia. Scroll wheel zoom (range 2.2–6.0). Auto-rotate on load.
- [x] **UI overlay** — Wordmark top-left, category toggles right-center, atlas text bottom-left, tooltip (HTML positioned).
- [x] **Playwright screenshots** — `scripts/screenshot.mjs` with repo-local Chromium. Limited by software WebGL rendering — use Chrome MCP for visual review instead.

### Phase 3: Globe Design Iteration (Complete)

- [x] **Dot density tuning** — Iterated from 2.0° → 0.8° → 0.4° spacing, radius from 0.006 → 0.003 → 0.0015.
- [x] **Country borders added** — Subtle lines for geographic context, replacing graticule.
- [x] **Zoom limits** — Min distance 2.2 to keep dots looking fine.
- [x] **Fix spurious dot line** — Antimeridian-wrapping polygons (Fiji) caused false PIP hits. Filtered small wrapping polygons.
- [x] **Fix Arctic dot anomalies** — Eurasia polygon wrapping ±180° broke PIP parity. Fixed via `splitAtAntimeridian()`.
- [x] **Bring Antarctica back** — Re-enabled Antarctica dots and borders via `fixPolarPoly()` for the 1-wrap-edge polar polygon. Dot grid extended to -89°.
- [x] **Atmosphere glow** — Fresnel rim shader on BackSide sphere. Light ocean blue halo around globe edge.
- [x] **Category point styling** — Color palette revised (10 distinct colors), size differentiation by density (4 tiers: 0.0015/0.0012/0.0008/0.0006), neon glow shader (opaque body + soft edge falloff + white-hot core), rimmed variant for earthquakes. Per-category radius/color/rimmed params in CATEGORIES array.
- [x] **Landing state polish** — Globe loads facing US (rotation.x=0.463, rotation.y=0.192, camera z=3.367). Controls panel starts collapsed (chevron only). "Select a category to begin." prompt fades out on first category toggle and stays gone. Auto-rotation spins left (westward).
- [x] **Controls panel collapse/expand** — Chevron button (`›`/`‹`) slides toggle list off-screen left with CSS transition. Button positioned after toggles in DOM so it stays visible when collapsed.
- [x] **Landing wave animation** — West→east gaussian sweep across mainland US on page load. Temporary InstancedMesh with per-instance longitude and color attributes, neon glow shader. 1s delay, ~2.3s sweep, self-disposing.
- [x] **Ambient idle animation** — Radial pond-ripple effect on continent dots when no categories active. Scale + brightness flash in vertex shader, random origin each cycle. Seamlessly begins from east coast when landing wave finishes.

### Phase 4: Atlas Narrator Content

- [x] **Write single-category observations** — 10 entries. Dry, deadpan, 1–3 sentences each.
- [x] **Write two-category intersection observations** — 25 combos. Dry, geographic.
- [x] **Implement narrator logic** — ATLAS_OBSERVATIONS (single) + ATLAS_INTERSECTIONS (pairs) lookup. Handles 0, 1, 2, 3+ categories. Fade transition with debounce.

### Phase 5: Overlap / Intersections (Port from preview.html)

- [x] **Port overlap detection to globe** — Haversine + spatial grid (2° cells), 150km radius. Toggle switch UI above category list. `computeOverlaps()` returns `{ catId → Set<pointIndex> }`.
- [x] **Intersection rendering on globe** — Per-instance `instanceOverlap` attribute + `uOverlapFade` uniform drives shader-based visibility. Post-fade matrix zeroing for raycasting.
- [x] **Intersection UX refinement** — Smooth ~300ms lerp fade (factor 0.08), 15% brightness boost on overlap-surviving points. Handles rapid toggling, category changes mid-fade, and force-disable.

### Phase 6: AI Chat Mode (Pivot — replaced Dashboard)

- [x] **Nav links** — Atlas / Ask Atlas / About. Renamed "Chat with AI" to "Ask Atlas" for editorial tone.
- [x] **Chat mode transition** — Zoom-out animation, chat rises from bottom, reverse on Atlas click. Category toggles stay in place (not sliding up with globe). Pointer-events pass through empty chat container to globe. Double-click globe restarts auto-rotate.
- [x] **Chat UI** — Editorial message styling (user pills, AI left-border quotes). Hide/Show toggle preserves context. New chat clears conversation. 240px max message height. Title scramble effect on page load, click, and mode switches. Subtitle updated to "~99,000 strange places · 10 categories".
- [x] **Kimi API integration** — Moonshot `moonshot-v1-8k` via Cloudflare Worker proxy (`worker/proxy.js`). API key server-side as Worker secret. CORS handled by proxy. Context-aware system prompt includes active categories.
- [x] **Build script update** — `build-globe.py` injects `CHAT_API_URL` env var (proxy URL). API key no longer in browser.
- [x] **Atlas voice tuning** — Dry, deadpan, 1-2 sentence responses. System prompt rewritten for concision and character.
- [x] **Typing animation** — Character-by-character reveal for AI responses. Adaptive speed based on response length.
- [x] **Tony plug** — Witty hire-me aside appended every 3rd question. 8 randomized variants, subtle italic styling.
- [x] **Rate limiting** — 30 messages/session (client-side) + 60 requests/hour/IP (worker-side) + 512 max_tokens cap.

### Phase 7: About Page + Visual Polish + Mobile

- [x] **About page** — `about.html`. Product-focused reviewer brief: data sources, design intent, how it works. Same design tokens and nav as globe page. Links back to portfolio site for build story. Mobile responsive.
- [x] **README rewrite** — Updated to reflect Phases 1-6 accurately. Removed stale Dashboard references, added AI Chat Mode, overlap detection, data attribution table.
- [x] **Globe surface Fresnel shader** — Edge-darkened globe via dot-product gradient (center #f0f0f0, edge #bababa). Replaced flat MeshBasicMaterial.
- [x] **Globe element darkening** — Continent dots (#c0c0c0 to #a0a0a0), country borders (#aaa/0.45 to #888/0.55) darkened proportionally.
- [x] **Atmosphere disabled** — Commented out for cleaner look. Code preserved for easy re-enable.
- [x] **Ripple origin** — First post-landing ripple originates from West Africa instead of US east coast.
- [x] **Atlas narrator removed** — Single/pair observation comments and chevron removed from UI.
- [x] **Chevron wiggle animation** — Draws attention to collapsed controls panel. Fires at 3s, 5s, 7s, 9s, 11s, then every 5s. Stops permanently once panel is opened.
- [x] **Mobile responsive** — Touch rotate (single finger), zoom disabled, fixed globe distance (4.2z), viewport meta locks scale.
- [x] **Mobile chat mode** — Globe stays full-viewport with full opacity, chat overlays as full-screen layer. Body background flattened. iOS keyboard handled via visualViewport API + body position:fixed scroll lock. Input font 16px prevents iOS auto-zoom.
- [x] **Mobile controls** — Column layout with chevron above options, fixed position (28% from top), max-height collapse instead of translateX.
- [x] **Mobile nav** — Row layout (title left, links right) on both globe and about pages.
- [x] **Stale index.html removed** — Was a redirect; no longer needed.

### Phase 8: Deployment

- [x] **Create repo** — `github.com/tqny/strange-atlas`, published.
- [x] **Initial commit** — Source JSON + dataset folder excluded via `.gitignore`. Data files excluded for now (preview is self-contained).
- [ ] **Resolve globe-preview.html deploy** — Currently in `.gitignore` (21MB built file). Either remove from gitignore and commit, or set up a GitHub Actions build step to generate it on deploy.
- [ ] **Enable GitHub Pages** — Serve from main branch. `index.html` redirects to `globe-preview.html`.
- [ ] **Final README pass** — Portfolio-quality. Remove "deploy pending" from live link.
- [ ] **Cross-browser check** — Chrome, Firefox, Safari desktop + mobile Safari.

### Phase 9: Modular Refactor (Post-MVP)

- [ ] **Sync modular JS** — Port globe-template.html logic into `js/` modules. Add fetch-based data loading.
- [ ] **Convert to production multi-page site** — Shared nav component, ES modules, fetch data on demand.

## Polish Tasks

- [x] Responsive/mobile considerations
- [ ] Performance profiling and optimization pass
- [ ] Accessibility audit (keyboard navigation, screen reader basics)
