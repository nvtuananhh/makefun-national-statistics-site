// VietStats Atlas — chart drawing.
// Hand-written inline SVG only: no library, no canvas, no network.
// Every chart is a pure function of (values, labels, options) returning
// an SVG string, so the same code draws bars and lines.

const TEAL = '#0b4f4a';
const TEAL_LIGHT = '#2e7d74';
const AMBER = '#e8a317';
const GRID = '#e3ddd0';
const INK = '#1d2a28';
const MUTED = '#5b6b68';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(values) {
  const m = Math.max.apply(null, values);
  if (m <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(m)));
  const n = m / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function axisLabels(max, ticks) {
  const out = [];
  for (let i = 0; i <= ticks; i++) out.push((max * i) / ticks);
  return out;
}

// Draw a bar chart. options: {title, unit, color, highlightLast, compact}
export function barChart(values, labels, options) {
  const o = options || {};
  const w = 760, h = o.compact ? 185 : 300, padL = 58, padR = 14, padT = 14, padB = 34;
  const max = niceMax(values);
  const iw = w - padL - padR, ih = h - padT - padB;
  const slot = iw / values.length;
  const bw = Math.min(52, slot * 0.62);
  let s = '';
  s += '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Bar chart') + '">';
  s += '<title>' + esc(o.title || 'Bar chart') + '</title>';
  axisLabels(max, 4).forEach(function (v) {
    const y = padT + ih - (v / max) * ih;
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + MUTED + '">' + fmtAxis(v, o.unit) + '</text>';
  });
  values.forEach(function (v, i) {
    const bh = (v / max) * ih;
    const x = padL + i * slot + (slot - bw) / 2;
    const y = padT + ih - bh;
    const last = o.highlightLast && i === values.length - 1;
    s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + (last ? AMBER : TEAL) + '"/>';
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + INK + '">' + fmtValue(v, o.unit) + '</text>';
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (h - 12) + '" text-anchor="middle" font-size="12.5" fill="' + MUTED + '">' + esc(labels[i]) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Draw a line chart with dots and value labels.
export function lineChart(values, labels, options) {
  const o = options || {};
  const w = 760, h = o.compact ? 185 : 300, padL = 58, padR = 18, padT = 22, padB = 34;
  const max = niceMax(values);
  const min = Math.min.apply(null, values);
  const floor = min > 0 && min / max > 0.6 ? min * 0.85 : 0;
  const iw = w - padL - padR, ih = h - padT - padB;
  function px(i) { return padL + (i / (values.length - 1)) * iw; }
  function py(v) { return padT + ih - ((v - floor) / (max - floor)) * ih; }
  let s = '';
  s += '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Line chart') + '">';
  s += '<title>' + esc(o.title || 'Line chart') + '</title>';
  axisLabels(max, 4).forEach(function (v) {
    if (v < floor) return;
    const y = py(v);
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + MUTED + '">' + fmtAxis(v, o.unit) + '</text>';
  });
  const pts = values.map(function (v, i) { return px(i).toFixed(1) + ',' + py(v).toFixed(1); }).join(' ');
  s += '<polyline points="' + pts + '" fill="none" stroke="' + TEAL + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  values.forEach(function (v, i) {
    const last = i === values.length - 1;
    s += '<circle cx="' + px(i).toFixed(1) + '" cy="' + py(v).toFixed(1) + '" r="' + (last ? 6 : 4.5) + '" fill="' + (last ? AMBER : TEAL) + '" stroke="#fff" stroke-width="2"/>';
    s += '<text x="' + px(i).toFixed(1) + '" y="' + (py(v) - 11).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + INK + '">' + fmtValue(v, o.unit) + '</text>';
    s += '<text x="' + px(i).toFixed(1) + '" y="' + (h - 12) + '" text-anchor="middle" font-size="12.5" fill="' + MUTED + '">' + esc(labels[i]) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Grouped bars: two series side by side (exports vs imports).
export function groupedBarChart(seriesA, seriesB, labels, options) {
  const o = options || {};
  const w = 760, h = 300, padL = 58, padR = 14, padT = 14, padB = 34;
  const max = niceMax(seriesA.concat(seriesB));
  const iw = w - padL - padR, ih = h - padT - padB;
  const slot = iw / labels.length;
  const bw = Math.min(30, slot * 0.34);
  let s = '';
  s += '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Grouped bar chart') + '">';
  axisLabels(max, 4).forEach(function (v) {
    const y = padT + ih - (v / max) * ih;
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + MUTED + '">' + fmtAxis(v, o.unit) + '</text>';
  });
  labels.forEach(function (lab, i) {
    const cx = padL + i * slot + slot / 2;
    const a = seriesA[i], b = seriesB[i];
    const ha = (a / max) * ih, hb = (b / max) * ih;
    s += '<rect x="' + (cx - bw - 2).toFixed(1) + '" y="' + (padT + ih - ha).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + ha.toFixed(1) + '" rx="3" fill="' + TEAL + '"/>';
    s += '<rect x="' + (cx + 2).toFixed(1) + '" y="' + (padT + ih - hb).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hb.toFixed(1) + '" rx="3" fill="' + AMBER + '"/>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 12) + '" text-anchor="middle" font-size="12.5" fill="' + MUTED + '">' + esc(lab) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Horizontal share bars for sector composition.
export function shareBars(rows) {
  let s = '<div class="share-bars">';
  rows.forEach(function (r) {
    s += '<div class="share-row"><div class="share-lab"><span>' + esc(r.name) + '</span><b>' + r.share.toFixed(1) + '%</b></div>';
    s += '<div class="share-track"><div class="share-fill" style="width:' + r.share.toFixed(1) + '%"></div></div></div>';
  });
  return s + '</div>';
}

function fmtAxis(v, unit) {
  if (unit === '$bn') return '$' + Math.round(v) + 'bn';
  if (unit === '$') return '$' + Math.round(v).toLocaleString('en-US');
  if (unit === '%') return v.toFixed(0) + '%';
  if (unit === 'm') return v.toFixed(0) + 'm';
  return String(Math.round(v));
}

function fmtValue(v, unit) {
  if (unit === '$bn') return v.toFixed(1);
  if (unit === '$') return '$' + Math.round(v).toLocaleString('en-US');
  if (unit === '%') return v.toFixed(1) + '%';
  if (unit === 'm') return v.toFixed(1) + 'm';
  return String(v);
}

// Small CSS hook for share bars, injected once by app.js.
export const SHARE_CSS =
  '.share-row{margin:10px 0}.share-lab{display:flex;justify-content:space-between;font-size:14.5px}' +
  '.share-lab b{color:#073632}.share-track{height:12px;background:#ece7d8;border-radius:6px;margin-top:4px;overflow:hidden}' +
  '.share-fill{height:100%;background:#0b4f4a;border-radius:6px}.share-row:nth-child(2) .share-fill{background:#2e7d74}' +
  '.share-row:nth-child(3) .share-fill{background:#e8a317}.share-row:nth-child(4) .share-fill{background:#9a8f6a}';
