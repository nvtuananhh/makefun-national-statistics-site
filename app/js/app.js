// VietStats Atlas — application.
// Hash routing, page rendering and every control on the site.
// No network: all data comes from data.js; CSV download is a Blob made
// locally; unit conversion is arithmetic on the same figures.

import {
  META, KPI, YEARS, SERIES, ECONOMY_2024, PRICES_LABOUR, TRADE_2024,
  TRADE_SERIES, TOP_EXPORTS, TRADE_PARTNERS, REGIONS, CITIES,
  POPULATION, GLANCE, VINTAGE_2025, indicatorRows,
} from './data.js';
import { barChart, lineChart, groupedBarChart, shareBars, SHARE_CSS } from './charts.js';

const page = document.getElementById('page');
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const ticker = document.getElementById('ticker');

// ---- shared state -------------------------------------------------------
const state = {
  unit: 'usd',          // 'usd' | 'vnd' — tables page
  chartType: 'bar',     // 'bar' | 'line' — economy + overview charts
  rangeStart: 2020,     // year-range selector on Economy
  regionQuery: '',
  regionSort: { key: 'population', dir: -1 },
};

// ---- small helpers ------------------------------------------------------
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fmt(n, d) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d });
}
function usdToVnd(bn) { return bn * META.vndPerUsd2024; }
function moneyCell(usdBn) {
  if (state.unit === 'vnd') return fmt(usdToVnd(usdBn), 0) + ' ₫bn';
  return '$' + fmt(usdBn, 1) + 'bn';
}
function srcLine(text) { return '<p class="source-note">Source: <b>' + esc(text) + '</b></p>'; }
function injectShareCss() {
  if (!document.getElementById('shareCss')) {
    const st = document.createElement('style');
    st.id = 'shareCss';
    st.textContent = SHARE_CSS;
    document.head.appendChild(st);
  }
}

// ---- ticker + nav -------------------------------------------------------
function renderTicker() {
  const items = [
    'GDP 2024 <b>$476.3bn</b>',
    'Growth <b>+7.09%</b>',
    'GDP per capita <b>$4,700</b>',
    'Population <b>100.99m</b>',
    'Trade <b>$786.29bn</b>',
    'CPI <b>+3.63%</b>',
    'Unemployment <b>2.24%</b> (GSO)',
  ];
  ticker.innerHTML = '<div class="wrap">' + items.map(function (i) { return '<span>' + i + '</span>'; }).join('') + '</div>';
}
function setActiveNav(route) {
  nav.querySelectorAll('a').forEach(function (a) {
    a.classList.toggle('active', a.dataset.route === route);
  });
}
navToggle.addEventListener('click', function () {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') nav.classList.remove('open');
});

// ---- pages --------------------------------------------------------------
function kpiCards(extraClass) {
  return '<section class="kpis' + (extraClass ? ' ' + extraClass : '') + '">' + KPI.map(function (k) {
    const shown = k.unit === '$' ? '$' + fmt(k.value, k.decimals) : fmt(k.value, k.decimals) + ' <small>' + esc(k.unit) + '</small>';
    return '<article class="kpi' + (k.hot ? ' hot' : '') + '">' +
      '<div class="label">' + esc(k.label) + '</div>' +
      '<div class="value">' + shown + '</div>' +
      '<div class="delta">' + esc(k.delta) + '</div>' +
      '<div class="meta">' + esc(k.meta) + '</div></article>';
  }).join('') + '</section>';
}

function chartPanel(title, svg, note, controlsHtml) {
  return '<section class="panel"><div class="panel-head"><h2>' + esc(title) + '</h2>' +
    (controlsHtml || '') + '</div>' + svg +
    '<p class="chart-note">' + note + '</p></section>';
}

function chartTypeSeg() {
  return '<span class="controls" style="margin:0"><span class="seg" role="group" aria-label="Chart type">' +
    '<button type="button" data-chart="bar" aria-pressed="' + (state.chartType === 'bar') + '">Bars</button>' +
    '<button type="button" data-chart="line" aria-pressed="' + (state.chartType === 'line') + '">Line</button>' +
    '</span></span>';
}

function gdpChartHtml(compact) {
  const idx = YEARS.map(function (y, i) { return i; }).filter(function (i) { return YEARS[i] >= state.rangeStart; });
  const vals = idx.map(function (i) { return SERIES.gdpUsdBn[i]; });
  const labs = idx.map(function (i) { return String(YEARS[i]); });
  const fn = state.chartType === 'line' ? lineChart : barChart;
  return fn(vals, labs, { title: 'GDP of Viet Nam, ' + state.rangeStart + '–2025, billion US dollars', unit: '$bn', highlightLast: true, compact: !!compact });
}

function renderOverview() {
  const gdp = gdpChartHtml(true);
  const glance = '<section class="glance">' + GLANCE.map(function (g) {
    return '<div><div class="g-num">' + esc(g.num) + '</div><div class="g-lab">' + esc(g.lab) + '</div></div>';
  }).join('') + '</section>';
  page.innerHTML =
    '<p class="kicker">Viet Nam · Anchor year 2024</p>' +
    '<h1>Viet Nam in numbers</h1>' +
    '<p class="lede">One country, eight sections, every figure sourced and dated — from the General Statistics Office and the World Bank.</p>' +
    kpiCards('six') +
    chartPanel('Gross domestic product, 2020–2025', gdp,
      'World Bank, World Development Indicators. GDP at current prices, US dollars. 2024: $476.3bn; 2025: $514.7bn (WDI vintage — see the vintage note on Sources &amp; methods).', chartTypeSeg()) +
    glance +
    '<section class="two-col">' +
    '<div class="panel"><h3>At a glance — 2024</h3><div class="fact-grid">' +
    '<div><div class="f-lab">Trade surplus</div><div class="f-val">$24.77bn</div><div class="f-sub">Exports $405.53bn, imports $380.76bn (GSO)</div></div>' +
    '<div><div class="f-lab">Labour productivity</div><div class="f-val">$9,182</div><div class="f-sub">per worker, +$726 on 2023 (GSO)</div></div>' +
    '<div><div class="f-lab">Urban share</div><div class="f-val">40.2%</div><div class="f-sub">of population in urban areas (GSO)</div></div>' +
    '<div><div class="f-lab">FDI net inflow</div><div class="f-val">$20.17bn</div><div class="f-sub">2024, World Bank WDI</div></div>' +
    '</div></div>' +
    '<div class="panel"><h3>Where to look next</h3><ul class="rank-list">' +
    '<li><span><b>Economy</b> — growth, sectors, GDP per capita</span><span class="val"><a href="#/economy">Open →</a></span></li>' +
    '<li><span><b>Population</b> — 101 million people, ageing slowly</span><span class="val"><a href="#/population">Open →</a></span></li>' +
    '<li><span><b>Prices &amp; Labour</b> — inflation 3.63%, jobs</span><span class="val"><a href="#/prices-labour">Open →</a></span></li>' +
    '<li><span><b>Trade</b> — $786bn of goods crossed the border</span><span class="val"><a href="#/trade">Open →</a></span></li>' +
    '<li><span><b>Regions</b> — six regions, sortable and searchable</span><span class="val"><a href="#/regions">Open →</a></span></li>' +
    '</ul></div></section>' +
    srcLine(META.sources.gso2024 + '; ' + META.sources.wdi + '.');
  bindChartSeg();
}

function renderEconomy() {
  injectShareCss();
  const rows = indicatorRows().filter(function (r) { return r.year >= state.rangeStart; });
  const table = '<div class="table-wrap"><table><caption>GDP and growth, ' + state.rangeStart + '–2025</caption>' +
    '<thead><tr><th>Year</th><th class="num">GDP ($bn)</th><th class="num">Growth (%)</th><th class="num">GDP per capita ($)</th></tr></thead><tbody>' +
    rows.map(function (r) {
      return '<tr><td>' + r.year + '</td><td class="num">' + fmt(r.gdp, 1) + '</td><td class="num">' + fmt(r.growth, 1) + '</td><td class="num">' + fmt(r.gdpPc, 0) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  page.innerHTML =
    '<p class="kicker">Economy</p><h1>The economy: $476.3bn and growing 7.09%</h1>' +
    '<p class="lede">Viet Nam’s economy grew 7.09% in real terms in 2024, its fastest pace since the 2022 rebound, on GDP of ₫11.51 quadrillion ($476.3 billion). GDP per capita reached $4,700 — ₫114 million — up $377 on 2023.</p>' +
    '<div class="controls"><label for="rangeSel">Show years from</label>' +
    '<select id="rangeSel">' + [2020, 2021, 2022, 2023, 2024].map(function (y) {
      return '<option value="' + y + '"' + (y === state.rangeStart ? ' selected' : '') + '>' + y + '</option>';
    }).join('') + '</select>' +
    '<span class="seg" role="group" aria-label="Chart type">' +
    '<button type="button" data-chart="bar" aria-pressed="' + (state.chartType === 'bar') + '">Bars</button>' +
    '<button type="button" data-chart="line" aria-pressed="' + (state.chartType === 'line') + '">Line</button></span></div>' +
    chartPanel('GDP, ' + state.rangeStart + '–2025 (US$ billion)', gdpChartHtml(),
      'World Bank, World Development Indicators. One vintage per chart — this series is WDI throughout.', '') +
    '<section class="two-col">' +
    '<div class="panel"><h3>GDP per capita, 2020–2025</h3>' +
    lineChart(SERIES.gdpPerCapitaUsd, YEARS.map(String), { title: 'GDP per capita, US dollars', unit: '$' }) +
    '<p class="chart-note">World Bank WDI. $3,534 in 2020 → $5,066 in 2025; $4,717 in 2024. PPP per capita in 2024 was $16,390 (GSO).</p></div>' +
    '<div class="panel"><h3>What the economy is made of</h3>' + shareBars(ECONOMY_2024.sectors2023) +
    '<p class="chart-note">Sector shares of GDP, 2023 estimates (GSO). Services 42.5%, industry &amp; construction about 38%, agriculture about 11%; the rest is product taxes less subsidies.</p>' +
    '<p class="chart-note">Labour productivity 2024: <b>$9,182 per worker</b> (₫221.9 million), up $726 on 2023 (GSO).</p></div></section>' +
    table + srcLine(META.sources.wdi + '; ' + META.sources.gso2024 + '.');
  document.getElementById('rangeSel').addEventListener('change', function (e) {
    state.rangeStart = Number(e.target.value);
    renderEconomy();
  });
  bindChartSeg();
}

function renderPopulation() {
  page.innerHTML =
    '<p class="kicker">Population</p><h1>100.99 million people</h1>' +
    '<p class="lede">Viet Nam passed 100 million people in 2023 and reached 100.99 million in 2024. Two in five people now live in towns and cities, and the population is ageing slowly — the median age was 32.5 in 2023.</p>' +
    '<section class="kpis">' +
    '<article class="kpi"><div class="label">Population 2024</div><div class="value">100.99 <small>million</small></div><div class="delta">15th most populous country</div><div class="meta">World Bank Data360, 2024</div></article>' +
    '<article class="kpi hot"><div class="label">Urban share</div><div class="value">40.2 <small>%</small></div><div class="delta">WDI series: 38.5% (other definition)</div><div class="meta">GSO 2024 — see note below</div></article>' +
    '<article class="kpi"><div class="label">Life expectancy</div><div class="value">74.6 <small>years</small></div><div class="delta">HDI 0.766 (2023, UNDP)</div><div class="meta">UNDP Human Development Report</div></article>' +
    '</section>' +
    chartPanel('Population, 2020–2025 (millions)',
      barChart(SERIES.populationM, YEARS.map(String), { title: 'Population, millions', unit: 'm', highlightLast: true }),
      'World Bank WDI. 98.08m (2020) → 101.6m (2025). The GSO figure for 2024 is 100.99m; the WDI 2024 value is 101.0m — the same count, rounded differently.', '') +
    '<section class="two-col">' +
    '<div class="panel"><h3>Urbanisation, 2020–2025</h3>' +
    lineChart(SERIES.urbanPct, YEARS.map(String), { title: 'Urban share of population, percent', unit: '%' }) +
    '<p class="chart-note">World Bank WDI urban definition: 35.6% (2020) → 38.8% (2025). The GSO urban share for 2024 is 40.2% under its own definition — the two series must not be read as one.</p></div>' +
    '<div class="panel"><h3>Age structure (2023)</h3>' + shareBars(POPULATION.ageGroups.map(function (a) { return { name: a.group, share: a.share }; })) +
    '<p class="chart-note">Shares of total population, 2023. Working-age people (15–64) are about 69% of the country; children 23%, people 65 and over 8%.</p>' +
    '<p class="chart-note">Labour force: <b>52.4 million</b> (2023); participation rate <b>68.2%</b> (June 2025).</p></div></section>' +
    srcLine(META.sources.wdi + '; ' + META.sources.undp + '; ' + META.sources.gso2024 + '.');
}

function renderPricesLabour() {
  page.innerHTML =
    '<p class="kicker">Prices &amp; Labour</p><h1>Prices up 3.63%, jobs steady</h1>' +
    '<p class="lede">Consumer prices rose 3.63% on average in 2024 — inside the government’s target range — while unemployment stayed low at 2.24% on the GSO definition. Average monthly earnings were about $383 in March 2025.</p>' +
    '<section class="kpis">' +
    '<article class="kpi hot"><div class="label">CPI inflation 2024</div><div class="value">3.63 <small>%</small></div><div class="delta">Q4: +2.87% · Dec: +2.94% y/y</div><div class="meta">GSO 2024, annual average</div></article>' +
    '<article class="kpi"><div class="label">Unemployment 2024</div><div class="value">2.24 <small>%</small></div><div class="delta">GSO definition, ages 15+</div><div class="meta">GSO 2024</div></article>' +
    '<article class="kpi"><div class="label">Avg monthly earnings</div><div class="value">$383</div><div class="delta">March 2025</div><div class="meta">CEIC</div></article>' +
    '</section>' +
    chartPanel('Inflation (CPI), 2020–2025 (% per year)',
      barChart(SERIES.inflationPct, YEARS.map(String), { title: 'CPI inflation, percent per year', unit: '%', highlightLast: true }),
      'World Bank WDI. Inflation stayed between 1.8% and 3.6% across 2020–2025; the GSO annual average for 2024 is 3.63%.', '') +
    '<div class="callout"><b>Read the unemployment number carefully.</b> ' + esc(PRICES_LABOUR.unemploymentNote) + '</div>' +
    '<section class="two-col">' +
    '<div class="panel"><h3>Labour market</h3><div class="fact-grid">' +
    '<div><div class="f-lab">Labour force</div><div class="f-val">52.4m</div><div class="f-sub">2023</div></div>' +
    '<div><div class="f-lab">Participation rate</div><div class="f-val">68.2%</div><div class="f-sub">June 2025</div></div>' +
    '<div><div class="f-lab">Labour productivity</div><div class="f-val">$9,182</div><div class="f-sub">per worker, 2024 (GSO)</div></div>' +
    '<div><div class="f-lab">Avg monthly earnings</div><div class="f-val">$383</div><div class="f-sub">March 2025 (CEIC)</div></div>' +
    '</div></div>' +
    '<div class="panel"><h3>What moved prices in 2024</h3><ul class="rank-list">' +
    '<li><span>Annual average CPI</span><span class="val">+3.63%</span></li>' +
    '<li><span>Fourth quarter, year on year</span><span class="val">+2.87%</span></li>' +
    '<li><span>December, year on year</span><span class="val">+2.94%</span></li>' +
    '<li><span>Government target range</span><span class="val">met</span></li>' +
    '</ul><p class="chart-note">GSO 2024 release. The year ended with inflation easing: December’s 2.94% was below the annual average.</p></div></section>' +
    srcLine(META.sources.gso2024 + '; ' + META.sources.wdi + '; CEIC, March 2025.');
}

function renderTrade() {
  const surplus = TRADE_SERIES.years.map(function (y, i) { return TRADE_SERIES.exportsBn[i] - TRADE_SERIES.importsBn[i]; });
  page.innerHTML =
    '<p class="kicker">Trade</p><h1>$786.29bn of trade — a $24.77bn surplus</h1>' +
    '<p class="lede">Viet Nam traded $786.29 billion of goods in 2024, up 15.4% on 2023. Exports reached $405.53 billion (+14.3%) and imports $380.76 billion (+16.7%), leaving a surplus of $24.77 billion. Foreign-invested firms shipped 71.7% of exports.</p>' +
    '<section class="kpis">' +
    '<article class="kpi hot"><div class="label">Exports 2024</div><div class="value">$405.53 <small>bn</small></div><div class="delta">+14.3% on 2023</div><div class="meta">GSO 2024 · FDI firms 71.7%</div></article>' +
    '<article class="kpi"><div class="label">Imports 2024</div><div class="value">$380.76 <small>bn</small></div><div class="delta">+16.7% on 2023</div><div class="meta">GSO 2024</div></article>' +
    '<article class="kpi"><div class="label">Trade surplus</div><div class="value">$24.77 <small>bn</small></div><div class="delta">Total trade +15.4%</div><div class="meta">GSO 2024 · $786.29bn total</div></article>' +
    '</section>' +
    chartPanel('Exports vs imports, 2020–2025 (US$ billion)',
      groupedBarChart(TRADE_SERIES.exportsBn, TRADE_SERIES.importsBn, TRADE_SERIES.years.map(String), { title: 'Exports and imports, billion US dollars', unit: '$bn' }),
      'Teal = exports, amber = imports. 2020–2024: World Bank WDI series (2024 values cross-check to the GSO release, $405.53bn exports and $380.76bn imports, within rounding). 2025: GSO 2025 release, January 2026 — exports $475.04bn, imports $455.01bn, surplus $20.03bn. Surplus each year: ' + surplus.map(function (v, i) { return TRADE_SERIES.years[i] + ' $' + fmt(v, 1) + 'bn'; }).join(' · ') + '.', '') +
    '<section class="two-col">' +
    '<div class="panel"><h3>Leading export categories</h3><ul class="rank-list">' +
    TOP_EXPORTS.map(function (t) { return '<li><span class="rank">' + t.rank + '</span><span><b>' + esc(t.item) + '</b><br><small style="color:#5b6b68">' + esc(t.note) + '</small></span></li>'; }).join('') +
    '</ul><p class="chart-note">Ranked by export value, GSO 2024. Categories only — this site does not invent dollar values for individual items.</p></div>' +
    '<div class="panel"><h3>Main trading partners</h3><ul class="rank-list">' +
    TRADE_PARTNERS.map(function (p) { return '<li><span><b>' + esc(p.partner) + '</b><br><small style="color:#5b6b68">' + esc(p.role) + '</small></span></li>'; }).join('') +
    '</ul><p class="chart-note">Domestic firms exported $114.59bn (28.3% of exports); foreign-invested firms $290.94bn (71.7%) — GSO 2024.</p></div></section>' +
    srcLine(META.sources.gso2024 + '; ' + META.sources.wdi + '.');
}

function regionRows() {
  const q = state.regionQuery.trim().toLowerCase();
  let rows = REGIONS.filter(function (r) {
    return !q || r.region.toLowerCase().indexOf(q) !== -1 || r.hub.toLowerCase().indexOf(q) !== -1;
  });
  const k = state.regionSort.key, d = state.regionSort.dir;
  rows = rows.slice().sort(function (a, b) {
    const av = a[k], bv = b[k];
    if (typeof av === 'string') return av.localeCompare(bv) * d;
    return (av - bv) * d;
  });
  return rows;
}

function renderRegions() {
  const rows = regionRows();
  const totalPop = REGIONS.reduce(function (s, r) { return s + r.population; }, 0);
  page.innerHTML =
    '<p class="kicker">Regions</p><h1>Six regions, one country</h1>' +
    '<p class="lede">Viet Nam groups its provinces into six socio-economic regions. The Red River Delta is the smallest and densest; the Southeast, anchored by Ho Chi Minh City, is the economic engine. Click a column heading to sort; type to filter.</p>' +
    '<div class="controls"><label for="regionSearch">Search regions</label>' +
    '<input type="search" id="regionSearch" placeholder="e.g. Delta or Ha Noi" value="' + esc(state.regionQuery) + '">' +
    '<span class="source-note" style="margin:0">Showing ' + rows.length + ' of ' + REGIONS.length + ' regions.</span></div>' +
    '<div class="table-wrap"><table id="regionTable"><caption>Regions by population</caption>' +
    '<thead><tr>' +
    '<th><button class="sort" type="button" data-key="region">Region</button></th>' +
    '<th class="num"><button class="sort" type="button" data-key="provinces">Provinces</button></th>' +
    '<th class="num"><button class="sort" type="button" data-key="areaKm2">Area (km²)</button></th>' +
    '<th class="num"><button class="sort" type="button" data-key="population">Population</button></th>' +
    '<th class="num"><button class="sort" type="button" data-key="density">Density /km²</button></th>' +
    '<th>Main hub</th></tr></thead><tbody>' +
    rows.map(function (r) {
      return '<tr><td><b>' + esc(r.region) + '</b><br><small style="color:#5b6b68">' + esc(r.note) + '</small></td>' +
        '<td class="num">' + r.provinces + '</td><td class="num">' + fmt(r.areaKm2, 0) + '</td>' +
        '<td class="num">' + fmt(r.population, 0) + '</td><td class="num">' + fmt(r.density, 0) + '</td>' +
        '<td>' + esc(r.hub) + '</td></tr>';
    }).join('') + '</tbody>' +
    '<tfoot><tr><td>Six regions, total</td><td class="num">34</td><td class="num">322,458</td><td class="num">' + fmt(totalPop, 0) + '</td><td class="num">—</td><td></td></tr></tfoot></table></div>' +
    '<div class="callout"><b>Why the total is not 100.99 million.</b> The regional populations are the figures as published in the Wikipedia list of regions (accessed November 2026), after the 2025 provincial mergers; their sum (' + fmt(totalPop, 0) + ') sits below the national total because the two counts come from different vintages and boundary sets. The national figure on the Overview page is the GSO/World Bank 2024 count. This site shows the gap rather than hiding it.</div>' +
    '<section class="two-col"><div class="panel"><h3>Largest cities</h3><ul class="rank-list">' +
    CITIES.map(function (c, i) {
      return '<li><span class="rank">' + (i + 1) + '</span><span><b>' + esc(c.city) + '</b> — ' + fmt(c.population, 0) + ' people (2024)<br><small style="color:#5b6b68">' + esc(c.grdpNote) + '</small></span></li>';
    }).join('') + '</ul><p class="chart-note">City populations: Wikidata / ISO 3166-2, 2024. GRDP notes: ' + esc(CITIES[0].source) + '; ' + esc(CITIES[1].source) + '.</p></div>' +
    '<div class="panel"><h3>Reading the regions</h3><p>Two regions hold almost two-fifths of the country: the Red River Delta (22.09m) and the Southeast (18.81m). The Mekong Delta (17.43m) is the rice bowl; the Northern Midland &amp; Mountainous region (12.60m) is the largest by area and the sparsest. Density runs from 1,466 people per km² in the Red River Delta to 136 in the northern mountains.</p>' +
    '<p class="chart-note">What this page does not do: it does not publish GRDP for regions whose figures could not be verified from a named source. Only the two largest cities carry an economic note, each with its source.</p></div></section>' +
    srcLine(META.sources.wikiRegions + '; ' + META.sources.wikidataCities + '.');
  document.getElementById('regionSearch').addEventListener('input', function (e) {
    state.regionQuery = e.target.value;
    renderRegions();
    const s = document.getElementById('regionSearch');
    s.focus();
    s.setSelectionRange(s.value.length, s.value.length);
  });
  page.querySelectorAll('#regionTable th button.sort').forEach(function (btn) {
    const key = btn.dataset.key;
    if (state.regionSort.key === key) btn.classList.add(state.regionSort.dir === 1 ? 'asc' : 'desc');
    btn.addEventListener('click', function () {
      if (state.regionSort.key === key) state.regionSort.dir *= -1;
      else state.regionSort = { key: key, dir: key === 'region' ? 1 : -1 };
      renderRegions();
    });
  });
}

function renderTables() {
  const rows = indicatorRows();
  const vndNote = state.unit === 'vnd'
    ? 'Showing đồng: US$ converted at ₫24,200 per $1 (2024 average, as used on this page).'
    : 'Showing US dollars at current prices.';
  page.innerHTML =
    '<p class="kicker">Data tables</p><h1>Every number, in one table</h1>' +
    '<p class="lede">The full indicator set behind this site, 2020–2025, in one place. Switch units and the money columns convert for real; download the table as a CSV file made on your own device — nothing leaves the browser.</p>' +
    '<div class="controls"><span class="seg" role="group" aria-label="Currency unit">' +
    '<button type="button" data-unit="usd" aria-pressed="' + (state.unit === 'usd') + '">$ (US dollars)</button>' +
    '<button type="button" data-unit="vnd" aria-pressed="' + (state.unit === 'vnd') + '">₫ (Vietnamese đồng)</button></span>' +
    '<button class="btn" type="button" id="csvBtn">Download CSV</button>' +
    '<button class="btn amber" type="button" id="printBtn">Print</button></div>' +
    '<p class="source-note">' + esc(vndNote) + '</p>' +
    '<div class="table-wrap"><table><caption>Viet Nam — key indicators, 2020–2025 (World Bank WDI)</caption>' +
    '<thead><tr><th>Year</th><th class="num">GDP</th><th class="num">Growth (%)</th><th class="num">GDP per capita</th><th class="num">Population (m)</th><th class="num">Inflation (%)</th><th class="num">Urban (%)</th><th class="num">FDI net ($bn)</th></tr></thead><tbody>' +
    rows.map(function (r) {
      return '<tr><td>' + r.year + '</td><td class="num">' + moneyCell(r.gdp) + '</td><td class="num">' + fmt(r.growth, 1) + '</td><td class="num">' + (state.unit === 'vnd' ? '₫' + fmt(r.gdpPc * META.vndPerUsd2024, 0) : '$' + fmt(r.gdpPc, 0)) + '</td><td class="num">' + fmt(r.pop, 2) + '</td><td class="num">' + fmt(r.infl, 1) + '</td><td class="num">' + fmt(r.urban, 1) + '</td><td class="num">' + fmt(r.fdi, 2) + '</td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<div class="table-wrap"><table><caption>Trade, 2024 (GSO release)</caption>' +
    '<thead><tr><th>Flow</th><th class="num">Value</th><th class="num">Change on 2023</th></tr></thead><tbody>' +
    '<tr><td>Exports</td><td class="num">' + moneyCell(TRADE_2024.exportsUsdBn) + '</td><td class="num">+14.3%</td></tr>' +
    '<tr><td>Imports</td><td class="num">' + moneyCell(TRADE_2024.importsUsdBn) + '</td><td class="num">+16.7%</td></tr>' +
    '<tr><td>Total trade</td><td class="num">' + moneyCell(TRADE_2024.totalUsdBn) + '</td><td class="num">+15.4%</td></tr>' +
    '<tr><td>Trade surplus</td><td class="num">' + moneyCell(TRADE_2024.surplusUsdBn) + '</td><td class="num">—</td></tr>' +
    '</tbody></table></div>' +
    srcLine(META.sources.wdi + '; ' + META.sources.gso2024 + '. CSV contains the same figures in US dollars.');
  page.querySelectorAll('[data-unit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.unit = btn.dataset.unit;
      renderTables();
    });
  });
  document.getElementById('csvBtn').addEventListener('click', downloadCsv);
  document.getElementById('printBtn').addEventListener('click', function () { window.print(); });
}

function downloadCsv() {
  const head = 'Year,GDP (US$bn),Real GDP growth (%),GDP per capita (US$),Population (m),CPI inflation (%),Urban share (%),FDI net inflow (US$bn)\n';
  const body = indicatorRows().map(function (r) {
    return [r.year, r.gdp, r.growth, r.gdpPc, r.pop, r.infl, r.urban, r.fdi].join(',');
  }).join('\n');
  const blob = new Blob([head + body + '\n'], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vietnam-key-indicators-2020-2025.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function renderSources() {
  page.innerHTML =
    '<p class="kicker">Sources &amp; methods</p><h1>Where every number comes from</h1>' +
    '<p class="lede">This site has one rule: a figure appears only with its source and year. Where two sources disagree, the site names both and uses one — it never blends them into a single series.</p>' +
    '<section class="panel"><h2>Sources</h2><ul class="rank-list">' +
    '<li><span><b>General Statistics Office of Viet Nam (GSO)</b> — 2024 release, 17 January 2025: GDP, growth, GDP per capita, CPI, trade, labour productivity, unemployment, urban share.</span></li>' +
    '<li><span><b>World Bank, World Development Indicators (WDI)</b> — series 2020–2025: GDP, growth, GDP per capita, population, inflation, urban share, FDI net inflow.</span></li>' +
    '<li><span><b>World Bank Data360</b> — population 2024: 100.99 million.</span></li>' +
    '<li><span><b>UNDP Human Development Report 2023–24</b> — HDI 0.766 (2023); life expectancy 74.6 years.</span></li>' +
    '<li><span><b>CEIC</b> — average monthly earnings $383, March 2025.</span></li>' +
    '<li><span><b>Wikipedia, “List of regions of Vietnam”</b> — six regions’ population and area, as published (accessed November 2026).</span></li>' +
    '<li><span><b>Wikidata / ISO 3166-2</b> — city populations 2024 (Ho Chi Minh City 14,002,598; Ha Noi 8,717,600).</span></li>' +
    '<li><span><b>City statistics offices via VNA / VGP</b> — Ho Chi Minh City GRDP 2024 (over ₫1,700 trillion, +7.17%); Ha Noi GRDP growth about 6.5% in 2024.</span></li>' +
    '</ul></section>' +
    '<section class="panel"><h2>Vintage notes — read before comparing</h2>' +
    '<div class="callout"><b>2025: two vintages, one choice.</b> The GSO 2025 vintage puts GDP at about $' + VINTAGE_2025.gso.gdpUsdBn + 'bn with ' + VINTAGE_2025.gso.growth.toFixed(2) + '% growth; the IMF/Wikipedia vintage puts it at $' + VINTAGE_2025.imf.gdpUsdBn + 'bn with ' + VINTAGE_2025.imf.growth.toFixed(1) + '% growth. They are different vintages, not a mistake. The charts on this site use the World Bank WDI series throughout (2025: $514.7bn), and the 2025 cross-check is noted here, not mixed into any 2024 table. The same GSO 2025 release (January 2026) puts 2025 trade at $930.05bn total — exports $475.04bn, imports $455.01bn, surplus $20.03bn — and the Trade chart uses those figures for 2025, not the WDI values.</div>' +
    '<div class="callout"><b>Unemployment: one definition.</b> This site uses the GSO figure, 2.24% for 2024. ILO-style series run lower, around 1.5%. The two are not interchangeable; this site never averages them.</div>' +
    '<div class="callout"><b>Urban share: two definitions.</b> GSO 2024: 40.2%. WDI series 2024: 38.5%. Each is correct under its own definition; the Population page labels which is which.</div>' +
    '<div class="callout"><b>Regional totals.</b> The six regions’ populations come from a different vintage and boundary set (after the 2025 provincial mergers) than the national total, so they do not sum to 100.99 million. The Regions page shows the gap openly.</div></section>' +
    '<section class="panel"><h2>Methods</h2><ul class="rank-list">' +
    '<li><span><b>Currency</b> — US dollars at current prices unless stated. Đồng conversions on the Data tables page use ₫24,200 per $1 (2024 average).</span></li>' +
    '<li><span><b>Rounding</b> — figures are shown as published; totals may differ by 0.1 from the sum of rounded parts.</span></li>' +
    '<li><span><b>What is not here</b> — regional GRDP is published only where a named source verifies it. A row that could not be verified was left out rather than estimated.</span></li>' +
    '<li><span><b>Offline</b> — every figure, chart and style on this site lives in its own files. Nothing is fetched from another origin, and the site works with no network at all.</span></li>' +
    '</ul></section>' +
    '<p class="source-note">VietStats Atlas is an original, independent atlas. It credits its sources; it is not affiliated with any of them. Updated ' + esc(META.updated) + '.</p>';
}

// ---- router ---------------------------------------------------------------
function bindChartSeg() {
  page.querySelectorAll('[data-chart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.chartType = btn.dataset.chart;
      route();
    });
  });
}

const ROUTES = {
  '': renderOverview,
  'economy': renderEconomy,
  'population': renderPopulation,
  'prices-labour': renderPricesLabour,
  'trade': renderTrade,
  'regions': renderRegions,
  'tables': renderTables,
  'sources': renderSources,
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  const fn = ROUTES[hash] || renderOverview;
  setActiveNav(ROUTES[hash] ? hash : '');
  fn();
  window.scrollTo(0, 0);
}

renderTicker();
window.addEventListener('hashchange', route);
route();
