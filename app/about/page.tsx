"use client";

import React from "react";
import Link from "next/link";
import { CricketBall } from "@/components/cricket/CricketBall";
import {
  Sparkles,
  Cpu,
  Layers,
  Database,
  GitBranch,
  Rocket,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Sports Analytics & Applied AI
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          About PitchSense
        </h1>
        <p className="text-xs text-pitch-muted">
          Tagline: &ldquo;What are the real odds, right now?&rdquo; • Built for GitHub source control and Vercel cloud hosting.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-2xl font-bold text-pitch-ivory font-display">
            The Vision Behind PitchSense
          </h2>
          <p className="text-sm text-pitch-secondary leading-relaxed">
            Cricket broadcasting frequently relies on crude, static formulas or uncalibrated commentator intuition to forecast match outcomes. In T20 cricket, where a single boundary or wicket fundamentally flips momentum within six balls, fans and analysts deserve transparent, data-driven odds.
          </p>
          <p className="text-sm text-pitch-muted leading-relaxed">
            PitchSense was designed to answer one question: <strong>&ldquo;What are the real odds, right now?&rdquo;</strong> By training a scikit-learn Logistic Regression pipeline on over 138,000 historical IPL deliveries, we produce calibrated probability estimates derived from ground truth match state invariants.
          </p>
        </div>

        <div className="lg:col-span-4 bg-pitch-secondary/80 rounded-3xl p-6 border border-pitch-border shadow-xl text-center space-y-3">
          <div className="mx-auto flex justify-center">
            <CricketBall size={56} animate={true} />
          </div>
          <span className="font-bold text-lg text-pitch-ivory font-display block">
            Stadium Intelligence
          </span>
          <p className="text-xs text-pitch-muted">
            Combining the aesthetics of broadcast cricket control rooms with sports analytics rigor.
          </p>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-pitch-secondary/60 rounded-3xl p-6 md:p-8 border border-pitch-border space-y-6">
        <h3 className="text-xl font-bold text-pitch-ivory font-display">
          Production Technology Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-pitch-card border border-pitch-border space-y-2">
            <span className="font-mono text-pitch-lime font-bold uppercase block">
              Frontend & Presentation
            </span>
            <ul className="space-y-1.5 text-pitch-secondary">
              <li>• Next.js 15+ App Router</li>
              <li>• React 19 & TypeScript</li>
              <li>• Tailwind CSS Design System</li>
              <li>• Framer Motion physics animations</li>
              <li>• Recharts interactive visualizations</li>
              <li>• Web Audio API sound synthesis</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-pitch-card border border-pitch-border space-y-2">
            <span className="font-mono text-pitch-lime font-bold uppercase block">
              Machine Learning Engine
            </span>
            <ul className="space-y-1.5 text-pitch-secondary">
              <li>• Python 3.13 & scikit-learn</li>
              <li>• LogisticRegression Pipeline</li>
              <li>• StandardScaler feature normalization</li>
              <li>• Pandas & NumPy vector processing</li>
              <li>• Joblib binary serialization</li>
              <li>• Match-level train/test split</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-pitch-card border border-pitch-border space-y-2">
            <span className="font-mono text-pitch-lime font-bold uppercase block">
              Backend & Deployment
            </span>
            <ul className="space-y-1.5 text-pitch-secondary">
              <li>• FastAPI asynchronous endpoints</li>
              <li>• Pydantic v2 strict schemas</li>
              <li>• Vercel serverless deployment</li>
              <li>• Git source control</li>
              <li>• Cricsheet Open Data (ODC-By)</li>
              <li>• Zero third-party API dependencies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implemented vs Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Implemented in v1 */}
        <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
          <div className="flex items-center space-x-2 text-pitch-lime font-bold">
            <CheckCircle2 className="w-5 h-5 text-pitch-lime" />
            <h3 className="text-lg font-display">Implemented in Version 1.0</h3>
          </div>
          <ul className="space-y-2 text-xs text-pitch-secondary">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>Full ingestion of 1,243 Cricsheet IPL matches</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>Extraction of 138,683 chasing delivery records</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>scikit-learn Logistic Regression model with 0.446 log-loss</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>Match-level train/test split preventing data leakage</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>101 precompiled ball-by-ball interactive replays</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>Web Audio procedural cricket sound synthesizer</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-lime" />
              <span>3 themes: Stadium (default), Light, Dark with persistence</span>
            </li>
          </ul>
        </div>

        {/* Future Development Roadmap */}
        <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
          <div className="flex items-center space-x-2 text-pitch-orange font-bold">
            <Rocket className="w-5 h-5 text-pitch-orange" />
            <h3 className="text-lg font-display">Future Development Roadmap</h3>
          </div>
          <ul className="space-y-2 text-xs text-pitch-muted">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-orange" />
              <span>Player-specific quality ratings (Batter strike rates vs Bowler economy)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-orange" />
              <span>Comparative ensemble models (Random Forest, XGBoost, LightGBM)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-orange" />
              <span>Expansion to One-Day Internationals (50 overs) & Test cricket</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-orange" />
              <span>Live match websocket feed integration for real-time fixtures</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pitch-orange" />
              <span>Venue-specific pitch wear & dew factor adjustment parameters</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

