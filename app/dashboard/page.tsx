"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CricketBall } from "@/components/cricket/CricketBall";
import { CricketPitch } from "@/components/cricket/CricketPitch";
import { WinProbabilityChart } from "@/components/charts/WinProbabilityChart";
import { DeliveryBadge } from "@/components/cricket/DeliveryBadge";
import { useSound } from "@/components/sound/SoundEngine";
import {
  Activity,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Flame,
  Award,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { playClick, playBatCrack } = useSound();
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [replayData, setReplayData] = useState<any>(null);
  const [deliveryIndex, setDeliveryIndex] = useState<number>(0);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);
  const [loadingReplay, setLoadingReplay] = useState<boolean>(false);

  // Load matches
  useEffect(() => {
    fetch("/api/matches?has_replay=true&limit=12")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);
          setSelectedMatchId(String(data.matches[0].match_id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingMatches(false));
  }, []);

  // Load replay when match changes
  useEffect(() => {
    if (!selectedMatchId) return;
    setLoadingReplay(true);
    fetch(`/api/matches/${selectedMatchId}/replay`)
      .then((res) => res.json())
      .then((data) => {
        setReplayData(data);
        // Default to late in the chase to show interesting high-pressure dynamics
        const midPoint = Math.min(45, Math.floor(data.deliveries.length * 0.65));
        setDeliveryIndex(midPoint);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingReplay(false));
  }, [selectedMatchId]);

  const currentDelivery = replayData?.deliveries?.[deliveryIndex];
  const matchInfo = replayData?.match_info;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Match Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-pitch-border gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
            Live Analytics Control Center
          </span>
          <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
            Match Intelligence Dashboard
          </h1>
          <p className="text-xs text-pitch-muted">
            Inspect real match states, pressure rates, and live ML probabilities from historical IPL fixtures.
          </p>
        </div>

        {/* Match Picker Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-medium text-pitch-muted">Match:</label>
          <select
            value={selectedMatchId}
            onChange={(e) => {
              playClick();
              setSelectedMatchId(e.target.value);
            }}
            disabled={loadingMatches}
            aria-label="Select IPL Match"
            className="bg-pitch-secondary text-pitch-ivory text-xs rounded-xl px-3 py-2 border border-pitch-border focus:outline-none focus:border-pitch-lime"
          >
            {matches.map((m) => (
              <option key={m.match_id} value={m.match_id}>
                [{m.season}] {m.team1} vs {m.team2} ({m.winner} won)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingReplay || !replayData ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-pitch-muted">
          <CricketBall size={40} animate={true} />
          <span className="text-xs font-mono">Loading ball-by-ball match state & ML probabilities...</span>
        </div>
      ) : (
        <>
          {/* Main Scoreboard & Win Probability Gauge Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Stadium Scoreboard Graphic */}
            <div className="lg:col-span-8 bg-pitch-secondary/80 rounded-3xl p-6 border border-pitch-border shadow-xl flex flex-col justify-between">
              <div>
                {/* Scoreboard Header */}
                <div className="flex items-center justify-between pb-3 border-b border-pitch-border/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-pitch-lime" />
                    <span className="font-semibold text-pitch-ivory uppercase tracking-wider">
                      Innings 2 — The Chase
                    </span>
                  </div>
                  <span className="text-pitch-muted font-mono">
                    {matchInfo?.date} • {matchInfo?.venue}
                  </span>
                </div>

                {/* Team Matchup & Target */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-2xl bg-pitch-forest/90 border border-pitch-border">
                    <span className="text-xs text-pitch-muted block mb-1">
                      Defending Team (1st Innings)
                    </span>
                    <h3 className="text-xl font-bold text-pitch-ivory">
                      {matchInfo?.defending_team}
                    </h3>
                    <div className="mt-2 text-2xl font-mono font-black text-pitch-orange">
                      {matchInfo?.inn1_runs}/{matchInfo?.inn1_wickets}
                      <span className="text-xs text-pitch-muted font-normal ml-2">
                        ({matchInfo?.inn1_overs} ov)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-pitch-card border border-pitch-lime/40 shadow-inner">
                    <span className="text-xs text-pitch-lime font-bold block mb-1 flex items-center justify-between">
                      <span>Chasing Team (Target: {matchInfo?.target_runs})</span>
                      <span className="text-[10px] bg-pitch-lime text-pitch-charcoal px-2 py-0.5 rounded font-mono">
                        IN PROGRESS
                      </span>
                    </span>
                    <h3 className="text-xl font-bold text-pitch-ivory">
                      {matchInfo?.chasing_team}
                    </h3>
                    <div className="mt-2 text-3xl font-mono font-black text-pitch-lime flex items-baseline">
                      {currentDelivery?.score_after}/{currentDelivery?.wickets_after}
                      <span className="text-sm text-pitch-muted font-normal ml-2 font-mono">
                        ({currentDelivery?.display_over} overs)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Match Analytics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-pitch-card/60 border border-pitch-border text-center">
                    <span className="text-[11px] text-pitch-muted block">Runs Needed</span>
                    <span className="text-xl font-mono font-extrabold text-pitch-ivory">
                      {currentDelivery?.runs_needed}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-pitch-card/60 border border-pitch-border text-center">
                    <span className="text-[11px] text-pitch-muted block">Balls Left</span>
                    <span className="text-xl font-mono font-extrabold text-pitch-ivory">
                      {currentDelivery?.balls_remaining}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-pitch-card/60 border border-pitch-border text-center">
                    <span className="text-[11px] text-pitch-muted block">Required RR</span>
                    <span className="text-xl font-mono font-extrabold text-pitch-orange">
                      {currentDelivery?.required_run_rate.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-pitch-card/60 border border-pitch-border text-center">
                    <span className="text-[11px] text-pitch-muted block">Current RR</span>
                    <span className="text-xl font-mono font-extrabold text-pitch-lime">
                      {currentDelivery?.current_run_rate.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Scrubber Bar */}
              <div className="mt-6 pt-4 border-t border-pitch-border/50">
                <div className="flex items-center justify-between text-xs text-pitch-muted mb-2 font-mono">
                  <span>Ball {deliveryIndex + 1} of {replayData.deliveries.length}</span>
                  <span>Scrub Chase Progress</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={replayData.deliveries.length - 1}
                  value={deliveryIndex}
                  onChange={(e) => {
                    playClick();
                    setDeliveryIndex(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-pitch-lime cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Live Win Probability Gauge Card */}
            <div className="lg:col-span-4 bg-gradient-to-b from-pitch-secondary via-pitch-card to-pitch-charcoal rounded-3xl p-6 border border-pitch-border shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-pitch-muted border-b border-pitch-border/50 pb-2">
                  <span className="font-mono uppercase tracking-wider text-pitch-lime font-bold">
                    Logistic Regression
                  </span>
                  <span className="text-[10px] text-pitch-muted font-mono">P(chasing team wins)</span>
                </div>

                <div className="my-6 text-center">
                  <span className="text-[11px] text-pitch-muted uppercase tracking-wider block">
                    {matchInfo?.chasing_team} Win Probability
                  </span>
                  <span className="text-6xl font-mono font-black text-pitch-lime tracking-tight block my-2 tabular-nums">
                    {(currentDelivery?.chasing_win_probability * 100).toFixed(1)}%
                  </span>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pitch-forest text-xs font-mono text-pitch-secondary border border-pitch-border">
                    <span>Defending ({matchInfo?.defending_team}):</span>
                    <span className="text-pitch-orange font-bold">
                      {(currentDelivery?.defending_win_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-3 rounded-full bg-pitch-forest overflow-hidden flex border border-pitch-border mb-4">
                  <div
                    className="h-full bg-pitch-lime transition-all duration-300"
                    style={{ width: `${currentDelivery?.chasing_win_probability * 100}%` }}
                  />
                  <div
                    className="h-full bg-pitch-orange opacity-80 transition-all duration-300"
                    style={{ width: `${currentDelivery?.defending_win_probability * 100}%` }}
                  />
                </div>

                {/* Recent Shift */}
                <div className="text-xs flex justify-between p-3 rounded-xl bg-pitch-secondary/90 border border-pitch-border text-pitch-muted font-mono">
                  <span>Delta this ball:</span>
                  <span
                    className={`font-bold ${
                      currentDelivery?.probability_change >= 0 ? "text-pitch-lime" : "text-red-400"
                    }`}
                  >
                    {currentDelivery?.probability_change >= 0 ? "+" : ""}
                    {(currentDelivery?.probability_change * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-pitch-border/40 text-center">
                <Link
                  href={`/match-center?id=${matchInfo?.match_id}`}
                  onClick={playClick}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-pitch-lime text-pitch-charcoal font-bold text-xs hover:bg-[#b0d854] transition-all"
                >
                  <span>Replay Ball-by-Ball in Match Center</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Central Pitch Animation Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <CricketPitch
                currentDelivery={currentDelivery}
                chasingProb={currentDelivery?.chasing_win_probability}
              />
            </div>

            <div className="lg:col-span-7">
              <WinProbabilityChart
                data={replayData.deliveries}
                currentIndex={deliveryIndex}
                chasingTeam={matchInfo?.chasing_team}
                defendingTeam={matchInfo?.defending_team}
                onSelectDelivery={(idx) => {
                  playClick();
                  setDeliveryIndex(idx);
                }}
              />
            </div>
          </div>

          {/* Recent Deliveries Strip */}
          <div className="bg-pitch-secondary/60 rounded-2xl p-4 border border-pitch-border">
            <h4 className="text-xs font-mono uppercase tracking-wider text-pitch-muted mb-3">
              Delivery Trail (Last 12 Deliveries)
            </h4>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {replayData.deliveries
                .slice(Math.max(0, deliveryIndex - 11), deliveryIndex + 1)
                .map((d: any) => (
                  <button
                    key={d.ball_index}
                    onClick={() => {
                      playClick();
                      setDeliveryIndex(d.ball_index - 1);
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                      d.ball_index - 1 === deliveryIndex
                        ? "bg-pitch-forest border-pitch-lime shadow-md scale-105"
                        : "bg-pitch-card border-pitch-border hover:border-pitch-lime/40"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-pitch-muted mb-1">
                      {d.display_over}
                    </span>
                    <DeliveryBadge
                      event={d.event}
                      runs={d.total_runs}
                      isWicket={d.is_wicket}
                      size="sm"
                    />
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

