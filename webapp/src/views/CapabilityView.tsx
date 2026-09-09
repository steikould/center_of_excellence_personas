import type { Capability } from '../types';
import type { Lookups } from '../lib';
import { duration, modeColor, modeLabel, MODE_ORDER, num, pct } from '../lib';
import { go } from '../router';
import { Legend, Link, Section, SeedFlag, Stat } from '../components/primitives';
import { ChartFrame } from '../components/ChartFrame';
import { CycleDumbbell } from '../components/CycleDumbbell';
import { ProcessRibbon } from '../components/ProcessRibbon';

export const CapabilityView = ({ capability, lk }: { capability: Capability; lk: Lookups }) => {
  const c = capability;
  const domain = lk.domain.get(c.domain)!;
  const bottleneck = [...c.processes].sort((a, b) => b.cycleTimeAfter - a.cycleTimeAfter)[0];

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">
          Capability · <Link to={{ view: 'domain', id: domain.id }}>{domain.name}</Link>
        </div>
        <h1>{c.name}</h1>
        <p className="lede">{c.summary}</p>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="chip">{num(c.annualVolume)} {c.volumeUnit} per year</span>
          <span className="chip">{c.currentFte} FTE today, was {c.priorFte}</span>
          <SeedFlag confidence={c.confidence} />
        </div>
      </div>

      <div className="grid grid--stats">
        <Stat label="Steps machine-run" value={`${c.derived.automatedCount}/${c.derived.processCount}`} sub={pct(c.derived.coveragePct)} />
        <Stat label="Chain cycle time" value={duration(c.derived.minutesAfter)} sub={`Was ${duration(c.derived.minutesBefore)}`} />
        <Stat label="Cycle reduction" value={pct(c.derived.cycleReductionPct)} sub="End to end, per unit" />
        <Stat label="Roles absorbed" value={c.derived.fteReleased} unit=" FTE" sub={`${c.derived.agents.length} agent(s) involved`} />
      </div>

      <Section title="The process chain">
        <div className="figure">
          <ProcessRibbon processes={c.processes} height={34} />
          <div style={{ marginTop: 12 }}>
            <Legend
              items={[
                ...MODE_ORDER.filter((m) => m !== 'human').map((m) => ({ label: modeLabel(m), color: modeColor(m) })),
                { label: 'Human', color: 'transparent', outline: true },
              ]}
            />
          </div>
          <div className="figure__caption">
            Width is the time each step takes today. The widest segment is{' '}
            <strong>{bottleneck.name}</strong> at {duration(bottleneck.cycleTimeAfter)} —{' '}
            {bottleneck.mode === 'human'
              ? 'still performed by a person, and now the binding constraint on this chain.'
              : 'the current constraint on this chain.'}
          </div>
        </div>
      </Section>

      <Section title="Where the time went">
        <ChartFrame
          title="Cycle time per step, before and after"
          caption="Open circle is the prior cycle time, filled circle is today. Steps a person still performs are shown unchanged — automating around a human step does not move it."
          table={
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Performed by</th>
                  <th className="num">Before</th>
                  <th className="num">Now</th>
                  <th className="num">Change</th>
                </tr>
              </thead>
              <tbody>
                {c.processes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{modeLabel(p.mode)}</td>
                    <td className="num">{duration(p.cycleTimeBefore)}</td>
                    <td className="num">{duration(p.cycleTimeAfter)}</td>
                    <td className="num">
                      {p.cycleTimeBefore === p.cycleTimeAfter
                        ? '—'
                        : `−${Math.round((1 - p.cycleTimeAfter / p.cycleTimeBefore) * 100)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <CycleDumbbell processes={c.processes} />
        </ChartFrame>
      </Section>

      <Section title="Step detail" note="Business step, the agent that performs it, and the systems it touches. Both directions drill.">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Step</th>
                <th>Performed by</th>
                <th style={{ width: 130 }}>Agent</th>
                <th>Systems</th>
              </tr>
            </thead>
            <tbody>
              {c.processes.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 550 }}>{p.name}</div>
                    {p.description && (
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{p.description}</div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="chip">
                      <span
                        className="chip__swatch"
                        style={
                          p.mode === 'human'
                            ? { background: 'transparent', border: '1.5px dashed var(--text-muted)' }
                            : { background: modeColor(p.mode) }
                        }
                        aria-hidden
                      />
                      {modeLabel(p.mode)}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {p.agent ? (
                      <Link to={{ view: 'agent', id: p.agent }}>{lk.agent.get(p.agent)?.shortName ?? p.agent}</Link>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="chiprow">
                      {p.systems.map((s) => (
                        <button key={s} className="chip" style={{ cursor: 'pointer' }} onClick={() => go({ view: 'system', id: s })}>
                          {lk.system.get(s)?.name ?? s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};
