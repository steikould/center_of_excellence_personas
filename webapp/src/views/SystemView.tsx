import type { Model, SystemEntry } from '../types';
import type { Lookups } from '../lib';
import { nodeName, titleCase } from '../lib';
import { go } from '../router';
import { Callout, DefList, Link, Section, SeedFlag } from '../components/primitives';

export const SystemView = ({ system, model, lk }: { system: SystemEntry; model: Model; lk: Lookups }) => {
  const s = system;
  const inbound = model.flows.filter((f) => f.to === s.id);
  const outbound = model.flows.filter((f) => f.from === s.id);
  const agents = model.agents.filter((a) => a.interfaces.systems.includes(s.id));
  const processes = model.processes.filter((p) => p.systems.includes(s.id));

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">System of record</div>
        <h1>{s.name}</h1>
        <p className="lede">{s.purpose}</p>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="chip">{s.category}</span>
          <span className="chip">{s.vendor}</span>
          <span className="chip">{s.hosting}</span>
          {s.gxpRelevant && <span className="chip">GxP</span>}
          <span className="chip">AI readiness · {s.aiReadiness}</span>
          <SeedFlag confidence={s.confidence} />
        </div>
      </div>

      {s.aiReadinessNote && (
        <Callout tone={s.aiReadiness === 'not-ready' ? 'critical' : 'warning'}>{s.aiReadinessNote}</Callout>
      )}

      <Section title="Platform entry">
        <div className="grid grid--2">
          <div className="card">
            <h3>Ownership and data</h3>
            <DefList
              items={[
                ['Owner', s.owner],
                ['Data classification', titleCase(s.dataClassification)],
                ['Interfaces', s.interfaces.join(', ')],
              ]}
            />
          </div>
          <div className="card">
            <h3>Regulatory</h3>
            <DefList
              items={[
                ['GxP relevant', s.gxpRelevant ? 'Yes' : 'No'],
                ['21 CFR Part 11', String(s.part11)],
                ['Validation status', titleCase(s.validationStatus)],
                ['Audit trail', titleCase(s.auditTrail)],
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Integrations" note="Edges into and out of this node in the graph of operations.">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Direction</th>
                <th>Counterparty</th>
                <th>What moves</th>
                <th>Protocol</th>
                <th>Frequency</th>
                <th>Criticality</th>
              </tr>
            </thead>
            <tbody>
              {[...inbound.map((f) => ({ f, dir: 'in' as const })), ...outbound.map((f) => ({ f, dir: 'out' as const }))].map(
                ({ f, dir }) => {
                  const other = dir === 'in' ? f.from : f.to;
                  const clickable = lk.agent.has(other) || lk.system.has(other) || lk.runtime.has(other);
                  return (
                    <tr key={f.id}>
                      <td>{dir === 'in' ? 'Inbound' : 'Outbound'}</td>
                      <td>
                        {clickable ? (
                          <button
                            className="linkbtn"
                            onClick={() =>
                              go({
                                view: lk.agent.has(other) ? 'agent' : lk.system.has(other) ? 'system' : 'runtime',
                                id: other,
                              } as never)
                            }
                          >
                            {nodeName(lk, other)}
                          </button>
                        ) : (
                          nodeName(lk, other)
                        )}
                      </td>
                      <td>
                        {f.label}
                        {f.health === 'degraded' && <span className="chip chip--serious" style={{ marginLeft: 6 }}>degraded</span>}
                      </td>
                      <td className="mono">{f.protocol}</td>
                      <td>{f.frequency}</td>
                      <td>{titleCase(f.criticality)}</td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Business exposure" note="Which agents reach this system and which business steps depend on it.">
        <div className="grid grid--2">
          <div className="card">
            <h3>Agents with access</h3>
            {agents.length === 0 ? (
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>No agent holds credentials to this system.</p>
            ) : (
              <ul className="plain">
                {agents.map((a) => (
                  <li key={a.id}>
                    <Link to={{ view: 'agent', id: a.id }}>{a.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card">
            <h3>Process steps that depend on it</h3>
            <ul className="plain">
              {processes.map((p) => (
                <li key={p.id}>
                  {p.name}{' '}
                  <span className="muted">
                    (<Link to={{ view: 'capability', id: p.capability }}>{lk.capability.get(p.capability)?.name}</Link>)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};
