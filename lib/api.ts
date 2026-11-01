/**
 * Typed client for PitchSense API.
 * Communicates with /api/... endpoints with safe handling.
 */

export interface MatchMetadata {
  match_id: string;
  season: string;
  date: string;
  venue: string;
  city: string;
  team1: string;
  team2: string;
  toss_winner: string;
  toss_decision: string;
  winner: string;
  win_by_type: string;
  win_margin: number;
  player_of_match: string;
  target_runs: number;
  inn1_runs: number;
  inn1_wickets: number;
  inn1_overs: number;
  inn2_runs: number;
  inn2_wickets: number;
  inn2_overs: number;
  chasing_team: string;
  defending_team: string;
  chasing_team_won: boolean | number;
  total_deliveries?: number;
  has_replay?: boolean;
}

export interface DeliveryRecord {
  ball_index: number;
  over: number;
  ball_in_over: number;
  display_over: string;
  batter: string;
  bowler: string;
  non_striker: string;
  batter_runs: number;
  extras_runs: number;
  total_runs: number;
  is_legal: boolean;
  is_wicket: boolean;
  wicket_kind: string;
  player_out: string;
  event: string;
  commentary: string;
  score_after: number;
  wickets_after: number;
  legal_balls_bowled: number;
  runs_needed: number;
  balls_remaining: number;
  wickets_in_hand: number;
  current_run_rate: number;
  required_run_rate: number;
  innings_progress: number;
  chasing_win_probability: number;
  defending_win_probability: number;
  previous_probability: number;
  probability_change: number;
}

export interface ReplayPayload {
  match_info: MatchMetadata;
  deliveries: DeliveryRecord[];
  total_deliveries: number;
}

export interface ModelMetrics {
  dataset_summary: {
    total_matches: number;
    total_deliveries: number;
    train_matches: number;
    test_matches: number;
    train_deliveries: number;
    test_deliveries: number;
    split_type: string;
    test_split_ratio: number;
  };
  logistic_regression: {
    log_loss: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    brier_score: number;
    roc_auc: number;
    confusion_matrix: {
      true_negative: number;
      false_positive: number;
      false_negative: number;
      true_positive: number;
    };
    coefficients: Record<string, number>;
    intercept: number;
    features: string[];
    calibration_curve: Array<{
      bin: number;
      predicted_probability: number;
      empirical_probability: number;
    }>;
  };
  heuristic_baseline: {
    name: string;
    log_loss: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    brier_score: number;
    description: string;
  };
  comparison: {
    log_loss_improvement: number;
    accuracy_improvement: number;
    brier_improvement: number;
    summary: string;
  };
}

export interface PredictParams {
  runs_needed: number;
  balls_remaining: number;
  wickets_in_hand: number;
  current_run_rate: number;
  required_run_rate?: number;
  innings_progress?: number;
}

export interface PredictResult {
  chasing_win_probability: number;
  defending_win_probability: number;
  chasing_win_percentage: number;
  defending_win_percentage: number;
  features_used: Record<string, number>;
  model_name: string;
  target_description: string;
  status: string;
}

export async function fetchHealth() {
  const res = await fetch("/api/health", { cache: "no-store" });
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchMatches(params?: {
  search?: string;
  season?: string;
  venue?: string;
  has_replay?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ total: number; limit: number; offset: number; matches: MatchMetadata[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.season) query.set("season", params.season);
  if (params?.venue) query.set("venue", params.venue);
  if (params?.has_replay !== undefined) query.set("has_replay", String(params.has_replay));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));

  const res = await fetch(`/api/matches?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function fetchMatch(matchId: string): Promise<MatchMetadata> {
  const res = await fetch(`/api/matches/${matchId}`);
  if (!res.ok) throw new Error(`Match ${matchId} not found`);
  return res.json();
}

export async function fetchMatchReplay(matchId: string): Promise<ReplayPayload> {
  const res = await fetch(`/api/matches/${matchId}/replay`);
  if (!res.ok) throw new Error(`Replay for match ${matchId} not found`);
  return res.json();
}

export async function fetchModelMetrics(): Promise<ModelMetrics> {
  const res = await fetch("/api/model/metrics");
  if (!res.ok) throw new Error("Failed to fetch model metrics");
  return res.json();
}

export async function predictProbability(params: PredictParams): Promise<PredictResult> {
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Prediction request failed");
  return res.json();
}

