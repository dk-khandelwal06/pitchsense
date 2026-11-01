import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const season = searchParams.get("season");
    const venue = searchParams.get("venue");
    const hasReplayParam = searchParams.get("has_replay");
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    const matchesPath = path.join(process.cwd(), "data", "processed", "matches.json");
    const replaysPath = path.join(process.cwd(), "data", "processed", "featured_replays.json");

    if (!fs.existsSync(matchesPath)) {
      return NextResponse.json({ error: "Matches data not found" }, { status: 404 });
    }

    const matches = JSON.parse(fs.readFileSync(matchesPath, "utf-8"));
    const featuredIds = new Set<string>();
    if (fs.existsSync(replaysPath)) {
      const replays = JSON.parse(fs.readFileSync(replaysPath, "utf-8"));
      replays.forEach((r: any) => featuredIds.add(String(r.match_id)));
    }

    let filtered = matches;

    if (season) {
      filtered = filtered.filter((m: any) => String(m.season) === String(season));
    }

    if (venue) {
      const vLower = venue.toLowerCase();
      filtered = filtered.filter((m: any) => String(m.venue || "").toLowerCase().includes(vLower));
    }

    if (search) {
      const sLower = search.toLowerCase();
      filtered = filtered.filter((m: any) =>
        String(m.team1 || "").toLowerCase().includes(sLower) ||
        String(m.team2 || "").toLowerCase().includes(sLower) ||
        String(m.venue || "").toLowerCase().includes(sLower) ||
        String(m.winner || "").toLowerCase().includes(sLower)
      );
    }

    if (hasReplayParam === "true") {
      filtered = filtered.filter((m: any) => featuredIds.has(String(m.match_id)));
    }

    const total = filtered.length;
    const pageItems = filtered.slice(offset, offset + limit).map((m: any) => ({
      ...m,
      has_replay: featuredIds.has(String(m.match_id)),
    }));

    return NextResponse.json({
      total,
      limit,
      offset,
      matches: pageItems,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

