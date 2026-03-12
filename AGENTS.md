# AGENTS.md — strange-atlas

A portfolio project by Tony Mikityuk.
Part of the portfolio at https://tqny.github.io/Tony-s-Site/

---

## Current Phase

**PLAN**

Phases progress as: BRIEF → PLAN → BUILD → POLISH

Update this field as the project advances.

---

## What To Do Right Now

Planning package is complete. All docs are populated. Next steps:

1. Review the planning docs with Tony — confirm spec, architecture, task order, and design direction.
2. Once confirmed, transition to **BUILD** phase.
3. Start with **Phase 0: Data Preparation** — acquire source data, write the split script, get the world GeoJSON.
4. Then move to **Phase 1: Map Prototype** — this is the highest-risk work. Everything depends on the dot-matrix canvas render working well.

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

- **Canvas rendering** — all map drawing is custom Canvas API. No tile libraries (Leaflet, Mapbox).
- **D3-geo** — used only for equirectangular projection math, not for rendering.
- **Data loading** — pre-split JSON files per category, loaded on demand. Source: `strange_places_v5.2.json`.
- **Performance** — tornado category has ~70K points. May need thinning/LOD.
- **Atlas narrator** — pre-scripted in MVP. Module designed as clean swap point for Phase 2 Claude API.
- **Design** — Tony is driving design direction with inspiration references. Design doc is intentionally loose.

---

## End-of-Session Discipline

Before ending any session:

1. Update `docs/tasks.md` — mark completed tasks, note what's in progress, confirm next task.
2. Update this file's "Current Phase" if it changed.
3. If architecture or design decisions were made, update the relevant doc.
4. Note anything a new thread needs to know that isn't captured in docs.

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
