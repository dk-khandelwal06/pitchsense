"use client";

import React from "react";
import {
  Database,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Calendar,
} from "lucide-react";

export default function DataSourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Data Integrity & Provenance
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          Data Sources & Licensing
        </h1>
        <p className="text-xs text-pitch-muted">
          Complete transparency regarding our raw data origins, processing criteria, and licensing compliance.
        </p>
      </div>

      {/* Primary Attribution Card */}
      <div className="bg-gradient-to-r from-pitch-secondary via-pitch-card to-pitch-secondary rounded-3xl p-6 sm:p-8 border border-pitch-border shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-pitch-lime font-mono text-xs">
          <Database className="w-4 h-4" />
          <span>Official Data Provider</span>
        </div>
        <h2 className="text-2xl font-bold text-pitch-ivory font-display">
          Cricsheet Open Cricket Data
        </h2>
        <p className="text-sm text-pitch-secondary leading-relaxed max-w-3xl">
          PitchSense uses historical Indian Premier League ball-by-ball match data compiled by{" "}
          <a
            href="https://cricsheet.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pitch-lime underline font-semibold hover:text-white"
          >
            Cricsheet.org
          </a>
          . Cricsheet publishes structured, community-verified ball-level data for international and domestic T20 leagues.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
          <a
            href="https://cricsheet.org/downloads/ipl_json.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-pitch-forest text-pitch-lime border border-pitch-border hover:bg-pitch-card transition-colors"
          >
            <span>Download Source: ipl_json.zip</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
          <a
            href="https://cricsheet.org/licensing/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-pitch-forest text-pitch-secondary border border-pitch-border hover:text-pitch-ivory transition-colors"
          >
            <span>License: ODC-By v1.0</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
        </div>
      </div>

      {/* Dataset Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border">
          <span className="text-[11px] text-pitch-muted font-mono uppercase block">Raw Fixtures Ingested</span>
          <span className="text-3xl font-mono font-bold text-pitch-ivory block mt-1">1,243</span>
          <span className="text-[11px] text-pitch-muted">Total Cricsheet JSON files</span>
        </div>

        <div className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border">
          <span className="text-[11px] text-pitch-muted font-mono uppercase block">Valid Match Pool</span>
          <span className="text-3xl font-mono font-bold text-pitch-lime block mt-1">1,195</span>
          <span className="text-[11px] text-pitch-muted">Regular completed 20-over games</span>
        </div>

        <div className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border">
          <span className="text-[11px] text-pitch-muted font-mono uppercase block">Chasing Deliveries</span>
          <span className="text-3xl font-mono font-bold text-pitch-orange block mt-1">138,683</span>
          <span className="text-[11px] text-pitch-muted">Extracted 2nd innings balls</span>
        </div>

        <div className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border">
          <span className="text-[11px] text-pitch-muted font-mono uppercase block">IPL Coverage</span>
          <span className="text-3xl font-mono font-bold text-pitch-secondary block mt-1">2008–2024</span>
          <span className="text-[11px] text-pitch-muted">17 competitive seasons</span>
        </div>
      </div>

      {/* Exclusion Criteria & Rules */}
      <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
        <h3 className="text-xl font-bold text-pitch-ivory font-display flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-pitch-orange" />
          <span>Explicit Dataset Exclusion Rules</span>
        </h3>
        <p className="text-xs text-pitch-muted leading-relaxed">
          To preserve model integrity and avoid feeding distorted match states into our training pipeline, the following fixture categories were systematically excluded:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-2">
          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-orange font-bold">DLS-Affected Matches (23)</span>
            <p className="text-pitch-muted text-[11px] pt-1 leading-normal font-sans">
              Matches with revised targets via Duckworth-Lewis-Stern alter over quotas and run calculations, introducing artificial state discontinuities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-orange font-bold">Tied Matches & Super Overs (14)</span>
            <p className="text-pitch-muted text-[11px] pt-1 leading-normal font-sans">
              Matches ending in scores tied after 20 overs are decided by 1-over eliminators rather than standard chase targets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border space-y-1">
            <span className="text-pitch-orange font-bold">Abandoned / No Results (11)</span>
            <p className="text-pitch-muted text-[11px] pt-1 leading-normal font-sans">
              Fixtures abandoned due to rain, unplayable surfaces, or technical factors without completing 20 overs in both innings.
            </p>
          </div>
        </div>
      </div>

      {/* License Text Box */}
      <div className="bg-pitch-secondary/50 rounded-2xl p-5 border border-pitch-border text-xs text-pitch-muted space-y-2">
        <h4 className="font-bold text-pitch-ivory uppercase tracking-wider text-[11px]">
          Open Data Commons Attribution License (ODC-By v1.0) Notice
        </h4>
        <p className="leading-relaxed">
          PitchSense uses data from Cricsheet, made available under the Open Data Commons Attribution License. You are free to share, modify, and build upon the data as long as proper attribution is given to Cricsheet.org. No personal or proprietary tracking data is redistributable.
        </p>
      </div>
    </div>
  );
}

