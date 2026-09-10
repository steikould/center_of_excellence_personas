#!/usr/bin/env python3
"""Generate a synthetic model at an arbitrary scale, in the same format as the
demo dataset, so the application can be measured against the performance
requirement (~5,000 nodes / ~20,000 edges).

Usage:  python3 app/tools/scale_model.py OUT_DIR [--domains 15] [--apps 420]
"""
import argparse
import json
import os
import random

NODE_KEYS = ["id", "type", "lens", "level", "name", "description", "code", "owner",
             "lifecycle", "criticality", "health", "maturity", "tags", "props", "externalRefs"]
EDGE_KEYS = ["id", "type", "from", "to", "props"]

HEALTHS = ["ok", "ok", "ok", "watch", "at-risk"]
LIFECYCLES = ["active", "active", "active", "active", "phase-out", "plan"]
CRITICALITIES = ["low", "medium", "medium", "high", "critical"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--domains", type=int, default=15)
    ap.add_argument("--caps", type=int, default=6)
    ap.add_argument("--procs", type=int, default=6)
    ap.add_argument("--acts", type=int, default=2)
    ap.add_argument("--apps", type=int, default=420)
    ap.add_argument("--units", type=int, default=3)
    ap.add_argument("--flows", type=int, default=340)
    ap.add_argument("--extra-deps", type=int, default=6000)
    args = ap.parse_args()

    rng = random.Random(4242)
    nodes, edges = {}, {}

    def add(id, type, lens, level, name, desc, **kw):
        nodes[id] = dict(id=id, type=type, lens=lens, level=level, name=name, description=desc,
                         code=kw.get("code", ""), owner=kw.get("owner", "Owner %d" % rng.randint(1, 60)),
                         lifecycle=kw.get("lifecycle", rng.choice(LIFECYCLES)),
                         criticality=kw.get("criticality", rng.choice(CRITICALITIES)),
                         health=kw.get("health", rng.choice(HEALTHS)),
                         maturity=kw.get("maturity", 0), tags=kw.get("tags", []),
                         props=kw.get("props", {}), externalRefs={})

    def link(a, t, b, **props):
        if a in nodes and b in nodes:
            edges["%s|%s|%s" % (a, t, b)] = {"id": "%s|%s|%s" % (a, t, b), "type": t,
                                             "from": a, "to": b, "props": props}

    # ---- business lens -----------------------------------------------------
    procs = []
    for d in range(1, args.domains + 1):
        did = "bd-%02d" % d
        add(did, "BusinessDomain", "business", "B1", "Domain %d" % d,
            "Synthetic business domain %d used for scale testing." % d,
            code="%d.0" % d, criticality="high", maturity=rng.randint(1, 5))
        for c in range(1, args.caps + 1):
            cid = "cap-%02d-%02d" % (d, c)
            add(cid, "Capability", "business", "B2", "Capability %d.%d" % (d, c),
                "Synthetic capability %d.%d used for scale testing." % (d, c),
                code="%d.%d" % (d, c), maturity=rng.randint(1, 5))
            link(did, "contains", cid)
            for p in range(1, args.procs + 1):
                pid = "proc-%02d-%02d-%02d" % (d, c, p)
                add(pid, "Process", "business", "B3", "Process %d.%d.%d" % (d, c, p),
                    "Synthetic process %d.%d.%d used for scale testing." % (d, c, p),
                    code="%d.%d.%d" % (d, c, p), maturity=rng.randint(1, 5))
                link(cid, "contains", pid)
                procs.append(pid)
                for a in range(1, args.acts + 1):
                    aid = "act-%02d-%02d-%02d-%02d" % (d, c, p, a)
                    add(aid, "Activity", "business", "B4", "Activity %d.%d.%d.%d" % (d, c, p, a),
                        "Synthetic activity used for scale testing.", code="%d.%d.%d.%d" % (d, c, p, a))
                    link(pid, "contains", aid)

    # ---- shared infrastructure --------------------------------------------
    sites = []
    for s in range(1, 13):
        sid = "site-%02d" % s
        add(sid, "Site", "it", "T5", "Site %d" % s, "Synthetic site used for scale testing.",
            props={"region": "region-%d" % s})
        sites.append(sid)
    zones = []
    for z in range(1, 16):
        zid = "net-%02d" % z
        add(zid, "NetworkZone", "it", "T5", "Network Zone %d" % z, "Synthetic network zone.")
        link(rng.choice(sites), "contains", zid)
        zones.append(zid)
    hosts = []
    for h in range(1, 61):
        hid = "host-%03d" % h
        add(hid, "Cluster" if h % 5 == 0 else "Host", "it", "T5", "Host %d" % h,
            "Synthetic host or cluster used for scale testing.")
        link(hid, "hosted_in", rng.choice(sites))
        link(hid, "hosted_in", rng.choice(zones))
        hosts.append(hid)
    for e, name in enumerate(["Production", "Validation", "Development"], start=1):
        add("env-%d" % e, "Environment", "it", "T4", name, "Synthetic environment.")
    for i, hid in enumerate(hosts):
        link("env-%d" % ((i % 3) + 1), "contains", hid)
    platforms = []
    for p in range(1, 46):
        pid = "plat-%03d" % p
        add(pid, "PlatformService", "it", "T4", "Platform Service %d" % p,
            "Synthetic platform service used for scale testing.")
        for hid in rng.sample(hosts, 2):
            link(pid, "hosted_in", hid)
        platforms.append(pid)

    # ---- applications and their internals ----------------------------------
    apps, stores, units_all = [], [], []
    for a in range(1, args.apps + 1):
        aid = "app-%03d" % a
        add(aid, "Application", "it", "T1", "Application %d" % a,
            "Synthetic application %d used for scale testing." % a,
            props={"category": "Cat %d" % (a % 12), "vendor": "Vendor %d" % (a % 30),
                   "costBand": rng.choice(["S", "M", "L", "XL"])})
        apps.append(aid)
        for target in rng.sample(procs, rng.randint(1, 3)):
            link(aid, "supports", target)
        primary = None
        for u in range(1, args.units + 1):
            uid = "du-%03d-%d" % (a, u)
            add(uid, "DeployableUnit", "it", "T2", "Application %d - Unit %d" % (a, u),
                "Synthetic deployable unit.", props={"environment": "production"})
            link(uid, "realizes", aid)
            link(aid, "contains", uid)
            link(uid, "runs_on", rng.choice(platforms))
            units_all.append(uid)
            primary = primary or uid
        for s in range(1, 3):
            sid = "ds-%03d-%d" % (a, s)
            add(sid, "DataStore", "it", "T2", "Application %d - Store %d" % (a, s),
                "Synthetic data store.", props={"environment": "production"})
            link(aid, "contains", sid)
            link(primary, "stores", sid)
            link(sid, "runs_on", rng.choice(platforms))
            stores.append(sid)
        ifid = "if-%03d" % a
        add(ifid, "Interface", "it", "T3", "Application %d - API" % a, "Synthetic interface.",
            props={"protocol": "REST/HTTPS"})
        link(aid, "contains", ifid)
        link(primary, "realizes", ifid)

    # ---- integration flows --------------------------------------------------
    for f in range(1, args.flows + 1):
        fid = "flow-%03d" % f
        src, dst = rng.sample(apps, 2)
        add(fid, "IntegrationFlow", "it", "T3", "Flow %d" % f, "Synthetic integration flow.",
            props={"protocol": rng.choice(["REST/HTTPS", "Kafka", "SFTP", "AS2"]),
                   "frequency": rng.choice(["real-time", "hourly", "daily"])})
        link(src, "connects_to", fid)
        link(fid, "connects_to", dst)
        link(fid, "runs_on", rng.choice(platforms))
        link(src, "integrates_with", dst, via=fid)

    # ---- extra dependency edges to reach the target edge count -------------
    pool = units_all + stores + platforms + apps
    for _ in range(args.extra_deps):
        a, b = rng.sample(pool, 2)
        link(a, "depends_on", b)
    for _ in range(args.extra_deps // 3):
        link(rng.choice(units_all), "reads", rng.choice(stores))

    node_list = [{k: nodes[i][k] for k in NODE_KEYS} for i in sorted(nodes)]
    edge_list = [{k: edges[i][k] for k in EDGE_KEYS} for i in sorted(edges)]
    meta = {"format": "business-it-map", "version": "1.0",
            "model": "Synthetic scale model (%d nodes / %d edges)" % (len(node_list), len(edge_list))}
    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "scale-nodes.json"), "w") as fh:
        json.dump({**meta, "kind": "nodes", "nodes": node_list}, fh, indent=2)
        fh.write("\n")
    with open(os.path.join(args.out, "scale-edges.json"), "w") as fh:
        json.dump({**meta, "kind": "edges", "edges": edge_list}, fh, indent=2)
        fh.write("\n")
    print("nodes: %d   edges: %d   -> %s" % (len(node_list), len(edge_list), args.out))


if __name__ == "__main__":
    main()
