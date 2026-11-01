"""
Direct test runner for PitchSense backend.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from api.index import app, predict, list_matches, get_match_replay, health, model_metrics, model_info, PredictRequest

def run_all_tests():
    print("Testing /api/health...")
    h = health()
    assert h["status"] == "healthy"
    assert h["model_loaded"] is True
    print(f"Health OK: matches={h['total_historical_matches']}, replays={h['total_replays_available']}")

    print("Testing /api/model/info...")
    info = model_info()
    assert info["framework"] == "scikit-learn"
    print(f"Model Info OK: features={info['features']}")

    print("Testing /api/model/metrics...")
    m = model_metrics()
    assert m["logistic_regression"]["accuracy"] > 0.75
    assert m["logistic_regression"]["log_loss"] < 0.50
    print(f"Metrics OK: accuracy={m['logistic_regression']['accuracy']}, log_loss={m['logistic_regression']['log_loss']}")

    print("Testing /api/matches...")
    matches_res = list_matches(limit=10)
    assert len(matches_res["matches"]) == 10
    print(f"Matches listing OK: total={matches_res['total']}")

    print("Testing /api/matches with search 'Chennai'...")
    search_res = list_matches(search="Chennai", limit=5)
    assert len(search_res["matches"]) > 0
    print(f"Matches search OK: found {len(search_res['matches'])} matches")

    print("Testing /api/matches/{id}/replay...")
    replays_res = list_matches(has_replay=True, limit=1)
    match_id = replays_res["matches"][0]["match_id"]
    replay = get_match_replay(match_id)
    assert len(replay["deliveries"]) > 0
    assert "chasing_win_probability" in replay["deliveries"][0]
    print(f"Replay OK for match {match_id}: deliveries={len(replay['deliveries'])}")

    print("Testing /api/predict (live model prediction)...")
    req = PredictRequest(
        runs_needed=35.0,
        balls_remaining=24,
        wickets_in_hand=6,
        current_run_rate=8.5,
        required_run_rate=8.75,
    )
    p = predict(req)
    assert 0.0 <= p["chasing_win_probability"] <= 1.0
    assert 0.0 <= p["defending_win_probability"] <= 1.0
    assert round(p["chasing_win_probability"] + p["defending_win_probability"], 2) == 1.0
    print(f"Prediction OK: P(Chase)={p['chasing_win_percentage']}%, P(Defend)={p['defending_win_percentage']}%")

    print("Testing /api/predict edge case: Target achieved...")
    p_win = predict(PredictRequest(runs_needed=0, balls_remaining=10, wickets_in_hand=5, current_run_rate=8.0))
    assert p_win["chasing_win_probability"] == 1.0
    print("Target achieved test OK")

    print("Testing /api/predict edge case: All out...")
    p_loss = predict(PredictRequest(runs_needed=25, balls_remaining=10, wickets_in_hand=0, current_run_rate=8.0))
    assert p_loss["chasing_win_probability"] == 0.0
    print("All out test OK")

    print("\nALL BACKEND & ML TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_all_tests()
