import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAssumptionsHtml } from '../../src/data/assumptions.js';
import type { ConfigResult, SimOutput } from './simulate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');
const SIM_ROOT = join(__dirname, '..');

function fmt(n: number, digits = 4): string {
  return n.toFixed(digits);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateHtml(output: SimOutput): string {
  const dataJson = JSON.stringify(output).replace(/</g, '\\u003c');

  const byBanker = [...output.results].sort(
    (a, b) =>
      b.bankerUnitsPerRoundPerPlayer.mean -
      a.bankerUnitsPerRoundPerPlayer.mean
  );
  const byPlayer = [...output.results].sort(
    (a, b) => a.bankerUnitsPerRoundPerPlayer.mean - b.bankerUnitsPerRoundPerPlayer.mean
  );

  const bestBanker = byBanker.slice(0, 5);
  const bestPlayer = byPlayer.slice(0, 5);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Banluck Simulation Results</title>
  <style>
    :root {
      --bg: #0f1419;
      --surface: #1a2332;
      --border: #2d3a4f;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --accent: #3d8bfd;
      --banker: #f59e0b;
      --player: #34d399;
    }
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 1.5rem;
      line-height: 1.5;
    }
    h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
    h2 { font-size: 1.2rem; margin: 2rem 0 0.75rem; color: var(--accent); }
    .meta { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--surface);
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .filters label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
    select {
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--border);
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .summary-grid { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
    }
    .card h3 { margin: 0 0 0.75rem; font-size: 1rem; }
    .card.banker h3 { color: var(--banker); }
    .card.player h3 { color: var(--player); }
    .card ol { margin: 0; padding-left: 1.25rem; font-size: 0.85rem; }
    .card li { margin-bottom: 0.35rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }
    th, td {
      padding: 0.5rem 0.6rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: var(--surface);
      color: var(--muted);
      font-weight: 600;
      position: sticky;
      top: 0;
    }
    tr:hover td { background: rgba(61, 139, 253, 0.08); }
    .num { font-variant-numeric: tabular-nums; }
    .positive { color: var(--banker); }
    .negative { color: var(--player); }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 8px;
      max-height: 70vh;
    }
    details {
      margin-top: 2rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
    }
    details summary { cursor: pointer; font-weight: 600; }
    details.assumptions .assumptions-body {
      margin-top: 0.75rem;
      color: var(--muted);
      font-size: 0.9rem;
    }
    details.assumptions h3 {
      margin: 1rem 0 0.35rem;
      font-size: 0.95rem;
      color: var(--text);
    }
    details.assumptions h3:first-child { margin-top: 0; }
    details.assumptions ul {
      margin: 0 0 0.5rem;
      padding-left: 1.25rem;
    }
    details.assumptions li { margin-bottom: 0.35rem; }
    #count { color: var(--muted); font-size: 0.9rem; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1>Banluck Simulation Results</h1>
  <p class="meta">
    Generated ${escapeHtml(output.meta.generatedAt)} ·
    ${output.meta.trials} trials per config ·
    seed ${output.meta.seed} ·
    ${output.results.length} configurations
  </p>

  <div class="summary-grid">
    <div class="card banker">
      <h3>Top 5 for banker (highest edge)</h3>
      <ol>
        ${bestBanker
          .map(
            (r) =>
              `<li><strong>${escapeHtml(r.label)}</strong> — ${fmt(r.bankerUnitsPerRoundPerPlayer.mean)} units/round/player</li>`
          )
          .join('')}
      </ol>
    </div>
    <div class="card player">
      <h3>Top 5 for players (lowest banker edge)</h3>
      <ol>
        ${bestPlayer
          .map(
            (r) =>
              `<li><strong>${escapeHtml(r.label)}</strong> — ${fmt(r.bankerUnitsPerRoundPerPlayer.mean)} units/round/player</li>`
          )
          .join('')}
      </ol>
    </div>
  </div>

  <h2>Filters</h2>
  <div class="filters">
    <label>15 run
      <select id="f-fifteen"><option value="">All</option><option value="both">both</option><option value="banker_only">banker_only</option><option value="none">none</option></select>
    </label>
    <label>Minimum
      <select id="f-minimum"><option value="">All</option><option value="14">14</option><option value="15">15</option><option value="16">16</option></select>
    </label>
    <label>Players
      <select id="f-players"><option value="">All</option><option value="3">3</option><option value="5">5</option><option value="7">7</option><option value="10">10</option></select>
    </label>
  </div>

  <p id="count"></p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Config</th>
          <th>Banker edge</th>
          <th>95% CI</th>
          <th>Player win %</th>
          <th>Banker win %</th>
          <th>Push %</th>
          <th>15-push rounds</th>
          <th>BJ</th>
          <th>Aces</th>
          <th>777</th>
          <th>5-card</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>

  <details class="assumptions">
    <summary>Simulation assumptions</summary>
    <div class="assumptions-body">
      ${renderAssumptionsHtml(escapeHtml)}
    </div>
  </details>

  <script>
    const DATA = ${dataJson};

    function bankerWinPct(r) {
      if (r.bankerWinRate) return r.bankerWinRate.mean;
      return 1 - r.playerWinRate.mean - r.pushRate;
    }

    function rowHtml(r) {
      const edge = r.bankerUnitsPerRoundPerPlayer.mean;
      const edgeClass = edge > 0.01 ? 'positive' : edge < -0.01 ? 'negative' : '';
      const ci = r.bankerUnitsPerRoundPerPlayer.ci95;
      return '<tr>' +
        '<td>' + r.label + '</td>' +
        '<td class="num ' + edgeClass + '">' + edge.toFixed(4) + '</td>' +
        '<td class="num">[' + ci[0].toFixed(4) + ', ' + ci[1].toFixed(4) + ']</td>' +
        '<td class="num">' + (r.playerWinRate.mean * 100).toFixed(2) + '%</td>' +
        '<td class="num positive">' + (bankerWinPct(r) * 100).toFixed(2) + '%</td>' +
        '<td class="num">' + (r.pushRate * 100).toFixed(2) + '%</td>' +
        '<td class="num">' + (r.pushedRoundRate * 100).toFixed(2) + '%</td>' +
        '<td class="num">' + (r.specialRates.blackjack * 100).toFixed(3) + '%</td>' +
        '<td class="num">' + (r.specialRates.pocketAces * 100).toFixed(3) + '%</td>' +
        '<td class="num">' + (r.specialRates.triple7 * 100).toFixed(3) + '%</td>' +
        '<td class="num">' + (r.specialRates.fiveCard * 100).toFixed(3) + '%</td>' +
        '</tr>';
    }

    function filterResults() {
      const fr = document.getElementById('f-fifteen').value;
      const mn = document.getElementById('f-minimum').value;
      const pl = document.getElementById('f-players').value;
      return DATA.results.filter(r => {
        const c = r.config;
        if (fr && c.fifteenRun !== fr) return false;
        if (mn && String(c.minimum) !== mn) return false;
        if (pl && String(c.players) !== pl) return false;
        return true;
      });
    }

    function render() {
      const rows = filterResults();
      document.getElementById('count').textContent = rows.length + ' of ' + DATA.results.length + ' configurations';
      document.getElementById('tbody').innerHTML = rows.map(rowHtml).join('');
    }

    ['f-fifteen','f-minimum','f-players'].forEach(id => {
      document.getElementById(id).addEventListener('change', render);
    });
    render();
  </script>
</body>
</html>`;
}

function main(): void {
  const jsonPath = join(PROJECT_ROOT, 'src/data/results.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const output = JSON.parse(raw) as SimOutput;
  const htmlPath = join(SIM_ROOT, 'results.html');
  writeFileSync(htmlPath, generateHtml(output));
  console.log(`Wrote ${htmlPath}`);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) main();
