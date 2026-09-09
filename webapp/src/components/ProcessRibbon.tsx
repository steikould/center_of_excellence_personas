import type { Process } from '../types';
import { duration, modeColor, modeLabel } from '../lib';
import { TipRow, TipTitle, useTooltip } from './Tooltip';

/** A capability's process chain as a single strip. Segment width is the time the
 *  step takes *today*, so the eye lands on where the cycle actually sits now —
 *  which is usually the human step nobody automated. */
export const ProcessRibbon = ({ processes, height = 26 }: { processes: Process[]; height?: number }) => {
  const { show, hide, node } = useTooltip();
  const total = processes.reduce((t, p) => t + Math.max(p.cycleTimeAfter, 1), 0);

  return (
    <>
      <div style={{ display: 'flex', gap: 2, width: '100%' }} role="img" aria-label="Process chain by execution mode">
        {processes.map((p) => {
          const share = (Math.max(p.cycleTimeAfter, 1) / total) * 100;
          const isHuman = p.mode === 'human';
          return (
            <div
              key={p.id}
              style={{
                flex: `0 0 ${share}%`,
                minWidth: 4,
                height,
                borderRadius: 3,
                background: isHuman ? 'transparent' : modeColor(p.mode),
                border: isHuman ? '1.5px dashed var(--text-muted)' : 'none',
              }}
              onMouseMove={(e) =>
                show(
                  e,
                  <>
                    <TipTitle>{p.name}</TipTitle>
                    <TipRow label="Performed by" value={modeLabel(p.mode)} />
                    <TipRow label="Was" value={duration(p.cycleTimeBefore)} />
                    <TipRow label="Now" value={duration(p.cycleTimeAfter)} />
                  </>,
                )
              }
              onMouseLeave={hide}
            />
          );
        })}
      </div>
      {node}
    </>
  );
};
