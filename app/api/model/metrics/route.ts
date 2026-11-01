import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const metricsPath = path.join(process.cwd(), "artifacts", "model", "evaluation_metrics.json");

    if (fs.existsSync(metricsPath)) {
      const data = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Model evaluation metrics unavailable" },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

