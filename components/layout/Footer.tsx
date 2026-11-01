"use client";

import React from "react";
import Link from "next/link";
import { CricketBall } from "@/components/cricket/CricketBall";
import { ShieldCheck, Database, GitBranch, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-pitch-secondary border-t border-pitch-border text-pitch-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <CricketBall size={24} animate={false} />
              <span className="font-extrabold text-base text-pitch-ivory font-display">
                Pitch<span className="text-pitch-lime">Sense</span>
              </span>
            </div>
            <p className="text-pitch-muted leading-relaxed">
              Ball-by-ball win probability engine for T20 cricket powered by historical IPL match data and an explainable scikit-learn Logistic Regression pipeline.
            </p>
            <div className="pt-2 text-[11px] text-pitch-muted">
              Tagline: <span className="text-pitch-secondary font-medium">&ldquo;What are the real odds, right now?&rdquo;</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-bold text-pitch-ivory uppercase tracking-wider text-[11px] mb-3">
              Cricket Intelligence
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-pitch-lime transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-pitch-lime transition-colors">
                  Historical Match Explorer
                </Link>
              </li>
              <li>
                <Link href="/match-center" className="hover:text-pitch-lime transition-colors">
                  Match Center Replay
                </Link>
              </li>
              <li>
                <Link href="/probability-lab" className="hover:text-pitch-lime transition-colors">
                  Win Probability Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Machine Learning & Architecture */}
          <div>
            <h4 className="font-bold text-pitch-ivory uppercase tracking-wider text-[11px] mb-3">
              ML & Engineering
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/model-intelligence" className="hover:text-pitch-lime transition-colors">
                  Model Intelligence & Metrics
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-pitch-lime transition-colors">
                  Pipeline & Methodology
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="hover:text-pitch-lime transition-colors">
                  Cricsheet Open Data
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-pitch-lime transition-colors">
                  Security & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Licensing & Trust Notice */}
          <div className="space-y-2">
            <h4 className="font-bold text-pitch-ivory uppercase tracking-wider text-[11px] mb-3 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-pitch-lime" />
              <span>Data Licensing</span>
            </h4>
            <p className="text-[11px] text-pitch-muted leading-relaxed">
              Match data provided courtesy of{" "}
              <a
                href="https://cricsheet.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pitch-lime hover:underline"
              >
                Cricsheet.org
              </a>{" "}
              under the{" "}
              <a
                href="https://cricsheet.org/licensing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pitch-lime hover:underline"
              >
                Open Data Commons Attribution License (ODC-By v1.0)
              </a>
              .
            </p>
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-pitch-secondary">
              <ShieldCheck className="w-4 h-4 text-pitch-lime" />
              <span>Zero credentials required • Production buildable</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-pitch-border/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pitch-muted gap-2">
          <div>
            &copy; {new Date().getFullYear()} PitchSense. Built for GitHub & Vercel deployment.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:text-pitch-ivory transition-colors">
              About Project
            </Link>
            <span>•</span>
            <Link href="/security" className="hover:text-pitch-ivory transition-colors">
              Security
            </Link>
            <span>•</span>
            <Link href="/data-sources" className="hover:text-pitch-ivory transition-colors">
              Attribution
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

