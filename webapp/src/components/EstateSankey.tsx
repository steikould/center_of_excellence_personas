import { useMemo } from 'react';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import type { Model } from '../types';
import { frameworkColor, frameworkLabel, usd } from '../lib';
import { go } from '../router';
import { TipRow, TipTitle, useTooltip } from './Tooltip';

interface N {
  id: string;
  label: string;
  kind: 'domain' | 'agent' | 'runtime';
  framework?: string;
  sub: string;
  x0?: number; x1?: number; y0?: number; y1?: number;
}
interface L {
  source: number | N;
  target: number | N;
  value: number;
  framework: string;
  width?: number;
}

const WIDTH = 1060;
const HEIGHT = 420;
const M = { top: 16, right: 210, bottom: 16, left: 150 };

/** The one picture that carries the whole story: which business domain the money
 *  sits in, which agent is doing that work, and which runtime it actually
 *  executes on. Business and infrastructure on a single canvas — three columns,
 *  one flow, every node a drill-down. */
export const EstateSankey = ({ model }: { model: Model }) => {
  const { show, hide, node: tipNode } = useTooltip();

  const graph = useMemo(() => {
    const nodes: N[] = [];
    const index = new Map<string, number>();
    const push = (n: N) => {
      index.set(n.id, nodes.length);
      nodes.push(n);
      return nodes.length - 1;
    };

    for (const d of model.domains) {
      if (d.derived.benefitUsd > 0) push({ id: d.id, label: d.shortName, kind: 'domain', sub: d.name });
    }
    for (const a of model.agents) {
      push({
        id: a.id,
        label: a.shortName,
        kind: 'agent',
        framework: a.platform.framework,
        sub: `${a.name} · v${a.version}`,
      });
    }
    for (const r of model.runtimes) {
      const fw = model.agents.find((a) => a.platform.runtime === r.id)?.platform.framework;
      push({ id: r.id, label: r.name.split(' — ')[0], kind: 'runtime', framework: fw, sub: `${r.cloud} · ${r.region}` });
    }

    const links: L[] = [];
    for (const a of model.agents) {
      const v = Math.max(a.economics.annualBenefitUsd, 1);
      const d = index.get(a.business.domain);
      const ai = index.get(a.id);
      const r = index.get(a.platform.runtime);
      if (d != null && ai != null) links.push({ source: d, target: ai, value: v, framework: a.platform.framework });
      if (ai != null && r != null) links.push({ source: ai, target: r, value: v, framework: a.platform.framework });
    }

    return sankey<N, L>()
      .nodeWidth(13)
      .nodePadding(18)
      .nodeAlign(sankeyJustify)
      .extent([
        [M.left, M.top],
        [WIDTH - M.right, HEIGHT - M.bottom],
      ])({ nodes: nodes.map((n) => ({ ...n })), links: links.map((l) => ({ ...l })) });
  }, [model]);

  const path = sankeyLinkHorizontal<N, L>();

  return (
    <>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="img" aria-label="Business domain to agent to runtime, sized by attributed annual benefit">
        <g>
          {graph.links.map((l, i) => (
            <path
              key={i}
              d={path(l) ?? undefined}
              fill="none"
              stroke={frameworkColor(l.framework)}
              strokeOpacity={0.26}
              strokeWidth={Math.max(1.5, l.width ?? 1)}
              onMouseMove={(e) =>
                show(
                  e,
                  <>
                    <TipTitle>
                      {(l.source as N).label} → {(l.target as N).label}
                    </TipTitle>
                    <TipRow label="Attributed benefit" value={usd(l.value)} />
                    <TipRow label="Framework" value={frameworkLabel(l.framework)} />
                  </>,
                )
              }
              onMouseLeave={hide}
            />
          ))}
        </g>
        <g>
          {graph.nodes.map((n) => {
            const h = (n.y1 ?? 0) - (n.y0 ?? 0);
            const isRight = n.kind === 'runtime';
            const fill = n.framework ? frameworkColor(n.framework) : 'var(--text-secondary)';
            return (
              <g
                key={n.id}
                style={{ cursor: 'pointer' }}
                onClick={() => go({ view: n.kind, id: n.id } as never)}
                onMouseMove={(e) =>
                  show(
                    e,
                    <>
                      <TipTitle>{n.sub}</TipTitle>
                      <TipRow label="Attributed benefit" value={usd((n as unknown as { value: number }).value)} />
                      {n.framework && <TipRow label="Framework" value={frameworkLabel(n.framework)} />}
                      <div className="tip__row" style={{ marginTop: 4 }}>
                        <span>Click to open</span>
                      </div>
                    </>,
                  )
                }
                onMouseLeave={hide}
              >
                <rect x={n.x0} y={n.y0} width={(n.x1 ?? 0) - (n.x0 ?? 0)} height={Math.max(h, 2)} rx={3} fill={fill} />
                {/* 2px surface ring keeps abutting nodes from reading as one mark */}
                <rect
                  x={n.x0}
                  y={n.y0}
                  width={(n.x1 ?? 0) - (n.x0 ?? 0)}
                  height={Math.max(h, 2)}
                  rx={3}
                  fill="none"
                  stroke="var(--surface-1)"
                  strokeWidth={2}
                />
                <text
                  x={isRight ? (n.x1 ?? 0) + 10 : (n.x0 ?? 0) - 10}
                  y={(n.y0 ?? 0) + h / 2}
                  textAnchor={isRight ? 'start' : 'end'}
                  dominantBaseline="middle"
                  fontSize={12}
                  fontWeight={550}
                  fill="var(--text-primary)"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
        <g fontSize={10.5} fontWeight={600} fill="var(--text-muted)" letterSpacing="0.06em">
          <text x={M.left - 10} y={10} textAnchor="end">BUSINESS DOMAIN</text>
          <text x={WIDTH / 2} y={10} textAnchor="middle">AGENT</text>
          <text x={WIDTH - M.right + 10} y={10} textAnchor="start">RUNTIME</text>
        </g>
      </svg>
      {tipNode}
    </>
  );
};
