# DS-03 — Experiment Tracking Patterns

> **Goal**: Establish experiment tracking patterns that ensure reproducibility, enable systematic comparison of approaches, and satisfy audit requirements in a regulated environment.

---

## What You're Learning
- How to structure experiment tracking for reproducibility and comparability
- Hyperparameter logging strategies that make experiments searchable and comparable
- Comparison frameworks that help you make evidence-based model selection decisions
- How experiment tracking feeds into the model registry and regulatory compliance

## Concept: Experiments as First-Class Citizens

In academic data science, experiments often live in notebooks with names like `model_v2_final_FINAL_v3.ipynb`. In enterprise data science — especially regulated environments — every experiment is a record that may need to be produced during an audit.

**Why experiment tracking matters in animal pharma:**

- **Regulatory reproducibility**: An FDA auditor may ask "How did you arrive at this model?" You need to reconstruct the full path: every approach tried, every parameter tuned, every dataset used.
- **Institutional memory**: When a data scientist leaves, their experiments shouldn't leave with them. The next person needs to understand what was tried and why.
- **Efficient iteration**: Without tracking, teams retry failed approaches. Good tracking lets you see what's already been explored and build from there.
- **Evidence-based decisions**: "We chose Random Forest over XGBoost" needs evidence. Tracked experiments provide that evidence.

**The experiment tracking stack:**

```
Hypothesis → Design → Execute → Log → Compare → Decide → Document
     ↑                                                        |
     └──────────── (learnings feed back) ─────────────────────┘
```

## The Challenge

### Part 1 — Design Your Experiment Log Schema

Ask Copilot to help you create a standardized experiment log format:

```
@data-scientist

Help me design an experiment log schema for data science work at an animal pharmaceutical company. Each experiment entry should capture enough information to:
1. Fully reproduce the experiment
2. Compare it meaningfully against other experiments
3. Satisfy a regulatory audit trail
4. Be searchable and filterable

Include these sections:

**Experiment Identity**
- Experiment ID (auto-generated, sequential)
- Experiment name (human-readable)
- Use case / project reference
- Hypothesis (what we're testing)
- Date started, date completed
- Experimenter (who ran it)

**Design**
- Approach description (algorithm, methodology)
- Independent variables (what we're changing)
- Dependent variables (what we're measuring)
- Control/baseline (what we're comparing against)
- Success criteria (how we'll know it worked)

**Data**
- Dataset version (DVC hash or equivalent)
- Dataset description (source, size, date range, species coverage)
- Train/validation/test split strategy
- Preprocessing steps applied

**Configuration**
- Full hyperparameter set (logged as key-value pairs)
- Random seed(s)
- Code version (Git SHA)
- Environment (Python version, key package versions)
- Compute infrastructure (CPU/GPU, memory, training time)

**Results**
- Primary metric: name, value, confidence interval
- Secondary metrics: table of all tracked metrics
- Performance by subgroup (if applicable)
- Training curves (loss, metric over epochs/iterations)
- Notable observations or anomalies

**Decision**
- Outcome: Success / Partial Success / Failure / Inconclusive
- Decision: Proceed to next stage / Iterate / Abandon / Merge with another experiment
- Rationale (why this decision, in 2-3 sentences)
- Next steps

**Artifacts**
- Links to: model artifacts, notebooks, plots, data snapshots
- MLflow run ID (or equivalent tracking system reference)

Format as both a markdown template and a Python dataclass I could use programmatically.
```

### Part 2 — Build a Comparison Framework

When you have 15 experiments for the same use case, you need a systematic way to compare them. Ask Copilot:

```
@data-scientist

Help me design an experiment comparison framework. I need:

1. **Comparison table generator** — Given a set of experiment IDs, produce a side-by-side table showing:
   - Key hyperparameters that differ between experiments
   - All tracked metrics
   - Training time and compute cost
   - Data version used
   - Status/decision

2. **Statistical comparison protocol** — For comparing model performance:
   - When to use paired t-tests vs. bootstrap confidence intervals vs. McNemar's test
   - How to handle multiple comparisons (Bonferroni, Holm-Bonferroni, or FDR)
   - Minimum sample size requirements for meaningful comparisons
   - How to report results: effect sizes AND p-values, not just p-values

3. **Visualization templates** — Standard plots for experiment comparison:
   - Parallel coordinates plot for hyperparameter exploration
   - Metric comparison bar charts with error bars
   - Training curve overlays
   - Confusion matrix comparison (for classification tasks)
   - Calibration curve comparison

4. **Decision matrix** — A structured framework for choosing between candidate models:
   - Performance (weighted by business priority)
   - Complexity (simpler is better when performance is comparable)
   - Inference latency (matters for real-time serving)
   - Interpretability (matters more for regulated models)
   - Maintenance burden (retraining frequency, data dependency complexity)

Give me the comparison table as a Python function that reads from MLflow and generates markdown, and the decision matrix as a scoring template.
```

### Part 3 — Implement Reproducibility Patterns

Reproducibility is non-negotiable. Ask Copilot:

```
@data-scientist

Help me create a reproducibility checklist and tooling for ML experiments in a regulated environment. I need:

1. **Pre-experiment checklist** — Before running any experiment:
   - [ ] Dataset version pinned and recorded (DVC hash or snapshot ID)
   - [ ] Code committed to Git (no uncommitted changes)
   - [ ] Random seeds set for: Python, NumPy, PyTorch/TensorFlow, scikit-learn
   - [ ] Environment captured (pip freeze or conda export)
   - [ ] Experiment ID assigned and log entry created
   - [ ] Hypothesis and success criteria documented

2. **Reproducibility wrapper** — A Python decorator or context manager that automatically:
   - Sets all random seeds from a single seed value
   - Logs the Git SHA of the current commit
   - Logs the pip freeze output
   - Logs system info (Python version, OS, GPU availability)
   - Starts an MLflow run with all the above as parameters
   - Saves the experiment to a structured log file

3. **Validation script** — Given an experiment ID, attempt to reproduce it:
   - Check out the exact code version
   - Install the exact dependencies
   - Load the exact dataset version
   - Run with the exact configuration
   - Compare results (within tolerance)
   - Report: reproducible / not reproducible / partially reproducible (and why)

4. **ALCOA+ compliance mapping** — How does our experiment tracking satisfy each ALCOA+ principle?
   - Attributable: logged experimenter, Git commit author
   - Legible: structured log format, not cryptic abbreviations
   - Contemporaneous: timestamps on all entries, logged during execution (not after)
   - Original: raw results preserved, not edited after the fact
   - Accurate: automated logging (not manual transcription)
   - Complete: nothing deleted, all experiments logged (even failures)
   - Consistent: same schema across all experiments
   - Enduring: stored in version control, backed up
   - Available: accessible to authorized team members

Write the Python code for items 2 and 3, and the checklist and compliance mapping as markdown.
```

### Part 4 — Connect Experiment Tracking to Model Registry

Experiments that succeed become models in the registry. Ask Copilot:

```
@data-scientist

Help me design the handoff workflow from experiment tracking to model registry. When an experiment succeeds, what happens next?

1. **Promotion criteria** — What must be true before an experiment result becomes a registered model?
   - Minimum performance thresholds met
   - Reproducibility validated
   - Experiment log complete (no missing fields)
   - Code review completed
   - At least N independent validation runs

2. **Automatic model card pre-population** — When promoting an experiment to the registry:
   - Which experiment log fields map to which model card fields?
   - What additional information must be manually added?
   - Generate a draft model card from the experiment log

3. **Lineage chain** — From registered model, trace back to:
   - The experiment(s) that produced it
   - All alternative experiments considered (and why they weren't selected)
   - The data version used
   - The code version used
   - The comparison analysis that justified selection

4. **Failure documentation** — Experiments that fail are equally valuable:
   - Negative result logging: what was tried, why it didn't work
   - Searchable failure catalog: "Has anyone tried approach X for problem Y?"
   - Lessons learned that prevent duplicate dead ends

Design this as a workflow specification with clear inputs, outputs, and decision points.
```

## Save Step

- Save your experiment log schema to `personas/data-scientist/workspace/artifacts/experiment-log-schema.md`
- Save the comparison framework to `personas/data-scientist/workspace/artifacts/experiment-comparison-framework.md`
- Save reproducibility patterns to `personas/data-scientist/workspace/artifacts/reproducibility-patterns.md`
- Save the experiment-to-registry workflow to `personas/data-scientist/workspace/artifacts/experiment-to-registry-workflow.md`
- Consider contributing the experiment log schema to `knowledge-base/best-practices/by-role/` as a data science best practice
- Mark DS-03 complete in your journey

## Stretch Goal

Run a real (or simulated) experiment using your tracking patterns. Pick a simple ML task (even from a public dataset), and:

1. Create the experiment log entry before starting
2. Use the reproducibility wrapper during training
3. Log everything to MLflow
4. Run it twice and verify reproducibility
5. Fill out the complete experiment log
6. Walk through the promotion criteria to see if it would qualify for the model registry

```
@data-scientist

Help me set up a demonstration experiment using our tracking patterns. I want to train a simple model (suggest something relevant to animal pharma — even with synthetic data) and walk through the complete experiment lifecycle: hypothesis, design, execution with full tracking, comparison against a baseline, and promotion decision. Make it realistic but achievable in one working session.
```

---

**Next**: DS-04 — MLOps Pipeline Design
