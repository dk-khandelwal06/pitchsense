import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const metricsPath = path.join(process.cwd(), "artifacts", "model", "evaluation_metrics.json");

    if (fs.existsSync(metricsPath)) {
      const data = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
      const lr = data.logistic_regression || {};
      return NextResponse.json({
        model_type: "Logistic Regression with StandardScaler Pipeline",
        framework: "scikit-learn",
        target: "P(Chasing team wins) [1 = Won, 0 = Lost]",
        features: lr.features || [],
        coefficients: lr.coefficients || {},
        intercept: lr.intercept || 0,
        dataset_summary: data.dataset_summary || {},
        random_state: 42,
        split_method: "Match-level split (Prevents cross-match data leakage)",
      });
    }

    return NextResponse.json({ error: "Model info unavailable" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

