"""
Data Pipeline Template — Exercise File

For: Data Scientists, Automation Engineers
Context: Animal pharmaceutical data processing

INSTRUCTIONS:
Open this file and use Copilot to complete each section.
The docstrings and comments guide Copilot toward
domain-specific patterns.

TIP: Before letting Copilot complete a section, add a
comment describing your specific data source or use case.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
# TODO: Let Copilot suggest additional imports


# ============================================
# Section 1: Data Source Configuration
# ============================================
# Define configurations for common animal pharma
# data sources. These are used by the pipeline
# to connect and extract data.

@dataclass
class DataSourceConfig:
    """Configuration for a data source in the animal pharma landscape."""
    name: str
    source_type: str  # "database", "api", "file_drop", "message_queue"
    connection_string: str
    # TODO: Let Copilot suggest additional fields
    # Hint: Think about GxP audit requirements,
    # data classification level, refresh frequency


# ============================================
# Section 2: Data Quality Validation
# ============================================
# Animal pharma data must meet ALCOA+ standards:
# Attributable, Legible, Contemporaneous, Original, Accurate
# + Complete, Consistent, Enduring, Available
#
# Create a validator that checks these principles.

# TODO: Let Copilot complete the ALCOA+ validator
# Hint: Describe what each principle means for your data type


# ============================================
# Section 3: Feature Engineering Pipeline
# ============================================
# Create a feature engineering pipeline for a
# common animal pharma ML use case. Choose one:
# - Batch yield prediction (manufacturing)
# - Stability study outcome prediction (R&D)
# - Adverse event signal detection (pharmacovigilance)
# - Demand forecasting (supply chain)

# TODO: Add a comment describing your chosen use case,
# then let Copilot build the feature pipeline


# ============================================
# Section 4: Model Training Pipeline
# ============================================
# Create a training pipeline that includes:
# - Experiment tracking (MLflow compatible)
# - Hyperparameter logging
# - Model versioning
# - Validation metrics
# - GxP compliance logging (if model is Tier 3/4)

# TODO: Let Copilot complete the training pipeline
# Hint: Reference the model risk framework tiers


# ============================================
# Section 5: Pipeline Orchestration
# ============================================
# Define an Airflow-style DAG for the complete pipeline:
# extract → validate → transform → train → evaluate → register
# Include error handling, retry logic, and alerting.

# TODO: Let Copilot suggest the DAG definition
# Hint: Describe your scheduling requirements and SLAs
