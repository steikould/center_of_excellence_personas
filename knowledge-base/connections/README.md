# Connections

Integration patterns documenting data flows between systems.

**Schema**: See `../_schema/connection-pattern.schema.md`
**Naming**: `{source}-to-{target}-{persona-tag}-{YYYY-MM}.md`

## Expected Entries

Critical integration patterns for an animal pharmaceutical company:

- [ ] LIMS → ERP (batch results to quality module)
- [ ] MES → LIMS (manufacturing data to lab)
- [ ] ERP → Supply Chain (demand and inventory)
- [ ] QMS → EDMS (CAPA documentation)
- [ ] Clinical → Regulatory (submission data)
- [ ] Pharmacovigilance → Regulatory (adverse event reporting)
- [ ] Data Lake → ML Platform (training data)
- [ ] ML Platform → Monitoring (model metrics)
- [ ] Source Systems → Data Lake (raw ingestion)
