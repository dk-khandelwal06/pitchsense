"""
Parse raw Cricsheet JSON matches, extract clean ball-by-ball delivery records for Innings 2,
and produce match metadata and ball-by-ball datasets.
"""
import json
import glob
from pathlib import Path
import pandas as pd
import numpy as np

TEAM_NAME_STANDARDIZATION = {
    "Delhi Daredevils": "Delhi Capitals",
    "Kings XI Punjab": "Punjab Kings",
    "Rising Pune Supergiants": "Rising Pune Supergiant",
    "Royal Challengers Bengaluru": "Royal Challengers Bangalore",
}

def standardize_team(name):
    if not name:
        return name
    return TEAM_NAME_STANDARDIZATION.get(name, name)

def parse_all_matches(raw_dir="data/raw/ipl_matches"):
    files = glob.glob(f"{raw_dir}/*.json")
    print(f"Found {len(files)} total json match files.")

    match_records = []
    delivery_records = []
    excluded_counts = {"dls_or_method": 0, "no_winner": 0, "super_over": 0, "incomplete_innings": 0, "other": 0}

    for idx, filepath in enumerate(files):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            excluded_counts["other"] += 1
            continue

        info = data.get("info", {})
        outcome = info.get("outcome", {})

        # Exclusion 1: DLS / Rain-affected matches
        if "method" in outcome:
            excluded_counts["dls_or_method"] += 1
            continue

        # Exclusion 2: Tied matches decided by super over or no result
        if "result" in outcome:
            result = outcome["result"]
            if result in ["no result", "tie"]:
                excluded_counts["no_winner"] += 1
                continue

        # Must have a clear winner
        winner = outcome.get("winner")
        if not winner:
            excluded_counts["no_winner"] += 1
            continue

        winner = standardize_team(winner)

        # Check innings: must have at least 2 innings
        innings_list = data.get("innings", [])
        if len(innings_list) < 2:
            excluded_counts["incomplete_innings"] += 1
            continue

        # Innings 1 calculation
        inn1 = innings_list[0]
        inn1_team = standardize_team(inn1.get("team"))
        inn1_runs = 0
        inn1_wickets = 0
        inn1_legal_balls = 0

        for over_data in inn1.get("overs", []):
            for deliv in over_data.get("deliveries", []):
                runs_info = deliv.get("runs", {})
                inn1_runs += runs_info.get("total", 0)
                if "wickets" in deliv:
                    inn1_wickets += len(deliv["wickets"])
                extras = deliv.get("extras", {})
                is_legal = ("wides" not in extras) and ("noballs" not in extras)
                if is_legal:
                    inn1_legal_balls += 1

        target_runs = inn1_runs + 1

        # Innings 2 calculation (Chasing team)
        inn2 = innings_list[1]
        inn2_team = standardize_team(inn2.get("team"))
        
        # Super over check in outcome or subsequent innings
        if len(innings_list) > 2:
            excluded_counts["super_over"] += 1
            continue

        chasing_team_won = 1 if winner == inn2_team else 0

        # Match ID from filename
        match_id = Path(filepath).stem

        # Match metadata
        season = str(info.get("season", ""))
        date_str = info.get("dates", [""])[0]
        venue = info.get("venue", "")
        city = info.get("city", "")
        toss_winner = standardize_team(info.get("toss", {}).get("winner", ""))
        toss_decision = info.get("toss", {}).get("decision", "")
        player_of_match = info.get("player_of_match", [""])[0] if info.get("player_of_match") else ""
        
        win_by_type = "runs" if "runs" in outcome.get("by", {}) else ("wickets" if "wickets" in outcome.get("by", {}) else "other")
        win_margin = outcome.get("by", {}).get(win_by_type, 0)

        match_meta = {
            "match_id": match_id,
            "season": season,
            "date": date_str,
            "venue": venue,
            "city": city,
            "team1": inn1_team,
            "team2": inn2_team,
            "toss_winner": toss_winner,
            "toss_decision": toss_decision,
            "winner": winner,
            "win_by_type": win_by_type,
            "win_margin": win_margin,
            "player_of_match": player_of_match,
            "target_runs": target_runs,
            "inn1_runs": inn1_runs,
            "inn1_wickets": inn1_wickets,
            "inn1_overs": round(inn1_legal_balls / 6, 1),
            "chasing_team": inn2_team,
            "defending_team": inn1_team,
            "chasing_team_won": chasing_team_won,
        }

        # Process deliveries in Innings 2
        inn2_score = 0
        inn2_wickets = 0
        inn2_legal_balls = 0
        match_deliveries = []

        total_max_balls = 120

        for over_data in inn2.get("overs", []):
            over_num = over_data.get("over", 0)
            deliv_index_in_over = 0
            for deliv in over_data.get("deliveries", []):
                deliv_index_in_over += 1
                runs_info = deliv.get("runs", {})
                batter_runs = runs_info.get("batter", 0)
                extras_runs = runs_info.get("extras", 0)
                total_deliv_runs = runs_info.get("total", 0)

                extras_dict = deliv.get("extras", {})
                is_wide = "wides" in extras_dict
                is_noball = "noballs" in extras_dict
                is_legal = (not is_wide) and (not is_noball)

                wickets_list = deliv.get("wickets", [])
                is_wicket = len(wickets_list) > 0
                wicket_kind = wickets_list[0].get("kind", "") if is_wicket else ""
                player_out = wickets_list[0].get("player_out", "") if is_wicket else ""

                # Prior state (before ball outcome)
                balls_rem_before = max(0, total_max_balls - inn2_legal_balls)
                runs_needed_before = max(0, target_runs - inn2_score)
                wickets_in_hand_before = max(0, 10 - inn2_wickets)
                crr_before = round((inn2_score / inn2_legal_balls) * 6, 2) if inn2_legal_balls > 0 else 0.0
                rrr_before = round((runs_needed_before / balls_rem_before) * 6, 2) if balls_rem_before > 0 else (99.0 if runs_needed_before > 0 else 0.0)
                progress_before = round(inn2_legal_balls / 120.0, 3)

                # Now apply delivery
                inn2_score += total_deliv_runs
                if is_wicket:
                    inn2_wickets += len(wickets_list)
                if is_legal:
                    inn2_legal_balls += 1

                balls_rem_after = max(0, total_max_balls - inn2_legal_balls)
                runs_needed_after = max(0, target_runs - inn2_score)
                wickets_in_hand_after = max(0, 10 - inn2_wickets)
                crr_after = round((inn2_score / inn2_legal_balls) * 6, 2) if inn2_legal_balls > 0 else 0.0
                rrr_after = round((runs_needed_after / balls_rem_after) * 6, 2) if balls_rem_after > 0 else (99.0 if runs_needed_after > 0 else 0.0)
                progress_after = round(min(1.0, inn2_legal_balls / 120.0), 3)

                # Event tag for visualization
                if is_wicket:
                    event = "wicket"
                elif total_deliv_runs == 6:
                    event = "six"
                elif total_deliv_runs == 4:
                    event = "four"
                elif is_wide:
                    event = "wide"
                elif is_noball:
                    event = "noball"
                elif total_deliv_runs == 0:
                    event = "dot"
                elif total_deliv_runs == 1:
                    event = "single"
                elif total_deliv_runs == 2:
                    event = "two"
                elif total_deliv_runs == 3:
                    event = "three"
                else:
                    event = "runs"

                deliv_record = {
                    "match_id": match_id,
                    "ball_index": len(match_deliveries) + 1,
                    "over": over_num,
                    "ball_in_over": deliv_index_in_over,
                    "display_over": f"{over_num}.{deliv_index_in_over}",
                    "batter": deliv.get("batter", ""),
                    "bowler": deliv.get("bowler", ""),
                    "non_striker": deliv.get("non_striker", ""),
                    "batter_runs": batter_runs,
                    "extras_runs": extras_runs,
                    "total_runs": total_deliv_runs,
                    "is_legal": is_legal,
                    "is_wicket": is_wicket,
                    "wicket_kind": wicket_kind,
                    "player_out": player_out,
                    "event": event,
                    # Pre-ball features
                    "runs_needed": runs_needed_before,
                    "balls_remaining": balls_rem_before,
                    "wickets_in_hand": wickets_in_hand_before,
                    "current_run_rate": crr_before,
                    "required_run_rate": rrr_before,
                    "innings_progress": progress_before,
                    # Post-ball match state
                    "score_after": inn2_score,
                    "wickets_after": inn2_wickets,
                    "legal_balls_bowled": inn2_legal_balls,
                    "runs_needed_after": runs_needed_after,
                    "balls_remaining_after": balls_rem_after,
                    "wickets_in_hand_after": wickets_in_hand_after,
                    "current_run_rate_after": crr_after,
                    "required_run_rate_after": rrr_after,
                    "innings_progress_after": progress_after,
                    "chasing_team_won": chasing_team_won,
                }
                match_deliveries.append(deliv_record)

        match_meta["inn2_runs"] = inn2_score
        match_meta["inn2_wickets"] = inn2_wickets
        match_meta["inn2_overs"] = round(inn2_legal_balls / 6, 1)
        match_meta["total_deliveries"] = len(match_deliveries)

        match_records.append(match_meta)
        delivery_records.extend(match_deliveries)

    print(f"Successfully processed {len(match_records)} valid matches.")
    print(f"Excluded counts: {excluded_counts}")
    print(f"Total delivery records: {len(delivery_records)}")

    # Save to data/processed
    out_dir = Path("data/processed")
    out_dir.mkdir(parents=True, exist_ok=True)

    df_matches = pd.DataFrame(match_records)
    df_matches.to_csv(out_dir / "matches.csv", index=False)
    df_matches.to_json(out_dir / "matches.json", orient="records", indent=2)

    df_deliveries = pd.DataFrame(delivery_records)
    df_deliveries.to_csv(out_dir / "deliveries.csv", index=False)

    # Save an index of featured iconic matches with precomputed ball-by-ball replay for the frontend
    # Pick matches with diverse finishes: close chases, big wins, low-scoring thrillers across multiple IPL seasons
    featured_seasons = sorted(df_matches["season"].unique(), reverse=True)
    featured_matches = []
    for s in featured_seasons[:8]:
        s_matches = df_matches[df_matches["season"] == s]
        for _, m in s_matches.head(4).iterrows():
            featured_matches.append(m["match_id"])

    print(f"Saved {len(df_matches)} matches and {len(df_deliveries)} deliveries to {out_dir}")
    return df_matches, df_deliveries

if __name__ == "__main__":
    parse_all_matches()
