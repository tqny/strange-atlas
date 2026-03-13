# AGENTS.md — strange-atlas

A portfolio project by Tony Mikityuk.
Part of the portfolio at https://tqny.github.io/Tony-s-Site/

---

## Current Phase

**BUILD — Deployment (Phase 6)**

Phases progress as: BRIEF → PLAN → BUILD → POLISH

Update this field as the project advances.

---

## What To Do Right Now

Phase 5 (Overlap / Intersections) is complete. Next up:

1. **Enable GitHub Pages** — Serve from main branch.
2. **Final README pass** — Portfolio-quality.
3. **Cross-browser check** — Chrome, Firefox, Safari.

---

## Read Order

For any thread picking up this project:

1. `AGENTS.md` (this file) — current phase and what to do
2. `V3-master-prompt.md` — full methodology reference
3. `docs/spec.md` — what the product is
4. `docs/architecture.md` — how it's structured
5. `docs/tasks.md` — what's done, what's next
6. `docs/design.md` — design system and direction
7. `README.md` — reviewer-facing context

---

## Source of Truth

- `docs/spec.md` — primary product truth
- `docs/tasks.md` — execution state and continuity
- `docs/architecture.md` — technical structure
- `docs/design.md` — design system and decisions
- `README.md` — reviewer-facing orientation

---

## Key Technical Notes

- **Three.js globe** — InstancedMesh for dot-matrix continents and category points. ShaderMaterial with silhouette discard for clean edges. Atmosphere glow via Fresnel rim shader.
- **Template/build system** — `globe-template.html` + `scripts/build-globe.py` → `globe-preview.html` (~21MB). All data inlined. Edit the template, not the built file.
- **TopoJSON** — Custom decoder (no D3 dependency). `world-110m.json` for land PIP, `countries-110m.json` for borders.
- **Antimeridian handling** — Polygons wrapping ±180° break PIP ray-casting. Handled by `splitAtAntimeridian()` (2-wrap-edge, e.g. Eurasia) and `fixPolarPoly()` (1-wrap-edge, e.g. Antarctica). See inline comments in `globe-template.html`.
- **Data** — 10 categories, ~99K total points. Pre-split JSON in `data/`. Source: `strange_places_v5.2.json`.
- **Atlas narrator** — pre-scripted in MVP. Designed as swap point for Phase 2 Claude API.
- **Future pages** — Dashboard (statistical analysis) and About (in-product reviewer brief) are planned as future phases. Current globe will become one page of a multi-page site.

---

## End-of-Session Discipline

Before ending any session:

1. Update `docs/tasks.md` — mark completed tasks, note what's in progress, confirm next task.
2. Update this file's "Current Phase" if it changed.
3. If architecture or design decisions were made, update the relevant doc.
4. Note anything a new thread needs to know that isn't captured in docs.

**Creep guard:** AGENTS.md stays forward-looking — no completed-task narratives. tasks.md records *what* was done (one sentence). Technical *how* goes in architecture.md or code comments. If you're writing root-cause analysis in a task description, it's in the wrong place.

---

## Thread Switching

When context gets heavy (30+ substantial exchanges), recommend a fresh thread. The new thread reads this file first, then follows the read order above. Docs-as-memory keeps continuity intact.

---

## Portfolio Context

This project is part of Tony Mikityuk's portfolio. It should be:

- Portfolio-grade: polished, presentable, credible
- Scoped honestly: clear MVP, clear non-goals
- Modular: clean boundaries, reusable primitives
- Documented: repo docs are durable, chat is temporary
- Reviewer-ready: includes an in-product "About This Project" surface

Target audience for the portfolio: hiring managers evaluating a program manager / customer success professional with growing AI/agentic engineering skills.

---

## Repo Workflow

- Git repo from day 1
- GitHub remote from day 1
- Feature branches for meaningful work
- PRs before merge to main
- No direct-to-main unless trivial
