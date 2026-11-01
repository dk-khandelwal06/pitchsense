import { NextRequest, NextResponse } from "next/server";
import weights from "@/lib/model_weights.json";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const runsNeeded = Number(body.runs_needed);
    const ballsRemaining = Number(body.balls_remaining);
    const wicketsInHand = Number(body.wickets_in_hand);
    const currentRunRate = Number(body.current_run_rate);

    // Validation
    if (isNaN(runsNeeded) || runsNeeded < 0 || runsNeeded > 400) {
      return NextResponse.json({ error: "Invalid runs_needed (0-400)" }, { status: 422 });
    }
    if (isNaN(ballsRemaining) || ballsRemaining < 0 || ballsRemaining > 120) {
      return NextResponse.json({ error: "Invalid balls_remaining (0-120)" }, { status: 422 });
    }
    if (isNaN(wicketsInHand) || wicketsInHand < 0 || wicketsInHand > 10) {
      return NextResponse.json({ error: "Invalid wickets_in_hand (0-10)" }, { status: 422 });
    }
    if (isNaN(currentRunRate) || currentRunRate < 0) {
      return NextResponse.json({ error: "Invalid current_run_rate" }, { status: 422 });
    }

    // Terminal Edge Cases
    if (runsNeeded <= 0) {
      return NextResponse.json({
        chasing_win_probability: 1.0,
        defending_win_probability: 0.0,
        chasing_win_percentage: 100.0,
        defending_win_percentage: 0.0,
        features_used: {
          runs_needed: 0,
          balls_remaining: ballsRemaining,
          wickets_in_hand: wicketsInHand,
          current_run_rate: currentRunRate,
          required_run_rate: 0,
          innings_progress: 1.0,
        },
        model_name: "Logistic Regression Pipeline",
        target_description: "P(Chasing team wins)",
        status: "target_achieved",
      });
    }

    if (wicketsInHand <= 0 || (ballsRemaining <= 0 && runsNeeded > 0)) {
      return NextResponse.json({
        chasing_win_probability: 0.0,
        defending_win_probability: 1.0,
        chasing_win_percentage: 0.0,
        defending_win_percentage: 100.0,
        features_used: {
          runs_needed: runsNeeded,
          balls_remaining: ballsRemaining,
          wickets_in_hand: wicketsInHand,
          current_run_rate: currentRunRate,
          required_run_rate: 99.0,
          innings_progress: 1.0,
        },
        model_name: "Logistic Regression Pipeline",
        target_description: "P(Chasing team wins)",
        status: wicketsInHand <= 0 ? "all_out" : "overs_completed",
      });
    }

    // Compute RRR & Progress if omitted
    const requiredRunRate =
      body.required_run_rate !== undefined
        ? Number(body.required_run_rate)
        : ballsRemaining > 0
        ? Math.round(((runsNeeded / ballsRemaining) * 6) * 100) / 100
        : 99.0;

    const inningsProgress =
      body.innings_progress !== undefined
        ? Number(body.innings_progress)
        : Math.round(Math.min(1.0, Math.max(0.0, (120 - ballsRemaining) / 120.0)) * 1000) / 1000;

    // Feature array
    const rawFeatures = [
      runsNeeded,
      ballsRemaining,
      wicketsInHand,
      currentRunRate,
      requiredRunRate,
      inningsProgress,
    ];

    // Standard scaler transformation: (x - mean) / scale
    const mean = weights.scaler.mean;
    const scale = weights.scaler.scale;
    const coef = weights.logistic_regression.coef;
    const intercept = weights.logistic_regression.intercept;

    let logit = intercept;
    for (let i = 0; i < rawFeatures.length; i++) {
      const zScore = (rawFeatures[i] - mean[i]) / scale[i];
      logit += coef[i] * zScore;
    }

    // Sigmoid probability: P = 1 / (1 + exp(-z))
    const pChasing = 1.0 / (1.0 + Math.exp(-logit));
    const pChasingClamped = Math.min(0.9999, Math.max(0.0001, pChasing));
    const pDefending = 1.0 - pChasingClamped;

    return NextResponse.json({
      chasing_win_probability: Math.round(pChasingClamped * 10000) / 10000,
      defending_win_probability: Math.round(pDefending * 10000) / 10000,
      chasing_win_percentage: Math.round(pChasingClamped * 1000) / 10,
      defending_win_percentage: Math.round(pDefending * 1000) / 10,
      features_used: {
        runs_needed: runsNeeded,
        balls_remaining: ballsRemaining,
        wickets_in_hand: wicketsInHand,
        current_run_rate: currentRunRate,
        required_run_rate: requiredRunRate,
        innings_progress: inningsProgress,
      },
      model_name: "scikit-learn Logistic Regression Pipeline",
      target_description: "P(Chasing team wins)",
      status: "success",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

