#!/usr/bin/env python3
"""Project the agent registry into the enterprise graph.

`model/agents/*.yaml` (one Agent Operating Manifest each), `model/controls.yaml`
and `model/infrastructure.yaml` are the authored source. This module turns them
into nodes and edges so agents live inside the same graph as everything else,
rather than in a second application beside it.

Placement in the model:

    Agent          T1  - a service in the application landscape. It `supports`
                         business processes exactly as an application does, so
                         the lens pivot, technology chain and impact analysis
                         all work on it without special cases.
    AgentRuntime   T4  - platform & runtime. The agent `runs_on` it; it in turn
                         runs on the clusters and sites already in the model.

The one deliberate asymmetry: telemetry leaves a runtime by `integrates_with`,
which the graph does not count as a dependency. That is what makes ADR-001's
central claim checkable rather than merely asserted - impact analysis from the
conformed telemetry pipeline reaches no business process, because nothing
depends on it.
"""
import os

import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "model"))

# Health is derived from the manifest, never authored: an agent whose findings
# say it is unowned and unvalidated must not be able to show up green.
def _health(findings):
    worst = {f["severity"] for f in findings}
    if "critical" in worst:
        return "at-risk"
    if "serious" in worst or "warning" in worst:
        return "watch"
    return "ok"


def _criticality(agent):
    gov = agent.get("governance", {})
    if gov.get("gxpRelevant") and gov.get("part11Scope"):
        return "critical"
    if gov.get("gxpRelevant") or agent.get("replaces", {}).get("fteEquivalent", 0) >= 5:
        return "high"
    return "medium"


def _lifecycle(agent):
    return {"production": "active", "pilot": "plan", "proposed": "plan",
            "retired": "retired"}.get(agent.get("status"), "active")


# Findings are rules over the manifest, not a hand-kept list, so the gap
# register cannot rot while the estate changes underneath it.
FINDING_RULES = [
    ("no-owner", "critical", "No technical owner",
     lambda a: not a.get("ownership", {}).get("technicalOwner")
     or a["ownership"]["technicalOwner"] == "UNASSIGNED"),
    ("unvalidated-gxp", "critical", "In production against GxP scope without completed validation",
     lambda a: a.get("governance", {}).get("gxpRelevant") and a.get("status") == "production"
     and a.get("governance", {}).get("validationStatus") != "validated"),
    ("no-telemetry", "serious", "Not exporting telemetry to the central pipeline",
     lambda a: a.get("telemetry", {}).get("exportsTo") in (None, "none")),
    ("no-cost", "serious", "No cost attribution",
     lambda a: a.get("telemetry", {}).get("coverage", {}).get("cost") == "none"),
    ("no-eval", "warning", "No offline evaluation",
     lambda a: a.get("telemetry", {}).get("coverage", {}).get("evaluations") == "none"),
    ("no-fallback", "warning", "No defined degraded mode",
     lambda a: not a.get("model", {}).get("fallback")
     or a["model"]["fallback"] == "None configured"),
    ("no-source", "warning", "Source artefacts not held by the enterprise",
     lambda a: a.get("provenance", {}).get("sourceAvailable") is False),
    ("no-review", "warning", "No periodic review scheduled",
     lambda a: not a.get("governance", {}).get("periodicReview")
     or a["governance"]["periodicReview"] == "not scheduled"),
    ("unreviewed-external", "warning", "Autonomous output reaching an external audience",
     lambda a: a.get("interfaces", {}).get("humanInLoop", {}).get("mode")
     == "autonomous-with-escalation"),
]


def findings_for(agent):
    return [{"id": fid, "severity": sev, "label": label}
            for fid, sev, label, test in FINDING_RULES if test(agent)]


def jsonsafe(value):
    """Make a YAML value serialise identically from Python and JavaScript.

    `json.dump` writes an integral float as `7.0`; `JSON.stringify` writes `7`.
    The canonical form has to be byte-identical from either side, so integral
    floats collapse to int here rather than diverging in the export.
    """
    if isinstance(value, bool):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    if isinstance(value, dict):
        return {k: jsonsafe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [jsonsafe(v) for v in value]
    return value


def load_registry(model_dir=MODEL_DIR):
    with open(os.path.join(model_dir, "infrastructure.yaml"), encoding="utf-8") as fh:
        infra = yaml.safe_load(fh)
    with open(os.path.join(model_dir, "controls.yaml"), encoding="utf-8") as fh:
        controls = {c["id"]: c for c in yaml.safe_load(fh)["controls"]}
    agents_dir = os.path.join(model_dir, "agents")
    agents = []
    for name in sorted(os.listdir(agents_dir)):
        if not name.endswith(".yaml"):
            continue
        with open(os.path.join(agents_dir, name), encoding="utf-8") as fh:
            agents.append(yaml.safe_load(fh))
    return agents, infra, controls


def build_agents(add_node, add_edge, node_exists, model_dir=MODEL_DIR):
    """Add the agent layer. `node_exists(id)` guards every binding into the
    enterprise model, so a manifest pointing at something that is not there
    fails the generator instead of silently producing a dangling edge."""
    agents, infra, controls = load_registry(model_dir)
    problems = []

    def bind(src, edge_type, dst, what):
        if not node_exists(dst):
            problems.append("%s: %s -> unknown node %r" % (src, what, dst))
            return
        add_edge(src, edge_type, dst)

    # ---------------------------------------------------------- runtimes (T4)
    for rt in infra["runtimes"]:
        b = rt.get("binding", {})
        add_node(
            rt["id"], "AgentRuntime", "it", "T4", rt["name"], rt["summary"],
            owner=rt.get("operator", ""),
            criticality="critical" if rt.get("gxpBoundary") else "high",
            health="ok",
            tags=["agent-runtime", rt.get("cloud", ""), "gxp" if rt.get("gxpBoundary") else "non-gxp"],
            props=jsonsafe({
                "cloud": rt.get("cloud", ""),
                "region": rt.get("region", ""),
                "operator": rt.get("operator", ""),
                "gxpBoundary": bool(rt.get("gxpBoundary")),
                "compute": rt.get("compute", []),
                "identity": rt.get("identity", []),
                "network": rt.get("network", []),
                "dataResidency": rt.get("data", []),
                "secrets": rt.get("secrets", []),
                "telemetryNative": rt.get("telemetry", {}).get("native", ""),
                "telemetryWire": rt.get("telemetry", {}).get("wire", ""),
                "redactionPoint": rt.get("telemetry", {}).get("redactionPoint", ""),
                "telemetryExportsTo": rt.get("telemetry", {}).get("exportsTo", "none"),
                "confidence": rt.get("confidence", "seed"),
            }),
        )
        if b.get("runsOn"):
            bind(rt["id"], "runs_on", b["runsOn"], "runsOn")
        if b.get("hostedIn"):
            bind(rt["id"], "hosted_in", b["hostedIn"], "hostedIn")
        for dep in b.get("dependsOn", []):
            bind(rt["id"], "depends_on", dep, "dependsOn")

    # ----------------------------------------------------- control plane (T4)
    for cp in infra["controlPlane"]:
        b = cp.get("binding", {})
        add_node(
            cp["id"], "PlatformService", "it", "T4", cp["name"], cp["summary"],
            owner=cp.get("ownedBy", ""),
            criticality="medium",
            health="ok",
            tags=["agent-control-plane", cp.get("layer", "")],
            props=jsonsafe({
                "layer": cp.get("layer", ""),
                "implementation": cp.get("implementation", ""),
                "inRequestPath": bool(cp.get("inRequestPath")),
                "note": cp.get("note", ""),
            }),
        )
        if b.get("runsOn"):
            bind(cp["id"], "runs_on", b["runsOn"], "runsOn")
        for dep in b.get("dependsOn", []):
            bind(cp["id"], "depends_on", dep, "dependsOn")

    # Telemetry leaves each runtime as an integration, never a dependency.
    for rt in infra["runtimes"]:
        sink = rt.get("telemetry", {}).get("exportsTo")
        if sink and sink != "none":
            bind(rt["id"], "integrates_with", sink, "telemetry export")
    for src, dst in (("cp-otel", "cp-warehouse"), ("cp-eval", "cp-warehouse"),
                     ("cp-warehouse", "cp-atlas"), ("cp-registry", "cp-policy")):
        bind(src, "integrates_with", dst, "control plane link")

    # -------------------------------------------------------------- agents (T1)
    known_agents = {a["id"] for a in agents}
    for a in agents:
        findings = findings_for(a)
        gov = a.get("governance", {})
        tel = a.get("telemetry", {})
        econ = a.get("economics", {})
        health = a.get("health", {})
        hitl = a.get("interfaces", {}).get("humanInLoop", {})

        add_node(
            a["id"], "Agent", "it", "T1", a["name"], a["oneLiner"],
            owner=a.get("ownership", {}).get("technicalOwner", "") or "Unassigned",
            lifecycle=_lifecycle(a),
            criticality=_criticality(a),
            health=_health(findings),
            tags=sorted({"agent", a.get("platform", {}).get("framework", ""),
                         "gxp" if gov.get("gxpRelevant") else "non-gxp",
                         a.get("status", "")} - {""}),
            props=jsonsafe({
                "shortName": a.get("shortName", a["name"]),
                "version": a.get("version", ""),
                "status": a.get("status", ""),
                "confidence": a.get("confidence", "seed"),
                "framework": a.get("platform", {}).get("framework", ""),
                "frameworkVersion": a.get("platform", {}).get("frameworkVersion", ""),
                "orchestrationStyle": a.get("platform", {}).get("orchestrationStyle", ""),
                "interop": a.get("platform", {}).get("interop", ""),
                "runtime": a.get("platform", {}).get("runtime", ""),
                # provenance
                "builtBy": a.get("provenance", {}).get("builtBy", ""),
                "deliveredOn": a.get("provenance", {}).get("deliveredOn", ""),
                "handoverStatus": a.get("provenance", {}).get("handoverStatus", ""),
                "sourceAvailable": bool(a.get("provenance", {}).get("sourceAvailable")),
                "sourceLocation": a.get("provenance", {}).get("sourceLocation", ""),
                # accountability
                "businessOwner": a.get("ownership", {}).get("businessOwner", ""),
                "technicalOwner": a.get("ownership", {}).get("technicalOwner", ""),
                "accountableExecutive": a.get("ownership", {}).get("accountableExecutive", ""),
                # what it replaced
                "replacesRole": a.get("replaces", {}).get("roleTitle", ""),
                "fteEquivalent": a.get("replaces", {}).get("fteEquivalent", 0),
                "displacementType": a.get("replaces", {}).get("displacementType", ""),
                "retainedByHumans": a.get("replaces", {}).get("retainedByHumans", []),
                "replacesNote": a.get("replaces", {}).get("note", ""),
                # model & humans
                "modelPrimary": a.get("model", {}).get("primary", ""),
                "modelFallback": a.get("model", {}).get("fallback", ""),
                "promptVersioning": a.get("model", {}).get("promptVersioning", ""),
                "hitlMode": hitl.get("mode", ""),
                "hitlGate": hitl.get("gate", ""),
                "hitlSlaMinutes": hitl.get("slaMinutes", 0),
                "overrideRatePct": hitl.get("overrideRatePct", 0),
                "tools": a.get("interfaces", {}).get("tools", []),
                # data
                "dataClassifications": a.get("data", {}).get("classifications", []),
                "residency": a.get("data", {}).get("residency", ""),
                "retention": a.get("data", {}).get("retention", ""),
                "trainingUse": a.get("data", {}).get("trainingUse", ""),
                # telemetry
                "telemetryEmits": tel.get("emits", "none"),
                "semconv": tel.get("semconv", ""),
                "telemetryExportsTo": tel.get("exportsTo", "none"),
                "coverage": tel.get("coverage", {}),
                "telemetryGaps": tel.get("gaps", []),
                # governance
                "gxpRelevant": bool(gov.get("gxpRelevant")),
                "part11Scope": bool(gov.get("part11Scope")),
                "validationStatus": gov.get("validationStatus", ""),
                "validationRef": gov.get("validationRef", ""),
                "periodicReview": gov.get("periodicReview", ""),
                "modelRiskTier": gov.get("modelRiskTier", 0),
                "regulatoryExposure": gov.get("regulatoryExposure", ""),
                "controls": [
                    {"id": cid,
                     "name": controls.get(cid, {}).get("name", cid),
                     "statement": controls.get(cid, {}).get("statement", ""),
                     "verification": controls.get(cid, {}).get("verification", ""),
                     "basis": controls.get(cid, {}).get("regulatoryBasis", [])}
                    for cid in gov.get("controls", [])
                ],
                # economics & operating health
                "annualRunCostUsd": econ.get("annualRunCostUsd", 0),
                "annualBenefitUsd": econ.get("annualBenefitUsd", 0),
                "benefitBasis": econ.get("benefitBasis", ""),
                "costConfidence": econ.get("costConfidence", "seed"),
                "benefitConfidence": econ.get("benefitConfidence", "seed"),
                "runsPerMonth": health.get("runsPerMonth", 0),
                "successRatePct": health.get("successRatePct", 0),
                "p50LatencySeconds": health.get("p50LatencySeconds", 0),
                "p95LatencySeconds": health.get("p95LatencySeconds", 0),
                "escalationRatePct": health.get("escalationRatePct", 0),
                "openQuestions": a.get("openQuestions", []),
                "findings": findings,
            }),
            externalRefs={"manifest": "model/agents/%s.yaml" % a["id"]},
        )

        for cid in gov.get("controls", []):
            if cid not in controls:
                problems.append("%s: unknown control %r" % (a["id"], cid))

        for proc in a.get("business", {}).get("processes", []):
            bind(a["id"], "supports", proc, "supports process")
        for sys_id in a.get("interfaces", {}).get("systems", []):
            bind(a["id"], "depends_on", sys_id, "system access")

        rt_id = a.get("platform", {}).get("runtime")
        if rt_id:
            bind(a["id"], "runs_on", rt_id, "runtime")

    # Agent-to-agent handoffs are integrations, not dependencies: the med-info
    # agent forwarding a suspected adverse event does not make safety intake
    # unavailable if it stops.
    for src, dst in (("agt-medinfo", "agt-pv-intake"),):
        if src in known_agents and dst in known_agents:
            add_edge(src, "integrates_with", dst)

    # Cross-check the runtime `hosts` lists against what the manifests claim.
    for rt in infra["runtimes"]:
        for host in rt.get("hosts", []):
            claimed = next((a for a in agents if a["id"] == host), None)
            if claimed is None:
                problems.append("%s: hosts unknown agent %r" % (rt["id"], host))
            elif claimed.get("platform", {}).get("runtime") != rt["id"]:
                problems.append("%s: hosts %s, which claims runtime %r"
                                % (rt["id"], host, claimed.get("platform", {}).get("runtime")))

    return problems
