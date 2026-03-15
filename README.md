# Strange Atlas

An interactive 3D globe visualizing ~99,000 real-world mysterious phenomena - UFO sightings, bigfoot encounters, haunted places, volcanoes, shipwrecks, and more - rendered as a dot-matrix editorial experience.

**Live:** [tqny.github.io/strange-atlas](https://tqny.github.io/strange-atlas/)
**Portfolio:** [tqny.github.io/Tony-s-Site](https://tqny.github.io/Tony-s-Site/)

---

## What It Is

A full-viewport 3D globe where 10 categories of strange phenomena can be toggled on and off. Each category lights up as neon scatter points in a distinct color. Where categories geographically overlap, an intersection mode filters the globe down to just those shared zones - showing you places where the world gets particularly weird.

A pre-scripted narrator called The Atlas delivers dry, deadpan observations as you explore. An AI chat mode ("Ask Atlas") lets you ask questions about the data using natural language, powered by Kimi 2.5 via a Cloudflare Worker proxy.

## Features

- **Custom 3D globe** - Three.js InstancedMesh dot-matrix continents with silhouette-aware shaders. Fresnel edge-darkening on the globe surface for depth. No tile libraries, no Mapbox, no Leaflet.
- **10 category toggles** - Each with a distinct color, neon glow shader, and size scaled by data density.
- **Geographic overlap detection** - Haversine distance on a 2° spatial grid (150km radius). Shader-based intersection mode fades non-overlapping points.
- **Ask Atlas (AI chat)** - Kimi 2.5 API via Cloudflare Worker proxy. Context-aware system prompt includes active categories. Character-by-character typing animation. 30 messages/session client-side, 60 requests/hour/IP server-side.
- **Landing wave animation** - West-to-east gaussian sweep across the US on page load, sampling all category colors.
- **Ambient ripple** - Radial pond-ripple on continent dots during idle. Scale and brightness pulse from random origins.
- **Hover tooltips** - Point name, category, date, and description on mouseover.
- **Mobile responsive** - Touch rotate, fixed zoom, full-viewport chat overlay with iOS keyboard handling.

## Data

Source: [Strange Places v5.2](https://github.com/lukeslp/strange-places-dataset) by Luke Steuber (CC BY 4.0). 354,770 records across 14 categories, filtered to 10 categories and ~99K points for this project.

| Category | Records | Source |
|----------|---------|--------|
| Meteorites | 32,186 | NASA |
| UFO Sightings (2010+) | 21,490 | NUFORC |
| Ghost Towns | 18,154 | OpenStreetMap |
| Haunted Places | 9,717 | Shadowlands Index |
| Thermal Springs | 5,003 | NOAA |
| Bigfoot Sightings | 3,797 | BFRO |
| Earthquakes | 3,742 | USGS |
| Shipwrecks | 3,653 | NOAA |
| Fireballs | 863 | NASA |
| Volcanoes | 170 | USGS |

## Architecture

Three.js r128, vanilla JavaScript, no framework. Single-file prototype (`globe-template.html`) built via Python script into a self-contained HTML file (~21MB) with all data inlined. Custom TopoJSON decoder (no D3 dependency). InstancedMesh for ~74K continent dots and per-category scatter points. Silhouette-aware ShaderMaterial discards fragments at the globe edge.

Antimeridian-wrapping polygons handled via `splitAtAntimeridian()` (2-wrap-edge, e.g. Eurasia) and `fixPolarPoly()` (1-wrap-edge, e.g. Antarctica).

AI chat proxied through a Cloudflare Worker (`worker/proxy.js`). API key stored as a Worker secret - never in the browser. `build-globe.py` injects the proxy URL at build time.

## How to Run

```bash
git clone https://github.com/tqny/strange-atlas.git
cd strange-atlas

# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000/globe-preview.html` (or build to `index.html` — see below).

To rebuild after editing `globe-template.html`:

```bash
# Set the chat proxy URL (optional - chat works without it, just won't connect)
export CHAT_API_URL=https://your-worker.workers.dev

python3 scripts/build-globe.py
```

## What This Demonstrates

- **Data visualization judgment** - Choosing the right visual encoding for ~99K points across 10 categories, with geographic overlap as the central insight mechanic.
- **Technical range** - Custom WebGL rendering, TopoJSON decoding, antimeridian polygon handling, Haversine spatial detection, Cloudflare Workers, shader programming - without hiding behind a framework.
- **Design sensibility** - Dot-matrix continents, atmosphere glow, neon scatter, typographic identity, editorial restraint. Light theme, clean negative space.
- **Product thinking** - Clear scope, honest non-goals, and a mid-project pivot from a static dashboard to an AI chat mode when the better product became obvious.
- **AI-assisted workflow** - Built collaboratively with Claude using a structured planning methodology. The AI collaboration is part of the portfolio story.

---

*Built by Tony Mikityuk. AI-assisted with Claude.*
