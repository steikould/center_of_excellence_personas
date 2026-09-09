import type { Model } from '../types';
import type { Lookups } from '../lib';
import { titleCase } from '../lib';
import { go } from '../router';
import { Callout, Section } from '../components/primitives';

export const Governance = ({ model, lk }: { model: Model; lk: Lookups }) => (
  <>
    <div className="page-head">
      <div className="eyebrow">Operating model</div>
      <h1>How this estate is governed</h1>
      <p className="lede">
        Agents execute in the cloud that suits them and keep their native LLMOps. What is centralised is
        deliberately thin: the registry that says what exists, a conformed telemetry pipeline, one evaluation
        harness, and one policy baseline. Nothing in the centre sits in an agent's request path, so nothing
        in the centre can take an agent down.
      </p>
    </div>

    <Callout>
      <strong>Why not one harness for everything?</strong> A single runtime proxy every agent must call through
      would be a shared point of failure, a latency tax on regulated work, and a compliance blast radius that
      spans every boundary at once — and it would still not get a vendor-hosted agent, a Power Platform agent
      and a self-hosted workflow to route through the same code path. The wire contract is the standard, not
      the runtime.
    </Callout>

    <Section title="The central control plane" note="Five components. None of them in the request path.">
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Layer</th>
              <th>What it is</th>
              <th>Owned by</th>
            </tr>
          </thead>
          <tbody>
            {model.controlPlane.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>{c.name}</td>
                <td>{titleCase(c.layer)}</td>
                <td>
                  {c.summary}
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{c.implementation}</div>
                  {c.note && (
                    <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-primary)' }}>{c.note}</div>
                  )}
                </td>
                <td>{c.ownedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="Federated runtimes" note="Each keeps its own native LLMOps and redacts at source.">
      <div className="grid grid--3">
        {model.runtimes.map((r) => (
          <button className="card" key={r.id} onClick={() => go({ view: 'runtime', id: r.id })}>
            <h2>{r.name}</h2>
            <div className="chiprow" style={{ margin: '8px 0' }}>
              <span className="chip">{r.cloud}</span>
              <span className="chip">{r.hosts.length} agent(s)</span>
              {r.gxpBoundary && <span className="chip">GxP boundary</span>}
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
              <strong>Native:</strong> {r.telemetry.native}
            </p>
          </button>
        ))}
      </div>
    </Section>

    <Section title="Controls" note="A control nobody can evidence from telemetry or CI is a policy statement, not a control.">
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Control</th>
              <th>Statement</th>
              <th>How conformance is proven</th>
              <th>Agents</th>
            </tr>
          </thead>
          <tbody>
            {model.controls.map((c) => {
              const users = model.agents.filter((a) => a.governance.controls.includes(c.id));
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 550 }}>
                    {c.name}
                    <div className="muted" style={{ fontSize: 11.5, fontWeight: 400, marginTop: 2 }}>
                      {c.regulatoryBasis.join(' · ')}
                    </div>
                  </td>
                  <td>{c.statement}</td>
                  <td className="muted">{c.verification}</td>
                  <td>
                    <div className="chiprow">
                      {users.map((a) => (
                        <button key={a.id} className="chip" style={{ cursor: 'pointer' }} onClick={() => go({ view: 'agent', id: a.id })}>
                          {a.shortName}
                        </button>
                      ))}
                      {users.length === 0 && <span className="muted">—</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="Conformance gaps" note="Agents missing a control that peers in the same regulatory class carry.">
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>GxP</th>
              <th>Missing controls</th>
            </tr>
          </thead>
          <tbody>
            {model.agents
              .filter((a) => a.governance.gxpRelevant)
              .map((a) => {
                const expected = ['ctl-hitl', 'ctl-audit-trail', 'ctl-eval-gate', 'ctl-payload-residency'];
                const missing = expected.filter((c) => !a.governance.controls.includes(c));
                return (
                  <tr key={a.id} className="is-clickable" onClick={() => go({ view: 'agent', id: a.id })}>
                    <td style={{ fontWeight: 550 }}>{a.name}</td>
                    <td>Yes</td>
                    <td>
                      {missing.length === 0 ? (
                        <span className="muted">None</span>
                      ) : (
                        <div className="chiprow">
                          {missing.map((m) => (
                            <span key={m} className="chip chip--serious">
                              {lk.control.get(m)?.name ?? m}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Section>
  </>
);
