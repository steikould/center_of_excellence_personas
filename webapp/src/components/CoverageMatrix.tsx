import type { Agent, Coverage } from '../types';
import { coverageColor, titleCase } from '../lib';

const SIGNALS = ['traces', 'metrics', 'cost', 'toolCalls', 'humanFeedback', 'evaluations'] as const;

/** Telemetry conformance across every agent, whatever framework it runs on.
 *  This is the picture that decides whether a federated model is actually
 *  working: the columns are the shared contract, the rows are the estate. */
export const CoverageMatrix = ({ agents }: { agents: Agent[] }) => (
  <div className="tablewrap">
    <table>
      <thead>
        <tr>
          <th>Agent</th>
          {SIGNALS.map((s) => (
            <th key={s} className="num">
              {titleCase(s === 'toolCalls' ? 'tool calls' : s === 'humanFeedback' ? 'human feedback' : s)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {agents.map((a) => (
          <tr key={a.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{a.shortName}</td>
            {SIGNALS.map((s) => {
              const v = (a.telemetry.coverage[s] ?? 'none') as Coverage;
              return (
                <td key={s} className="num">
                  <span
                    title={`${s}: ${v}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: v === 'none' ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 26,
                        height: 10,
                        borderRadius: 5,
                        background: coverageColor(v),
                        border: v === 'none' ? '1px solid var(--line)' : 'none',
                      }}
                    />
                    {v}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
