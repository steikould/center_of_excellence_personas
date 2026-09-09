import type { Model, Runtime } from '../types';
import type { Lookups } from '../lib';
import { frameworkColor, frameworkLabel } from '../lib';
import { DefList, Link, Section, SeedFlag } from '../components/primitives';

const LAYERS: { key: keyof Pick<Runtime, 'compute' | 'identity' | 'network' | 'data' | 'secrets'>; label: string }[] = [
  { key: 'compute', label: 'Compute' },
  { key: 'identity', label: 'Identity' },
  { key: 'network', label: 'Network' },
  { key: 'data', label: 'Data' },
  { key: 'secrets', label: 'Secrets' },
];

export const RuntimeView = ({ runtime, model, lk }: { runtime: Runtime; model: Model; lk: Lookups }) => {
  const r = runtime;
  const hosted = r.hosts.map((id) => lk.agent.get(id)!).filter(Boolean);
  const sink = lk.controlPlane.get(r.telemetry.exportsTo);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Runtime · IT infrastructure</div>
        <h1>{r.name}</h1>
        <p className="lede">{r.summary}</p>
        <div className="chiprow" style={{ marginTop: 12 }}>
          <span className="chip">{r.cloud}</span>
          <span className="chip">{r.region}</span>
          <span className="chip">Operated by {r.operator}</span>
          {r.gxpBoundary && <span className="chip">Inside the GxP boundary</span>}
          <SeedFlag confidence={r.confidence} />
        </div>
      </div>

      <Section title="Infrastructure layers">
        <div className="grid grid--2">
          {LAYERS.map((l) => (
            <div className="card" key={l.key}>
              <h3>{l.label}</h3>
              <ul className="plain" style={{ fontSize: 13 }}>
                {r[l.key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Telemetry path"
        note="Redaction happens here, inside the boundary — not centrally. That is the whole point of the federated design."
      >
        <div className="card">
          <DefList
            items={[
              ['Native LLMOps', r.telemetry.native],
              ['Wire format', r.telemetry.wire],
              ['Redaction point', r.telemetry.redactionPoint],
              [
                'Exports to',
                sink ? `${sink.name} — ${sink.summary}` : 'Nothing. This runtime is not reporting centrally.',
              ],
            ]}
          />
        </div>
      </Section>

      <Section title="Agents hosted here">
        <div className="grid grid--2">
          {hosted.map((a) => (
            <div className="card" key={a.id}>
              <div className="chiprow" style={{ marginBottom: 6 }}>
                <span className="chip">
                  <span className="chip__swatch" style={{ background: frameworkColor(a.platform.framework) }} aria-hidden />
                  {frameworkLabel(a.platform.framework)}
                </span>
                <span className="chip">v{a.version}</span>
              </div>
              <h2>
                <Link to={{ view: 'agent', id: a.id }}>{a.name}</Link>
              </h2>
              <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>{a.oneLiner}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Telemetry flows out of this runtime">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>What moves</th>
                <th>Protocol</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {model.flows
                .filter((f) => f.from === r.id)
                .map((f) => (
                  <tr key={f.id}>
                    <td>{lk.controlPlane.get(f.to)?.name ?? f.to}</td>
                    <td>{f.label}</td>
                    <td className="mono">{f.protocol}</td>
                    <td>{f.frequency}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};
