/**
 * Graph model: a typed property graph over the business and IT lenses.
 *
 * Everything the views need is derived here, so this module stays free of DOM
 * and can be exercised directly from Node (see app/tools/verify.mjs).
 */

export const BUSINESS_LEVELS = ["B1", "B2", "B3", "B4"];
export const IT_LEVELS = ["T1", "T2", "T3", "T4", "T5"];

export const LEVEL_LABELS = {
  B1: "Business domain",
  B2: "Capability",
  B3: "Process",
  B4: "Activity",
  T1: "Application & service landscape",
  T2: "Application internals",
  T3: "Integration & data",
  T4: "Platform & runtime",
  T5: "Infrastructure & network",
};

/**
 * "X depends on Y" is the spine of both impact analysis and the technology
 * chain. Following an out-edge of these types leads to something the node
 * depends on; following an in-edge of these types does the same.
 */
const DEP_OUT = new Set(["contains", "runs_on", "hosted_in", "reads", "stores", "depends_on"]);
const DEP_IN = new Set(["realizes", "connects_to", "supports"]);

const EMPTY = Object.freeze([]);

export function buildModel(nodesDoc, edgesDoc) {
  const nodes = new Map();
  const outEdges = new Map();
  const inEdges = new Map();
  const byType = new Map();
  const byLevel = new Map();
  const searchIndex = new Map();

  for (const raw of nodesDoc.nodes) {
    const n = normalizeNode(raw);
    nodes.set(n.id, n);
    push(byType, n.type, n.id);
    push(byLevel, n.level, n.id);
    searchIndex.set(n.id, [n.name, n.description, n.owner, n.code, n.type, n.tags.join(" "),
      Object.values(n.props || {}).filter((v) => typeof v === "string").join(" ")]
      .join(" ").toLowerCase());
  }

  const edges = new Map();
  for (const raw of edgesDoc.edges) {
    const e = normalizeEdge(raw);
    if (!nodes.has(e.from) || !nodes.has(e.to)) continue; // tolerate partial imports
    edges.set(e.id, e);
    push(outEdges, e.from, e);
    push(inEdges, e.to, e);
  }

  const parentOf = new Map();
  for (const e of edges.values()) {
    if (e.type === "contains" && !parentOf.has(e.to)) parentOf.set(e.to, e.from);
  }

  const model = {
    meta: { version: nodesDoc.version || "1.0", name: nodesDoc.model || "Enterprise model" },
    nodes, edges, byType, byLevel, parentOf,

    node: (id) => nodes.get(id),
    has: (id) => nodes.has(id),
    all: () => [...nodes.values()],
    out: (id) => outEdges.get(id) || EMPTY,
    in: (id) => inEdges.get(id) || EMPTY,
    ofType: (type) => (byType.get(type) || EMPTY).map((id) => nodes.get(id)),
    ofLevel: (level) => (byLevel.get(level) || EMPTY).map((id) => nodes.get(id)),
    parent: (id) => nodes.get(parentOf.get(id)),
    haystack: (id) => searchIndex.get(id) || "",
  };

  model.children = (id) => (outEdges.get(id) || EMPTY)
    .filter((e) => e.type === "contains")
    .map((e) => nodes.get(e.to))
    .filter(Boolean);

  /** Root-first list of ancestors, not including the node itself. */
  model.ancestors = (id) => {
    const out = [];
    const seen = new Set([id]);
    let cur = parentOf.get(id);
    while (cur && nodes.has(cur) && !seen.has(cur)) {
      out.unshift(nodes.get(cur));
      seen.add(cur);
      cur = parentOf.get(cur);
    }
    return out;
  };

  /** Root-first list of ancestors plus the node itself - the breadcrumb trail. */
  model.trail = (id) => (nodes.has(id) ? [...model.ancestors(id), nodes.get(id)] : []);

  /** Every node contained beneath `id`, self included. */
  model.subtree = (id) => {
    const out = [];
    const stack = [id];
    const seen = new Set();
    while (stack.length) {
      const cur = stack.pop();
      if (seen.has(cur) || !nodes.has(cur)) continue;
      seen.add(cur);
      out.push(nodes.get(cur));
      for (const e of outEdges.get(cur) || EMPTY) if (e.type === "contains") stack.push(e.to);
    }
    return out;
  };

  model.dependencies = (id) => neighborsBy(id, outEdges, inEdges, DEP_OUT, DEP_IN);
  model.dependents = (id) => neighborsBy(id, outEdges, inEdges, DEP_IN, DEP_OUT);

  /**
   * Breadth-first closure over dependencies or dependents.
   * Returns nodes with the distance at which each was first reached.
   */
  model.closure = (startIds, direction, options = {}) => {
    const step = direction === "up" ? model.dependents : model.dependencies;
    const limit = options.limit || 20000;
    const stopTypes = options.stopTypes || null;
    const seen = new Map();
    let frontier = [...new Set(startIds)].filter((id) => nodes.has(id));
    frontier.forEach((id) => seen.set(id, 0));
    let depth = 0;
    while (frontier.length && seen.size < limit) {
      depth += 1;
      const next = [];
      for (const id of frontier) {
        for (const nid of step(id)) {
          if (seen.has(nid)) continue;
          seen.set(nid, depth);
          if (stopTypes && stopTypes.has(nodes.get(nid).type)) continue;
          next.push(nid);
        }
      }
      frontier = next;
    }
    if (!options.includeStart) startIds.forEach((id) => seen.delete(id));
    return [...seen].map(([id, distance]) => ({ node: nodes.get(id), distance }));
  };

  /**
   * Applications supporting a business node. `direct` are attached to the node
   * or anything beneath it; `inherited` are attached to an ancestor and so
   * cover this node too.
   */
  model.applicationsFor = (businessId) => {
    const scope = new Set(model.subtree(businessId).map((n) => n.id));
    const direct = new Map();
    const inherited = new Map();
    for (const id of scope) {
      for (const e of inEdges.get(id) || EMPTY) {
        if (e.type !== "supports") continue;
        const app = nodes.get(e.from);
        if (app && !direct.has(app.id)) direct.set(app.id, { app, target: nodes.get(id) });
      }
    }
    for (const anc of model.ancestors(businessId)) {
      for (const e of inEdges.get(anc.id) || EMPTY) {
        if (e.type !== "supports") continue;
        const app = nodes.get(e.from);
        if (app && !direct.has(app.id) && !inherited.has(app.id)) {
          inherited.set(app.id, { app, target: anc });
        }
      }
    }
    return { direct: [...direct.values()], inherited: [...inherited.values()] };
  };

  /** Business nodes an IT node ultimately serves, with the applications between. */
  model.businessFor = (itId) => {
    const reached = model.closure([itId], "up", { includeStart: true });
    const apps = reached.filter((r) => r.node.type === "Application").map((r) => r.node);
    const targets = new Map();
    for (const app of apps) {
      for (const e of outEdges.get(app.id) || EMPTY) {
        if (e.type !== "supports") continue;
        const target = nodes.get(e.to);
        if (!target) continue;
        if (!targets.has(target.id)) targets.set(target.id, { node: target, via: [] });
        targets.get(target.id).via.push(app);
      }
    }
    return { applications: apps, targets: [...targets.values()] };
  };

  /** Every IT element a business node transitively depends on. */
  model.technologyChain = (businessId) => {
    const reached = model.closure([businessId], "down", {});
    return reached.filter((r) => r.node.lens === "it");
  };

  /** IT nodes in scope for a business node, grouped by IT level. */
  model.itScope = (businessId) => {
    const chain = model.technologyChain(businessId);
    const byLvl = {};
    for (const lvl of IT_LEVELS) byLvl[lvl] = [];
    for (const { node } of chain) if (byLvl[node.level]) byLvl[node.level].push(node);
    for (const lvl of IT_LEVELS) byLvl[lvl].sort(byName);
    return byLvl;
  };

  /** Impact analysis: what breaks upstream if this IT node fails. */
  model.impactOf = (itId) => {
    const reached = model.closure([itId], "up", {});
    const business = reached.filter((r) => r.node.lens === "business");
    const it = reached.filter((r) => r.node.lens === "it");
    const grouped = {};
    for (const lvl of BUSINESS_LEVELS) grouped[lvl] = [];
    const seenBusiness = new Set();
    for (const { node } of business) {
      if (grouped[node.level] && !seenBusiness.has(node.id)) { grouped[node.level].push(node); seenBusiness.add(node.id); }
    }
    // An affected process drags its own activities with it.
    for (const proc of [...grouped.B3]) {
      for (const child of model.children(proc.id)) {
        if (child.level === "B4" && !seenBusiness.has(child.id)) { grouped.B4.push(child); seenBusiness.add(child.id); }
      }
    }
    for (const lvl of BUSINESS_LEVELS) grouped[lvl].sort(byName);
    return {
      business: grouped,
      applications: it.filter((r) => r.node.type === "Application").map((r) => r.node).sort(byName),
      it: it.map((r) => r.node),
      counts: {
        domains: grouped.B1.length, capabilities: grouped.B2.length,
        processes: grouped.B3.length, activities: grouped.B4.length,
      },
    };
  };

  /** Capability/process to application matrix, with redundancy and gap flags. */
  model.matrix = (level = "B2", scopeId = null) => {
    const scopeIds = scopeId ? new Set(model.subtree(scopeId).map((n) => n.id)) : null;
    const rows = model.ofLevel(level)
      .filter((n) => !scopeIds || scopeIds.has(n.id))
      .sort((a, b) => (a.code || "").localeCompare(b.code || "", undefined, { numeric: true }) || byName(a, b));
    const appIds = new Set();
    const cells = new Map();
    for (const row of rows) {
      const { direct, inherited } = model.applicationsFor(row.id);
      const list = [...direct.map((d) => ({ app: d.app, inherited: false })),
        ...inherited.map((d) => ({ app: d.app, inherited: true }))];
      cells.set(row.id, list);
      list.forEach((entry) => appIds.add(entry.app.id));
    }
    const applications = [...appIds].map((id) => nodes.get(id))
      .sort((a, b) => byName(a, b));
    const redundant = rows.filter((r) => cells.get(r.id).filter((c) => !c.inherited).length > 1);
    const gaps = rows.filter((r) => cells.get(r.id).length === 0);
    return { rows, applications, cells, redundant, gaps };
  };

  /** Model hygiene findings for the data-quality panel. */
  model.quality = () => {
    const apps = model.ofType("Application");
    const orphanApplications = apps.filter((a) => !model.out(a.id).some((e) => e.type === "supports"));
    const unsupported = [...model.ofLevel("B2"), ...model.ofLevel("B3")]
      .filter((n) => model.applicationsFor(n.id).direct.length === 0
        && model.applicationsFor(n.id).inherited.length === 0);
    const redundancy = model.ofLevel("B3").map((n) => ({ node: n, apps: model.applicationsFor(n.id).direct.map((d) => d.app) }))
      .filter((r) => r.apps.length > 1);
    const noOwner = model.all().filter((n) => !n.owner || n.owner === "Unassigned");
    const sharedStores = model.ofType("DataStore").map((ds) => {
      const readers = model.in(ds.id).filter((e) => e.type === "reads" || e.type === "stores")
        .map((e) => nodes.get(e.from)).filter(Boolean);
      const owningApps = new Set();
      for (const r of readers) {
        for (const e of model.out(r.id)) if (e.type === "realizes" && nodes.get(e.to)?.type === "Application") owningApps.add(e.to);
      }
      return { node: ds, applications: [...owningApps].map((id) => nodes.get(id)) };
    }).filter((s) => s.applications.length > 2);
    const retiredInUse = model.all().filter((n) => n.lifecycle === "retired"
      && model.in(n.id).some((e) => e.type === "depends_on" || e.type === "reads"));
    const danglingEdges = edgesDoc.edges.filter((e) => !nodes.has(e.from) || !nodes.has(e.to));
    return { orphanApplications, unsupported, redundancy, noOwner, sharedStores, retiredInUse, danglingEdges };
  };

  model.search = (query, filters = {}) => {
    const q = (query || "").trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    const results = [];
    for (const n of nodes.values()) {
      if (!matchesFilters(n, filters)) continue;
      if (terms.length) {
        const hay = searchIndex.get(n.id);
        if (!terms.every((t) => hay.includes(t))) continue;
      }
      results.push({ node: n, score: score(n, terms) });
    }
    results.sort((a, b) => b.score - a.score || byName(a.node, b.node));
    return results;
  };

  model.stats = () => ({
    nodes: nodes.size,
    edges: edges.size,
    byLens: {
      business: model.all().filter((n) => n.lens === "business").length,
      it: model.all().filter((n) => n.lens === "it").length,
    },
    applications: (byType.get("Application") || EMPTY).length,
  });

  return model;
}

export function matchesFilters(node, filters = {}) {
  if (filters.lifecycle?.size && !filters.lifecycle.has(node.lifecycle)) return false;
  if (filters.health?.size && !filters.health.has(node.health)) return false;
  if (filters.criticality?.size && !filters.criticality.has(node.criticality)) return false;
  if (filters.lens?.size && !filters.lens.has(node.lens)) return false;
  if (filters.type?.size && !filters.type.has(node.type)) return false;
  if (filters.owner && !(node.owner || "").toLowerCase().includes(filters.owner.toLowerCase())) return false;
  if (filters.environment?.size) {
    const envs = node.props?.environments || (node.props?.environment ? [node.props.environment] : []);
    if (!envs.some((e) => filters.environment.has(normalizeEnv(e)))) return false;
  }
  return true;
}

function normalizeEnv(value) {
  const v = String(value).toLowerCase();
  if (v.startsWith("prod")) return "production";
  if (v.startsWith("valid") || v.startsWith("uat")) return "validation";
  if (v.startsWith("dev") || v.startsWith("non")) return "development";
  return v;
}

function score(node, terms) {
  let s = { B1: 60, B2: 50, B3: 40, T1: 45 }[node.level] || 20;
  if (node.criticality === "critical") s += 8;
  const name = node.name.toLowerCase();
  for (const t of terms) {
    if (name === t) s += 100;
    else if (name.startsWith(t)) s += 40;
    else if (name.includes(t)) s += 20;
  }
  return s;
}

/**
 * Neighbours reached by following out-edges of `outTypes` and in-edges of
 * `inTypes`. Dependencies and dependents are the same walk with the two type
 * sets swapped, which keeps the two directions guaranteed symmetric.
 */
function neighborsBy(id, outEdges, inEdges, outTypes, inTypes) {
  const out = [];
  const seen = new Set();
  for (const e of outEdges.get(id) || EMPTY) {
    if (!outTypes.has(e.type) || seen.has(e.to)) continue;
    seen.add(e.to);
    out.push(e.to);
  }
  for (const e of inEdges.get(id) || EMPTY) {
    if (!inTypes.has(e.type) || seen.has(e.from)) continue;
    seen.add(e.from);
    out.push(e.from);
  }
  return out;
}

function byName(a, b) { return a.name.localeCompare(b.name); }

function push(map, key, value) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

export function normalizeNode(raw) {
  return {
    id: raw.id,
    type: raw.type,
    lens: raw.lens || (BUSINESS_LEVELS.includes(raw.level) ? "business" : "it"),
    level: raw.level,
    name: raw.name || raw.id,
    description: raw.description || "",
    code: raw.code || "",
    owner: raw.owner || "",
    lifecycle: raw.lifecycle || "active",
    criticality: raw.criticality || "medium",
    health: raw.health || "unknown",
    maturity: Number(raw.maturity) || 0,
    tags: Array.isArray(raw.tags) ? [...raw.tags] : [],
    props: raw.props ? { ...raw.props } : {},
    externalRefs: raw.externalRefs ? { ...raw.externalRefs } : {},
  };
}

export function normalizeEdge(raw) {
  return {
    id: raw.id || `${raw.from}|${raw.type}|${raw.to}`,
    type: raw.type,
    from: raw.from,
    to: raw.to,
    props: raw.props ? { ...raw.props } : {},
  };
}
