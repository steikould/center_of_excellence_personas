import type { Model } from '../types';
import { frameworkColor, frameworkLabel, num, pct, usd } from '../lib';
import { go } from '../router';
import { Bar, Callout, Legend, Section, SeverityChip, Stat } from '../components/primitives';
import { ChartFrame } from '../components/ChartFrame';
import { EstateSankey } from '../components/EstateSankey';
import { CoverageMatrix } from '../components/CoverageMatrix';

export const Portfolio = ({ model }: { model: Model }) => {
  const p = model.portfolio;
  const domains = [...model.domains].sort((a, b) => b.valueAtStake - a.valueAtStake);
  const nonReporting = model.agents.filter((a) => a.telemetry.exportsTo === 'none').length;
  const findings = model.agents
    .flatMap((a) => a.derived.risks.map((r) => ({ ...r, agent: a })))
    .filter((r) => r.severity === 'critical' || r.severity === 'serious')
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'critical' ? -1 : 1));

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">{model.meta.organization} · as of {model.meta.asOf}</div>
        <h1>The agent estate</h1>
        <p className="lede">
          Five agents now perform work that people used to do, across five business domains and three
          different runtimes. This atlas is one document read at four depths: the portfolio, the business
          domain, the process, and the infrastructure it runs on. Every panel drills.
        </p>
      </div>

      <Callout>
        <strong>This model ships as seed data.</strong> The structure is real; the values are placeholders
        authored by the CoE, not an inventory of the delivered agents. Replace every field marked{' '}
        <span className="mono">confidence: seed</span> in <span className="mono">model/</span> before this
        atlas leaves the CoE. The build step will not let a broken reference through, but it cannot tell you
        a number is wrong.
      </Callout>

      <Section title="Portfolio at a glance">
        <div className="grid grid--stats">
          <Stat label="Agents in service" value={p.agentCount} sub={`${p.frameworks.length} frameworks, ${p.runtimeCount} runtimes`} />
          <Stat label="Roles absorbed" value={p.fteReleased} unit=" FTE" sub="Task absorption, not headcount cuts" />
          <Stat label="Net annual benefit" value={usd(p.netBenefitUsd)} sub={`${usd(p.benefitUsd)} benefit − ${usd(p.runCostUsd)} run cost`} />
          <Stat
            label="Telemetry conformance"
            value={pct(p.telemetryConformancePct)}
            sub={`${nonReporting} of ${p.agentCount} not reporting centrally`}
            tone={p.telemetryConformancePct < 100 ? 'serious' : 'good'}
          />
          <Stat
            label="Critical findings"
            value={p.criticalRiskCount}
            sub={`${p.seriousRiskCount} further serious`}
            tone={p.criticalRiskCount > 0 ? 'critical' : 'good'}
          />
        </div>
      </Section>

      <Section title="Business to infrastructure, in one view">
        <ChartFrame
          title="Where the value sits, who does the work, and where it runs"
          legend={
            <Legend
              items={[
                { label: 'PwC agent OS', color: frameworkColor('pwc-agent-os') },
                { label: 'Copilot Studio', color: frameworkColor('copilot-studio') },
                { label: 'Dify (self-hosted)', color: frameworkColor('dify') },
              ]}
            />
          }
          caption="Flow width is attributed annual benefit. Colour is the framework the agent was built in — three frameworks, three runtimes, one estate. Click any node to drill in."
          table={
            <table>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Agent</th>
                  <th>Framework</th>
                  <th>Runtime</th>
                  <th className="num">Attributed benefit</th>
                </tr>
              </thead>
              <tbody>
                {model.agents.map((a) => (
                  <tr key={a.id}>
                    <td>{model.domains.find((d) => d.id === a.business.domain)?.shortName}</td>
                    <td>{a.name}</td>
                    <td>{frameworkLabel(a.platform.framework)}</td>
                    <td>{model.runtimes.find((r) => r.id === a.platform.runtime)?.name}</td>
                    <td className="num">{usd(a.economics.annualBenefitUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <EstateSankey model={model} />
        </ChartFrame>
      </Section>

      <Section title="Where the work is" note="Sorted by annual cost of the work in scope. Click a row to open the domain.">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Business domain</th>
                <th style={{ width: 190 }}>Cost of work in scope</th>
                <th style={{ width: 150 }}>Steps now machine-run</th>
                <th className="num">Roles absorbed</th>
                <th className="num">Net benefit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="is-clickable" onClick={() => go({ view: 'domain', id: d.id })}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {d.derived.agentCount} agent{d.derived.agentCount === 1 ? '' : 's'} · {d.derived.capabilityCount} capabilit{d.derived.capabilityCount === 1 ? 'y' : 'ies'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <Bar value={d.valueAtStake} max={domains[0].valueAtStake} />
                      </div>
                      <span className="mono" style={{ minWidth: 46, textAlign: 'right' }}>{usd(d.valueAtStake)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <Bar value={d.derived.coveragePct} color="var(--ord-3)" />
                      </div>
                      <span className="mono" style={{ minWidth: 34, textAlign: 'right' }}>{pct(d.derived.coveragePct)}</span>
                    </div>
                  </td>
                  <td className="num">{d.derived.fteReleased}</td>
                  <td className="num">{usd(d.derived.netBenefitUsd)}</td>
                  <td>
                    <SeverityChip severity={d.derived.worstSeverity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="What needs a decision"
        note="Derived from the manifests by rule, not authored by hand — so it cannot quietly go stale."
      >
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 110 }}>Severity</th>
                <th>Finding</th>
                <th>Agent</th>
                <th>Framework</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={`${f.agent.id}-${f.id}`} className="is-clickable" onClick={() => go({ view: 'agent', id: f.agent.id })}>
                  <td><SeverityChip severity={f.severity} /></td>
                  <td>{f.label}</td>
                  <td>{f.agent.name}</td>
                  <td>{frameworkLabel(f.agent.platform.framework)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Telemetry conformance across frameworks"
        note="The contract is OpenTelemetry GenAI semantics. This is whether each agent actually honours it."
      >
        <CoverageMatrix agents={model.agents} />
        <p className="muted" style={{ fontSize: 13, marginTop: 10, maxWidth: '72ch' }}>
          Federation works only if every runtime emits the same shape. The gaps here are the backlog:{' '}
          {num(model.agents.filter((a) => a.telemetry.coverage.evaluations === 'none').length)} agents have no
          offline evaluation, and one exports nothing to the central pipeline at all.
        </p>
      </Section>
    </>
  );
};
