"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CricketBall } from "./CricketBall";

interface CricketPitchProps {
  currentDelivery?: {
    ball_index: number;
    over: number;
    ball_in_over: number;
    batter: string;
    bowler: string;
    total_runs: number;
    is_wicket: boolean;
    event: string;
    wicket_kind?: string;
    player_out?: string;
  } | null;
  chasingProb?: number;
  interactive?: boolean;
}

export function CricketPitch({ currentDelivery, chasingProb = 0.5 }: CricketPitchProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (currentDelivery) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 900);
      return () => clearTimeout(timer);
    }
  }, [currentDelivery?.ball_index]);

  const isBoundary = currentDelivery && (currentDelivery.total_runs === 4 || currentDelivery.total_runs === 6);
  const isWicket = currentDelivery?.is_wicket;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-pitch-border bg-gradient-to-b from-[#143228] to-[#0D241D] p-4 shadow-xl">
      {/* Stadium Turf Header / Status */}
      <div className="flex items-center justify-between pb-3 border-b border-pitch-border/50 text-xs font-medium text-pitch-muted">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-pitch-lime animate-pulse" />
          <span className="uppercase tracking-wider font-semibold text-pitch-secondary">
            Pitch Visualizer • 22 Yards
          </span>
        </div>
        <div>
          {currentDelivery ? (
            <span className="text-pitch-secondary font-mono">
              Over {currentDelivery.over}.{currentDelivery.ball_in_over}
            </span>
          ) : (
            <span>Match Ready</span>
          )}
        </div>
      </div>

      {/* Main Pitch Stadium Graphic */}
      <div className="relative h-64 md:h-72 w-full flex items-center justify-center my-2 select-none">
        {/* Outfield Grass Striping Pattern */}
        <div
          className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #78A96B 0px, #78A96B 30px, #183D32 30px, #183D32 60px)",
          }}
        />

        {/* 22-Yard Pitch Strip */}
        <div className="relative w-full max-w-xl h-28 md:h-32 rounded-lg bg-[#C49767] shadow-inner border border-[#A67C4E] flex items-center justify-between px-6 overflow-hidden">
          {/* Pitch grass wear marks & clay textures */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B58957] via-[#D1A675] to-[#B58957] opacity-90" />
          
          {/* Popping Crease - Bowler's End (Left) */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Bowling Crease Line */}
            <div className="w-[3px] h-24 bg-white/90 shadow-sm" />
            <span className="text-[10px] font-mono font-bold text-white/80 mt-1 uppercase">Bowler</span>
            
            {/* Non-striker Stumps */}
            <div className="flex space-x-[2px] mt-1">
              <div className="w-[3px] h-6 bg-amber-200 rounded-t" />
              <div className="w-[3px] h-6 bg-amber-200 rounded-t" />
              <div className="w-[3px] h-6 bg-amber-200 rounded-t" />
            </div>
          </div>

          {/* Central Pitch Markings */}
          <div className="relative z-10 flex flex-col items-center opacity-70">
            <div className="w-16 h-[2px] bg-white/40" />
            <span className="text-[9px] uppercase tracking-widest text-[#5C3B1E] font-bold mt-1">
              Good Length
            </span>
          </div>

          {/* Popping Crease - Striker's End (Right) */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Striker Wickets / Stumps with Bails */}
            <div className="flex flex-col items-center mb-1">
              {/* Bails */}
              <div className="w-5 h-[2px] bg-amber-100 rounded-full mb-[1px]" />
              {/* 3 Stumps */}
              <div className="flex space-x-[3px]">
                <div className="w-[3px] h-7 bg-amber-200 rounded-t shadow" />
                <div className="w-[3px] h-7 bg-amber-200 rounded-t shadow" />
                <div className="w-[3px] h-7 bg-amber-200 rounded-t shadow" />
              </div>
            </div>

            {/* Popping Crease Line */}
            <div className="w-[3px] h-24 bg-white/90 shadow-sm" />
            <span className="text-[10px] font-mono font-bold text-white/80 mt-1 uppercase">Striker</span>
          </div>

          {/* Animated Cricket Ball Trajectory */}
          <AnimatePresence>
            {animating && (
              <motion.div
                key={`ball-${currentDelivery?.ball_index}`}
                className="absolute z-30"
                initial={{ left: "12%", top: "45%", scale: 0.8 }}
                animate={{
                  left: ["12%", "50%", "86%"],
                  top: ["45%", "65%", "45%"],
                  scale: [0.8, 1.1, 0.9],
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <CricketBall size={22} animate={true} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boundary / Wicket Impact Visual Explosion */}
          <AnimatePresence>
            {animating && isBoundary && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute right-8 top-6 z-40 bg-amber-400 text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-yellow-200 uppercase"
              >
                {currentDelivery?.total_runs === 6 ? "MAXIMUM! SIX" : "BOUNDARY FOUR!"}
              </motion.div>
            )}
            {animating && isWicket && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute right-8 top-6 z-40 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-red-300 uppercase"
              >
                WICKET! OUT!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Batter Silhouette Graphic */}
        <div className="absolute right-8 md:right-16 bottom-4 z-20 pointer-events-none opacity-85">
          <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="text-pitch-ivory drop-shadow-md">
            {/* Helmet */}
            <circle cx="28" cy="18" r="7" fill="currentColor" opacity="0.9" />
            {/* Batter Body / Torso */}
            <path d="M22 26 L34 26 L30 52 L24 52 Z" fill="currentColor" opacity="0.85" />
            {/* Bat */}
            <rect x="36" y="22" width="5" height="42" rx="2" fill="#C5ED68" transform="rotate(-25 36 22)" />
            {/* Batter Legs with Pads */}
            <rect x="22" y="52" width="5" height="26" rx="2" fill="currentColor" opacity="0.8" />
            <rect x="29" y="52" width="5" height="26" rx="2" fill="currentColor" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Match Commentary & Delivery Summary Bar */}
      <div className="bg-pitch-secondary/80 rounded-xl p-3 border border-pitch-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-pitch-forest text-pitch-lime font-mono font-bold px-2.5 py-1 rounded text-xs border border-pitch-border">
            {currentDelivery ? `${currentDelivery.over}.${currentDelivery.ball_in_over}` : "0.0"}
          </div>
          <div>
            <span className="font-semibold text-pitch-ivory mr-2">
              {currentDelivery ? `${currentDelivery.bowler} to ${currentDelivery.batter}` : "Awaiting delivery"}
            </span>
            <span className="text-pitch-muted text-xs block md:inline">
              {currentDelivery?.is_wicket
                ? `WICKET! ${currentDelivery.player_out} dismissed (${currentDelivery.wicket_kind})`
                : currentDelivery?.event.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 self-end md:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-pitch-muted block">
              Win Probability
            </span>
            <span className="font-mono font-bold text-pitch-lime text-base tabular-nums">
              {(chasingProb * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

