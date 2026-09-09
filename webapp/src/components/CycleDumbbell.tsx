import type { Process } from '../types';
import { duration, modeColor, modeLabel } from '../lib';

const ROW = 30;
const LABEL_W = 300;
const PAD_R = 168;

/** Before → after per process step, on one shared linear axis. Linear is
 *  deliberate: it shows honestly that one un-automated step can dominate a
 *  cycle even after everything around it got faster. */
export const CycleDumbbell = ({ processes, width = 980 }: { processes: Process[]; width?: number }) => {
  const max = Math.max(...processes.map((p) => p.cycleTimeBefore), 1);
  const plotW = width - LABEL_W - PAD_R;
  const x = (v: number) => LABEL_W + (v / max) * plotW;
  const height = processes.length * ROW + 24;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Cycle time before and after, by process step">
      {processes.map((p, i) => {
        const y = i * ROW + ROW / 2 + 8;
        const unchanged = p.cycleTimeBefore === p.cycleTimeAfter;
        const fill = p.mode === 'human' ? 'var(--text-muted)' : modeColor(p.mode);
        return (
          <g key={p.id}>
            <text x={LABEL_W - 12} y={y} textAnchor="end" dominantBaseline="middle" fontSize={12} fill="var(--text-primary)">
              {p.name.length > 34 ? `${p.name.slice(0, 33)}…` : p.name}
            </text>
            <line x1={LABEL_W} x2={width - PAD_R} y1={y} y2={y} stroke="var(--line-soft)" strokeWidth={1} />
            {!unchanged && (
              <line
                x1={x(p.cycleTimeAfter)}
                x2={x(p.cycleTimeBefore)}
                y1={y}
                y2={y}
                stroke={fill}
                strokeWidth={2}
                strokeOpacity={0.45}
              />
            )}
            {/* open circle = before, filled = now */}
            <circle cx={x(p.cycleTimeBefore)} cy={y} r={4.5} fill="var(--surface-1)" stroke="var(--text-muted)" strokeWidth={2} />
            <circle cx={x(p.cycleTimeAfter)} cy={y} r={5} fill={fill} stroke="var(--surface-1)" strokeWidth={2} />
            <text x={width - PAD_R + 10} y={y} dominantBaseline="middle" fontSize={11.5} fill="var(--text-secondary)">
              {unchanged ? `${duration(p.cycleTimeAfter)} · unchanged` : `${duration(p.cycleTimeBefore)} → ${duration(p.cycleTimeAfter)}`}
            </text>
            <title>{`${p.name} — ${modeLabel(p.mode)}`}</title>
          </g>
        );
      })}
    </svg>
  );
};
