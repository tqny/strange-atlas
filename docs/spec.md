# Spec — Strange Atlas

> Primary product truth. All other docs derive from this.

## Product

An interactive full-viewport world map that visualizes 354,770 real-world mysterious phenomena — UFO sightings, bigfoot encounters, haunted places, volcanoes, megaliths, shipwrecks, and more — across 14 categories. Users toggle categories on and off, watch the map respond with colored scatter points and overlap intensification, read dry Atlas observations, and hover for record details.

Single-page vanilla JS app with a secondary "About This Project" page. Deployed to GitHub Pages.

## Target User

Primary: anyone curious about weird geography who stumbles on it and shares it. Portfolio audience: technical hiring managers and recruiters evaluating range, taste, and judgment.

## Success Criteria

A reviewer lands on the page, selects two categories, watches the map respond, reads one Atlas observation, and thinks: "I've never seen exactly this." Total time to that moment: under 60 seconds.

## MVP Scope

- Full-viewport dark dot-matrix world map rendered via Canvas API from GeoJSON (custom — no tile libraries)
- 14 category toggle filters, each with a distinct assigned color
- Points render on the map per active category; overlap zones intensify visually
- On category selection, The Atlas delivers a pre-scripted dry observation (1–3 sentences)
- Hover on a point: tooltip with name, category, date, brief description
- "About This Project" page (dedicated page)
- Deployed to GitHub Pages

## Non-Goals (MVP)

- Live Claude API calls (Phase 2)
- Timeline/playback animation
- Mobile optimization
- User accounts or saved states
- Free-text search
- Light mode toggle (Phase 2)

## Assumptions and Constraints

- No paid infrastructure
- No API keys in MVP — Atlas responses are pre-scripted only
- Must deploy to GitHub Pages (static files only)
- 354K records across 14 categories — performance is a real constraint
- Pre-splitting data by category is the solution for load performance
- Canvas rendering must handle up to ~70K points (tornado category) without freezing
- Source data: `strange_places_v5.2.json` from GitHub (CC BY 4.0)

## Data / State Model

- Source: `strange_places_v5.2.json` pre-processed at build time into 14 category JSON files
- Loaded client-side on demand when a category is toggled
- All state managed in memory — no backend, no database, no localStorage
- Coordinate projection: equirectangular (flat map) via custom canvas rendering
- Atlas responses: static JSON lookup keyed by active category combination

## Auth / Access

None.
