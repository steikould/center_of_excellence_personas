/**
 * Loads the model. The JSON files are the canonical interchange format; the
 * generated ES module carries the same content so the application also runs
 * from the file system, with no server and no external service.
 */
export async function loadSeed() {
  try {
    const [nodesRes, edgesRes] = await Promise.all([
      fetch(new URL("../data/nodes.json", import.meta.url)),
      fetch(new URL("../data/edges.json", import.meta.url)),
    ]);
    if (nodesRes.ok && edgesRes.ok) {
      return { nodes: await nodesRes.json(), edges: await edgesRes.json(), source: "json" };
    }
  } catch { /* falls through to the bundled module (file:// has no fetch) */ }

  const mod = await import("../data/seed-data.js");
  return { nodes: mod.NODES_DOCUMENT, edges: mod.EDGES_DOCUMENT, source: "module" };
}
