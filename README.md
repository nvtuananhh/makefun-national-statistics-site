# VietStats Atlas — Viet Nam in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/nvtuananhh/makefun-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/nvtuananhh/makefun-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An original, independent atlas of Viet Nam's national statistics — built for the [make.fun bounty "Make the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## What it is

VietStats Atlas gathers Viet Nam's headline statistics into one working site that runs **fully offline** in a browser on desktop and on a phone, from its own static files: no build step, no CDN, no network request at all.

- **Overview** — six KPI cards (population 100.99m, GDP $476.3bn, growth 7.09%, GDP per capita $4,700, CPI +3.63%, unemployment 2.24%) plus the GDP 2020–2025 chart and an at-a-glance strip.
- **Economy** — GDP series with a year-range selector that really re-renders, bar/line chart toggle, sector shares, GDP per capita chart.
- **Population** — population series, urbanisation, age structure, labour force.
- **Prices & Labour** — CPI series and inflation chart, unemployment with its definition labelled, average earnings.
- **Trade** — exports vs imports 2020–2025, the $24.77bn surplus, leading export categories and trading partners.
- **Regions** — six socio-economic regions in a table you can sort by any column and filter by search, plus the two largest cities with verified GRDP notes.
- **Data tables** — the full indicator set with a $/₫ unit toggle that really converts, a CSV download that really downloads (made locally in the browser), and print.
- **Sources & methods** — every figure's source and year, plus vintage notes for the cases where sources disagree (2025 GDP, unemployment definitions, urban share, regional totals).

Every control on the site works. Nothing is a placeholder, and no figure is invented: a row that could not be verified from a named source was left out rather than estimated.

## Screenshots

Four real renders of the site's own code, taken in a headless browser:

1. `01-overview-desktop.jpg` — Overview at 1280×800 (the cover)
2. `02-economy-desktop.jpg` — Economy at 1280×800
3. `03-tables-desktop.jpg` — Data tables at 1280×800
4. `04-overview-phone.jpg` — Overview at 390×844

## Run it

```sh
cd app
python3 -m http.server 8080
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts` (the kit's copy, unchanged).

## Layout

- `app/index.html` — shell, navigation, ticker
- `app/css/site.css` — the whole look (deep teal + amber on warm paper)
- `app/js/data.js` — every figure, as code, with source and year
- `app/js/charts.js` — hand-written inline SVG bar/line charts
- `app/js/app.js` — hash routing, page rendering, all controls
- `screenshots/` — four real renders of the site (desktop ×3, phone ×1)
- `LICENSE` — MIT

## Design

An original look, not a copy of any statistics office: deep teal (`#0b4f4a`) with an amber accent (`#e8a317`) on warm paper (`#faf7f0`), system type only (no webfont, so nothing is fetched), big legible numbers, and hand-drawn inline SVG charts. The layout stacks cleanly on a phone.

## Sources

General Statistics Office of Viet Nam (2024 release), World Bank World Development Indicators and Data360, UNDP Human Development Report 2023–24, CEIC, and the published regional lists cited on the Sources page. VietStats Atlas is an original work and is not affiliated with any statistics office.
