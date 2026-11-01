"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CricketBall } from "./CricketBall";
import { Activity, ArrowRight, Award, Zap } from "lucide-react";
import { useSound } from "@/components/sound/SoundEngine";

export function StadiumHero() {
  const [prob, setProb] = useState(58.4);
  const { playClick, playBatCrack } = useSound();

  useEffect(() => {
    // Subtle ticker to demonstrate live ML probability calculation
    const interval = setInterval(() => {
      setProb((prev) => {
        const delta = (Math.random() - 0.48) * 3.5;
        const next = Math.min(99.2, Math.max(1.5, prev + delta));
        return Math.round(next * 10) / 10;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-pitch-border">
      {/* Stadium Floodlights & Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pitch-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pitch-stadium/15 rounded-full blur-3xl pointer-events-none" />

      {/* Stadium floodlight beams */}
      <div
        className="absolute top-0 inset-x-0 h-48 opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(197, 237, 104, 0.4) 0%, rgba(24, 61, 50, 0) 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Branding, Value Prop & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pitch-secondary border border-pitch-border text-xs font-medium text-pitch-lime shadow-inner">
              <span className="w-2 h-2 rounded-full bg-pitch-lime animate-ping" />
              <span>Ball-by-Ball Machine Learning Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-pitch-ivory font-display leading-[1.1]">
              What are the <span className="text-pitch-lime underline decoration-pitch-lime/40 underline-offset-8">real odds</span>, right now?
            </h1>

            <p className="text-lg sm:text-xl text-pitch-secondary max-w-2xl leading-relaxed">
              Understand the game beyond the scoreboard. Explore ball-by-ball win probabilities powered by machine learning and real historical IPL data.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                onClick={() => {
                  playClick();
                  playBatCrack();
                }}
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-pitch-lime text-pitch-charcoal font-bold text-base shadow-lg hover:bg-[#b0d854] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Match Intelligence</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                href="/model-intelligence"
                onClick={playClick}
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-pitch-secondary border border-pitch-border text-pitch-ivory font-semibold text-base hover:bg-pitch-card hover:border-pitch-lime/50 transition-all shadow-sm"
              >
                <Activity className="w-5 h-5 mr-2 text-pitch-lime" />
                <span>Discover the Model</span>
              </Link>
            </div>

            {/* Trust Metrics Badge */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-pitch-border/50 max-w-lg text-xs">
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-pitch-ivory">1,195</span>
                <span className="text-pitch-muted">IPL Matches</span>
              </div>
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-pitch-lime">138,683</span>
                <span className="text-pitch-muted">Ball Deliveries</span>
              </div>
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-pitch-orange">0.446</span>
                <span className="text-pitch-muted">Test Log-Loss</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stadium Graphic & Probability HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Stadium Visual Control Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-pitch-secondary via-pitch-card to-pitch-charcoal p-6 border border-pitch-border shadow-2xl overflow-hidden">
              {/* Stadium Floodlight Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pitch-lime/20 rounded-full blur-2xl" />

              {/* Floating Animated Cricket Ball */}
              <div className="absolute -top-4 -right-4 z-20">
                <CricketBall size={56} animate={true} />
              </div>

              {/* Live Match State HUD */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-pitch-muted border-b border-pitch-border pb-3">
                  <span className="uppercase tracking-widest font-mono flex items-center">
                    <Zap className="w-3.5 h-3.5 text-pitch-lime mr-1" />
                    Live Win Odds Simulation
                  </span>
                  <span className="bg-pitch-forest text-pitch-lime px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    T20 CHASE STATE
                  </span>
                </div>

                {/* Scoreboard Miniature */}
                <div className="bg-pitch-forest/80 rounded-2xl p-4 border border-pitch-border/80">
                  <div className="flex justify-between items-center text-xs text-pitch-muted mb-1">
                    <span>CSK (Chasing) vs KKR</span>
                    <span className="font-mono text-pitch-lime">Target: 178</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold text-pitch-ivory">
                      142<span className="text-pitch-muted text-lg font-normal">/4</span>
                    </span>
                    <span className="font-mono text-sm text-pitch-secondary">
                      16.2 Overs
                    </span>
                  </div>
                  <div className="mt-2 text-xs flex justify-between text-pitch-muted pt-2 border-t border-pitch-border/40 font-mono">
                    <span>Req: 36 off 22 balls</span>
                    <span>RRR: 9.82 • CRR: 8.71</span>
                  </div>
                </div>

                {/* The Real Odds Indicator */}
                <div className="p-4 rounded-2xl bg-pitch-charcoal/90 border border-pitch-border shadow-inner">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-pitch-muted font-medium">Chasing Team Win Probability</span>
                    <span className="text-pitch-lime font-mono font-bold">P(Chasing Team Wins)</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <motion.span
                      key={prob}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="text-5xl font-mono font-black text-pitch-lime tracking-tight tabular-nums"
                    >
                      {prob.toFixed(1)}%
                    </motion.span>
                    <span className="text-sm font-semibold text-pitch-muted">Current Odds</span>
                  </div>

                  {/* Probability Bar */}
                  <div className="w-full h-3 bg-pitch-forest rounded-full mt-3 overflow-hidden flex shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pitch-stadium to-pitch-lime"
                      animate={{ width: `${prob}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div
                      className="h-full bg-pitch-orange opacity-80"
                      style={{ width: `${100 - prob}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-pitch-muted mt-1.5">
                    <span className="text-pitch-lime">CSK: {prob.toFixed(1)}%</span>
                    <span className="text-pitch-orange">KKR: {(100 - prob).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Model Attribution Footer */}
                <div className="text-center pt-1 text-[11px] text-pitch-muted">
                  <span>Logistic Regression trained with scikit-learn on Cricsheet IPL data.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

