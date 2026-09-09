import type { Domain, Model } from '../types';
import type { Lookups } from '../lib';
import { duration, frameworkColor, frameworkLabel, modeColor, modeLabel, MODE_ORDER, num, pct, usd } from '../lib';
import { go } from '../router';
import { Bar, Legend, Section, SeedFlag, SeverityChip, Stat } from '../components/primitives';
import { ProcessRibbon } from '../components/ProcessRibbon';

export const DomainView = ({ domain, model, lk }: { domain: Domain; model: Model; lk: Lookups }) => {
  const caps = model.capabilities.filter((c) => c.domain === domain.id);
  const agents = domain.derived.agents.map((id) => lk.agent.get(id)!).filter(Boolean);
  const systems = domain.derived.systems.map((id) => lk.system.get(id)!).filter(Boolean);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Business domain</div>
        <h1>{domain.name}</h1>
        <p className="lede">{domain.summary}</p>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="chip">Owner · {domain.owner}</span>
          <span className="chip">{usd(domain.valueAtStake)} of work in scope</span>
          <SeverityChip severity={domain.derived.worstSeverity} />
          <SeedFlag confidence={domain.confidence} />
        </div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
        <h3 style={{ marginBottom: 4 }}>The outcome this domain owns</h3>
        <p style={{ margin: 0, fontSize: 15 }}>{domain.outcome}</p>
      </div>

      <Section title="How the business is measured">
        <div className="grid grid--stats">
          {domain.kpis.map((k) => {
            const onTarget = k.direction === 'up' ? k.value >= k.target : k.value <= k.target;
            return (
              <Stat
                key={k.id}
                label={k.label}
                value={k.value.toLocaleString('en-US')}
                unit={k.unit === '%' ? '%' : ` ${k.unit}`}
                sub={`Target ${k.target}${k.unit === '%' ? '%' : ` ${k.unit}`}`}
                tone={onTarget ? 'good' : 'warning'}
              />
            );
          })}
        </div>
        <ul className="plain muted" style={{ fontSize: 13, marginTop: 12 }}>
          {domain.pressures.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="Effort before and after">
        <div className="grid grid--stats">
          <Stat label="People on this work" value={domain.derived.currentFte} unit=" FTE" sub={`Was ${domain.derived.priorFte} FTE`} />
          <Stat label="Steps now machine-run" value={pct(domain.derived.coveragePct)} sub={`${domain.derived.processCount} process steps total`} />
          <Stat label="Annual run cost" value={usd(domain.derived.runCostUsd)} sub="Agent operating cost" />
          <Stat label="Attributed benefit" value={usd(domain.derived.benefitUsd)} sub={`Net ${usd(domain.derived.netBenefitUsd)}`} />
        </div>
      </Section>

      <Section
        title="Capabilities"
        note="Each strip is the process chain, segment width = the time that step takes today. Click to open."
        right={
          <Legend
            items={[
              ...MODE_ORDER.filter((m) => m !== 'human').map((m) => ({ label: modeLabel(m), color: modeColor(m) })),
              { label: 'Human', color: 'transparent', outline: true },
            ]}
          />
        }
      >
        <div className="grid grid--2">
          {caps.map((c) => (
            <button className="card" key={c.id} onClick={() => go({ view: 'capability', id: c.id })}>
              <h2>{c.name}</h2>
              <p className="muted" style={{ fontSize: 13, margin: '4px 0 12px' }}>{c.summary}</p>
              <ProcessRibbon processes={c.processes} />
              <div className="chiprow" style={{ marginTop: 12 }}>
                <span className="chip">{pct(c.derived.coveragePct)} machine-run</span>
                <span className="chip">{c.derived.cycleReductionPct}% less cycle time</span>
                <span className="chip">{c.derived.fteReleased} FTE absorbed</span>
                <span className="chip">{num(c.annualVolume)} {c.volumeUnit}/yr</span>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Agents operating here">
        <div className="grid grid--2">
          {agents.map((a) => (
            <button className="card" key={a.id} onClick={() => go({ view: 'agent', id: a.id })}>
              <div className="chiprow" style={{ marginBottom: 8 }}>
                <span className="chip">
                  <span className="chip__swatch" style={{ background: frameworkColor(a.platform.framework) }} aria-hidden />
                  {frameworkLabel(a.platform.framework)}
                </span>
                <span className="chip">v{a.version}</span>
                <span className="chip">{a.status}</span>
                <SeverityChip severity={a.derived.worstSeverity} />
              </div>
              <h2>{a.name}</h2>
              <p className="muted" style={{ fontSize: 13, margin: '4px 0 10px' }}>{a.oneLiner}</p>
              <div style={{ fontSize: 13 }}>
                Replaced <strong>{a.replaces.roleTitle}</strong> — {a.replaces.fteEquivalent} FTE of task load
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Systems this domain runs on" note="The IT surface behind the business process. Click through for the platform entry.">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>System</th>
                <th>Category</th>
                <th>Hosting</th>
                <th>GxP</th>
                <th style={{ width: 200 }}>AI readiness</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((s) => (
                <tr key={s.id} className="is-clickable" onClick={() => go({ view: 'system', id: s.id })}>
                  <td style={{ fontWeight: 550 }}>{s.name}</td>
                  <td>{s.category}</td>
                  <td>{s.hosting}</td>
                  <td>{s.gxpRelevant ? 'Yes' : 'No'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <Bar value={{ ready: 100, constrained: 55, 'not-ready': 15 }[s.aiReadiness]} color="var(--ord-2)" />
                      </div>
                      <span style={{ minWidth: 86 }}>{s.aiReadiness}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <p className="muted" style={{ fontSize: 12, marginTop: 24 }}>
        Total cycle time across this domain's chains: {duration(caps.reduce((t, c) => t + c.derived.minutesBefore, 0))} before,{' '}
        {duration(caps.reduce((t, c) => t + c.derived.minutesAfter, 0))} now.
      </p>
    </>
  );
};
