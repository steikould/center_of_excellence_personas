/**
 * Charts.
 *
 * The rule the rest of the map follows applies here too: colour is never the
 * only signal. Every mark carries a shape and a printed value, there is a
 * legend, and the numbers behind the picture are one click away in a table -
 * so the chart works in greyscale, in forced-colours, and for a reader who
 * just wants the figures.
 *
 * Colours come from the application's own tokens rather than a palette of
 * their own: before and after are two states of one thing, so they are one
 * hue in two steps plus a shape difference, not two competing colours.
 */
import { tpl, raw } from "../util.js";
import { duration } from "../format.js";

const ROW = 34;
const LABEL_W = 300;
const PAD_R = 150;
const WIDTH = 960;

/**
 * Before/after on one shared linear axis, one row per item.
 *
 * Linear is deliberate. A log axis would flatter every row equally; linear
 * shows honestly that one slow step can still dominate the others after all
 * of them got faster.
 */
export function dumbbell(items, { caption = "", tableHeading = "Show the numbers" } = {}) {
  if (!items.length) return raw("");
  const max = Math.max(...items.map((d) => d.before));
  const plotW = WIDTH - LABEL_W - PAD_R;
  const x = (v) => LABEL_W + (v / max) * plotW;
  const height = items.length * ROW + 34;

  const ticks = [0, max / 2, max];

  return tpl`
    <figure class="chart">
      <figcaption class="chart-legend">
        <span class="chart-key">
          <svg width="14" height="14" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="4.5" class="mark-before"></circle>
          </svg> Before
        </span>
        <span class="chart-key">
          <svg width="14" height="14" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="5" class="mark-after"></circle>
          </svg> Now
        </span>
      </figcaption>

      <svg class="chart-svg" viewBox="0 0 ${WIDTH} ${height}" role="img"
           aria-label="Cycle time before and after, one row per business step">
        ${ticks.map((t) => tpl`
          <line class="chart-grid" x1="${x(t)}" x2="${x(t)}" y1="20" y2="${items.length * ROW + 22}"></line>
          <text class="chart-tick" x="${x(t)}" y="14" text-anchor="middle">${duration(t)}</text>`)}

        ${items.map((d, i) => {
          const y = i * ROW + ROW / 2 + 22;
          const label = d.label.length > 34 ? `${d.label.slice(0, 33)}…` : d.label;
          return tpl`
            <g class="chart-row">
              <title>${d.label}${d.sub ? ` — ${d.sub}` : ""}: ${duration(d.before)} → ${duration(d.after)}</title>
              <text class="chart-label" x="${LABEL_W - 12}" y="${y}" text-anchor="end" dominant-baseline="middle">${label}</text>
              ${d.sub ? tpl`<text class="chart-sublabel" x="${LABEL_W - 12}" y="${y + 13}" text-anchor="end">${d.sub}</text>` : ""}
              <line class="chart-track" x1="${LABEL_W}" x2="${WIDTH - PAD_R}" y1="${y}" y2="${y}"></line>
              <line class="chart-link" x1="${x(d.after)}" x2="${x(d.before)}" y1="${y}" y2="${y}"></line>
              <circle class="mark-before" cx="${x(d.before)}" cy="${y}" r="4.5"></circle>
              <circle class="mark-after" cx="${x(d.after)}" cy="${y}" r="5"></circle>
              <text class="chart-value" x="${WIDTH - PAD_R + 10}" y="${y}" dominant-baseline="middle">${duration(d.before)} → ${duration(d.after)}</text>
            </g>`;
        })}
      </svg>

      ${caption ? tpl`<p class="chart-caption">${caption}</p>` : ""}

      <details class="chart-data">
        <summary>${tableHeading}</summary>
        <table class="data-table">
          <thead><tr>
            <th>Step</th><th>Performed by</th><th>Before</th><th>Now</th><th>Change</th><th>Unit</th>
          </tr></thead>
          <tbody>${items.map((d) => tpl`<tr>
            <td>${d.label}</td>
            <td>${d.sub || ""}</td>
            <td>${duration(d.before)}</td>
            <td>${duration(d.after)}</td>
            <td>${d.before === d.after ? "unchanged" : `−${Math.round((1 - d.after / d.before) * 100)}%`}</td>
            <td class="muted">${d.unit || ""}</td>
          </tr>`)}</tbody>
        </table>
      </details>
    </figure>`;
}


/**
 * Percent reduction, one bar per item, on a fixed 0-100% axis.
 *
 * This exists because the dumbbell above cannot honestly compare rows measured
 * in different units: 15 minutes per inquiry and 2,400 minutes per submission
 * share no axis, and putting them on one anyway would say something false.
 * Proportional change is the measure that survives a change of denominator, so
 * that is what gets the axis; the absolute figures are printed beside each bar
 * and repeated in the table, where the unit is named.
 */
export function reductionBars(items, { caption = "", tableHeading = "Show the numbers" } = {}) {
  if (!items.length) return raw("");
  const rowH = 32;
  const labelW = 300;
  const padR = 190;
  const plotW = WIDTH - labelW - padR;
  const height = items.length * rowH + 34;
  const x = (pct) => (pct / 100) * plotW;
  const ticks = [0, 25, 50, 75, 100];

  return tpl`
    <figure class="chart">
      <svg class="chart-svg" viewBox="0 0 ${WIDTH} ${height}" role="img"
           aria-label="Reduction in cycle time, one bar per business step">
        ${ticks.map((t) => tpl`
          <line class="chart-grid" x1="${labelW + x(t)}" x2="${labelW + x(t)}" y1="20" y2="${items.length * rowH + 22}"></line>
          <text class="chart-tick" x="${labelW + x(t)}" y="14" text-anchor="middle">${t}%</text>`)}

        ${items.map((d, i) => {
          const y = i * rowH + 22;
          const mid = y + rowH / 2 - 2;
          const pct = Math.max(0, Math.min(100, d.pct));
          const label = d.label.length > 34 ? `${d.label.slice(0, 33)}…` : d.label;
          return tpl`
            <g class="chart-row">
              <title>${d.label}${d.sub ? ` — ${d.sub}` : ""}: ${pct}% faster (${d.detail})</title>
              <text class="chart-label" x="${labelW - 12}" y="${mid}" text-anchor="end" dominant-baseline="middle">${label}</text>
              ${d.sub ? tpl`<text class="chart-sublabel" x="${labelW - 12}" y="${mid + 13}" text-anchor="end">${d.sub}</text>` : ""}
              <rect class="chart-bar-track" x="${labelW}" y="${mid - 6}" width="${plotW}" height="12" rx="6"></rect>
              <rect class="chart-bar" x="${labelW}" y="${mid - 6}" width="${Math.max(x(pct), 3)}" height="12" rx="4"></rect>
              <text class="chart-value" x="${labelW + plotW + 12}" y="${mid}" dominant-baseline="middle">${pct}% · ${d.detail}</text>
            </g>`;
        })}
      </svg>

      ${caption ? tpl`<p class="chart-caption">${caption}</p>` : ""}

      <details class="chart-data">
        <summary>${tableHeading}</summary>
        <table class="data-table">
          <thead><tr>
            <th>Step</th><th>Performed by</th><th>Before</th><th>Now</th><th>Change</th><th>Unit</th>
          </tr></thead>
          <tbody>${items.map((d) => tpl`<tr>
            <td>${d.label}</td>
            <td>${d.sub || ""}</td>
            <td>${duration(d.before)}</td>
            <td>${duration(d.after)}</td>
            <td>−${d.pct}%</td>
            <td class="muted">${d.unit || ""}</td>
          </tr>`)}</tbody>
        </table>
      </details>
    </figure>`;
}
