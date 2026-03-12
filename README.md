# Strange Atlas

An interactive world map visualizing 354,770 real mysterious phenomena — UFO sightings, bigfoot encounters, haunted places, volcanoes, megaliths, shipwrecks, and more — rendered as a dot-matrix dark editorial experience.

**Live:** [tqny.github.io/strange-atlas](https://tqny.github.io/strange-atlas/) *(deploy pending)*
**Portfolio:** [tqny.github.io/Tony-s-Site](https://tqny.github.io/Tony-s-Site/)

---

## What It Is

A full-viewport canvas map where 14 categories of strange phenomena can be toggled on and off. Each category lights up in a distinct color. Where categories geographically overlap, the visualization intensifies — showing you places where the world gets particularly weird.

An AI narrator called "The Atlas" delivers dry, deadpan observations as you explore. In v1, these are pre-scripted. Phase 2 replaces them with live Claude API responses.

## Why It Exists

This is a portfolio project demonstrating interactive data visualization, editorial design sensibility, and the judgment to take a creative concept from raw open data to a polished, shareable product. It also demonstrates AI-assisted development workflow — the entire project was built collaboratively with Claude.

The secondary reason: it's genuinely interesting. 354,770 data points across 14 categories of the world's strangest places, and you can layer them to find the overlaps.

## What's In V1

- Custom dot-matrix world map rendered via Canvas API (no tile libraries, no Mapbox, no Leaflet)
- 14 category toggles with assigned color palette
- Geographic overlap visualization with brightness intensification
- Pre-scripted Atlas narrator with category-specific and intersection-specific observations
- Point hover tooltips with record details
- "About This Project" page with full context for reviewers
- Static deployment to GitHub Pages

## What's Intentionally Deferred

- Live Claude API integration for the Atlas narrator
- Light mode toggle
- Mobile optimization
- Timeline/playback animation
- Search and filtering beyond category toggles

## Architecture

Vanilla JavaScript, Canvas API, D3-geo for coordinate projection. No framework. Pre-split static JSON data files loaded on demand per category. Seven focused modules: map renderer, projection, data loader, state manager, Atlas narrator, UI controls, and app orchestrator. The narrator module is designed as a clean swap point for Phase 2 API integration.

Data source: [strange_places_v5.2.json](https://github.com/) (CC BY 4.0) — 354,770 records across 14 categories.

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

Open `http://localhost:8000` (or whatever port your server uses).

## What This Project Demonstrates

- **Data visualization judgment:** Choosing the right visual encoding for 354K points across 14 categories, with overlap as the central insight mechanic.
- **Technical range:** Custom canvas rendering, coordinate projection, on-demand data loading, spatial hit detection — without hiding behind a framework.
- **Design sensibility:** Dark editorial aesthetic, variable-density halftone, typographic identity, restraint.
- **Product thinking:** Clear scope, honest non-goals, success criteria defined in seconds not features.
- **AI-assisted workflow:** Built collaboratively with Claude using a structured planning methodology. The AI collaboration is part of the portfolio story.

---

*Built by Tony Mikityuk. AI-assisted with Claude.*
