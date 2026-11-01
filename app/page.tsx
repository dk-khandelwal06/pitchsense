"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StadiumHero } from "@/components/cricket/StadiumHero";
import { CricketBall } from "@/components/cricket/CricketBall";
import { CricketPitch } from "@/components/cricket/CricketPitch";
import { WinProbabilityChart } from "@/components/charts/WinProbabilityChart";
import { useSound } from "@/components/sound/SoundEngine";
import {
  TrendingUp,
  Cpu,
  Database,
  Search,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Flame,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const { playClick, playBatCrack } = useSound();
  const [featuredReplay, setFeaturedReplay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a sample featured replay for genuine live preview
    fetch("/api/matches?has_replay=true&limit=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches && data.matches.length > 0) {
          const matchId = data.matches[0].match_id;
          return fetch(`/api/matches/${matchId}/replay`);
        }
      })
      .then((res) => (res ? res.json() : null))
      .then((replay) => {
        if (replay) {
          setFeaturedReplay(replay);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <StadiumHero />

      {/* 2. How PitchSense Works Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-pitch-lime font-bold bg-pitch-secondary px-3 py-1 rounded-full border border-pitch-border">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pitch-ivory font-display">
            How PitchSense Works
          </h2>
          <p className="text-pitch-secondary text-sm sm:text-base">
            From raw ball-by-ball match scorecards to calibrated machine learning probabilities and interactive replays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: "01",
              title: "Cricsheet Data",
              desc: "1,243 IPL match JSONs extracted into 138,683 delivery records.",
              icon: Database,
            },
            {
              step: "02",
              title: "Feature Engineering",
              desc: "Runs needed, balls remaining, wickets in hand, CRR, RRR, progress ratio.",
              icon: Sliders,
            },
            {
              step: "03",
              title: "Logistic Regression",
              desc: "scikit-learn pipeline with StandardScaler & match-level train/test split.",
              icon: Cpu,
            },
            {
              step: "04",
              title: "Win Probability",
              desc: "Calibrated P(chasing team wins) calculated for every legal delivery.",
              icon: TrendingUp,
            },
            {
              step: "05",
              title: "Match Replay",
              desc: "Interactive 22-yard pitch visualizer with dynamic probability curves.",
              icon: Layers,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-pitch-secondary/70 p-5 rounded-2xl border border-pitch-border hover:border-pitch-lime/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-pitch-muted font-bold group-hover:text-pitch-lime">
                      {item.step}
                    </span>
                    <div className="p-2 rounded-lg bg-pitch-forest text-pitch-lime border border-pitch-border">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-pitch-ivory text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-pitch-muted text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-pitch-lime font-bold bg-pitch-secondary px-3 py-1 rounded-full border border-pitch-border">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pitch-ivory font-display">
            Built for Match Analysts & Cricket Fans
          </h2>
          <p className="text-pitch-secondary text-sm sm:text-base">
            Genuine mathematical rigor meets broadcast-quality sports visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Ball-by-Ball Predictions",
              desc: "Every legal delivery updates the exact match state: runs required, balls left, and pressure run rates.",
              icon: Flame,
              badge: "ML Powered",
            },
            {
              title: "Historical Match Explorer",
              desc: "Search and filter 1,195 verified IPL fixtures by season, venue, team name, and match result.",
              icon: Search,
              badge: "1,195 Matches",
            },
            {
              title: "Interactive Probability Curves",
              desc: "Dynamic Recharts visualizations capturing match swings, wickets, and boundary breakthroughs.",
              icon: BarChart3,
              badge: "Recharts Visuals",
            },
            {
              title: "22-Yard Pitch Replay",
              desc: "Original vector animations displaying delivery trajectories, bowler run-ups, and batter silhouettes.",
              icon: Layers,
              badge: "SVG Visuals",
            },
            {
              title: "Verified Evaluation Metrics",
              desc: "Genuine 0.446 log-loss, 78% accuracy, confusion matrix, and Brier calibration curves.",
              icon: CheckCircle2,
              badge: "0.446 Log-Loss",
            },
            {
              title: "Transparent Methodology",
              desc: "No black boxes or hidden variables. Clear coefficients, match-level train/test splits, and code.",
              icon: Cpu,
              badge: "Match-Level Split",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-pitch-secondary/60 rounded-2xl p-6 border border-pitch-border hover:border-pitch-lime/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-pitch-forest text-pitch-lime border border-pitch-border">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-pitch-lime bg-pitch-forest px-2.5 py-0.5 rounded-full border border-pitch-border">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-pitch-ivory text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-pitch-muted text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Analytics Preview (Live Data from Genuine Match) */}
      {featuredReplay && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-pitch-secondary/40 rounded-3xl p-6 md:p-8 border border-pitch-border shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-pitch-border/60 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-pitch-lime font-bold">
                  Live Analytics Preview
                </span>
                <h3 className="text-2xl font-bold text-pitch-ivory mt-1">
                  {featuredReplay.match_info.team1} vs {featuredReplay.match_info.team2}
                </h3>
                <p className="text-xs text-pitch-muted">
                  Season {featuredReplay.match_info.season} • {featuredReplay.match_info.venue}
                </p>
              </div>

              <Link
                href={`/match-center?id=${featuredReplay.match_info.match_id}`}
                onClick={playClick}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-pitch-lime text-pitch-charcoal font-bold text-xs hover:bg-[#b0d854] transition-all self-start md:self-auto"
              >
                <span>Open Full Match Center</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <CricketPitch
                  currentDelivery={featuredReplay.deliveries[Math.min(30, featuredReplay.deliveries.length - 1)]}
                  chasingProb={featuredReplay.deliveries[Math.min(30, featuredReplay.deliveries.length - 1)].chasing_win_probability}
                />
              </div>

              <div className="lg:col-span-7">
                <WinProbabilityChart
                  data={featuredReplay.deliveries}
                  currentIndex={Math.min(30, featuredReplay.deliveries.length - 1)}
                  chasingTeam={featuredReplay.match_info.chasing_team}
                  defendingTeam={featuredReplay.match_info.defending_team}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Data Source, Licensing & Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pitch-secondary via-pitch-card to-pitch-secondary rounded-3xl p-8 border border-pitch-border text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs text-pitch-lime font-mono">
              <Database className="w-4 h-4" />
              <span>Official Cricsheet Historical Archive</span>
            </div>
            <h3 className="text-2xl font-bold text-pitch-ivory font-display">
              Open Data Attribution & License
            </h3>
            <p className="text-pitch-secondary text-sm leading-relaxed">
              All ball-by-ball match records originate from the authentic Cricsheet open dataset, licensed under the{" "}
              <a
                href="https://cricsheet.org/licensing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pitch-lime underline font-medium hover:text-white"
              >
                Open Data Commons Attribution License (ODC-By v1.0)
              </a>
              . DLS-affected matches are excluded to ensure clean 20-over training integrity.
            </p>
          </div>

          <Link
            href="/data-sources"
            onClick={playClick}
            className="px-6 py-3 rounded-xl bg-pitch-card border border-pitch-border text-pitch-ivory hover:text-pitch-lime font-semibold text-sm hover:border-pitch-lime/40 transition-all shrink-0"
          >
            Review Data Sources
          </Link>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center bg-gradient-to-b from-pitch-secondary to-[#0F261F] rounded-3xl p-10 sm:p-14 border border-pitch-border relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-pitch-ivory font-display">
              Ready to Explore Cricket Odds in Action?
            </h2>
            <p className="text-pitch-secondary text-base">
              Dive into 1,195 historical IPL fixtures, simulate custom chase scenarios, or inspect our scikit-learn model weights.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/matches"
                onClick={() => {
                  playClick();
                  playBatCrack();
                }}
                className="inline-flex items-center px-8 py-3.5 rounded-xl bg-pitch-lime text-pitch-charcoal font-bold text-base shadow-lg hover:bg-[#b0d854] transition-all"
              >
                <span>Launch Match Explorer</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/probability-lab"
                onClick={playClick}
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-pitch-forest border border-pitch-border text-pitch-ivory font-semibold text-base hover:bg-pitch-card transition-all"
              >
                <span>Open Odds Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

