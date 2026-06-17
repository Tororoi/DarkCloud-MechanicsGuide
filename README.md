# Dark Cloud Mechanics Guide

A companion website documenting the mechanics of a Dark Cloud romhack and the vanilla game.
Formulas are reverse-engineered from the game's code, and all interactive tools (the fishing
simulator) run entirely in the browser — there is no backend.

Built with **SvelteKit** + **`adapter-static`**, so it builds to plain static HTML/JS/CSS that
can be hosted anywhere (GitHub Pages, Netlify, Vercel, …). It began as a Google Apps Script web
app backed by a Google Sheet; the data and simulation logic were pure JavaScript, so the
conversion moved everything client-side (the spreadsheet became `src/lib/data/fish.js`, and the
`google.script.run` server bridge was dropped).

## Develop

```sh
pnpm install
pnpm dev          # http://localhost:5173
```

## Build & preview

```sh
pnpm build        # static output in ./build
pnpm preview      # serve the built site locally
```

## Structure

```
src/
  app.css                       Global design tokens / shared styles
  routes/
    +layout.svelte              Site shell (nav + footer)
    +layout.js                  prerender = true (whole site is static)
    +page.svelte                Home / section landing
    fishing/+page.svelte        Fishing section
    weapons|enemies|dungeons/   Scaffolded placeholder sections
  lib/
    data/fish.js                Canonical fish + area data (source of truth)
    color.js                    Color-scale helpers (derive colors from data)
    sim/fishing.js              Simulation engine (pure, no DOM)
    fishingState.svelte.js      Shared reactive "Custom Fish" state
    components/
      Nav.svelte
      ComingSoon.svelte
      ChartCanvas.svelte        Generic Chart.js wrapper
      fishing/                  Legends, FishStatsTable, Simulator
```

## Adding a section

1. Create `src/routes/<section>/+page.svelte` (use `ComingSoon` for a placeholder).
2. Add the section to the `sections` array in `src/lib/components/Nav.svelte` and a tile in
   `src/routes/+page.svelte`.
3. Put section data under `src/lib/data/` and logic under `src/lib/sim/`.

## Hosting on a sub-path

Links use `base` from `$app/paths`, so for a GitHub Pages *project* site
(`user.github.io/repo/`) set `paths.base` in the SvelteKit config to `/repo` and everything
resolves correctly.
