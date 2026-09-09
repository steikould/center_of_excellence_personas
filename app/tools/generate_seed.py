#!/usr/bin/env python3
"""Generate the demo model (nodes.json / edges.json / seed-data.js) for the
Business <-> IT map application.

Run:  python3 app/tools/generate_seed.py

The JSON files are the canonical interchange format. seed-data.js is the same
content wrapped as an ES module so the app also runs straight from file://.
Serialization is canonical (fixed key order, ids sorted) so that an export from
the browser is byte-identical to these files.
"""
import json
import os
import random
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seed_business import DOMAINS, ACTIVITIES          # noqa: E402
from seed_apps import APPS                             # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))

MODEL_VERSION = "1.0"
MODEL_NAME = "Vetrellis Animal Health - demo enterprise model"

NODE_KEYS = ["id", "type", "lens", "level", "name", "description", "code", "owner",
             "lifecycle", "criticality", "health", "maturity", "tags", "props", "externalRefs"]
EDGE_KEYS = ["id", "type", "from", "to", "props"]

nodes = {}
edges = {}
rng = random.Random(20260909)


def slug(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return re.sub(r"-+", "-", s)


def add_node(id, type, lens, level, name, description, **kw):
    if id in nodes:
        raise SystemExit("duplicate node id: " + id)
    nodes[id] = dict(
        id=id, type=type, lens=lens, level=level, name=name, description=description,
        code=kw.get("code", ""),
        owner=kw.get("owner", ""),
        lifecycle=kw.get("lifecycle", "active"),
        criticality=kw.get("criticality", "medium"),
        health=kw.get("health", "ok"),
        maturity=kw.get("maturity", 0),
        tags=sorted(set(kw.get("tags", []))),
        props=kw.get("props", {}),
        externalRefs=kw.get("externalRefs", {}),
    )
    return id


def add_edge(src, type, dst, **props):
    if src not in nodes:
        raise SystemExit("edge from unknown node: " + src)
    if dst not in nodes:
        raise SystemExit("edge to unknown node: " + dst)
    eid = "%s|%s|%s" % (src, type, dst)
    if eid not in edges:
        edges[eid] = dict(id=eid, type=type, **{"from": src, "to": dst}, props=props)
    return eid


HEALTH_POOL = ["ok"] * 6 + ["watch"] * 3 + ["at-risk"]


def pick_health(bias=None):
    return bias or rng.choice(HEALTH_POOL)


# ---------------------------------------------------------------------------
# Business lens (B1 - B4)
# ---------------------------------------------------------------------------
proc_id_by_name = {}
cap_id_by_name = {}

for di, dom in enumerate(DOMAINS, start=1):
    did = "bd-" + slug(dom["name"])
    add_node(did, "BusinessDomain", "business", "B1", dom["name"], dom["description"],
             code="%d.0" % di, owner=dom["owner"], criticality="high",
             health=dom["health"], maturity=dom["maturity"],
             tags=["domain", dom["importance"]],
             props={"importance": dom["importance"]},
             externalRefs={"pcf": "%d.0" % di})
    for ci, cap in enumerate(dom["capabilities"], start=1):
        cid = "cap-" + slug(cap["name"])
        cap_id_by_name[cap["name"]] = cid
        add_node(cid, "Capability", "business", "B2", cap["name"], cap["description"],
                 code="%d.%d" % (di, ci), owner=cap["owner"], criticality="medium",
                 health=cap["health"], maturity=cap["maturity"],
                 tags=["capability", cap["importance"]],
                 props={"importance": cap["importance"]},
                 externalRefs={"pcf": "%d.%d" % (di, ci)})
        add_edge(did, "contains", cid)
        for pi, (pname, pdesc) in enumerate(cap["processes"], start=1):
            pid = "proc-" + slug(pname)
            proc_id_by_name[pname] = pid
            code = "%d.%d.%d" % (di, ci, pi)
            add_node(pid, "Process", "business", "B3", pname, pdesc,
                     code=code, owner=cap["owner"], criticality="medium",
                     health=pick_health(), maturity=max(1, min(5, cap["maturity"] + rng.choice([-1, 0, 0, 1]))),
                     tags=["process"], props={"importance": cap["importance"]},
                     externalRefs={"pcf": code})
            add_edge(cid, "contains", pid)
            for ai, (aname, adesc) in enumerate(ACTIVITIES.get(pname, []), start=1):
                aid = "act-" + slug(aname)
                acode = "%s.%d" % (code, ai)
                add_node(aid, "Activity", "business", "B4", aname, adesc,
                         code=acode, owner=cap["owner"], criticality="low",
                         health=pick_health(), maturity=0, tags=["activity"],
                         props={}, externalRefs={"pcf": acode})
                add_edge(pid, "contains", aid)

# ---------------------------------------------------------------------------
# Technology lens - shared platform (T4), infrastructure (T5)
# ---------------------------------------------------------------------------
SITES = [
    ("site-hq-dc", "Lincoln HQ Data Center", "Company-owned data centre attached to the Lincoln headquarters campus.", "on-premise", "Lincoln, NE (US)"),
    ("site-cloud-east", "Cloud Region: US East", "Primary public cloud region hosting production workloads for the Americas.", "cloud", "us-east"),
    ("site-cloud-eu", "Cloud Region: EU West", "Secondary public cloud region hosting EU production and disaster recovery.", "cloud", "eu-west"),
    ("site-plant-rathdrum", "Rathdrum Manufacturing Plant", "GxP manufacturing site with its own edge compute and line control room.", "plant", "Rathdrum, ID (US)"),
    ("site-lab-lincoln", "Lincoln Research Labs", "Discovery and QC laboratory campus with instrument networks.", "lab", "Lincoln, NE (US)"),
    ("site-vendor-cloud", "Vendor SaaS Clouds", "Aggregate placeholder for vendor-operated cloud estates hosting SaaS applications.", "vendor", "multi-region"),
]
for sid, name, desc, kind, region in SITES:
    add_node(sid, "Site", "it", "T5", name, desc, owner="Head of Infrastructure",
             criticality="high", health="ok", tags=["site", kind],
             props={"siteType": kind, "region": region})

ZONES = [
    ("net-corp", "Corporate Network Zone", "General corporate user and office application traffic.", "internal", "site-hq-dc"),
    ("net-dmz", "Internet-Facing DMZ", "Perimeter zone terminating inbound internet traffic to public services.", "dmz", "site-hq-dc"),
    ("net-gxp-mfg", "GxP Manufacturing Zone", "Segregated OT/IT zone for validated manufacturing systems and line equipment.", "restricted", "site-plant-rathdrum"),
    ("net-lab", "Laboratory Instrument Zone", "Instrument network segment for laboratory acquisition systems.", "restricted", "site-lab-lincoln"),
    ("net-cloud-prod", "Cloud Production VPC", "Production virtual network in the public cloud regions.", "cloud", "site-cloud-east"),
    ("net-partner", "Partner Extranet Zone", "Controlled zone for distributor, carrier and health authority connectivity.", "extranet", "site-hq-dc"),
]
for nid, name, desc, kind, site in ZONES:
    add_node(nid, "NetworkZone", "it", "T5", name, desc, owner="Network Operations",
             criticality="high", health="ok", tags=["network", kind],
             props={"zoneType": kind})
    add_edge(site, "contains", nid)

HOSTS = [
    ("host-k8s-prod-a", "Cluster", "Production Container Cluster A", "Primary production Kubernetes cluster for the Americas.", "site-cloud-east", "net-cloud-prod", "critical", "ok"),
    ("host-k8s-prod-b", "Cluster", "Production Container Cluster B (EU)", "EU production Kubernetes cluster, also the DR target for cluster A.", "site-cloud-eu", "net-cloud-prod", "critical", "ok"),
    ("host-k8s-nonprod", "Cluster", "Non-Production Container Cluster", "Shared cluster carrying development, test and validation workloads.", "site-cloud-east", "net-cloud-prod", "medium", "watch"),
    ("host-vm-cluster-hq", "Cluster", "HQ Virtualisation Cluster", "On-premise hypervisor cluster running legacy and middleware workloads.", "site-hq-dc", "net-corp", "critical", "watch"),
    ("host-oracle-rac-1", "Host", "Oracle RAC Node 1", "First node of the clustered database appliance serving ERP and legacy systems.", "site-hq-dc", "net-corp", "critical", "watch"),
    ("host-oracle-rac-2", "Host", "Oracle RAC Node 2", "Second node of the clustered database appliance.", "site-hq-dc", "net-corp", "critical", "ok"),
    ("host-db-managed-east", "Host", "Managed Database Fleet (US East)", "Cloud-managed relational database instances for production services.", "site-cloud-east", "net-cloud-prod", "critical", "ok"),
    ("host-db-managed-eu", "Host", "Managed Database Fleet (EU West)", "Cloud-managed relational database instances for EU production services.", "site-cloud-eu", "net-cloud-prod", "high", "ok"),
    ("host-storage-hq", "Host", "HQ Storage Array", "Primary block and file storage array in the HQ data centre.", "site-hq-dc", "net-corp", "critical", "at-risk"),
    ("host-object-store-east", "Host", "Cloud Object Storage (US East)", "Durable object storage backing the lakehouse and document repositories.", "site-cloud-east", "net-cloud-prod", "critical", "ok"),
    ("host-edge-rathdrum", "Host", "Rathdrum Edge Servers", "Edge compute at the plant keeping line systems running during WAN loss.", "site-plant-rathdrum", "net-gxp-mfg", "critical", "watch"),
    ("host-lab-gateway", "Host", "Laboratory Acquisition Gateways", "Instrument gateway servers bridging lab equipment to validated systems.", "site-lab-lincoln", "net-lab", "high", "watch"),
    ("host-vendor-managed", "Host", "Vendor-Managed Infrastructure", "Opaque infrastructure operated by SaaS vendors under contract.", "site-vendor-cloud", "net-partner", "high", "ok"),
]
for hid, htype, name, desc, site, zone, crit, health in HOSTS:
    add_node(hid, htype, "it", "T5", name, desc, owner="Head of Infrastructure",
             criticality=crit, health=health, tags=["infrastructure"],
             props={"environment": "production" if "nonprod" not in hid else "non-production"})
    add_edge(hid, "hosted_in", site)
    add_edge(hid, "hosted_in", zone)

ENVIRONMENTS = [
    ("env-prod", "Production", "Validated production environment serving live business operations.", "critical"),
    ("env-uat", "Validation / UAT", "Qualification and user acceptance environment used for GxP release testing.", "high"),
    ("env-dev", "Development", "Development and integration environment; no regulated data permitted.", "low"),
]
for eid, name, desc, crit in ENVIRONMENTS:
    add_node(eid, "Environment", "it", "T4", name, desc, owner="Head of Infrastructure",
             criticality=crit, health="ok", tags=["environment"], props={})

PLATFORMS = [
    ("plat-container", "Container Platform", "Managed Kubernetes platform hosting most modern application workloads.", "runtime", ["host-k8s-prod-a", "host-k8s-prod-b", "host-k8s-nonprod"], "critical", "ok"),
    ("plat-appserver", "Java Application Server Estate", "Legacy application server middleware hosting monolithic applications.", "runtime", ["host-vm-cluster-hq"], "high", "at-risk"),
    ("plat-oracle", "Oracle Database Service", "Clustered Oracle database service for ERP and legacy application schemas.", "data", ["host-oracle-rac-1", "host-oracle-rac-2"], "critical", "watch"),
    ("plat-postgres", "Managed PostgreSQL Service", "Cloud-managed PostgreSQL used by most modern applications.", "data", ["host-db-managed-east", "host-db-managed-eu"], "critical", "ok"),
    ("plat-sqlserver", "SQL Server Service", "Managed SQL Server instances for vendor products that require it.", "data", ["host-db-managed-east"], "high", "ok"),
    ("plat-objectstore", "Object Storage Service", "Durable object storage for documents, raw data and backups.", "data", ["host-object-store-east"], "critical", "ok"),
    ("plat-lakehouse", "Lakehouse Compute Service", "Elastic compute and table format layer for curated analytical data.", "data", ["host-object-store-east", "host-k8s-prod-a"], "critical", "watch"),
    ("plat-eventbus", "Enterprise Event Bus", "Kafka-compatible event streaming backbone for asynchronous integration.", "integration", ["host-k8s-prod-a", "host-k8s-prod-b"], "critical", "ok"),
    ("plat-esb", "Integration Bus", "API-led integration platform hosting mappings, orchestrations and connectors.", "integration", ["host-k8s-prod-a"], "critical", "watch"),
    ("plat-apigw", "API Gateway", "Edge gateway publishing internal APIs to partners and mobile clients.", "integration", ["host-k8s-prod-a"], "critical", "ok"),
    ("plat-mft", "Managed File Transfer", "Governed SFTP and file-drop service for batch interchange with partners.", "integration", ["host-vm-cluster-hq"], "high", "watch"),
    ("plat-scheduler", "Enterprise Job Scheduler", "Central scheduler orchestrating batch jobs and pipeline runs.", "runtime", ["host-vm-cluster-hq", "host-k8s-prod-a"], "high", "watch"),
    ("plat-cache", "In-Memory Cache Service", "Shared low-latency cache and session store.", "data", ["host-k8s-prod-a"], "high", "ok"),
    ("plat-idp", "Enterprise Identity Provider", "Single sign-on, MFA and token issuance for all internal and SaaS applications.", "security", ["host-k8s-prod-a", "host-vm-cluster-hq"], "critical", "ok"),
    ("plat-observability", "Observability Platform", "Metrics, logs and traces with alerting for all production services.", "operations", ["host-k8s-prod-a"], "high", "ok"),
    ("plat-backup", "Backup & Recovery Service", "Enterprise backup, immutable retention and restore orchestration.", "operations", ["host-storage-hq", "host-object-store-east"], "critical", "watch"),
    ("plat-vendor-cloud", "Vendor SaaS Runtime", "Externally operated runtime for subscribed software-as-a-service products.", "runtime", ["host-vendor-managed"], "high", "ok"),
    ("plat-vdi", "Virtual Desktop Service", "Managed desktops used for validated system access and third-party contractors.", "runtime", ["host-vm-cluster-hq"], "medium", "ok"),
]
for pid, name, desc, kind, hosts, crit, health in PLATFORMS:
    envs = ["production", "validation", "development"]
    if kind in ("security", "operations"):
        envs = ["production", "validation"]
    add_node(pid, "PlatformService", "it", "T4", name, desc, owner="Head of Infrastructure",
             criticality=crit, health=health, tags=["platform", kind],
             props={"platformType": kind, "environments": envs})
    for h in hosts:
        add_edge(pid, "hosted_in", h)

# Each host sits in exactly one environment, which keeps `contains` a strict tree.
for hid, htype, name, desc, site, zone, crit, health in HOSTS:
    add_edge("env-dev" if "nonprod" in hid else "env-prod", "contains", hid)

# ---------------------------------------------------------------------------
# Technology lens - applications (T1) and their internals (T2 / T3)
# ---------------------------------------------------------------------------
ARCHETYPES = {
    "three_tier": dict(
        units=[
            ("web", "Web Front End", "plat-container", "Browser-facing single-page interface for end users."),
            ("api", "API Service", "plat-container", "Application services holding the business logic behind the interface."),
            ("jobs", "Scheduled Jobs", "plat-scheduler", "Periodic jobs for imports, exports, notifications and housekeeping."),
        ],
        stores=[("db", "Primary Database", "plat-postgres", "relational", "Transactional store of record for the application.")],
        interfaces=[("rest", "REST API", "REST/HTTPS", "Synchronous REST API published to internal consumers.")],
    ),
    "event_driven": dict(
        units=[
            ("api", "API Service", "plat-container", "Command and query API accepting work into the service."),
            ("worker", "Event Processor", "plat-container", "Consumes events from the bus and applies them asynchronously."),
        ],
        stores=[
            ("db", "Primary Database", "plat-postgres", "relational", "Transactional store of record for the service."),
            ("cache", "Working Cache", "plat-cache", "cache", "Low-latency cache holding in-flight state and lookups."),
        ],
        interfaces=[
            ("rest", "REST API", "REST/HTTPS", "Synchronous REST API published to internal consumers."),
            ("events", "Event Stream", "Kafka/AVRO", "Domain events published to the enterprise event bus."),
        ],
    ),
    "data_platform": dict(
        units=[
            ("ingest", "Ingestion Service", "plat-container", "Lands raw data from source systems into the platform."),
            ("orchestrator", "Pipeline Orchestrator", "plat-scheduler", "Schedules, sequences and retries the transformation pipelines."),
            ("serve", "Query & Serving Layer", "plat-lakehouse", "Serves curated data products to analytical consumers."),
        ],
        stores=[
            ("raw", "Raw Landing Store", "plat-objectstore", "object", "Immutable landing area for raw source extracts and events."),
            ("curated", "Curated Data Store", "plat-lakehouse", "lakehouse", "Modelled, quality-checked data products for consumption."),
        ],
        interfaces=[("sql", "SQL Endpoint", "SQL/JDBC", "Governed SQL endpoint used by BI tools and analysts.")],
    ),
    "legacy_monolith": dict(
        units=[
            ("core", "Monolithic Application Server", "plat-appserver", "Single deployable carrying the whole application, released quarterly."),
            ("batch", "Nightly Batch Suite", "plat-scheduler", "Long-running overnight batch chain; failures push into the business day."),
        ],
        stores=[
            ("db", "Oracle Schema", "plat-oracle", "relational", "Large shared relational schema with limited modularity."),
            ("files", "File Interchange Area", "plat-mft", "file", "Directory structure used for flat-file interchange with partners."),
        ],
        interfaces=[
            ("soap", "SOAP Services", "SOAP/HTTPS", "Legacy SOAP services kept alive for downstream consumers."),
            ("files", "File Interface", "SFTP/CSV", "Scheduled flat-file drops consumed by partners and internal jobs."),
        ],
    ),
    "mobile": dict(
        units=[
            ("mobile", "Mobile Client", "plat-apigw", "Native application distributed to customer devices."),
            ("bff", "Backend For Frontend", "plat-container", "Aggregation layer shaping data for the mobile and web clients."),
            ("api", "API Service", "plat-container", "Core domain services behind the aggregation layer."),
        ],
        stores=[("db", "Primary Database", "plat-postgres", "relational", "Transactional store of record for the application.")],
        interfaces=[("rest", "Public REST API", "REST/HTTPS", "Customer-facing API published through the gateway.")],
    ),
}

SQLSERVER_APPS = {"maintainx-cmms", "labcore-lims", "riskregistry", "assetcore-cmdb"}
ORACLE_APPS = {"auriga-erp", "clarion-crm", "regdossier"}

app_id_by_slug = {}
app_units = {}          # slug -> {suffix: node id}
app_stores = {}         # slug -> {suffix: node id}
app_interfaces = {}     # slug -> {suffix: node id}


def health_for(lifecycle, criticality, seed_key):
    if lifecycle == "phase-out":
        return "at-risk"
    if lifecycle == "plan":
        return "unknown"
    r = random.Random(seed_key).random()
    if criticality in ("critical", "high"):
        return "ok" if r < 0.68 else ("watch" if r < 0.92 else "at-risk")
    return "ok" if r < 0.78 else ("watch" if r < 0.95 else "at-risk")


for slug_, name, desc, category, vendor, lifecycle, criticality, cost, archetype, supports in APPS:
    aid = "app-" + slug_
    app_id_by_slug[slug_] = aid
    owner = "Application Owner - " + category
    add_node(aid, "Application", "it", "T1", name, desc,
             owner=owner, lifecycle=lifecycle, criticality=criticality,
             health=health_for(lifecycle, criticality, slug_),
             tags=["application", category.lower(), "internal" if vendor == "Internal" else "vendor"],
             props={"category": category, "vendor": vendor, "costBand": cost,
                    "hosting": "saas" if archetype == "saas" else "internal",
                    "archetype": archetype},
             externalRefs={"cmdb": "CI-APP-%s" % slug_.upper().replace("-", "")})
    for target in supports:
        tid = cap_id_by_name[target[4:]] if target.startswith("cap:") else proc_id_by_name[target]
        add_edge(aid, "supports", tid)

    if archetype == "saas":
        sid = "svc-" + slug_
        add_node(sid, "ExternalService", "it", "T2", name + " (Vendor Service)",
                 "Vendor-operated service instance; internals are not visible to the company.",
                 owner="Vendor: " + vendor, lifecycle=lifecycle, criticality=criticality,
                 health=nodes[aid]["health"], tags=["external", "saas"],
                 props={"vendor": vendor, "environment": "production", "tenancy": "multi-tenant"})
        add_edge(sid, "realizes", aid)
        add_edge(aid, "contains", sid)
        add_edge(sid, "runs_on", "plat-vendor-cloud")
        dsid = "ds-%s-tenant" % slug_
        add_node(dsid, "DataStore", "it", "T2", name + " Tenant Data",
                 "Vendor-hosted tenant data for the subscribed service.",
                 owner="Vendor: " + vendor, criticality=criticality, health="ok",
                 tags=["datastore", "vendor-managed"],
                 props={"storeType": "vendor-managed", "environment": "production"})
        add_edge(aid, "contains", dsid)
        add_edge(sid, "stores", dsid)
        ifid = "if-%s-rest" % slug_
        add_node(ifid, "Interface", "it", "T3", name + " REST API",
                 "Vendor REST API used for integration with internal systems.",
                 owner=owner, criticality=criticality, health="ok", tags=["interface", "api"],
                 props={"protocol": "REST/HTTPS", "direction": "exposed", "auth": "OAuth 2.0"})
        add_edge(aid, "contains", ifid)
        add_edge(sid, "realizes", ifid)
        add_edge(sid, "depends_on", "plat-idp", note="SAML single sign-on")
        app_units[slug_] = {"core": sid}
        app_stores[slug_] = {"db": dsid}
        app_interfaces[slug_] = {"rest": ifid}
        continue

    tmpl = ARCHETYPES[archetype]
    units, stores, ifaces = {}, {}, {}
    db_platform = ("plat-oracle" if slug_ in ORACLE_APPS else
                   "plat-sqlserver" if slug_ in SQLSERVER_APPS else None)
    for suffix, uname, platform, udesc in tmpl["units"]:
        uid = "du-%s-%s" % (slug_, suffix)
        add_node(uid, "DeployableUnit", "it", "T2", "%s - %s" % (name, uname), udesc,
                 owner=owner, lifecycle=lifecycle, criticality=criticality,
                 health=health_for(lifecycle, criticality, uid),
                 tags=["deployable-unit", suffix],
                 props={"unitType": uname, "environment": "production",
                        "replicas": 2 if criticality in ("critical", "high") else 1})
        add_edge(uid, "realizes", aid)
        add_edge(aid, "contains", uid)
        add_edge(uid, "runs_on", platform)
        units[suffix] = uid
    primary = units.get("api") or units.get("core") or units.get("ingest") or list(units.values())[0]
    add_edge(primary, "depends_on", "plat-idp", note="Authenticates users and services")
    add_edge(primary, "depends_on", "plat-observability", note="Emits metrics, logs and traces")

    for suffix, sname, platform, kind, sdesc in tmpl["stores"]:
        sidd = "ds-%s-%s" % (slug_, suffix)
        plat = db_platform if (kind == "relational" and db_platform) else platform
        add_node(sidd, "DataStore", "it", "T2", "%s - %s" % (name, sname), sdesc,
                 owner=owner, lifecycle=lifecycle, criticality=criticality,
                 health=health_for(lifecycle, criticality, sidd),
                 tags=["datastore", kind],
                 props={"storeType": kind, "environment": "production",
                        "backedUp": True, "classification": "Confidential"})
        add_edge(sidd, "runs_on", plat)
        add_edge(aid, "contains", sidd)
        add_edge(primary, "stores", sidd)
        add_edge(sidd, "depends_on", "plat-backup", note="Nightly backup with 35-day retention")
        stores[suffix] = sidd

    for suffix, iname, protocol, idesc in tmpl["interfaces"]:
        ifid = "if-%s-%s" % (slug_, suffix)
        add_node(ifid, "Interface", "it", "T3", "%s - %s" % (name, iname), idesc,
                 owner=owner, lifecycle=lifecycle, criticality=criticality,
                 health="ok", tags=["interface"],
                 props={"protocol": protocol, "direction": "exposed",
                        "auth": "OAuth 2.0" if "REST" in protocol else "Certificate"})
        add_edge(aid, "contains", ifid)
        add_edge(primary, "realizes", ifid)
        if protocol.startswith("Kafka"):
            add_edge(ifid, "runs_on", "plat-eventbus")
        if protocol.startswith("SFTP"):
            add_edge(ifid, "runs_on", "plat-mft")
        ifaces[suffix] = ifid

    app_units[slug_] = units
    app_stores[slug_] = stores
    app_interfaces[slug_] = ifaces

# ---------------------------------------------------------------------------
# External parties the estate talks to
# ---------------------------------------------------------------------------
EXTERNALS = [
    ("ext-health-authority", "Health Authority Gateways", "Electronic submission endpoints operated by veterinary medicines regulators.", "critical"),
    ("ext-payment-network", "Card Payment Network", "Acquirer and card scheme endpoints used to authorise customer payments.", "critical"),
    ("ext-banking-network", "Banking Payment Network", "Bank host-to-host channels used for outbound payment files and statements.", "critical"),
    ("ext-distributor-edi", "Distributor EDI Network", "EDI value-added network exchanging orders and invoices with distributors.", "high"),
    ("ext-carrier-api", "Logistics Carrier Services", "Carrier booking, tracking and proof-of-delivery services.", "high"),
]
for eid, name, desc, crit in EXTERNALS:
    add_node(eid, "ExternalService", "it", "T1", name, desc, owner="Third Party",
             criticality=crit, health="ok", tags=["external", "third-party"],
             props={"vendor": "External", "hosting": "external"})
    add_edge(eid, "depends_on", "net-partner", note="Reachable only through the partner extranet zone")

# ---------------------------------------------------------------------------
# Integration flows (T3)
# ---------------------------------------------------------------------------
FLOWS = [
    ("order-to-erp", "ordercentral", "auriga-erp", "Sales Order Handover", "Accepted customer orders are handed to the ERP for allocation and fulfilment.", "REST/HTTPS", "real-time", "JSON", "critical", "plat-esb"),
    ("erp-to-billing", "auriga-erp", "billwise", "Fulfilment Confirmation to Billing", "Despatch confirmations trigger billing of the fulfilled order lines.", "Kafka", "near-real-time", "AVRO", "critical", "plat-eventbus"),
    ("billing-to-gl", "billwise", "auriga-erp", "Invoice Posting to Ledger", "Issued invoices post receivable and revenue entries into the general ledger.", "REST/HTTPS", "hourly", "JSON", "high", "plat-esb"),
    ("pay-to-billing", "paygate", "billwise", "Payment Application Events", "Captured payments are applied against open receivables.", "Kafka", "real-time", "AVRO", "critical", "plat-eventbus"),
    ("pay-to-network", "paygate", "ext-payment-network", "Card Authorisation Requests", "Authorisation and settlement traffic with the acquiring bank.", "ISO 8583", "real-time", "Binary", "critical", "plat-apigw"),
    ("crm-to-order", "vetconnect-crm", "ordercentral", "Field Order Submission", "Orders taken by field representatives are submitted for capture.", "REST/HTTPS", "real-time", "JSON", "high", "plat-esb"),
    ("clarion-to-order", "clarion-crm", "ordercentral", "Legacy EU Order Submission", "Overnight flat-file order submission from the legacy EU CRM; a known fragility.", "SFTP", "daily", "CSV", "high", "plat-mft"),
    ("mdm-to-erp", "datasteward-mdm", "auriga-erp", "Golden Records to ERP", "Approved customer, product and supplier master records are published to the ERP.", "Kafka", "near-real-time", "AVRO", "critical", "plat-eventbus"),
    ("mdm-to-crm", "datasteward-mdm", "vetconnect-crm", "Golden Records to CRM", "Approved customer master records are published to the CRM.", "REST/HTTPS", "near-real-time", "JSON", "high", "plat-esb"),
    ("erp-to-lake", "auriga-erp", "insightlake", "ERP Nightly Extract", "Full and delta extracts of finance, order and inventory tables.", "SFTP", "daily", "Parquet", "high", "plat-mft"),
    ("crm-to-lake", "vetconnect-crm", "insightlake", "CRM Data Export", "Account, opportunity and activity data exported for analytics.", "REST/HTTPS", "daily", "JSON", "medium", "plat-esb"),
    ("lims-to-lake", "labcore-lims", "insightlake", "QC Result Ingestion", "Released analytical results ingested for quality analytics.", "REST/HTTPS", "hourly", "JSON", "medium", "plat-esb"),
    ("lake-to-bi", "insightlake", "vistareports-bi", "Curated Data Products to BI", "Certified data products exposed to the enterprise BI layer.", "SQL/JDBC", "real-time", "Tabular", "high", "plat-lakehouse"),
    ("lake-to-mlops", "insightlake", "modelforge", "Feature Data to MLOps", "Curated feature tables consumed by training and inference pipelines.", "SQL/JDBC", "hourly", "Tabular", "medium", "plat-lakehouse"),
    ("lake-to-catalog", "insightlake", "lineageiq", "Lineage Harvest", "Pipeline and table metadata harvested into the data catalogue.", "REST/HTTPS", "daily", "JSON", "low", "plat-esb"),
    ("erp-to-mes", "auriga-erp", "prodline-mes", "Production Order Download", "Released production orders and master recipes are pushed to the shop floor.", "REST/HTTPS", "real-time", "XML", "critical", "plat-esb"),
    ("mes-to-erp", "prodline-mes", "auriga-erp", "Batch Confirmation & Yield", "Confirmed quantities, yields and consumption post back to the ERP.", "REST/HTTPS", "real-time", "XML", "critical", "plat-esb"),
    ("mes-to-lims", "prodline-mes", "labcore-lims", "In-Process Sample Requests", "Sampling points in the batch record raise test requests in the LIMS.", "REST/HTTPS", "real-time", "JSON", "critical", "plat-esb"),
    ("lims-to-release", "labcore-lims", "releasedesk", "QC Result Set for Disposition", "Approved analytical results are assembled for batch disposition review.", "REST/HTTPS", "event-driven", "JSON", "critical", "plat-esb"),
    ("mes-to-release", "prodline-mes", "releasedesk", "Electronic Batch Record for Review", "The completed electronic batch record is handed to review by exception.", "REST/HTTPS", "event-driven", "JSON", "critical", "plat-esb"),
    ("lims-to-qms", "labcore-lims", "qualisphere-qms", "Out-of-Specification to Deviation", "Confirmed OOS results automatically raise a deviation record.", "REST/HTTPS", "event-driven", "JSON", "critical", "plat-esb"),
    ("qms-to-lms", "qualisphere-qms", "learnpath-lms", "Retraining Assignment", "CAPA actions requiring retraining assign curricula to affected staff.", "REST/HTTPS", "event-driven", "JSON", "high", "plat-esb"),
    ("cmms-to-mes", "maintainx-cmms", "prodline-mes", "Equipment Availability Status", "Maintenance and calibration status gates equipment use on the line.", "REST/HTTPS", "near-real-time", "JSON", "high", "plat-esb"),
    ("erp-to-wms", "auriga-erp", "storeflow-wms", "Outbound Delivery Instructions", "Deliveries and picking waves are released to the warehouse.", "REST/HTTPS", "real-time", "XML", "critical", "plat-esb"),
    ("wms-to-erp", "storeflow-wms", "auriga-erp", "Goods Movement Confirmations", "Receipts, putaways and despatch confirmations post back to inventory.", "REST/HTTPS", "real-time", "XML", "critical", "plat-esb"),
    ("wms-to-tms", "storeflow-wms", "coldlink-tms", "Shipment Booking Request", "Packed shipments are booked onto validated cold-chain lanes.", "REST/HTTPS", "real-time", "JSON", "high", "plat-esb"),
    ("tms-to-carrier", "coldlink-tms", "ext-carrier-api", "Carrier Booking & Tracking", "Bookings, labels and tracking events exchanged with carriers.", "REST/HTTPS", "real-time", "JSON", "high", "plat-apigw"),
    ("iot-to-tms", "coldchain-hub", "coldlink-tms", "Temperature Excursion Alerts", "Logger telemetry raises excursion alerts against in-transit shipments.", "Kafka", "real-time", "AVRO", "high", "plat-eventbus"),
    ("mes-to-serial", "prodline-mes", "serialtrack", "Serial Commissioning Events", "Units are commissioned and aggregated as they are packed.", "Kafka", "real-time", "AVRO", "high", "plat-eventbus"),
    ("serial-to-authority", "serialtrack", "ext-health-authority", "Track & Trace Reporting", "Product movement events reported to national traceability systems.", "AS2", "daily", "EPCIS XML", "high", "plat-mft"),
    ("edc-to-ctms", "clincap-edc", "vettrial-ctms", "Clinical Data Extract", "Locked study data is extracted into trial management for reporting.", "SFTP", "weekly", "SDTM", "high", "plat-mft"),
    ("ctms-to-rim", "vettrial-ctms", "regdossier", "Study Report Package", "Final study reports are filed into the regulatory dossier structure.", "REST/HTTPS", "event-driven", "JSON", "high", "plat-esb"),
    ("rim-to-gateway", "regdossier", "esubmit-gateway", "Submission Package Transfer", "Assembled dossiers are transferred to the submission gateway.", "REST/HTTPS", "event-driven", "eCTD", "critical", "plat-esb"),
    ("gateway-to-authority", "esubmit-gateway", "ext-health-authority", "Regulatory Submission", "Validated submission packages are transmitted to the agency.", "AS2", "event-driven", "eCTD", "critical", "plat-mft"),
    ("pv-to-rim", "safetyvault", "regdossier", "Safety Signal to Regulatory", "Confirmed safety signals feed labelling and dossier commitments.", "REST/HTTPS", "event-driven", "JSON", "critical", "plat-esb"),
    ("desk-to-pv", "vetsupport-desk", "safetyvault", "Suspected Adverse Event Handoff", "Customer contacts flagged as suspected adverse events are handed to safety.", "REST/HTTPS", "real-time", "JSON", "critical", "plat-esb"),
    ("store-to-order", "vetstore", "ordercentral", "Portal Order Submission", "Self-service portal and app orders enter the order hub.", "REST/HTTPS", "real-time", "JSON", "high", "plat-apigw"),
    ("edi-to-order", "ext-distributor-edi", "ordercentral", "Distributor EDI Orders", "EDI purchase orders received from distributor trading partners.", "AS2", "hourly", "EDIFACT", "high", "plat-mft"),
    ("ap-to-erp", "invoiceiq", "auriga-erp", "Approved Invoice Posting", "Matched and approved supplier invoices post to accounts payable.", "REST/HTTPS", "hourly", "JSON", "high", "plat-esb"),
    ("erp-to-treasury", "auriga-erp", "treasuryone", "Payment Proposal to Treasury", "Approved payment proposals are released for bank transmission.", "SFTP", "daily", "ISO 20022", "critical", "plat-mft"),
    ("treasury-to-bank", "treasuryone", "ext-banking-network", "Payment File Transmission", "Signed payment files and statement retrieval with banking partners.", "SFTP", "daily", "ISO 20022", "critical", "plat-mft"),
    ("hcm-to-iam", "peoplecore-hcm", "identityone", "Worker Lifecycle to Identity", "Joiner, mover and leaver events drive identity and entitlement changes.", "SCIM", "near-real-time", "JSON", "critical", "plat-esb"),
    ("hcm-to-lms", "peoplecore-hcm", "learnpath-lms", "Worker & Role Feed", "Worker and job role data drives curriculum assignment.", "REST/HTTPS", "daily", "JSON", "high", "plat-esb"),
    ("hcm-to-payroll", "peoplecore-hcm", "payrollpro", "Payroll Input Feed", "Pay-affecting worker changes are transferred to payroll.", "SFTP", "monthly", "CSV", "critical", "plat-mft"),
    ("iam-to-siem", "identityone", "sentinelops-siem", "Authentication Event Feed", "Authentication and entitlement change events feed security monitoring.", "Kafka", "real-time", "JSON", "high", "plat-eventbus"),
    ("cmdb-to-itsm", "assetcore-cmdb", "serviceone-itsm", "Configuration Item Sync", "Configuration items and relationships synchronise into service management.", "REST/HTTPS", "hourly", "JSON", "medium", "plat-esb"),
    ("erp-to-aps", "auriga-erp", "planwise-aps", "Demand History & Inventory", "Shipment history and stock positions feed planning.", "SFTP", "daily", "CSV", "high", "plat-mft"),
    ("aps-to-erp", "planwise-aps", "auriga-erp", "Planned Orders", "Approved supply plans are released as planned orders.", "REST/HTTPS", "daily", "JSON", "high", "plat-esb"),
    ("eln-to-lake", "helix-eln", "insightlake", "Experiment Data Extract", "Structured experiment results are extracted for research analytics.", "REST/HTTPS", "daily", "JSON", "medium", "plat-esb"),
    ("edms-to-qms", "edms-docuvault", "qualisphere-qms", "Controlled Document Links", "Effective SOP versions are linked to quality records and training.", "REST/HTTPS", "near-real-time", "JSON", "high", "plat-esb"),
]

for fslug, src, dst, name, desc, protocol, freq, fmt, crit, platform in FLOWS:
    fid = "flow-" + fslug
    src_id = app_id_by_slug.get(src, "app-" + src if ("app-" + src) in nodes else src)
    dst_id = app_id_by_slug.get(dst, "app-" + dst if ("app-" + dst) in nodes else dst)
    add_node(fid, "IntegrationFlow", "it", "T3", name, desc, owner="Integration Competency Centre",
             criticality=crit, health=health_for("active", crit, fid),
             tags=["integration", protocol.split("/")[0].lower()],
             props={"protocol": protocol, "frequency": freq, "format": fmt,
                    "direction": "unidirectional", "middleware": nodes[platform]["name"],
                    "gxpDataInTransit": crit == "critical"})
    add_edge(src_id, "connects_to", fid)
    add_edge(fid, "connects_to", dst_id)
    add_edge(fid, "runs_on", platform)
    add_edge(src_id, "integrates_with", dst_id, via=fid)
    for suffix in ("rest", "events", "soap", "files", "sql"):
        ifid = app_interfaces.get(src, {}).get(suffix)
        if ifid:
            add_edge(fid, "depends_on", ifid, note="Consumes the published interface")
            break

# ---------------------------------------------------------------------------
# Deliberate imperfections that make the analysis views worth opening
# ---------------------------------------------------------------------------
# 1. One shared datastore that four other applications read directly.
GOLDEN = app_stores["datasteward-mdm"]["db"]
nodes[GOLDEN]["name"] = "Golden Record Store"
nodes[GOLDEN]["description"] = ("Single shared store of golden customer, product, supplier and site records. "
                                "Four applications read it directly rather than through a published interface.")
nodes[GOLDEN]["criticality"] = "critical"
nodes[GOLDEN]["health"] = "watch"
nodes[GOLDEN]["tags"] = sorted(set(nodes[GOLDEN]["tags"] + ["single-point-of-failure"]))
for consumer in ("auriga-erp", "ordercentral", "billwise", "vetconnect-crm"):
    units = app_units[consumer]
    reader = units.get("api") or units.get("core") or list(units.values())[0]
    add_edge(reader, "reads", GOLDEN, note="Direct database read; not an approved integration pattern")
    add_edge(app_id_by_slug[consumer], "depends_on", app_id_by_slug["datasteward-mdm"],
             note="Direct dependency on the shared golden record store")

# 2. An application nobody has mapped to a business capability yet.
add_node("app-reportmill", "Application", "it", "T1", "ReportMill (Legacy Reporting)",
         "Legacy reporting tool still running in production. Nobody has claimed it, and no business "
         "capability is recorded against it - it shows up in the data quality panel as an orphan.",
         owner="Unassigned", lifecycle="phase-out", criticality="low", health="at-risk",
         tags=["application", "analytics", "internal", "orphan"],
         props={"category": "Analytics", "vendor": "Internal", "costBand": "S",
                "hosting": "internal", "archetype": "legacy_monolith"},
         externalRefs={"cmdb": "CI-APP-REPORTMILL"})
add_node("du-reportmill-core", "DeployableUnit", "it", "T2", "ReportMill - Application Server",
         "Single legacy deployable running on an unsupported application server version.",
         owner="Unassigned", lifecycle="phase-out", criticality="low", health="at-risk",
         tags=["deployable-unit", "core"],
         props={"unitType": "Monolithic Application Server", "environment": "production", "replicas": 1})
add_edge("app-reportmill", "contains", "du-reportmill-core")
add_edge("du-reportmill-core", "realizes", "app-reportmill")
add_edge("du-reportmill-core", "runs_on", "plat-appserver")
add_edge("du-reportmill-core", "reads", app_stores["auriga-erp"]["db"], note="Undocumented read against the ERP schema")

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
LIFECYCLES = {"plan", "active", "phase-out", "retired"}
CRITICALITIES = {"low", "medium", "high", "critical"}
HEALTHS = {"ok", "watch", "at-risk", "unknown"}
EDGE_TYPES = {"contains", "supports", "realizes", "depends_on", "connects_to",
              "integrates_with", "runs_on", "hosted_in", "stores", "reads"}


def validate():
    problems = []
    parents = {}
    for e in edges.values():
        if e["type"] not in EDGE_TYPES:
            problems.append("unknown edge type: " + e["type"])
        if e["type"] == "contains":
            if e["to"] in parents:
                problems.append("node %s has two contains-parents (%s, %s)" % (e["to"], parents[e["to"]], e["from"]))
            parents[e["to"]] = e["from"]
    # contains must be acyclic
    for nid in parents:
        seen, cur = set(), nid
        while cur in parents:
            cur = parents[cur]
            if cur in seen:
                problems.append("contains cycle at " + nid)
                break
            seen.add(cur)
    for n in nodes.values():
        if n["lifecycle"] not in LIFECYCLES:
            problems.append("%s: bad lifecycle %r" % (n["id"], n["lifecycle"]))
        if n["criticality"] not in CRITICALITIES:
            problems.append("%s: bad criticality %r" % (n["id"], n["criticality"]))
        if n["health"] not in HEALTHS:
            problems.append("%s: bad health %r" % (n["id"], n["health"]))
        if not n["name"] or not n["description"]:
            problems.append("%s: missing name or description" % n["id"])
    supported = {e["from"] for e in edges.values() if e["type"] == "supports"}
    orphans = [n["id"] for n in nodes.values() if n["type"] == "Application" and n["id"] not in supported]
    return problems, orphans


def canonical_node(n):
    return {k: n[k] for k in NODE_KEYS}


def canonical_edge(e):
    return {k: e[k] for k in EDGE_KEYS}


def write(path, payload):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def main():
    problems, orphans = validate()
    if problems:
        for p in problems:
            print("MODEL ERROR:", p)
        raise SystemExit(1)

    node_list = [canonical_node(nodes[i]) for i in sorted(nodes)]
    edge_list = [canonical_edge(edges[i]) for i in sorted(edges)]
    nodes_doc = {"format": "business-it-map", "kind": "nodes", "version": MODEL_VERSION,
                 "model": MODEL_NAME, "nodes": node_list}
    edges_doc = {"format": "business-it-map", "kind": "edges", "version": MODEL_VERSION,
                 "model": MODEL_NAME, "edges": edge_list}

    os.makedirs(DATA, exist_ok=True)
    write(os.path.join(DATA, "nodes.json"), nodes_doc)
    write(os.path.join(DATA, "edges.json"), edges_doc)

    with open(os.path.join(DATA, "seed-data.js"), "w", encoding="utf-8") as fh:
        fh.write("// Generated by app/tools/generate_seed.py - do not edit by hand.\n")
        fh.write("// Same content as nodes.json / edges.json, wrapped as an ES module so the\n")
        fh.write("// application also runs directly from the file system without a web server.\n")
        fh.write("export const NODES_DOCUMENT = ")
        json.dump(nodes_doc, fh, indent=2, ensure_ascii=False)
        fh.write(";\n\nexport const EDGES_DOCUMENT = ")
        json.dump(edges_doc, fh, indent=2, ensure_ascii=False)
        fh.write(";\n")

    from collections import Counter
    ntypes = Counter(n["type"] for n in node_list)
    etypes = Counter(e["type"] for e in edge_list)
    print("nodes: %d   edges: %d" % (len(node_list), len(edge_list)))
    print("node types:", ", ".join("%s=%d" % kv for kv in sorted(ntypes.items())))
    print("edge types:", ", ".join("%s=%d" % kv for kv in sorted(etypes.items())))
    print("orphan applications (no supports edge):", ", ".join(orphans) or "none")
    for lvl in ("B1", "B2", "B3", "B4", "T1", "T2", "T3", "T4", "T5"):
        print("  %s: %d" % (lvl, sum(1 for n in node_list if n["level"] == lvl)))


if __name__ == "__main__":
    main()
