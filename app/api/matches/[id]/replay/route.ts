import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const replayFile = path.join(process.cwd(), "data", "processed", "replays", `${id}.json`);

    if (fs.existsSync(replayFile)) {
      const data = JSON.parse(fs.readFileSync(replayFile, "utf-8"));
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: `Ball-by-ball replay not yet compiled for match ${id}` },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

