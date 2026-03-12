# Spec — Strange Atlas

> Primary product truth. All other docs derive from this.

## Product

An interactive 3D globe that visualizes ~99,000 real-world mysterious phenomena — UFO sightings, bigfoot encounters, haunted places, volcanoes, shipwrecks, and more — across 10 categories. Users toggle categories on and off, watch the globe respond with colored scatter points and overlap intensification, read dry Atlas observations, and hover for record details.

Three-page site: Globe (interactive map), Dashboard (statistical analysis), About (reviewer brief). Deployed to GitHub Pages.

## Target User

Primary: anyone curious about weird geography who stumbles on it and shares it. Portfolio audience: technical hiring managers and recruiters evaluating range, taste, and judgment.

## Success Criteria

A reviewer lands on the page, selects two categories, watches the globe respond, reads one Atlas observation, and thinks: "I've never seen exactly this." Total time to that moment: under 60 seconds.

## MVP Scope (Globe Page)

- Full-viewport 3D dot-matrix globe rendered via Three.js (custom — no tile libraries)
- 10 category toggle filters, each with a distinct assigned color
- Points render on the globe per active category; overlap zones intensify visually
- On category selection, The Atlas delivers a pre-scripted dry observation (1–3 sentences)
- Hover on a point: tooltip with name, category, date, brief description
- Deployed to GitHub Pages

## Post-MVP Pages

- **Dashboard** — Statistical analysis view: category breakdown charts, reports over time, by-state choropleth, top states. Reference: Strange Places dashboard.
- **About** — In-product reviewer brief: data sources, design intent, build story, portfolio framing.

## Non-Goals (MVP)

- Live Claude API calls (Phase 2)
- Timeline/playback animation
- Mobile optimization
- User accounts or saved states
- Free-text search

## Assumptions and Constraints

- No paid infrastructure
- No API keys in MVP — Atlas responses are pre-scripted only
- Must deploy to GitHub Pages (static files only)
- ~99K records across 10 categories (cut from 354K/14 for performance and scope)
- Pre-split category data inlined at build time; runtime fetching deferred to modular refactor
- Source data: `strange_places_v5.2.json` from GitHub (CC BY 4.0)

## Data / State Model

- Source: `strange_places_v5.2.json` pre-processed into 10 category JSON files
- All data inlined into built HTML at build time (no runtime fetch in prototype)
- All state managed in memory — no backend, no database, no localStorage
- 3D globe projection via Three.js (InstancedMesh dots on sphere)
- Atlas responses: static lookup keyed by active category combination

## Auth / Access

None.
