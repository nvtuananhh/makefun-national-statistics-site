// VietStats Atlas — data layer.
// Every figure below is a published figure with its source and year.
// Two vintages are kept strictly apart and never mixed in one series:
//   VINTAGE_GSO_2024 — General Statistics Office of Viet Nam, 2024 release (17 Jan 2025)
//   VINTAGE_WDI      — World Bank, World Development Indicators series 2020-2025
// A third vintage (GSO 2025, about $514bn / 8.02%) is cited only on the
// Sources page as a cross-check, never inside a 2024 table or chart.

// 2025 cross-check — two published vintages that disagree. Kept here so
// the Sources page can name both; never used inside a 2024 table or chart.
export const VINTAGE_2025 = {
  gso: { gdpUsdBn: 514, growth: 8.02, tradeUsdBn: 930, populationM: 102, note: 'GSO via USDA FAS Exporter Guide, July 2026' },
  imf: { gdpUsdBn: 484.73, growth: 6.5, note: 'IMF / Wikipedia vintage, 2025 forecast basis' },
};

export const META = {
  country: 'Viet Nam',
  anchorYear: 2024,
  updated: '26 November 2026',
  vndPerUsd2024: 24200,
  sources: {
    gso2024: 'General Statistics Office of Viet Nam (GSO), 2024 release, 17 Jan 2025',
    wdi: 'World Bank, World Development Indicators (WDI), series 2020–2025',
    gsoYearbook: 'GSO Statistical Yearbook',
    undp: 'UNDP Human Development Report 2023–24',
    wikiRegions: 'Wikipedia, “List of regions of Vietnam” (figures as published, accessed Nov 2026)',
    wikidataCities: 'Wikidata / ISO 3166-2 population values, 2024',
  },
};

// Headline indicators, GSO 2024 vintage.
export const KPI = [
  { key: 'pop', label: 'Population', value: 100.99, unit: 'million', decimals: 2, delta: '+0.6% on 2023', meta: 'World Bank Data360, 2024', hot: false },
  { key: 'gdp', label: 'GDP', value: 476.3, unit: '$bn', decimals: 1, delta: '+7.09% real growth', meta: 'GSO 2024 · ₫11.51 quadrillion', hot: true },
  { key: 'growth', label: 'Real GDP growth', value: 7.09, unit: '%', decimals: 2, delta: 'vs 5.05% in 2023', meta: 'GSO 2024', hot: false },
  { key: 'gdppc', label: 'GDP per capita', value: 4700, unit: '$', decimals: 0, delta: '+$377 on 2023', meta: 'GSO 2024 · ₫114 million', hot: false },
  { key: 'cpi', label: 'CPI inflation', value: 3.63, unit: '%', decimals: 2, delta: 'Dec 2024: +2.94% y/y', meta: 'GSO 2024, annual average', hot: true },
  { key: 'unemp', label: 'Unemployment', value: 2.24, unit: '%', decimals: 2, delta: 'GSO definition', meta: 'GSO 2024 · ages 15+', hot: false },
];

// World Bank WDI series, 2020–2025. One vintage per chart.
export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
export const SERIES = {
  gdpUsdBn: [346.6, 366.5, 413.4, 433.8, 476.3, 514.7],
  growthPct: [2.9, 2.6, 8.5, 5.0, 7.0, 8.0],
  gdpPerCapitaUsd: [3534, 3704, 4148, 4323, 4717, 5066],
  populationM: [98.08, 98.94, 99.68, 100.4, 101.0, 101.6],
  inflationPct: [3.2, 1.8, 3.2, 3.3, 3.6, 3.3],
  urbanPct: [35.6, 36.7, 37.5, 38.1, 38.5, 38.8],
  fdiNetBn: [15.8, 15.66, 17.9, 18.5, 20.17, 21.99],
};

// GSO 2024 detail figures.
export const ECONOMY_2024 = {
  gdpVndQ: 11.51,
  gdpUsdBn: 476.3,
  growth: 7.09,
  growth2023: 5.05,
  gdpPerCapitaUsd: 4700,
  gdpPerCapitaVndM: 114,
  gdpPerCapitaPpp: 16390,
  labourProductivityUsd: 9182,
  labourProductivityVndM: 221.9,
  productivityGainUsd: 726,
  // Sector shares are 2023 estimates, labelled as such everywhere they appear.
  sectors2023: [
    { name: 'Agriculture, forestry & fishing', share: 11.0 },
    { name: 'Industry & construction', share: 38.0 },
    { name: 'Services', share: 42.5 },
    { name: 'Product taxes less subsidies', share: 8.5 },
  ],
};

export const PRICES_LABOUR = {
  cpiAnnual: 3.63,
  cpiQ4: 2.87,
  cpiDec: 2.94,
  unemploymentGso: 2.24,
  unemploymentNote: 'GSO definition: unemployed share of the labour force, ages 15+. ILO-style series run lower (about 1.5%); this site uses the GSO figure only.',
  avgMonthlyEarningsUsd: 383,
  avgMonthlyEarningsNote: 'March 2025, CEIC',
  labourForceM: 52.4,
  labourForceNote: '2023',
  participationPct: 68.2,
  participationNote: 'June 2025',
};

export const TRADE_2024 = {
  totalUsdBn: 786.29,
  totalGrowth: 15.4,
  exportsUsdBn: 405.53,
  exportsGrowth: 14.3,
  importsUsdBn: 380.76,
  importsGrowth: 16.7,
  surplusUsdBn: 24.77,
  domesticExportsBn: 114.59,
  domesticShare: 28.3,
  fdiExportsBn: 290.94,
  fdiShare: 71.7,
};

// Trade series 2020–2025. Years 2020–2024 are the World Bank WDI vintage
// (2024 cross-checks to the GSO release $405.53/$380.76bn above within
// rounding); 2025 is the GSO 2025 release (Jan 2026): exports $475.04bn,
// imports $455.01bn, total $930.05bn, surplus $20.03bn. One vintage per
// year — the series never mixes WDI and GSO values in the same year.
export const TRADE_SERIES = {
  years: YEARS,
  exportsBn: [282.7, 336.1, 371.9, 354.7, 405.5, 475.04],
  importsBn: [262.7, 332.2, 358.9, 326.4, 380.8, 455.01],
};

// Leading export categories, ranked by export value, GSO 2024.
// Categories only — no dollar values invented for individual items.
export const TOP_EXPORTS = [
  { rank: 1, item: 'Phones & components', note: 'Largest export item by value' },
  { rank: 2, item: 'Computers, electronics & parts', note: 'Includes integrated circuits' },
  { rank: 3, item: 'Machinery, equipment & parts', note: 'Industrial machinery' },
  { rank: 4, item: 'Textiles & garments', note: 'Apparel and fabrics' },
  { rank: 5, item: 'Footwear', note: 'Shoes and parts' },
  { rank: 6, item: 'Wood & wooden products', note: 'Furniture included' },
  { rank: 7, item: 'Seafood', note: 'Shrimp and fish' },
  { rank: 8, item: 'Rice & coffee', note: 'Leading farm exports' },
];

export const TRADE_PARTNERS = [
  { partner: 'United States', role: 'Largest export market' },
  { partner: 'China', role: 'Largest import source; major export market' },
  { partner: 'South Korea', role: 'Major investor and trading partner' },
  { partner: 'Japan', role: 'Major investor and trading partner' },
  { partner: 'European Union', role: 'Major export market (EVFTA)' },
  { partner: 'ASEAN', role: 'Regional trade bloc' },
];

// Six socio-economic regions. Population and area as published in the
// Wikipedia list of regions (accessed Nov 2026); boundaries reflect the
// 2025 provincial mergers, so the regional total does not sum exactly to
// the national total — the page says so.
export const REGIONS = [
  { region: 'Red River Delta', provinces: 6, areaKm2: 15071, population: 22091250, density: 1466, hub: 'Ha Noi', note: 'Smallest area, densest region' },
  { region: 'Southeast', provinces: 3, areaKm2: 23551, population: 18810780, density: 799, hub: 'Ho Chi Minh City', note: 'Largest economic engine' },
  { region: 'Mekong Delta', provinces: 5, areaKm2: 40923, population: 17432120, density: 426, hub: 'Can Tho', note: 'Rice bowl and aquaculture' },
  { region: 'South Central Coast & Central Highlands', provinces: 6, areaKm2: 99153, population: 15872000, density: 160, hub: 'Da Nang', note: 'Coast plus highlands' },
  { region: 'Northern Midland & Mountainous', provinces: 9, areaKm2: 92517, population: 12601800, density: 136, hub: 'Thai Nguyen', note: 'Border highlands' },
  { region: 'North Central Coast', provinces: 5, areaKm2: 51243, population: 11190830, density: 218, hub: 'Thanh Hoa', note: 'Narrow central coast' },
];

// Largest cities, 2024 population values (Wikidata / ISO 3166-2).
// HCMC GRDP verified separately (see city note); Ha Noi GRDP is given as
// the 2023 scale (~$55bn) with 2024 growth, not as a 2024 total.
export const CITIES = [
  { city: 'Ho Chi Minh City', population: 14002598, grdpNote: 'GRDP over ₫1,700 trillion (~$67bn), +7.17% in 2024', source: 'City statistics office via VNA, Dec 2024' },
  { city: 'Ha Noi', population: 8717600, grdpNote: 'Economy about $55bn in 2023; GRDP growth about 6.5% in 2024', source: 'Ha Noi People’s Committee / VGP' },
];

export const POPULATION = {
  total2024M: 100.99,
  urbanPct2024: 40.2,
  urbanPctWdi2024: 38.5,
  urbanNote: '40.2% is the GSO 2024 urban share; the WDI series (38.5% in 2024) uses a different urban definition — never compare the two as one series.',
  lifeExpectancy: 74.6,
  lifeExpectancyYear: 2023,
  hdi: 0.766,
  hdiYear: 2023,
  medianAge: 32.5,
  medianAgeYear: 2023,
  ageGroups: [
    { group: '0–14 years', share: 23.0 },
    { group: '15–64 years', share: 69.0 },
    { group: '65+ years', share: 8.0 },
  ],
};

export const GLANCE = [
  { num: '15th', lab: 'most populous country in the world' },
  { num: '$16,390', lab: 'GDP per capita, PPP (2024)' },
  { num: '$930bn', lab: 'total trade, 2025 (GSO vintage)' },
  { num: '0.766', lab: 'Human Development Index (2023, UNDP)' },
];

// Full indicator table for the Data tables page (WDI vintage).
export function indicatorRows() {
  return YEARS.map((y, i) => ({
    year: y,
    gdp: SERIES.gdpUsdBn[i],
    growth: SERIES.growthPct[i],
    gdpPc: SERIES.gdpPerCapitaUsd[i],
    pop: SERIES.populationM[i],
    infl: SERIES.inflationPct[i],
    urban: SERIES.urbanPct[i],
    fdi: SERIES.fdiNetBn[i],
  }));
}
