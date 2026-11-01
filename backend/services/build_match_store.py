"""
Build precomputed match replays and fast search index.
Every delivery's win probability is computed directly using the trained scikit-learn model.
"""
import json
import os
from pathlib import Path
import pandas as pd
import numpy as np
import joblib

FEATURE_COLS = [
    "runs_needed",
    "balls_remaining",
    "wickets_in_hand",
    "current_run_rate",
    "required_run_rate",
    "innings_progress",
]

def build_store():
    model_path = Path("artifacts/model/logistic_regression.joblib")
    if not model_path.exists():
        raise FileNotFoundError(f"Trained model not found at {model_path}")

    print("Loading model pipeline...")
    model = joblib.load(model_path)

    print("Loading processed matches and deliveries...")
    df_matches = pd.read_json("data/processed/matches.json")
    df_deliveries = pd.read_csv("data/processed/deliveries.csv")

    output_matches_dir = Path("data/processed/replays")
    output_matches_dir.mkdir(parents=True, exist_ok=True)

    # We will precompute ball-by-ball replays for top diverse matches across all seasons
    # Including iconic thrillers, last-over finishes, and classic matches
    seasons = sorted(df_matches["season"].unique(), reverse=True)
    selected_match_ids = set()

    for season in seasons:
        season_matches = df_matches[df_matches["season"] == season]
        # Pick close finishes (win margin <= 10 runs or <= 4 wickets) + representative games
        close_finishes = season_matches[
            ((season_matches["win_by_type"] == "runs") & (season_matches["win_margin"] <= 15)) |
            ((season_matches["win_by_type"] == "wickets") & (season_matches["win_margin"] <= 4))
        ]
        if len(close_finishes) > 0:
            for m_id in close_finishes.head(3)["match_id"]:
                selected_match_ids.add(str(m_id))
        
        # Pick other games to ensure coverage
        for m_id in season_matches.head(3)["match_id"]:
            selected_match_ids.add(str(m_id))

    print(f"Precomputing delivery win probabilities for {len(selected_match_ids)} curated match replays...")

    replay_summaries = []

    for match_id_str in selected_match_ids:
        # Match info
        m_row = df_matches[df_matches["match_id"].astype(str) == match_id_str]
        if m_row.empty:
            continue
        match_info = m_row.iloc[0].to_dict()

        # Deliveries for this match
        m_delivs = df_deliveries[df_deliveries["match_id"].astype(str) == match_id_str].copy()
        if m_delivs.empty:
            continue

        m_delivs = m_delivs.sort_values(by="ball_index")

        # Feature matrix for model
        X = m_delivs[FEATURE_COLS].values
        # Actual scikit-learn model predict_proba
        probs = model.predict_proba(X)
        prob_chase = probs[:, 1]
        prob_defend = probs[:, 0]

        deliv_list = []
        prev_prob = 0.500  # Initial 50% prior

        for idx, (_, row) in enumerate(m_delivs.iterrows()):
            p_chase = round(float(prob_chase[idx]), 4)
            p_defend = round(float(prob_defend[idx]), 4)
            p_delta = round(p_chase - prev_prob, 4)

            # Commentary template from authentic metadata
            batter = row["batter"]
            bowler = row["bowler"]
            total_runs = int(row["total_runs"])
            event = row["event"]
            is_wicket = bool(row["is_wicket"])
            wicket_kind = str(row["wicket_kind"]) if is_wicket else ""
            player_out = str(row["player_out"]) if is_wicket else ""

            if is_wicket:
                commentary = f"WICKET! {bowler} strikes to dismiss {player_out} ({wicket_kind})."
            elif event == "six":
                commentary = f"SIX! {batter} dispatches {bowler} over the boundary ropes for six runs."
            elif event == "four":
                commentary = f"FOUR! Superb placement from {batter} off {bowler} for four runs."
            elif event == "dot":
                commentary = f"No run. {bowler} bowls a dot delivery to {batter}."
            elif total_runs == 1:
                commentary = f"{batter} taps {bowler} into the gap for a single."
            elif total_runs > 1:
                commentary = f"{batter} and non-striker hustle well to take {total_runs} runs."
            elif event in ["wide", "noball"]:
                commentary = f"Extra delivery ({event.upper()}) conceded by {bowler}."
            else:
                commentary = f"{total_runs} run(s) scored off {bowler}."

            deliv_item = {
                "ball_index": int(row["ball_index"]),
                "over": int(row["over"]),
                "ball_in_over": int(row["ball_in_over"]),
                "display_over": str(row["display_over"]),
                "batter": batter,
                "bowler": bowler,
                "non_striker": str(row["non_striker"]),
                "batter_runs": int(row["batter_runs"]),
                "extras_runs": int(row["extras_runs"]),
                "total_runs": total_runs,
                "is_legal": bool(row["is_legal"]),
                "is_wicket": is_wicket,
                "wicket_kind": wicket_kind,
                "player_out": player_out,
                "event": event,
                "commentary": commentary,
                # Post-ball match state
                "score_after": int(row["score_after"]),
                "wickets_after": int(row["wickets_after"]),
                "legal_balls_bowled": int(row["legal_balls_bowled"]),
                "runs_needed": int(row["runs_needed_after"]),
                "balls_remaining": int(row["balls_remaining_after"]),
                "wickets_in_hand": int(row["wickets_in_hand_after"]),
                "current_run_rate": round(float(row["current_run_rate_after"]), 2),
                "required_run_rate": round(float(row["required_run_rate_after"]), 2),
                "innings_progress": round(float(row["innings_progress_after"]), 3),
                # Probabilities strictly from the trained scikit-learn model
                "chasing_win_probability": p_chase,
                "defending_win_probability": p_defend,
                "previous_probability": round(prev_prob, 4),
                "probability_change": p_delta,
            }
            deliv_list.append(deliv_item)
            prev_prob = p_chase

        replay_payload = {
            "match_info": match_info,
            "deliveries": deliv_list,
            "total_deliveries": len(deliv_list),
        }

        # Save individual match replay JSON
        with open(output_matches_dir / f"{match_id_str}.json", "w", encoding="utf-8") as f:
            json.dump(replay_payload, f, indent=2, default=str)

        replay_summaries.append({
            "match_id": match_id_str,
            "season": match_info.get("season"),
            "date": match_info.get("date"),
            "venue": match_info.get("venue"),
            "team1": match_info.get("team1"),
            "team2": match_info.get("team2"),
            "winner": match_info.get("winner"),
            "win_by_type": match_info.get("win_by_type"),
            "win_margin": match_info.get("win_margin"),
            "target_runs": match_info.get("target_runs"),
            "inn1_runs": match_info.get("inn1_runs"),
            "inn1_wickets": match_info.get("inn1_wickets"),
            "inn2_runs": match_info.get("inn2_runs"),
            "inn2_wickets": match_info.get("inn2_wickets"),
            "chasing_team": match_info.get("chasing_team"),
            "defending_team": match_info.get("defending_team"),
            "chasing_team_won": bool(match_info.get("chasing_team_won")),
            "final_chasing_prob": deliv_list[-1]["chasing_win_probability"] if deliv_list else 0.5,
            "total_deliveries": len(deliv_list),
        })

    # Save replay catalog
    with open("data/processed/featured_replays.json", "w", encoding="utf-8") as f:
        json.dump(replay_summaries, f, indent=2, default=str)

    print(f"Successfully generated {len(replay_summaries)} curated ball-by-ball match replays with exact ML probabilities.")

if __name__ == "__main__":
    build_store()
