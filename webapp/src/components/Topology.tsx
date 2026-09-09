import { useMemo, useState } from 'react';
import { Background, Controls, Position, ReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Model } from '../types';
import { frameworkColor } from '../lib';
import { go } from '../router';

type Kind = 'data' | 'control' | 'telemetry' | 'hosting';

const KINDS: { id: Kind; label: string; color: string }[] = [
  { id: 'data', label: 'Business data', color: 'var(--cat-1)' },
  { id: 'control', label: 'Control / handoff', color: 'var(--cat-2)' },
  { id: 'telemetry', label: 'Telemetry', color: 'var(--cat-3)' },
  { id: 'hosting', label: 'Hosted on', color: 'var(--text-muted)' },
];

const COL = { system: 0, agent: 460, runtime: 900, controlPlane: 1300 };
const ROW = 66;

/** Spread values apart in place, preserving order, so nodes never overlap. */
const declump = (ys: number[], gap: number): number[] => {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  let last = -Infinity;
  const out = new Array<number>(ys.length);
  for (const { y, i } of order) {
    const placed = Math.max(y, last + gap);
    out[i] = placed;
    last = placed;
  }
  return out;
};

const mean = (xs: number[], fallback: number) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : fallback);

/** The graph of operations, as a graph. Same nodes and edges the Phase 3
 *  roadmap describes — systems, agents, runtimes, control plane.
 *
 *  Layout is a single barycentric pass: order the systems by the agents that
 *  touch them, then pull each agent to the middle of its systems. It is not a
 *  full crossing-minimisation, but it turns the hairball into something a
 *  person can actually trace. */
export const Topology = ({ model }: { model: Model }) => {
  const [active, setActive] = useState<Set<Kind>>(new Set(['data', 'control', 'telemetry', 'hosting']));

  const toggle = (k: Kind) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const { nodes, edges } = useMemo(() => {
    const agentIndex = new Map(model.agents.map((a, i) => [a.id, i]));

    // Systems ordered by the agents that touch them, so the middle column's
    // edges mostly run flat instead of crossing the whole canvas.
    const systemKey = new Map(
      model.systems.map((s) => {
        const touching = model.agents.filter((a) => a.interfaces.systems.includes(s.id)).map((a) => agentIndex.get(a.id)!);
        return [s.id, touching.length ? mean(touching, 0) : Number.POSITIVE_INFINITY];
      }),
    );
    const systems = [...model.systems].sort(
      (a, b) => (systemKey.get(a.id)! - systemKey.get(b.id)!) || a.name.localeCompare(b.name),
    );
    const systemY = new Map(systems.map((s, i) => [s.id, i * ROW]));

    const agentYRaw = model.agents.map((a) =>
      mean(a.interfaces.systems.map((s) => systemY.get(s) ?? 0), (systems.length * ROW) / 2),
    );
    const agentY = declump(agentYRaw, 130);
    const agentYById = new Map(model.agents.map((a, i) => [a.id, agentY[i]]));

    const runtimeYRaw = model.runtimes.map((r) => mean(r.hosts.map((h) => agentYById.get(h) ?? 0), 0));
    const runtimeY = declump(runtimeYRaw, 150);

    const style = (bg: string, fg = 'var(--surface-1)') => ({
      background: bg,
      color: fg,
      border: '1px solid var(--line)',
      borderRadius: 6,
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 550,
      width: 250,
      textAlign: 'left' as const,
    });

    const ns: Node[] = [
      ...systems.map((s) => ({
        id: s.id,
        position: { x: COL.system, y: systemY.get(s.id)! },
        data: { label: s.name, kind: 'system' },
        style: style('var(--surface-2)', 'var(--text-primary)'),
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
      ...model.agents.map((a, i) => ({
        id: a.id,
        position: { x: COL.agent, y: agentY[i] },
        data: { label: a.shortName, kind: 'agent' },
        style: style(frameworkColor(a.platform.framework)),
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
      ...model.runtimes.map((r, i) => ({
        id: r.id,
        position: { x: COL.runtime, y: runtimeY[i] },
        data: { label: r.name, kind: 'runtime' },
        style: style('var(--surface-2)', 'var(--text-primary)'),
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
      ...model.controlPlane.map((c, i) => ({
        id: c.id,
        position: { x: COL.controlPlane, y: i * 90 + 40 },
        data: { label: c.name, kind: 'controlPlane' },
        style: { ...style('var(--surface-1)', 'var(--text-primary)'), borderStyle: 'dashed' },
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      })),
    ];

    const colorOf = (k: Kind) => KINDS.find((x) => x.id === k)!.color;

    const es: Edge[] = [
      ...model.flows.map((f) => ({
        id: f.id,
        source: f.from,
        target: f.to,
        type: 'smoothstep',
        // Business-data edges are the dense layer; their labels overplot into
        // noise, so the payload lives in the hover title and the system page.
        label: f.kind === 'data' ? undefined : f.label,
        hidden: !active.has(f.kind),
        animated: f.kind === 'telemetry',
        style: {
          stroke: colorOf(f.kind),
          strokeWidth: f.criticality === 'critical' ? 1.75 : 1.1,
          strokeOpacity: f.kind === 'data' ? 0.55 : 0.9,
          strokeDasharray: f.health === 'degraded' ? '5 4' : undefined,
        },
        labelStyle: { fontSize: 10, fill: 'var(--text-secondary)' },
        labelBgStyle: { fill: 'var(--surface-1)' },
      })),
      // "hosted on" is derived from each manifest, not a data flow — shown as
      // its own layer so the infrastructure story is visible without
      // pretending it is an integration.
      ...model.agents.map((a) => ({
        id: `host-${a.id}`,
        source: a.id,
        target: a.platform.runtime,
        type: 'smoothstep',
        hidden: !active.has('hosting'),
        style: { stroke: colorOf('hosting'), strokeWidth: 1, strokeDasharray: '3 3' },
      })),
    ];

    return { nodes: ns, edges: es };
  }, [model, active]);

  return (
    <div>
      <div className="chiprow" style={{ marginBottom: 12 }}>
        {KINDS.map((k) => (
          <button
            key={k.id}
            className="chip"
            aria-pressed={active.has(k.id)}
            onClick={() => toggle(k.id)}
            style={{ opacity: active.has(k.id) ? 1 : 0.42, cursor: 'pointer' }}
          >
            <span className="chip__swatch" style={{ background: k.color }} aria-hidden />
            {k.label}
          </button>
        ))}
        <span className="muted" style={{ fontSize: 12 }}>
          Dashed edge = degraded integration. Click any node to open it.
        </span>
      </div>
      <div style={{ height: 680, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-1)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.15}
          onNodeClick={(_, n) => {
            const kind = (n.data as { kind?: string }).kind;
            if (kind === 'system' || kind === 'agent' || kind === 'runtime') go({ view: kind, id: n.id } as never);
          }}
        >
          <Background gap={22} color="var(--line-soft)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};
