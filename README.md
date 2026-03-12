# Strange Atlas

An interactive 3D globe visualizing ~99,000 real mysterious phenomena — UFO sightings, bigfoot encounters, haunted places, volcanoes, shipwrecks, and more — rendered as a dot-matrix editorial experience.

**Live:** [tqny.github.io/strange-atlas](https://tqny.github.io/strange-atlas/) *(deploy pending)*
**Portfolio:** [tqny.github.io/Tony-s-Site](https://tqny.github.io/Tony-s-Site/)

---

## What It Is

A full-viewport 3D globe where 10 categories of strange phenomena can be toggled on and off. Each category lights up in a distinct color. Where categories geographically overlap, the visualization intensifies — showing you places where the world gets particularly weird.

An AI narrator called "The Atlas" delivers dry, deadpan observations as you explore. In v1, these are pre-scripted. Phase 2 replaces them with live Claude API responses.

## Why It Exists

This is a portfolio project demonstrating interactive data visualization, editorial design sensibility, and the judgment to take a creative concept from raw open data to a polished, shareable product. It also demonstrates AI-assisted development workflow — the entire project was built collaboratively with Claude.

The secondary reason: it's genuinely interesting. ~99,000 data points across 10 categories of the world's strangest places, and you can layer them to find the overlaps.

## What's In V1

- Custom dot-matrix 3D globe rendered via Three.js (no tile libraries, no Mapbox, no Leaflet)
- 10 category toggles with assigned color palette
- Geographic overlap visualization
- Pre-scripted Atlas narrator with category-specific and intersection-specific observations
- Point hover tooltips with record details
- Atmosphere glow and country border lines for geographic context
- Static deployment to GitHub Pages

## What's Planned

- **Dashboard page** — statistical analysis: category breakdown, reports over time, by-state view
- **About page** — in-product reviewer brief with data sources, design intent, and build story
- Live Claude API integration for the Atlas narrator

## What's Intentionally Deferred

- Light/dark mode toggle
- Mobile optimization
- Timeline/playback animation
- Search and filtering beyond category toggles

## Architecture

Three.js r128, vanilla JavaScript, no framework. Single-file prototype (`globe-template.html`) built via Python script into a self-contained HTML file with all data inlined. Custom TopoJSON decoder (no D3). InstancedMesh for ~74K continent dots and category scatter points. Silhouette-aware shaders for clean globe edges. The Atlas narrator module is designed as a clean swap point for Phase 2 API integration.

Data source: [strange_places_v5.2.json](https://github.com/) (CC BY 4.0) — ~99,000 records across 10 categories.

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/tqny/strange-atlas.git
cd strange-atlas

# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000/globe-preview.html`.

To rebuild after editing `globe-template.html`:

```bash
python3 scripts/build-globe.py
```

## What This Project Demonstrates

- **Data visualization judgment:** Choosing the right visual encoding for ~99K points across 10 categories, with overlap as the central insight mechanic.
- **Technical range:** Custom WebGL globe rendering, TopoJSON decoding, antimeridian polygon handling, spatial hit detection — without hiding behind a framework.
- **Design sensibility:** Light editorial aesthetic, dot-matrix continents, atmosphere glow, typographic identity, restraint.
- **Product thinking:** Clear scope, honest non-goals, success criteria defined in seconds not features.
- **AI-assisted workflow:** Built collaboratively with Claude using a structured planning methodology. The AI collaboration is part of the portfolio story.

---

*Built by Tony Mikityuk. AI-assisted with Claude.*
