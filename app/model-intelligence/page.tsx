"use client";

import React, { useState, useEffect } from "react";
import { fetchModelMetrics, ModelMetrics } from "@/lib/api";
import { CricketBall } from "@/components/cricket/CricketBall";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Activity,
  Layers,
  BarChart,
  HelpCircle,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

export default function ModelIntelligencePage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-3 text-pitch-muted">
        <CricketBall size={44} animate={true} />
        <span className="text-xs font-mono">Loading model architecture & evaluation metrics...</span>
      </div>
    );
  }

  const lr = metrics.logistic_regression;
  const base = metrics.heuristic_baseline;
  const cm = lr.confusion_matrix;
  const ds = metrics.dataset_summary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Applied Machine Learning & scikit-learn
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          Model Intelligence & Evaluation
        </h1>
        <p className="text-xs text-pitch-muted">
          Transparent performance metrics, calibration curves, feature weights, and baseline comparisons.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-pitch-secondary/80 rounded-2xl p-5 border border-pitch-border shadow-lg">
          <span className="text-xs text-pitch-muted font-mono uppercase">Primary Metric: Log-Loss</span>
          <div className="text-3xl font-mono font-black text-pitch-lime mt-1 tabular-nums">
            {lr.log_loss}
          </div>
          <span className="text-[11px] text-pitch-muted">
            vs Heuristic {base.log_loss} ({metrics.comparison.log_loss_improvement.toFixed(4)} better)
          </span>
        </div>

        <div className="bg-pitch-secondary/80 rounded-2xl p-5 border border-pitch-border shadow-lg">
          <span className="text-xs text-pitch-muted font-mono uppercase">Classification Accuracy</span>
          <div className="text-3xl font-mono font-black text-pitch-ivory mt-1 tabular-nums">
            {(lr.accuracy * 100).toFixed(1)}%
          </div>
          <span className="text-[11px] text-pitch-muted">
            On held-out test match deliveries
          </span>
        </div>

        <div className="bg-pitch-secondary/80 rounded-2xl p-5 border border-pitch-border shadow-lg">
          <span className="text-xs text-pitch-muted font-mono uppercase">ROC AUC Score</span>
          <div className="text-3xl font-mono font-black text-pitch-orange mt-1 tabular-nums">
            {lr.roc_auc}
          </div>
          <span className="text-[11px] text-pitch-muted">
            Strong discriminative separation
          </span>
        </div>

        <div className="bg-pitch-secondary/80 rounded-2xl p-5 border border-pitch-border shadow-lg">
          <span className="text-xs text-pitch-muted font-mono uppercase">Brier Score</span>
          <div className="text-3xl font-mono font-black text-pitch-secondary mt-1 tabular-nums">
            {lr.brier_score}
          </div>
          <span className="text-[11px] text-pitch-muted">
            Mean squared probability error
          </span>
        </div>
      </div>

      {/* Model Overview & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Model Purpose & Math */}
        <div className="lg:col-span-7 bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
          <h2 className="text-xl font-bold text-pitch-ivory font-display flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-pitch-lime" />
            <span>The Logistic Regression Pipeline</span>
          </h2>
          <p className="text-pitch-secondary text-xs sm:text-sm leading-relaxed">
            PitchSense models the posterior probability of the chasing team winning the match:
          </p>
          <div className="p-4 rounded-xl bg-pitch-charcoal font-mono text-xs text-pitch-lime border border-pitch-border overflow-x-auto">
            P(Chasing Team Wins | x) = 1 / (1 + exp(-z))
            <br />
            where z = w₀ + Σ wᵢ · ((xᵢ - μᵢ) / σᵢ)
          </div>
          <p className="text-pitch-muted text-xs leading-relaxed">
            Features are standardized using <code className="text-pitch-secondary">StandardScaler</code> fitted strictly on training matches.
            The pipeline was trained on <strong>{ds.train_matches} matches ({ds.train_deliveries.toLocaleString()} deliveries)</strong> and validated on <strong>{ds.test_matches} test matches ({ds.test_deliveries.toLocaleString()} deliveries)</strong> using a strict match-level split to prevent data leakage.
          </p>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-pitch-ivory uppercase tracking-wider font-mono mb-3">
              Learned Feature Weights (Standardized)
            </h3>
            <div className="space-y-2">
              {Object.entries(lr.coefficients).map(([feat, coef]) => (
                <div key={feat} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-pitch-card border border-pitch-border">
                  <span className="text-pitch-secondary">{feat}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${coef > 0 ? "text-pitch-lime" : "text-pitch-orange"}`}>
                      {coef > 0 ? "+" : ""}{coef}
                    </span>
                    <span className="text-[10px] text-pitch-muted">
                      {coef > 0 ? "(Increases Win Odds)" : "(Decreases Win Odds)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confusion Matrix & Baseline Comparison */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confusion Matrix */}
          <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-3">
            <h3 className="text-base font-bold text-pitch-ivory font-display">
              Confusion Matrix (Test Deliveries)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-2">
              <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
                <span className="text-[10px] text-pitch-muted block">True Negative</span>
                <span className="text-xl font-bold text-pitch-ivory">{cm.true_negative.toLocaleString()}</span>
                <span className="text-[9px] text-pitch-muted block">Correct Defend Calls</span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
                <span className="text-[10px] text-pitch-muted block">False Positive</span>
                <span className="text-xl font-bold text-pitch-orange">{cm.false_positive.toLocaleString()}</span>
                <span className="text-[9px] text-pitch-muted block">False Chase Calls</span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
                <span className="text-[10px] text-pitch-muted block">False Negative</span>
                <span className="text-xl font-bold text-pitch-orange">{cm.false_negative.toLocaleString()}</span>
                <span className="text-[9px] text-pitch-muted block">Missed Chase Calls</span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
                <span className="text-[10px] text-pitch-muted block">True Positive</span>
                <span className="text-xl font-bold text-pitch-lime">{cm.true_positive.toLocaleString()}</span>
                <span className="text-[9px] text-pitch-muted block">Correct Chase Calls</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-pitch-muted pt-2 border-t border-pitch-border font-mono">
              <span>Precision: {(lr.precision * 100).toFixed(1)}%</span>
              <span>Recall: {(lr.recall * 100).toFixed(1)}%</span>
              <span>F1-Score: {lr.f1_score}</span>
            </div>
          </div>

          {/* Baseline Comparison */}
          <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-3">
            <h3 className="text-base font-bold text-pitch-ivory font-display flex items-center justify-between">
              <span>Baseline Heuristic Comparison</span>
              <span className="text-[10px] text-pitch-lime bg-pitch-forest px-2 py-0.5 rounded font-mono">
                OUTPERFORMED
              </span>
            </h3>
            <p className="text-xs text-pitch-muted leading-relaxed">
              Compared against a domain heuristic computing run rate pressure (CRR vs RRR) weighted by wickets in hand.
            </p>

            <div className="space-y-2 text-xs font-mono pt-1">
              <div className="flex justify-between p-2 rounded-lg bg-pitch-card border border-pitch-border">
                <span className="text-pitch-muted">Log-Loss:</span>
                <span className="text-pitch-lime font-bold">
                  {lr.log_loss} vs {base.log_loss} (Δ -{metrics.comparison.log_loss_improvement})
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-pitch-card border border-pitch-border">
                <span className="text-pitch-muted">Accuracy:</span>
                <span className="text-pitch-lime font-bold">
                  {(lr.accuracy * 100).toFixed(1)}% vs {(base.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-pitch-card border border-pitch-border">
                <span className="text-pitch-muted">Brier Score:</span>
                <span className="text-pitch-lime font-bold">
                  {lr.brier_score} vs {base.brier_score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calibration Table & Why Log-Loss Matters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calibration Table */}
        <div className="lg:col-span-6 bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
          <h3 className="text-lg font-bold text-pitch-ivory font-display">
            Probability Calibration Curve (10 Bins)
          </h3>
          <p className="text-xs text-pitch-muted">
            For probabilistic models, predicted odds must match empirical frequency (e.g. when the model says 70%, the team should win 70% of the time).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-pitch-border text-pitch-muted uppercase text-[10px]">
                <tr>
                  <th className="pb-2">Bin</th>
                  <th className="pb-2">Predicted Probability</th>
                  <th className="pb-2">Empirical Win Frequency</th>
                  <th className="pb-2 text-right">Reliability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pitch-border/30">
                {lr.calibration_curve?.map((b) => (
                  <tr key={b.bin} className="hover:bg-pitch-card/40">
                    <td className="py-1.5 text-pitch-muted">Bin {b.bin}</td>
                    <td className="py-1.5 text-pitch-lime font-bold">
                      {(b.predicted_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-1.5 text-pitch-ivory">
                      {(b.empirical_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-1.5 text-right text-pitch-secondary text-[11px]">
                      Δ {Math.abs(b.predicted_probability - b.empirical_probability).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Limitations & Boundaries */}
        <div className="lg:col-span-6 bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
          <h3 className="text-lg font-bold text-pitch-ivory font-display flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-pitch-orange" />
            <span>Model Boundaries & Honest Limitations</span>
          </h3>

          <div className="space-y-3 text-xs text-pitch-muted leading-relaxed">
            <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
              <strong className="text-pitch-ivory block mb-1">1. IPL Data Scope</strong>
              Trained exclusively on 20-over Indian Premier League matches. Not calibrated for One-Day Internationals, Test matches, or English T20 Blast conditions.
            </div>

            <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
              <strong className="text-pitch-ivory block mb-1">2. Exclusion of DLS-Affected Fixtures</strong>
              23 rain-affected or DLS-shortened matches were excluded from training to protect the mathematical consistency of legal ball counts (120 balls).
            </div>

            <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
              <strong className="text-pitch-ivory block mb-1">3. Early-Innings Uncertainty</strong>
              In the opening 3 overs of a chase, small run variations have wide confidence intervals due to remaining overs and unknown pitch behavior.
            </div>

            <div className="p-3 rounded-xl bg-pitch-card border border-pitch-border">
              <strong className="text-pitch-ivory block mb-1">4. Player-Specific Quality in v1</strong>
              Version 1 focuses purely on explainable match-state features (runs, balls, wickets, run rates) rather than player ratings or matchup head-to-heads.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

