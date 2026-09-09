import { useEffect, useMemo, useState } from 'react';
import type { Model } from './types';
import { buildLookups } from './lib';
import { go, href, useRoute, type Route } from './router';
import { Portfolio } from './views/Portfolio';
import { DomainView } from './views/DomainView';
import { CapabilityView } from './views/CapabilityView';
import { AgentView } from './views/AgentView';
import { SystemView } from './views/SystemView';
import { RuntimeView } from './views/RuntimeView';
import { Governance } from './views/Governance';
import { Topology } from './components/Topology';
import { Section } from './components/primitives';

type Theme = 'light' | 'dark' | 'system';

const readTheme = (): Theme => {
  try {
    const v = localStorage.getItem('atlas-theme');
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* private mode, blocked storage — the system default is a fine answer */
  }
  return 'system';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    try {
      if (theme === 'system') localStorage.removeItem('atlas-theme');
      else localStorage.setItem('atlas-theme', theme);
    } catch {
      /* nothing to persist to; the in-memory choice still applies */
    }
  }, [theme]);

  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
  return (
    <button className="chip" style={{ cursor: 'pointer' }} onClick={() => setTheme(next[theme])} title="Cycle theme">
      {{ system: 'Theme: auto', light: 'Theme: light', dark: 'Theme: dark' }[theme]}
    </button>
  );
};

const Crumbs = ({ trail }: { trail: { label: string; route?: Route }[] }) => (
  <nav className="crumbs" aria-label="Breadcrumb">
    {trail.map((c, i) => (
      <span key={`${c.label}-${i}`} style={{ display: 'contents' }}>
        {i > 0 && <span className="crumbs__sep" aria-hidden>›</span>}
        {c.route ? (
          <button onClick={() => go(c.route!)}>{c.label}</button>
        ) : (
          <span className="crumbs__current">{c.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export const App = () => {
  const route = useRoute();
  const [model, setModel] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}model.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.statusText}`))))
      .then(setModel)
      .catch((e: Error) => setError(e.message));
  }, []);

  const lk = useMemo(() => (model ? buildLookups(model) : null), [model]);

  if (error)
    return (
      <main className="main">
        <h1>Model not loaded</h1>
        <p className="lede">
          <code>model.json</code> could not be fetched ({error}). Run <code className="mono">npm run model</code> to
          compile <code className="mono">model/*.yaml</code>.
        </p>
      </main>
    );
  if (!model || !lk) return <main className="main"><p className="muted">Loading the estate…</p></main>;

  const home: { label: string; route?: Route } = { label: 'Estate', route: { view: 'portfolio' } };
  let trail: { label: string; route?: Route }[] = [home];
  let body = <Portfolio model={model} />;

  switch (route.view) {
    case 'domain': {
      const d = lk.domain.get(route.id);
      if (d) {
        trail = [home, { label: d.shortName }];
        body = <DomainView domain={d} model={model} lk={lk} />;
      }
      break;
    }
    case 'capability': {
      const c = lk.capability.get(route.id);
      if (c) {
        const d = lk.domain.get(c.domain)!;
        trail = [home, { label: d.shortName, route: { view: 'domain', id: d.id } }, { label: c.name }];
        body = <CapabilityView capability={c} lk={lk} />;
      }
      break;
    }
    case 'agent': {
      const a = lk.agent.get(route.id);
      if (a) {
        const d = lk.domain.get(a.business.domain)!;
        trail = [home, { label: d.shortName, route: { view: 'domain', id: d.id } }, { label: a.shortName }];
        body = <AgentView agent={a} lk={lk} />;
      }
      break;
    }
    case 'system': {
      const s = lk.system.get(route.id);
      if (s) {
        trail = [home, { label: 'Systems', route: { view: 'topology' } }, { label: s.name }];
        body = <SystemView system={s} model={model} lk={lk} />;
      }
      break;
    }
    case 'runtime': {
      const r = lk.runtime.get(route.id);
      if (r) {
        trail = [home, { label: 'Operating model', route: { view: 'governance' } }, { label: r.name }];
        body = <RuntimeView runtime={r} model={model} lk={lk} />;
      }
      break;
    }
    case 'governance':
      trail = [home, { label: 'Operating model' }];
      body = <Governance model={model} lk={lk} />;
      break;
    case 'topology':
      trail = [home, { label: 'Graph of operations' }];
      body = (
        <>
          <div className="page-head">
            <div className="eyebrow">Integration topology</div>
            <h1>Graph of operations</h1>
            <p className="lede">
              Every system, agent, runtime and control-plane component, and every edge between them. Business
              data, control handoffs and telemetry are separate layers — toggle them to see one story at a time.
            </p>
          </div>
          <Section title="" >
            <Topology model={model} />
          </Section>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a className="topbar__mark" href={href({ view: 'portfolio' })} style={{ textDecoration: 'none', color: 'inherit' }}>
          Agent Atlas <span>/ AI CoE</span>
        </a>
        <Crumbs trail={trail} />
        <span className="topbar__spacer" />
        <button className="chip" style={{ cursor: 'pointer' }} onClick={() => go({ view: 'topology' })}>
          Graph of operations
        </button>
        <button className="chip" style={{ cursor: 'pointer' }} onClick={() => go({ view: 'governance' })}>
          Operating model
        </button>
        <ThemeToggle />
      </header>
      <main className="main">{body}</main>
    </div>
  );
};
