# Architecture — Strange Atlas

> Technical realization of the spec.

## Stack

- Vanilla JavaScript (no framework)
- Canvas API for map and point rendering
- D3.js for equirectangular coordinate projection math (d3-geo)
- CSS custom properties for design tokens
- Static JSON data files (pre-split by category)
- GitHub Pages for deployment

## Module Structure

### 1. Map Renderer (`map.js`)
Owns the canvas element and all drawing operations.
- Renders dot-matrix continent outlines from GeoJSON world data
- Handles variable-density halftone dot pattern for landmasses
- Draws category points as colored glowing dots
- Handles overlap zone visual intensification (additive blending / brightness)
- Manages canvas resize and redraw on viewport change
- Exposes `render(state)` — receives current app state, redraws accordingly

### 2. Projection (`projection.js`)
Coordinate math layer.
- Wraps D3 equirectangular projection
- Converts lat/lng to canvas x/y
- Handles viewport scaling
- Single source of truth for coordinate transforms

### 3. Data Loader (`data.js`)
Fetches and caches category data.
- Loads pre-split JSON files on demand per category toggle
- Caches loaded categories in memory (no re-fetch)
- Exposes `loadCategory(id)` → returns array of point records
- Handles loading states

### 4. State Manager (`state.js`)
Application state and category toggle logic.
- Tracks which categories are active
- Tracks hovered point (if any)
- Tracks current Atlas response
- Emits state changes to trigger re-renders
- Simple pub/sub or callback pattern — no library needed

### 5. Atlas Narrator (`atlas.js`)
Pre-scripted observation engine.
- Lookup table: single-category observations (14 entries)
- Lookup table: two-category intersection observations (top 20+ combos)
- Fallback observations for uncovered combinations
- Returns observation text given active category set
- Designed so Phase 2 can swap this for live Claude API calls with no UI changes

### 6. UI Controls (`controls.js`)
Category toggles and tooltip.
- Renders 14 category toggle buttons with color indicators
- Handles toggle click → updates state
- Renders hover tooltip (name, category, date, description)
- Renders Atlas observation panel
- All DOM manipulation for non-canvas UI elements

### 7. App Shell (`app.js`)
Entry point and orchestrator.
- Initializes all modules
- Wires state changes → data loading → map re-render → Atlas response → UI update
- Sets up event listeners (toggle clicks, canvas hover/mousemove)
- Manages the render loop

### 8. About Page (`about.html`)
Separate static HTML page.
- Explains data source, intersection mechanic, AI narrator concept, build approach, portfolio intent
- Same design tokens and typography as main page
- Links back to main page

## File / Folder Layout

```
strange-atlas/
├── index.html              # Main app shell
├── about.html              # About This Project page
├── css/
│   └── style.css           # All styles + CSS custom properties (tokens)
├── js/
│   ├── app.js              # Entry point, orchestrator
│   ├── map.js              # Canvas map renderer
│   ├── projection.js       # Coordinate projection (D3 wrapper)
│   ├── data.js             # Category data loader + cache
│   ├── state.js            # App state manager
│   ├── atlas.js            # Pre-scripted narrator
│   └── controls.js         # UI toggles, tooltip, Atlas panel
├── data/
│   ├── world.json          # GeoJSON world boundaries (simplified)
│   ├── ufo-sightings.json  # Pre-split category files
│   ├── volcanoes.json
│   ├── bigfoot.json
│   ├── haunted-places.json
│   ├── megaliths.json
│   ├── meteorites.json
│   ├── tornadoes.json
│   ├── caves.json
│   ├── ghost-towns.json
│   ├── shipwrecks.json
│   ├── earthquakes.json
│   ├── fireballs.json
│   ├── thermal-springs.json
│   └── storm-events.json
├── assets/
│   └── fonts/              # Self-hosted Playfair Display + Inter (if needed)
├── scripts/
│   └── split-data.js       # Build-time script: splits source JSON into category files
├── docs/                   # Project documentation (not deployed)
│   ├── spec.md
│   ├── architecture.md
│   ├── design.md
│   └── tasks.md
├── AGENTS.md
├── README.md
└── V3-master-prompt.md
```

## Data Flow

```
User toggles category
  → state.js updates active categories
  → data.js loads category JSON (if not cached)
  → atlas.js generates observation for current combo
  → map.js re-renders canvas with updated points + overlaps
  → controls.js updates toggle UI + Atlas panel text

User hovers point on canvas
  → app.js performs hit detection on canvas coordinates
  → state.js updates hovered point
  → controls.js renders/hides tooltip
```

## External Dependencies

- **D3-geo** (d3-geo standalone or full D3): equirectangular projection math. Loaded via CDN or bundled.
- **GeoJSON world file**: simplified Natural Earth world boundaries for continent rendering. Included in `data/world.json`.
- **Google Fonts**: Playfair Display + Inter (CDN link, or self-hosted in assets/).

No other runtime dependencies. No build tools required for deployment.

## Boundaries and Swap Points

- **Atlas Narrator** is the primary swap point: Phase 2 replaces static lookup with live Claude API calls. The interface (`getObservation(activeCategories, context)`) stays the same — only the implementation changes.
- **Projection** is isolated so the projection method could change (e.g., to a globe view) without touching the renderer.
- **Data Loader** is isolated so the data source could change (e.g., from static JSON to an API) without touching state or rendering.
- **Map Renderer** owns all canvas operations — UI controls never draw to canvas directly.
- **State Manager** is the single source of truth — no module reads state from the DOM.
