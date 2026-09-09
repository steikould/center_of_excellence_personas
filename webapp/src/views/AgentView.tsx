import type { Agent } from '../types';
import type { Lookups } from '../lib';
import { frameworkColor, frameworkLabel, num, pct, seconds, titleCase, usd } from '../lib';
import { go } from '../router';
import { Callout, DefList, Link, Section, SeedFlag, SeverityChip, Stat } from '../components/primitives';
import { CoverageMatrix } from '../components/CoverageMatrix';

export const AgentView = ({ agent, lk }: { agent: Agent; lk: Lookups }) => {
  const a = agent;
  const domain = lk.domain.get(a.business.domain)!;
  const runtime = lk.runtime.get(a.platform.runtime)!;
  const critical = a.derived.risks.filter((r) => r.severity === 'critical');
  const rest = a.derived.risks.filter((r) => r.severity !== 'critical');

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">
          Agent · <Link to={{ view: 'domain', id: domain.id }}>{domain.name}</Link>
        </div>
        <h1>{a.name}</h1>
        <p className="lede">{a.oneLiner}</p>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="chip">
            <span className="chip__swatch" style={{ background: frameworkColor(a.platform.framework) }} aria-hidden />
            {frameworkLabel(a.platform.framework)}
          </span>
          <span className="chip">v{a.version}</span>
          <span className="chip">{titleCase(a.status)}</span>
          <span className="chip">Built by {a.provenance.builtBy}</span>
          {a.governance.gxpRelevant && <span className="chip">GxP</span>}
          <SeverityChip severity={a.derived.worstSeverity} />
          <SeedFlag confidence={a.confidence} />
        </div>
      </div>

      {critical.length > 0 && (
        <Callout tone="critical">
          <strong>{critical.length} critical finding{critical.length === 1 ? '' : 's'}.</strong>{' '}
          {critical.map((r) => r.label).join('. ')}.
        </Callout>
      )}

      <Section title="Operating health" note="From the conformed telemetry pipeline.">
        <div className="grid grid--stats">
          <Stat label="Runs per month" value={num(a.health.runsPerMonth)} />
          <Stat
            label="Success rate"
            value={pct(a.health.successRatePct)}
            tone={a.health.successRatePct >= 95 ? 'good' : 'warning'}
          />
          <Stat label="p95 latency" value={seconds(a.health.p95LatencySeconds)} sub={`p50 ${seconds(a.health.p50LatencySeconds)}`} />
          <Stat label="Escalation rate" value={pct(a.health.escalationRatePct)} sub="Handed back to a person" />
          <Stat label="Human override" value={pct(a.interfaces.humanInLoop.overrideRatePct)} sub="Reviewer changed the output" />
        </div>
      </Section>

      <Section title="What it replaced" note="The honest version of this row is the one an executive will be asked about.">
        <div className="card">
          <DefList
            items={[
              ['Role', a.replaces.roleTitle],
              ['Task load absorbed', `${a.replaces.fteEquivalent} FTE`],
              ['Displacement type', titleCase(a.replaces.displacementType)],
              [
                'Still done by people',
                <ul className="plain" key="retained">
                  {a.replaces.retainedByHumans.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>,
              ],
              ...(a.replaces.note ? ([['Note', a.replaces.note]] as [string, string][]) : []),
            ]}
          />
        </div>
      </Section>

      <Section title="Business scope">
        <div className="grid grid--2">
          <div className="card">
            <h3>Capabilities and steps</h3>
            <ul className="plain">
              {a.business.processes.map((p) => {
                const proc = lk.process.get(p);
                return (
                  <li key={p}>
                    {proc?.name}{' '}
                    <span className="muted">
                      (<Link to={{ view: 'capability', id: proc!.capability }}>{lk.capability.get(proc!.capability)?.name}</Link>)
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card">
            <h3>Accountability</h3>
            <DefList
              items={[
                ['Business owner', a.ownership.businessOwner],
                [
                  'Technical owner',
                  a.ownership.technicalOwner === 'UNASSIGNED' ? (
                    <SeverityChip severity="critical" label="Unassigned" />
                  ) : (
                    a.ownership.technicalOwner
                  ),
                ],
                ['Accountable executive', a.ownership.accountableExecutive],
                ['Delivered', `${a.provenance.deliveredOn} · handover ${a.provenance.handoverStatus}`],
                [
                  'Source artefacts',
                  a.provenance.sourceAvailable ? a.provenance.sourceLocation : <SeverityChip severity="warning" label="Not held by the enterprise" />,
                ],
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Platform and runtime" note="Where the business process stops being a business process and becomes infrastructure.">
        <div className="grid grid--2">
          <div className="card">
            <h3>Build</h3>
            <DefList
              items={[
                ['Framework', frameworkLabel(a.platform.framework)],
                ['Version', a.platform.frameworkVersion],
                ['Orchestration', a.platform.orchestrationStyle],
                ['Interop', a.platform.interop],
                ['Prompt versioning', a.model.promptVersioning],
              ]}
            />
          </div>
          <div className="card">
            <h3>Run</h3>
            <DefList
              items={[
                ['Runtime', <Link key="rt" to={{ view: 'runtime', id: runtime.id }}>{runtime.name}</Link>],
                ['Cloud', `${runtime.cloud} · ${runtime.region}`],
                ['Primary model', a.model.primary],
                ['Degraded mode', a.model.fallback],
                ['Data residency', a.data.residency],
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Interfaces" note="Every system this agent can reach, and with what access. This is the blast radius.">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Tool</th>
                <th>Type</th>
                <th>Access</th>
                <th>Scope</th>
              </tr>
            </thead>
            <tbody>
              {a.interfaces.tools.map((t) => (
                <tr key={t.name}>
                  <td className="mono">{t.name}</td>
                  <td>{t.type}</td>
                  <td>
                    <span className="chip">{t.access}</span>
                  </td>
                  <td className="muted">{t.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="muted" style={{ fontSize: 13 }}>Systems:</span>
          {a.interfaces.systems.map((s) => (
            <button key={s} className="chip" style={{ cursor: 'pointer' }} onClick={() => go({ view: 'system', id: s })}>
              {lk.system.get(s)?.name ?? s}
            </button>
          ))}
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Human in the loop</h3>
          <DefList
            items={[
              ['Mode', titleCase(a.interfaces.humanInLoop.mode)],
              ['Gate', a.interfaces.humanInLoop.gate],
              ['Response SLA', a.interfaces.humanInLoop.slaMinutes ? `${a.interfaces.humanInLoop.slaMinutes} min` : 'No gate — answers go out unreviewed'],
              ['Override rate', pct(a.interfaces.humanInLoop.overrideRatePct)],
            ]}
          />
        </div>
      </Section>

      <Section title="Observability" note={`Emits ${a.telemetry.emits} · ${a.telemetry.semconv}`}>
        <CoverageMatrix agents={[a]} />
        <ul className="plain" style={{ marginTop: 12, fontSize: 13 }}>
          {a.telemetry.gaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </Section>

      <Section title="Governance">
        <div className="grid grid--2">
          <div className="card">
            <h3>Regulatory posture</h3>
            <DefList
              items={[
                ['GxP relevant', a.governance.gxpRelevant ? 'Yes' : 'No'],
                ['21 CFR Part 11 scope', a.governance.part11Scope ? 'Yes' : 'No'],
                [
                  'Validation',
                  a.governance.validationStatus === 'validated' ? (
                    `${a.governance.validationStatus} · ${a.governance.validationRef}`
                  ) : (
                    <SeverityChip severity="critical" label={`${a.governance.validationStatus} · ${a.governance.validationRef}`} />
                  ),
                ],
                ['Model risk tier', `Tier ${a.governance.modelRiskTier}`],
                ['Periodic review', a.governance.periodicReview],
                ['Regulatory exposure', a.governance.regulatoryExposure],
                ['Data classification', a.data.classifications.join(', ')],
                ['Training use', a.data.trainingUse],
              ]}
            />
          </div>
          <div className="card">
            <h3>Controls in force</h3>
            <ul className="none">
              {a.governance.controls.map((cid) => {
                const ctl = lk.control.get(cid);
                return (
                  <li key={cid} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 550 }}>{ctl?.name}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>{ctl?.statement}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Economics" note="Cost and benefit carry their own confidence markers. Most benefit numbers in this estate are still seed.">
        <div className="grid grid--stats">
          <Stat label="Annual run cost" value={usd(a.economics.annualRunCostUsd)} sub={a.economics.costConfidence} />
          <Stat label="Attributed benefit" value={usd(a.economics.annualBenefitUsd)} sub={a.economics.benefitConfidence} />
          <Stat label="Net" value={usd(a.derived.netBenefitUsd)} />
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>{a.economics.benefitBasis}</p>
      </Section>

      {(rest.length > 0 || a.openQuestions.length > 0) && (
        <Section title="Open items">
          {rest.length > 0 && (
            <div className="chiprow" style={{ marginBottom: 12 }}>
              {rest.map((r) => (
                <SeverityChip key={r.id} severity={r.severity} label={r.label} />
              ))}
            </div>
          )}
          <div className="card">
            <h3>Questions for the build team</h3>
            <ul className="plain">
              {a.openQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </>
  );
};
