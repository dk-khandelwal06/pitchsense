"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CricketBall } from "@/components/cricket/CricketBall";
import { useSound } from "@/components/sound/SoundEngine";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

export default function MatchesPage() {
  const { playClick, playBatCrack } = useSound();
  const [matches, setMatches] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("");
  const [replayOnly, setReplayOnly] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 18;

  const seasonsList = [
    "All", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"
  ];

  const fetchMatchList = () => {
    setLoading(true);
    const query = new URLSearchParams();
    query.set("limit", String(limit));
    query.set("offset", String(page * limit));
    if (search) query.set("search", search);
    if (season && season !== "All") query.set("season", season);
    if (replayOnly) query.set("has_replay", "true");

    fetch(`/api/matches?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches || []);
        setTotalCount(data.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatchList();
  }, [search, season, replayOnly, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-pitch-border gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
            Historical Archive (2008 - 2024)
          </span>
          <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
            IPL Match Explorer
          </h1>
          <p className="text-xs text-pitch-muted">
            Browse 1,195 verified IPL fixtures. Select any match to inspect its ball-by-ball probability trajectory.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-pitch-muted">
          <span className="text-pitch-lime font-bold">{totalCount}</span>
          <span>Matches Filtered</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-pitch-secondary/80 rounded-2xl p-4 border border-pitch-border grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-pitch-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search teams (e.g. Chennai, Mumbai, Bangalore)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full bg-pitch-card text-pitch-ivory text-xs rounded-xl pl-9 pr-3 py-2.5 border border-pitch-border focus:outline-none focus:border-pitch-lime"
          />
        </div>

        {/* Season Selector */}
        <div className="sm:col-span-3">
          <select
            value={season}
            onChange={(e) => {
              setSeason(e.target.value);
              setPage(0);
            }}
            aria-label="Filter by Season"
            className="w-full bg-pitch-card text-pitch-ivory text-xs rounded-xl px-3 py-2.5 border border-pitch-border focus:outline-none focus:border-pitch-lime"
          >
            <option value="">All Seasons (2008–2024)</option>
            {seasonsList.filter(s => s !== "All").map((s) => (
              <option key={s} value={s}>
                Season {s}
              </option>
            ))}
          </select>
        </div>

        {/* Replay-only toggle */}
        <div className="sm:col-span-4 flex items-center justify-end space-x-2">
          <label className="text-xs text-pitch-muted cursor-pointer flex items-center space-x-2">
            <input
              type="checkbox"
              checked={replayOnly}
              onChange={(e) => {
                setReplayOnly(e.target.checked);
                setPage(0);
              }}
              className="accent-pitch-lime rounded cursor-pointer"
            />
            <span className="text-pitch-ivory font-medium">Replay Compiled Only (101)</span>
          </label>
        </div>
      </div>

      {/* Match Cards Grid */}
      {loading ? (
        <div className="h-72 flex flex-col items-center justify-center space-y-3 text-pitch-muted">
          <CricketBall size={36} animate={true} />
          <span className="text-xs font-mono">Searching match archive...</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-pitch-muted border border-dashed border-pitch-border rounded-2xl p-6">
          <p className="text-sm">No matches found matching your filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setSeason("");
              setReplayOnly(false);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-pitch-forest text-pitch-lime text-xs font-semibold border border-pitch-border"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => (
            <div
              key={m.match_id}
              className="bg-pitch-secondary/70 rounded-2xl p-5 border border-pitch-border hover:border-pitch-lime/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Card Top: Season, Date & Badge */}
                <div className="flex items-center justify-between text-xs text-pitch-muted mb-3 pb-2 border-b border-pitch-border/50">
                  <span className="font-mono bg-pitch-forest text-pitch-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                    IPL {m.season}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-pitch-lime" />
                    <span>{m.date}</span>
                  </div>
                </div>

                {/* Match Teams & Scores */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${m.winner === m.team1 ? "text-pitch-ivory font-bold" : "text-pitch-secondary"}`}>
                      {m.team1}
                    </span>
                    <span className="font-mono text-xs font-bold text-pitch-muted">
                      {m.inn1_runs}/{m.inn1_wickets}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${m.winner === m.team2 ? "text-pitch-ivory font-bold" : "text-pitch-secondary"}`}>
                      {m.team2}
                    </span>
                    <span className="font-mono text-xs font-bold text-pitch-lime">
                      {m.inn2_runs}/{m.inn2_wickets}
                    </span>
                  </div>
                </div>

                {/* Match Result Badge */}
                <div className="p-2.5 rounded-xl bg-pitch-card/80 border border-pitch-border text-xs mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-pitch-ivory font-medium">
                    <Trophy className="w-3.5 h-3.5 text-pitch-lime shrink-0" />
                    <span className="truncate">{m.winner} won by {m.win_margin} {m.win_by_type}</span>
                  </div>
                  {m.has_replay && (
                    <span className="text-[10px] font-mono text-pitch-lime font-bold bg-pitch-forest px-1.5 py-0.5 rounded border border-pitch-border shrink-0">
                      REPLAY
                    </span>
                  )}
                </div>

                {/* Venue */}
                <div className="flex items-center space-x-1.5 text-[11px] text-pitch-muted truncate">
                  <MapPin className="w-3 h-3 text-pitch-lime shrink-0" />
                  <span className="truncate">{m.venue}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-pitch-border/40">
                <Link
                  href={`/match-center?id=${m.match_id}`}
                  onClick={() => {
                    playClick();
                    playBatCrack();
                  }}
                  className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl bg-pitch-card hover:bg-pitch-lime hover:text-pitch-charcoal text-pitch-ivory text-xs font-semibold border border-pitch-border transition-all group-hover:border-pitch-lime/60"
                >
                  <span>Replay Match In Center</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalCount > limit && (
        <div className="flex items-center justify-between pt-4 border-t border-pitch-border text-xs text-pitch-muted">
          <span>
            Showing {page * limit + 1} - {Math.min(totalCount, (page + 1) * limit)} of {totalCount}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                playClick();
                setPage((p) => Math.max(0, p - 1));
              }}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-pitch-secondary border border-pitch-border disabled:opacity-40 hover:bg-pitch-card"
            >
              Previous
            </button>
            <span className="font-mono text-pitch-ivory">Page {page + 1}</span>
            <button
              onClick={() => {
                playClick();
                setPage((p) => p + 1);
              }}
              disabled={(page + 1) * limit >= totalCount}
              className="px-3 py-1.5 rounded-lg bg-pitch-secondary border border-pitch-border disabled:opacity-40 hover:bg-pitch-card"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

