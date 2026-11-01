"use client";

import React from "react";
import Link from "next/link";
import {
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Workflow,
  ArrowRight,
} from "lucide-react";

export default function MethodologyPage() {
  const steps = [
    {
      number: "01",
      title: "Data Acquisition",
      summary: "Acquiring official ball-by-ball JSON match archives from Cricsheet.",
      detail:
        "We source official match records directly from Cricsheet (ipl_json.zip). Cricsheet provides peer-reviewed cricket data with ball-level detail under the Open Data Commons Attribution License (ODC-By v1.0).",
    },
    {
      number: "02",
      title: "JSON Ingestion",
      summary: "Traversing nested Innings → Overs → Deliveries structures.",
      detail:
        "Cricsheet format organizes matches as hierarchical documents containing metadata (season, venue, toss, outcome) and arrays of overs and deliveries. Our ingestion engine unpacks nested structures into structured relational tables.",
    },
    {
      number: "03",
      title: "Data Cleaning & DLS Filter",
      summary: "Excluding rain-interrupted, super-over, and incomplete fixtures.",
      detail:
        "Duckworth-Lewis-Stern (DLS) matches fundamentally distort target calculations and legal ball limits. We systematically excluded 23 DLS-affected matches and 25 ties/no-results to ensure clean 120-ball match-state invariants.",
    },
    {
      number: "04",
      title: "Ball-by-Ball Flattening",
      summary: "Transforming 1,195 matches into 138,683 sequential delivery rows.",
      detail:
        "Every row represents a discrete delivery in the chasing innings, tracking cumulative runs, fallen wickets, legal deliveries bowled, and dismissal kinds.",
    },
    {
      number: "05",
      title: "Feature Engineering",
      summary: "Extracting runs needed, balls left, wickets in hand, CRR, RRR, progress.",
      detail:
        "We engineer 6 core features: runs_needed = max(0, target - score), balls_remaining = 120 - legal_balls (wides & noballs do not decrement remaining balls), wickets_in_hand = 10 - wickets, current_run_rate, required_run_rate, and innings_progress ratio.",
    },
    {
      number: "06",
      title: "Target Generation",
      summary: "Binary indicator: 1 = chasing team won, 0 = chasing team lost.",
      detail:
        "Target is grounded strictly in completed match outcomes. Matches where chasing team successfully met or surpassed the target have target = 1; matches where they fell short or were bowled out have target = 0.",
    },
    {
      number: "07",
      title: "Match-Level Train/Test Split",
      summary: "Preventing cross-match data leakage by splitting on Match ID.",
      detail:
        "Crucial integrity rule: deliveries from the same match share correlated contexts (pitch degradation, dew, momentum). If split by random delivery, earlier balls in the training set would leak the outcome of test balls. We split by unique Match ID: 956 matches train, 239 matches test.",
    },
    {
      number: "08",
      title: "Heuristic Baseline Comparison",
      summary: "Benchmarking against a transparent cricket pressure rule.",
      detail:
        "We construct a rule-based sigmoid model computing net run rate pressure (CRR - RRR) weighted by wickets in hand. This provides a transparent reference to prove the statistical value added by machine learning.",
    },
    {
      number: "09",
      title: "Logistic Regression Training",
      summary: "Fitting scikit-learn StandardScaler + LogisticRegression pipeline.",
      detail:
        "We fit sklearn.linear_model.LogisticRegression with max_iter=1000, random_state=42. StandardScaler is fitted strictly on the training set to prevent scaler leakage.",
    },
    {
      number: "10",
      title: "Model Evaluation",
      summary: "Measuring log-loss (0.446), accuracy (78%), Brier score, and calibration.",
      detail:
        "Log-loss serves as the primary evaluation metric because cricket odds must produce accurate probabilities, not merely binary winners. The resulting model achieves 0.446 log-loss on unseen matches.",
    },
    {
      number: "11",
      title: "Historical Match Replay Store",
      summary: "Precomputing delivery-level probabilities for 101 diverse matches.",
      detail:
        "To provide instant sub-millisecond client rendering without repeated batch inference, we precompile full ball-by-ball probability trails across diverse iconic seasons.",
    },
    {
      number: "12",
      title: "Probability Visualization",
      summary: "Broadcasting-style interactive curves and 22-yard pitch animations.",
      detail:
        "Rendered via Recharts and custom vector SVG graphics, delivering clear odds shifts on wickets, boundaries, and dot ball pressure spells.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Technical Pipeline Architecture
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          Engineering & Modeling Methodology
        </h1>
        <p className="text-xs text-pitch-muted">
          A step-by-step technical breakdown of our data pipeline, feature engineering, and evaluation framework.
        </p>
      </div>

      {/* WHY MATCH-LEVEL SPLIT MATTERS ALERT BOX */}
      <div className="bg-pitch-secondary/90 rounded-3xl p-6 border-2 border-pitch-lime/40 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-pitch-lime font-bold text-sm font-display">
          <ShieldCheck className="w-5 h-5 text-pitch-lime" />
          <span>Core Principle: Why Match-Level Splitting Prevents Data Leakage</span>
        </div>
        <p className="text-xs sm:text-sm text-pitch-secondary leading-relaxed">
          In time-series sports analytics, a common rookie error is splitting delivery rows randomly across train and test sets (e.g. <code>train_test_split(deliveries_df)</code>).
          Because a single cricket match shares pitch conditions, weather, dew factor, and match outcome across all 120 balls, having Ball 1.2 in the training set and Ball 1.3 in the test set causes <strong>massive information leakage</strong> and artificially inflated accuracy.
        </p>
        <p className="text-xs text-pitch-muted leading-relaxed font-mono">
          PitchSense strictly splits by <strong>Match ID</strong>. All deliveries of a given match exist exclusively in either the training set OR the testing set. The model is evaluated on matches it has never seen before.
        </p>
      </div>

      {/* 12-STEP METHODOLOGY LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-pitch-ivory font-display mb-6">
          The 12-Step Implementation Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div
              key={s.number}
              className="bg-pitch-secondary/60 rounded-2xl p-5 border border-pitch-border hover:border-pitch-lime/40 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-pitch-lime bg-pitch-forest px-2 py-0.5 rounded border border-pitch-border">
                    Step {s.number}
                  </span>
                  <span className="text-[11px] text-pitch-muted font-mono">{s.summary}</span>
                </div>
                <h3 className="font-bold text-pitch-ivory text-base mb-1.5">{s.title}</h3>
                <p className="text-xs text-pitch-muted leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
        <h3 className="text-lg font-bold text-pitch-ivory font-display">
          Feature Formulations & Mathematical Invariants
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-lime font-bold">Runs Needed</span>
            <div className="text-pitch-ivory">runs_needed = max(0, target - score)</div>
            <p className="text-pitch-muted text-[11px] pt-1">
              Non-negative bound. Reaching 0 signifies match victory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-lime font-bold">Balls Remaining</span>
            <div className="text-pitch-ivory">balls_rem = 120 - legal_deliveries</div>
            <p className="text-pitch-muted text-[11px] pt-1">
              Wides & no-balls add runs but do not decrement legal balls remaining.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-lime font-bold">Required Run Rate</span>
            <div className="text-pitch-ivory">RRR = (runs_needed / balls_rem) × 6</div>
            <p className="text-pitch-muted text-[11px] pt-1">
              Clamped to 99.0 rpo when balls_rem = 0 to prevent division by zero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

