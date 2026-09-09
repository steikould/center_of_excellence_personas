import { useEffect, useState } from 'react';

/** Drill state lives in the URL so any level of the atlas can be linked to,
 *  pasted into a deck, or bookmarked. That matters more than it sounds: the
 *  audience for this thing forwards links, they do not re-navigate. */
export type Route =
  | { view: 'portfolio' }
  | { view: 'domain'; id: string }
  | { view: 'capability'; id: string }
  | { view: 'agent'; id: string }
  | { view: 'system'; id: string }
  | { view: 'runtime'; id: string }
  | { view: 'topology' }
  | { view: 'governance' };

const VIEWS_WITH_ID = ['domain', 'capability', 'agent', 'system', 'runtime'] as const;

export const parseHash = (hash: string): Route => {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [view, id] = parts;
  if (!view) return { view: 'portfolio' };
  if (view === 'topology' || view === 'governance') return { view };
  if (id && (VIEWS_WITH_ID as readonly string[]).includes(view)) {
    return { view, id } as Route;
  }
  return { view: 'portfolio' };
};

export const href = (r: Route): string =>
  'id' in r ? `#/${r.view}/${r.id}` : r.view === 'portfolio' ? '#/' : `#/${r.view}`;

export const go = (r: Route): void => {
  window.location.hash = href(r);
};

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
};
