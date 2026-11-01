# PitchSense Architecture Overview

## 1. System Vision
PitchSense is a sports analytics and applied machine learning platform engineered to answer the central question of modern T20 cricket: **"What are the real odds, right now?"**

The platform calculates calibrated ball-by-ball win probabilities for the chasing team across Indian Premier League matches using an explainable scikit-learn Logistic Regression pipeline.

```mermaid
flowchart TD
    subgraph Data Pipeline
        CRIC[Cricsheet IPL Data] --> ING[JSON Ingestion & Extraction]
        ING --> CLN[Data Cleaning & DLS Filter]
        CLN --> FE[Feature Engineering Engine]
        FE --> SPLIT[Match-Level Train/Test Split]
        SPLIT --> TRN[scikit-learn Logistic Regression Pipeline]
        SPLIT --> EVAL[Evaluation Engine & Baseline Comparison]
        TRN --> ART[Model Artifact: logistic_regression.joblib]
        EVAL --> MET[Evaluation Metrics: evaluation_metrics.json]
    end

    subgraph Backend Engine
        ART --> API[FastAPI Application: api/index.py]
        MET --> API
        DATA[Processed Matches Store] --> API
        API --> EP1["GET /api/health"]
        API --> EP2["GET /api/matches"]
        API --> EP3["GET /api/matches/:id/replay"]
        API --> EP4["GET /api/model/metrics"]
        API --> EP5["POST /api/predict"]
    end

    subgraph Next.js Frontend
        API --> CLI[Typed API Client: lib/api.ts]
        CLI --> P1["/ (Home Hero & Analytics)"]
        CLI --> P2["/dashboard (Analytics Control Center)"]
        CLI --> P3["/matches (1,195 Match Explorer)"]
        CLI --> P4["/match-center (Interactive Replay)"]
        CLI --> P5["/probability-lab (Scenario Simulator)"]
        CLI --> P6["/model-intelligence (Metrics & Weights)"]
        CLI --> P7["/methodology (12-Step Walkthrough)"]
        CLI --> P8["/data-sources (Cricsheet Attribution)"]
        CLI --> P9["/security (Zero-Credential Policy)"]
        CLI --> P10["/about (Mission & Roadmap)"]
    end
```

## 2. Directory Layout
- `app/`: Next.js 15 App Router pages and native API route handlers.
- `components/`: UI components, cricket pitch visualizer, animated ball, sound synthesizer.
- `api/`: FastAPI backend implementation (`api/index.py`).
- `ml/`: Model training (`ml/train.py`), evaluation scripts, feature calculations.
- `backend/`: Data ingestion, processing, and match store builders.
- `data/processed/`: Structured match metadata and precompiled ball-by-ball replays.
- `artifacts/model/`: Serialized scikit-learn pipeline and evaluation metrics.
- `tests/backend/`: Integration and unit tests for API endpoints and model validation.
- `docs/`: Comprehensive technical and deployment documentation.

