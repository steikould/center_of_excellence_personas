import type { ReactNode } from 'react';
import type { Confidence, Severity } from '../types';
import { severityIcon, severityLabel, statusColor } from '../lib';
import { go, type Route } from '../router';

export const Section = ({
  title,
  note,
  right,
  children,
}: {
  title: string;
  note?: string;
  right?: ReactNode;
  children: ReactNode;
}) => (
  <section className="section">
    <div className="section__head">
      <h2>{title}</h2>
      {note && <span className="section__note">{note}</span>}
      <span className="topbar__spacer" />
      {right}
    </div>
    {children}
  </section>
);

export const Stat = ({
  label,
  value,
  unit,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: ReactNode;
  tone?: Severity;
}) => (
  <div className="stat" style={tone ? { borderLeft: `3px solid ${statusColor(tone)}` } : undefined}>
    <div className="stat__label">{label}</div>
    <div className="stat__value">
      {value}
      {unit && <small>{unit}</small>}
    </div>
    {sub && <div className="stat__sub">{sub}</div>}
  </div>
);

export const SeverityChip = ({ severity, label }: { severity: Severity; label?: string }) => (
  <span className={`chip chip--${severity}`}>
    <span className="chip__dot" style={{ background: statusColor(severity) }} aria-hidden />
    <span aria-hidden>{severityIcon(severity)}</span>
    {label ?? severityLabel(severity)}
  </span>
);

export const Chip = ({ children, swatch }: { children: ReactNode; swatch?: string }) => (
  <span className="chip">
    {swatch && <span className="chip__swatch" style={{ background: swatch }} aria-hidden />}
    {children}
  </span>
);

export const Bar = ({ value, max = 100, color = 'var(--ord-2)' }: { value: number; max?: number; color?: string }) => (
  <div className="bar">
    <div
      className="bar__fill"
      style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color }}
    />
  </div>
);

export const DefList = ({ items }: { items: [string, ReactNode][] }) => (
  <dl className="deflist">
    {items.map(([k, v]) => (
      <div key={k} style={{ display: 'contents' }}>
        <dt>{k}</dt>
        <dd>{v}</dd>
      </div>
    ))}
  </dl>
);

export const Legend = ({ items }: { items: { label: string; color: string; outline?: boolean }[] }) => (
  <div className="legend">
    {items.map((i) => (
      <span className="legend__item" key={i.label}>
        <span
          className="legend__swatch"
          style={
            i.outline
              ? { background: 'transparent', border: '1.5px dashed var(--text-muted)' }
              : { background: i.color }
          }
          aria-hidden
        />
        {i.label}
      </span>
    ))}
  </div>
);

export const SeedFlag = ({ confidence }: { confidence: Confidence }) =>
  confidence === 'evidenced' ? null : (
    <span className="seedflag" title="Confidence marker from the model. Seed values are illustrative and unverified.">
      {confidence === 'seed' ? 'Seed data — not yet verified' : 'Declared, not evidenced'}
    </span>
  );

export const Link = ({ to, children }: { to: Route; children: ReactNode }) => (
  <button className="linkbtn" onClick={() => go(to)}>
    {children}
  </button>
);

export const Callout = ({ tone = 'warning', children }: { tone?: 'warning' | 'critical'; children: ReactNode }) => (
  <div className={tone === 'critical' ? 'callout callout--critical' : 'callout'}>{children}</div>
);
