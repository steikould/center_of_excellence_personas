/** Rules for creating new elements: what can go where, and how ids are minted. */

export const TYPE_META = {
  BusinessDomain: { lens: "business", level: "B1", prefix: "bd" },
  Capability: { lens: "business", level: "B2", prefix: "cap" },
  Process: { lens: "business", level: "B3", prefix: "proc" },
  Activity: { lens: "business", level: "B4", prefix: "act" },
  Application: { lens: "it", level: "T1", prefix: "app" },
  ExternalService: { lens: "it", level: "T1", prefix: "svc" },
  DeployableUnit: { lens: "it", level: "T2", prefix: "du" },
  DataStore: { lens: "it", level: "T2", prefix: "ds" },
  Interface: { lens: "it", level: "T3", prefix: "if" },
  IntegrationFlow: { lens: "it", level: "T3", prefix: "flow" },
  PlatformService: { lens: "it", level: "T4", prefix: "plat" },
  Environment: { lens: "it", level: "T4", prefix: "env" },
  Host: { lens: "it", level: "T5", prefix: "host" },
  Cluster: { lens: "it", level: "T5", prefix: "cluster" },
  NetworkZone: { lens: "it", level: "T5", prefix: "net" },
  Site: { lens: "it", level: "T5", prefix: "site" },
};

/** What a given element is allowed to contain. Empty means it is a leaf. */
export const CHILD_TYPES = {
  BusinessDomain: ["Capability"],
  Capability: ["Process"],
  Process: ["Activity"],
  Application: ["DeployableUnit", "DataStore", "Interface"],
  Environment: ["Host", "Cluster", "PlatformService"],
  Site: ["NetworkZone"],
};

export function canContain(node) {
  return Boolean(node && (CHILD_TYPES[node.type] || []).length);
}

export function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60)
    || "element";
}

/** A readable id that does not collide with anything already in the model. */
export function mintId(model, type, name) {
  const prefix = TYPE_META[type]?.prefix || "node";
  const base = `${prefix}-${slugify(name)}`;
  if (!model.has(base)) return base;
  let n = 2;
  while (model.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Continue the parent's numbering, e.g. 5.5 -> 5.5.4 for its fourth child. */
export function nextCode(model, parent) {
  if (!parent || !parent.code) return "";
  const siblings = model.children(parent.id).length;
  return `${parent.code}.${siblings + 1}`;
}

export function buildNode(model, { type, name, description, owner, lifecycle, criticality, health, parent }) {
  const meta = TYPE_META[type];
  if (!meta) throw new Error(`Unknown element type "${type}".`);
  return {
    id: mintId(model, type, name),
    type,
    lens: meta.lens,
    level: meta.level,
    name: name.trim(),
    description: (description || "").trim(),
    code: meta.lens === "business" ? nextCode(model, parent) : "",
    owner: (owner || "").trim(),
    lifecycle: lifecycle || "plan",
    criticality: criticality || "medium",
    health: health || "unknown",
    maturity: 0,
    tags: [],
    props: {},
    externalRefs: {},
  };
}
