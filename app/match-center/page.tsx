"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CricketBall } from "@/components/cricket/CricketBall";
import { CricketPitch } from "@/components/cricket/CricketPitch";
import { WinProbabilityChart } from "@/components/charts/WinProbabilityChart";
import { DeliveryBadge } from "@/components/cricket/DeliveryBadge";
import { useSound } from "@/components/sound/SoundEngine";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Volume2,
  Trophy,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function MatchCenterContent() {
  const searchParams = useSearchParams();
  const queryMatchId = searchParams.get("id");

  const {
    playClick,
    playBatCrack,
    playBallWhoosh,
    playBoundaryFanfare,
    playWicket,
  } = useSound();

  const [matchesList, setMatchesList] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [replayData, setReplayData] = useState<any>(null);
  const [deliveryIndex, setDeliveryIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 1.5x, 2x
  const [loading, setLoading] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch matches with precomputed replays
  useEffect(() => {
    fetch("/api/matches?has_replay=true&limit=25")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches && data.matches.length > 0) {
          setMatchesList(data.matches);
          const initialId = queryMatchId || String(data.matches[0].match_id);
          setSelectedMatchId(initialId);
        }
      })
      .catch((err) => console.error(err));
  }, [queryMatchId]);

  // 2. Fetch replay data for selected match
  useEffect(() => {
    if (!selectedMatchId) return;
    setLoading(true);
    setIsPlaying(false);
    fetch(`/api/matches/${selectedMatchId}/replay`)
      .then((res) => res.json())
      .then((data) => {
        setReplayData(data);
        setDeliveryIndex(0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedMatchId]);

  // 3. Playback timer effect
  useEffect(() => {
    if (isPlaying && replayData?.deliveries) {
      const intervalMs = Math.round(1400 / speed);
      timerRef.current = setInterval(() => {
        setDeliveryIndex((prev) => {
          if (prev >= replayData.deliveries.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const nextIndex = prev + 1;
          const nextDeliv = replayData.deliveries[nextIndex];
          // Sound trigger on delivery outcome
          if (nextDeliv.is_wicket) {
            playWicket();
          } else if (nextDeliv.total_runs === 4 || nextDeliv.total_runs === 6) {
            playBatCrack();
            playBoundaryFanfare();
          } else if (nextDeliv.total_runs > 0) {
            playBatCrack();
          } else {
            playBallWhoosh();
          }
          return nextIndex;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, replayData]);

  const currentDelivery = replayData?.deliveries?.[deliveryIndex];
  const matchInfo = replayData?.match_info;

  const handleNext = () => {
    if (!replayData?.deliveries) return;
    if (deliveryIndex < replayData.deliveries.length - 1) {
      const nextIdx = deliveryIndex + 1;
      setDeliveryIndex(nextIdx);
      const d = replayData.deliveries[nextIdx];
      if (d.is_wicket) playWicket();
      else if (d.total_runs >= 4) {
        playBatCrack();
        playBoundaryFanfare();
      } else playClick();
    }
  };

  const handlePrev = () => {
    playClick();
    setDeliveryIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    playClick();
    setIsPlaying(false);
    setDeliveryIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Match Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-pitch-border gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
            Broadcasting Replay Suite
          </span>
          <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
            Match Center: Ball-by-Ball Replay
          </h1>
          <p className="text-xs text-pitch-muted">
            Step through every legal delivery and watch win probabilities shift in real-time.
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
            disabled={loading}
            aria-label="Select Match for Replay"
            className="bg-pitch-secondary text-pitch-ivory text-xs rounded-xl px-3 py-2 border border-pitch-border focus:outline-none focus:border-pitch-lime"
          >
            {matchesList.map((m) => (
              <option key={m.match_id} value={m.match_id}>
                [{m.season}] {m.team1} vs {m.team2}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !replayData ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-pitch-muted">
          <CricketBall size={44} animate={true} />
          <span className="text-xs font-mono">Compiling ball-by-ball delivery timeline...</span>
        </div>
      ) : (
        <>
          {/* Broadcasting Scoreboard Header */}
          <div className="bg-gradient-to-r from-pitch-secondary via-pitch-card to-pitch-secondary rounded-2xl p-5 border border-pitch-border shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Match Details */}
              <div className="md:col-span-5 space-y-1">
                <div className="flex items-center space-x-2 text-xs text-pitch-muted">
                  <span className="bg-pitch-forest text-pitch-lime px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                    IPL {matchInfo?.season}
                  </span>
                  <span>{matchInfo?.venue}</span>
                </div>
                <div className="text-lg font-bold text-pitch-ivory flex items-center space-x-2">
                  <span>{matchInfo?.inn1_runs}/{matchInfo?.inn1_wickets}</span>
                  <span className="text-xs text-pitch-muted font-normal">
                    {matchInfo?.defending_team} (Target: {matchInfo?.target_runs})
                  </span>
                </div>
                <div className="text-xs text-pitch-lime font-mono">
                  {matchInfo?.winner} won by {matchInfo?.win_margin} {matchInfo?.win_by_type}
                </div>
              </div>

              {/* Current Chase State Scorecard */}
              <div className="md:col-span-4 bg-pitch-forest/80 rounded-xl p-3 border border-pitch-border text-center">
                <span className="text-[11px] uppercase tracking-wider text-pitch-muted block">
                  {matchInfo?.chasing_team} Chasing
                </span>
                <div className="text-3xl font-mono font-black text-pitch-lime my-0.5 tabular-nums">
                  {currentDelivery?.score_after}/{currentDelivery?.wickets_after}
                  <span className="text-sm font-normal text-pitch-secondary ml-2">
                    ({currentDelivery?.display_over} ov)
                  </span>
                </div>
                <div className="text-xs font-mono text-pitch-muted">
                  Need {currentDelivery?.runs_needed} off {currentDelivery?.balls_remaining} balls (RRR: {currentDelivery?.required_run_rate.toFixed(2)})
                </div>
              </div>

              {/* Odds summary */}
              <div className="md:col-span-3 text-right space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-pitch-muted block font-mono">
                  Win Probability
                </span>
                <span className="text-4xl font-mono font-black text-pitch-lime tabular-nums block">
                  {(currentDelivery?.chasing_win_probability * 100).toFixed(1)}%
                </span>
                <span className="text-[11px] font-mono text-pitch-orange block">
                  Defending: {(currentDelivery?.defending_win_probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Replay Controls Toolbar */}
          <div className="bg-pitch-secondary rounded-2xl p-4 border border-pitch-border flex flex-wrap items-center justify-between gap-4 shadow-md">
            {/* Play / Step Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                title="Reset to 1st Ball"
                className="p-2 rounded-xl bg-pitch-card border border-pitch-border hover:bg-pitch-forest text-pitch-ivory transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                disabled={deliveryIndex === 0}
                title="Previous Delivery"
                className="p-2 rounded-xl bg-pitch-card border border-pitch-border hover:bg-pitch-forest text-pitch-ivory disabled:opacity-40 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="px-5 py-2 rounded-xl bg-pitch-lime text-pitch-charcoal font-bold text-xs flex items-center space-x-1.5 shadow-md hover:bg-[#b0d854] transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play Replay</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={deliveryIndex >= replayData.deliveries.length - 1}
                title="Next Delivery"
                className="p-2 rounded-xl bg-pitch-card border border-pitch-border hover:bg-pitch-forest text-pitch-ivory disabled:opacity-40 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery Progress Slider */}
            <div className="flex-1 min-w-[200px] flex items-center space-x-3">
              <span className="text-xs font-mono text-pitch-muted shrink-0">
                Ball {deliveryIndex + 1}/{replayData.deliveries.length}
              </span>
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

            {/* Speed Selector */}
            <div className="flex items-center space-x-1">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    playClick();
                    setSpeed(s);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    speed === s
                      ? "bg-pitch-lime text-pitch-charcoal font-bold"
                      : "bg-pitch-card text-pitch-muted hover:text-pitch-ivory"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pitch + Probability Chart */}
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

          {/* Delivery Commentary Box */}
          <div className="bg-pitch-secondary/80 rounded-2xl p-5 border border-pitch-border shadow-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-pitch-border/50 text-xs">
              <span className="uppercase tracking-widest font-mono text-pitch-lime font-bold">
                Authentic Ball-by-Ball Commentary
              </span>
              <span className="text-pitch-muted font-mono">
                Over {currentDelivery?.display_over}
              </span>
            </div>

            <div className="flex items-start space-x-4">
              <DeliveryBadge
                event={currentDelivery?.event}
                runs={currentDelivery?.total_runs}
                isWicket={currentDelivery?.is_wicket}
                size="lg"
              />
              <div className="space-y-1">
                <p className="text-base font-semibold text-pitch-ivory">
                  {currentDelivery?.commentary}
                </p>
                <div className="text-xs text-pitch-muted font-mono space-x-4">
                  <span>Batter: <strong className="text-pitch-secondary">{currentDelivery?.batter}</strong> ({currentDelivery?.batter_runs} runs)</span>
                  <span>Bowler: <strong className="text-pitch-secondary">{currentDelivery?.bowler}</strong></span>
                  <span>Extras: <strong className="text-pitch-secondary">{currentDelivery?.extras_runs}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MatchCenterPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-pitch-muted">
          <CricketBall size={44} animate={true} />
          <span className="text-xs font-mono">Loading Match Center...</span>
        </div>
      }
    >
      <MatchCenterContent />
    </Suspense>
  );
}

