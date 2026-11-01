import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchesPath = path.join(process.cwd(), "data", "processed", "matches.json");
    const replaysPath = path.join(process.cwd(), "data", "processed", "featured_replays.json");

    if (!fs.existsSync(matchesPath)) {
      return NextResponse.json({ error: "Matches data not found" }, { status: 404 });
    }

    const matches = JSON.parse(fs.readFileSync(matchesPath, "utf-8"));
    const match = matches.find((m: any) => String(m.match_id) === String(id));

    if (!match) {
      return NextResponse.json({ error: `Match ${id} not found` }, { status: 404 });
    }

    let hasReplay = false;
    if (fs.existsSync(replaysPath)) {
      const replays = JSON.parse(fs.readFileSync(replaysPath, "utf-8"));
      hasReplay = replays.some((r: any) => String(r.match_id) === String(id));
    }

    return NextResponse.json({
      ...match,
      has_replay: hasReplay,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

