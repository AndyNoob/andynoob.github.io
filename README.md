# AndyNoob website

This repository now uses **Lit + TypeScript + Vite** as a hash-routed SPA.

## Scripts

- `npm install` — install dependencies
- `npm run dev` — run local dev server
- `npm run lint` — type-check lint pass
- `npm run build` — production build
- `npm run preview` — preview production build

## Project data

Projects are rendered from `/public/data/projects.json`.
Add or edit entries there to update the showcase without touching HTML templates.

## Legacy content

Legacy static pages (including mini-games) are archived under `/public/legacy` and linked from the Contact & Legacy route.

## Routing

The SPA uses hash-based routing (`#/intro`, `#/projects`, `#/contact`) for reliable GitHub Pages hosting.
