# Tasks — Strange Atlas

> Execution breakdown. Keep this current — it's the primary continuity document.

<!-- Status markers: [ ] pending, [→] in progress, [x] done -->

## Current Phase

PLAN

## Planning Tasks

- [x] Complete project brief
- [x] Draft spec.md
- [x] Draft architecture.md
- [x] Draft design.md (Pass 1 — structure and direction, kept loose per Tony's preference)
- [x] Draft tasks.md (this file)
- [x] Draft README.md
- [ ] Review planning package with Tony → confirm or adjust before build

## Build Tasks

### Phase 0: Data Preparation

- [ ] **Acquire source data** — Download `strange_places_v5.2.json` from GitHub. Verify structure, record count, field names, category list.
  - Done when: source file is in repo, field schema is documented, 14 categories confirmed.

- [ ] **Write data split script** — `scripts/split-data.js` that reads source JSON and outputs 14 category files to `data/`. Each file contains an array of `{ name, lat, lng, date, description, category }` objects. Strip unnecessary fields to minimize file size.
  - Done when: 14 JSON files exist in `data/`, total record count matches source, largest file (tornadoes) size is known.

- [ ] **Acquire and simplify world GeoJSON** — Get Natural Earth 110m or 50m world boundaries. Simplify if needed for canvas rendering performance. Save as `data/world.json`.
  - Done when: `world.json` renders recognizable continents and is under 500KB.

### Phase 1: Map Prototype (Highest Risk)

- [ ] **Scaffold project** — Create `index.html`, `css/style.css`, `js/app.js`. Set up HTML shell with full-viewport canvas, link fonts (Playfair + Inter), apply base dark styles. Wire up JS module loading (ES modules via `<script type="module">`).
  - Done when: page loads with a black full-viewport canvas and correct fonts.

- [ ] **Implement projection module** — `js/projection.js`. Wrap D3 equirectangular projection. Convert lat/lng → canvas x/y. Handle canvas resize.
  - Done when: known coordinates (e.g., London, New York, Tokyo) project to visually correct canvas positions.

- [ ] **Render dot-matrix continents** — `js/map.js` first pass. Load `world.json`, project polygon boundaries, fill landmasses with a dot grid pattern. Variable density halftone: denser toward polygon centers/coastlines, sparser at edges. Dark grey dots on black background.
  - Done when: recognizable world continents render as halftone dot-matrix on canvas. This is the highest-risk task — prototype and iterate.

- [ ] **Render category points** — Load one test category (e.g., volcanoes — moderate count). Draw colored glowing dots at projected coordinates on top of the continent base layer.
  - Done when: volcano points render in the correct color at geographically plausible locations with a subtle glow/bloom effect.

- [ ] **Canvas performance test** — Load the largest category (tornadoes, ~70K points). Measure frame time. If unacceptable, implement point thinning, spatial indexing, or level-of-detail reduction.
  - Done when: 70K points render without noticeable freeze or jank on a standard laptop.

### Phase 2: State + Data Loading

- [ ] **Implement state manager** — `js/state.js`. Track active categories, hovered point, current Atlas text. Pub/sub pattern for state change notifications.
  - Done when: toggling a category in state triggers registered callbacks.

- [ ] **Implement data loader** — `js/data.js`. Fetch category JSON on demand. Cache in memory. Expose `loadCategory(id)` async function.
  - Done when: toggling a category fetches the correct JSON file (or returns cached), and data is available for rendering.

- [ ] **Wire state → render loop** — Connect state changes to map re-render. When active categories change, map redraws with correct points.
  - Done when: programmatically toggling categories causes the map to update with the right colored points.

### Phase 3: UI Controls

- [ ] **Build category toggle panel** — `js/controls.js`. Render 14 toggle buttons with category name and color indicator. Clicking toggles category in state.
  - Done when: all 14 toggles render, clicking one lights up/dims the toggle and triggers data load + map render for that category.

- [ ] **Build Atlas observation panel** — Quiet text panel (bottom of viewport or similar). Displays Atlas observation text when categories change. Initial state: "354,770 phenomena. 14 categories. Select one to begin."
  - Done when: panel renders, updates text on category toggle, styled as editorial caption (not chat bubble).

- [ ] **Build hover tooltip** — Detect which point the cursor is near (spatial hit detection on canvas). Show tooltip with name, category, date, description. Hide when cursor moves away.
  - Done when: hovering near a point shows a correctly populated tooltip; moving away hides it.

### Phase 4: Atlas Narrator Content

- [ ] **Write single-category observations** — 14 entries, one per category. Dry, deadpan, 1–3 sentences each. Save in `js/atlas.js` or a separate `data/atlas-responses.json`.
  - Done when: every single-category toggle produces a unique, tonally consistent Atlas observation.

- [ ] **Write two-category intersection observations** — Top 20+ most interesting two-category combinations. Dry, specific to the geographic intersection. Fallback text for uncovered combos.
  - Done when: the most likely category combos produce specific observations; edge cases get a reasonable fallback.

- [ ] **Implement Atlas narrator logic** — `js/atlas.js`. Lookup current active categories → return appropriate observation. Handle 0, 1, 2, and 3+ active categories.
  - Done when: Atlas panel always shows contextually appropriate text for any combination of active categories.

### Phase 5: Overlap Visualization

- [ ] **Implement overlap zone rendering** — Where points from multiple active categories are geographically close, increase brightness and blend colors. Define a radius threshold. Use canvas composite operations or manual brightness calculation.
  - Done when: activating two categories that geographically overlap produces visible intensification/blending at intersection points.

### Phase 6: About Page + Polish

- [ ] **Build About This Project page** — `about.html`. Content: data source explanation, 14 categories, intersection mechanic, AI narrator concept + Phase 2 roadmap, build approach (vanilla JS, canvas, pre-split JSON), portfolio intent. Same tokens and typography as main page.
  - Done when: page is complete, linked from main page, tonally consistent (honest, specific, a little dry).

- [ ] **Add ambient idle animation** — Subtle slow dot pulse on the continent map when no categories are selected. Barely perceptible. Gives the page life.
  - Done when: the page has a subtle living quality even before interaction.

- [ ] **Landing state polish** — Ensure the initial load experience is right. "Strange Atlas" wordmark in Playfair Display. Atlas panel shows opening line. All dots dim. Everything invites interaction.
  - Done when: first impression matches the 60-second success criteria setup.

- [ ] **Cross-browser sanity check** — Test in Chrome, Firefox, Safari. Fix any canvas rendering inconsistencies.
  - Done when: map renders correctly in all three browsers.

### Phase 7: Deployment

- [ ] **Configure GitHub Pages deployment** — Set up repo, push, configure GH Pages to serve from main branch (or /docs, depending on structure).
  - Done when: live at `tqny.github.io/strange-atlas` (or similar) and fully functional.

- [ ] **Final README pass** — Ensure README is portfolio-quality. Not just technical — explains the project's intent, the data, the design choices, the AI workflow story.
  - Done when: README reads well to a hiring manager who spends 30 seconds on it.

## Polish Tasks

<!-- Populate as build nears completion. -->
- [ ] Responsive/mobile considerations (post-MVP but note any quick wins)
- [ ] Performance profiling and optimization pass
- [ ] Accessibility audit (keyboard navigation, screen reader basics)
- [ ] Phase 2 architecture prep (ensure Atlas narrator swap point is clean)
