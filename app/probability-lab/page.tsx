"use client";

import React, { useState, useEffect } from "react";
import { CricketBall } from "@/components/cricket/CricketBall";
import { WinProbabilityChart } from "@/components/charts/WinProbabilityChart";
import { predictProbability, PredictResult } from "@/lib/api";
import { useSound } from "@/components/sound/SoundEngine";
import {
  Sliders,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  BarChart2,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProbabilityLabPage() {
  const { playClick, playBatCrack } = useSound();

  // Match replay state
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [replayData, setReplayData] = useState<any>(null);
  const [loadingReplay, setLoadingReplay] = useState(true);

  // Live Scenario Simulator sliders
  const [simRunsNeeded, setSimRunsNeeded] = useState<number>(45);
  const [simBallsRemaining, setSimBallsRemaining] = useState<number>(30);
  const [simWicketsInHand, setSimWicketsInHand] = useState<number>(6);
  const [simCurrentRunRate, setSimCurrentRunRate] = useState<number>(8.2);
  const [simResult, setSimResult] = useState<PredictResult | null>(null);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Load matches
  useEffect(() => {
    fetch("/api/matches?has_replay=true&limit=15")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);
          setSelectedMatchId(String(data.matches[0].match_id));
        }
      });
  }, []);

  // Load replay data
  useEffect(() => {
    if (!selectedMatchId) return;
    setLoadingReplay(true);
    fetch(`/api/matches/${selectedMatchId}/replay`)
      .then((res) => res.json())
      .then((data) => setReplayData(data))
      .finally(() => setLoadingReplay(false));
  }, [selectedMatchId]);

  // Run live scenario prediction whenever simulation sliders change
  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await predictProbability({
        runs_needed: simRunsNeeded,
        balls_remaining: simBallsRemaining,
        wickets_in_hand: simWicketsInHand,
        current_run_rate: simCurrentRunRate,
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [simRunsNeeded, simBallsRemaining, simWicketsInHand, simCurrentRunRate]);

  // Compute major probability swings in the selected match
  const topSwings = React.useMemo(() => {
    if (!replayData?.deliveries) return [];
    return [...replayData.deliveries]
      .sort((a, b) => Math.abs(b.probability_change) - Math.abs(a.probability_change))
      .slice(0, 6);
  }, [replayData]);

  const simRRR =
    simBallsRemaining > 0
      ? ((simRunsNeeded / simBallsRemaining) * 6).toFixed(2)
      : "99.00";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Analytics & Scenario Laboratory
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          Win Probability Lab
        </h1>
        <p className="text-xs text-pitch-muted">
          Analyze historical match probability curves and simulate hypothetical chase scenarios using the live scikit-learn model.
        </p>
      </div>

      {/* SECTION 1: LIVE CHASE SCENARIO SIMULATOR */}
      <section className="bg-gradient-to-r from-pitch-secondary via-pitch-card to-pitch-secondary rounded-3xl p-6 md:p-8 border border-pitch-border shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-pitch-border/60 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-pitch-forest text-pitch-lime border border-pitch-border">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-pitch-ivory font-display">
                Interactive Scenario Simulator
              </h2>
              <p className="text-xs text-pitch-muted">
                Adjust match state sliders to invoke <code className="text-pitch-lime">predict_proba()</code> on the server
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-pitch-forest text-pitch-lime px-3 py-1 rounded-full border border-pitch-border self-start sm:self-auto">
            POST /api/predict
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Control Panel */}
          <div className="lg:col-span-7 space-y-5">
            {/* Slider 1: Runs Needed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-pitch-secondary">Runs Needed:</span>
                <span className="text-pitch-lime font-bold">{simRunsNeeded} runs</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={simRunsNeeded}
                onChange={(e) => {
                  playClick();
                  setSimRunsNeeded(parseInt(e.target.value, 10));
                }}
                className="w-full accent-pitch-lime cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-pitch-muted font-mono">
                <span>0 (Won)</span>
                <span>90</span>
                <span>180</span>
              </div>
            </div>

            {/* Slider 2: Balls Remaining */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-pitch-secondary">Balls Remaining:</span>
                <span className="text-pitch-lime font-bold">{simBallsRemaining} balls ({(simBallsRemaining / 6).toFixed(1)} ov)</span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                value={simBallsRemaining}
                onChange={(e) => {
                  playClick();
                  setSimBallsRemaining(parseInt(e.target.value, 10));
                }}
                className="w-full accent-pitch-lime cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-pitch-muted font-mono">
                <span>1 ball</span>
                <span>60 balls</span>
                <span>120 balls</span>
              </div>
            </div>

            {/* Slider 3: Wickets in Hand */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-pitch-secondary">Wickets in Hand:</span>
                <span className="text-pitch-lime font-bold">{simWicketsInHand} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={simWicketsInHand}
                onChange={(e) => {
                  playClick();
                  setSimWicketsInHand(parseInt(e.target.value, 10));
                }}
                className="w-full accent-pitch-lime cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-pitch-muted font-mono">
                <span>0 (All Out)</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Slider 4: Current Run Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-pitch-secondary">Current Run Rate (CRR):</span>
                <span className="text-pitch-lime font-bold">{simCurrentRunRate.toFixed(1)} rpo</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="15.0"
                step="0.1"
                value={simCurrentRunRate}
                onChange={(e) => {
                  playClick();
                  setSimCurrentRunRate(parseFloat(e.target.value));
                }}
                className="w-full accent-pitch-lime cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-pitch-muted font-mono">
                <span>3.0 rpo</span>
                <span>9.0 rpo</span>
                <span>15.0 rpo</span>
              </div>
            </div>

            {/* Derived RRR badge */}
            <div className="p-3 rounded-xl bg-pitch-secondary/90 border border-pitch-border flex justify-between text-xs font-mono text-pitch-muted">
              <span>Required Run Rate (RRR):</span>
              <span className="text-pitch-orange font-bold">{simRRR} rpo</span>
            </div>
          </div>

          {/* Probability Output Card */}
          <div className="lg:col-span-5 bg-pitch-secondary rounded-2xl p-6 border border-pitch-border shadow-xl text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-pitch-muted block font-mono">
              Model Prediction
            </span>

            <div>
              <span className="text-6xl font-mono font-black text-pitch-lime tracking-tight block tabular-nums">
                {simResult ? `${simResult.chasing_win_percentage.toFixed(1)}%` : "..."}
              </span>
              <span className="text-xs text-pitch-secondary font-medium">
                P(chasing team wins)
              </span>
            </div>

            {/* Split Bar */}
            <div className="w-full h-3 rounded-full bg-pitch-forest overflow-hidden flex border border-pitch-border">
              <div
                className="h-full bg-pitch-lime transition-all duration-300"
                style={{ width: `${simResult?.chasing_win_percentage || 50}%` }}
              />
              <div
                className="h-full bg-pitch-orange opacity-80 transition-all duration-300"
                style={{ width: `${simResult?.defending_win_percentage || 50}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="text-pitch-lime font-bold">Chasing: {simResult?.chasing_win_percentage}%</span>
              <span className="text-pitch-orange font-bold">Defending: {simResult?.defending_win_percentage}%</span>
            </div>

            <div className="pt-3 border-t border-pitch-border/50 text-[11px] text-pitch-muted text-left space-y-1 font-mono">
              <div>Status: <span className="text-pitch-secondary">{simResult?.status}</span></div>
              <div>Model: <span className="text-pitch-secondary">{simResult?.model_name}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HISTORICAL MATCH PROBABILITY INSPECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-pitch-border gap-3">
          <div>
            <h2 className="text-2xl font-bold text-pitch-ivory font-display">
              Match Probability Trajectory
            </h2>
            <p className="text-xs text-pitch-muted">
              Inspect how odds evolved across every legal delivery of the chosen historical match.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-medium text-pitch-muted">Match:</label>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                playClick();
                setSelectedMatchId(e.target.value);
              }}
              aria-label="Select match for trajectory inspection"
              className="bg-pitch-secondary text-pitch-ivory text-xs rounded-xl px-3 py-2 border border-pitch-border"
            >
              {matches.map((m) => (
                <option key={m.match_id} value={m.match_id}>
                  [{m.season}] {m.team1} vs {m.team2}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingReplay || !replayData ? (
          <div className="h-64 flex items-center justify-center text-pitch-muted text-xs font-mono">
            Loading trajectory...
          </div>
        ) : (
          <div className="space-y-6">
            <WinProbabilityChart
              data={replayData.deliveries}
              chasingTeam={replayData.match_info.chasing_team}
              defendingTeam={replayData.match_info.defending_team}
            />

            {/* Major Probability Swings Table */}
            <div className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border shadow-lg">
              <h3 className="text-sm font-bold text-pitch-ivory uppercase tracking-wider font-mono mb-4 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-pitch-lime" />
                <span>Top Probability Swings in this Match</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-pitch-border/60 text-pitch-muted font-mono uppercase text-[10px]">
                    <tr>
                      <th className="pb-2">Over</th>
                      <th className="pb-2">Bowler</th>
                      <th className="pb-2">Batter</th>
                      <th className="pb-2">Event</th>
                      <th className="pb-2 text-right">Probability Shift</th>
                      <th className="pb-2 text-right">New Win %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pitch-border/30">
                    {topSwings.map((d: any) => (
                      <tr key={d.ball_index} className="hover:bg-pitch-card/40">
                        <td className="py-2.5 font-mono font-bold text-pitch-ivory">
                          {d.display_over}
                        </td>
                        <td className="py-2.5 text-pitch-secondary">{d.bowler}</td>
                        <td className="py-2.5 text-pitch-secondary">{d.batter}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.is_wicket
                              ? "bg-red-600 text-white"
                              : d.total_runs >= 4
                              ? "bg-pitch-lime text-pitch-charcoal"
                              : "bg-pitch-forest text-pitch-secondary"
                          }`}>
                            {d.is_wicket ? `WICKET (${d.wicket_kind})` : `${d.total_runs} RUNS`}
                          </span>
                        </td>
                        <td className={`py-2.5 text-right font-mono font-bold ${
                          d.probability_change >= 0 ? "text-pitch-lime" : "text-red-400"
                        }`}>
                          {d.probability_change >= 0 ? "+" : ""}
                          {(d.probability_change * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-pitch-ivory">
                          {(d.chasing_win_probability * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

