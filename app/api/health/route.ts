import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const matchesPath = path.join(process.cwd(), "data", "processed", "matches.json");
    const replaysPath = path.join(process.cwd(), "data", "processed", "featured_replays.json");

    let matchesCount = 0;
    if (fs.existsSync(matchesPath)) {
      const data = JSON.parse(fs.readFileSync(matchesPath, "utf-8"));
      matchesCount = data.length;
    }

    let replaysCount = 0;
    if (fs.existsSync(replaysPath)) {
      const data = JSON.parse(fs.readFileSync(replaysPath, "utf-8"));
      replaysCount = data.length;
    }

    return NextResponse.json({
      status: "healthy",
      service: "pitchsense-api",
      version: "1.0.0",
      model_loaded: true,
      total_historical_matches: matchesCount,
      total_replays_available: replaysCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

