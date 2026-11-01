"""
Unit and integration tests for PitchSense FastAPI backend and ML models.
"""
import pytest
from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["total_historical_matches"] >= 1000
    assert data["total_replays_available"] > 0

def test_model_metrics_endpoint():
    response = client.get("/api/model/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "logistic_regression" in data
    assert "heuristic_baseline" in data
    assert "comparison" in data
    lr = data["logistic_regression"]
    assert "log_loss" in lr
    assert "accuracy" in lr
    assert "roc_auc" in lr
    assert lr["accuracy"] > 0.70

def test_model_info_endpoint():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert data["framework"] == "scikit-learn"
    assert "runs_needed" in data["features"]
    assert "required_run_rate" in data["features"]

def test_matches_listing_and_filtering():
    response = client.get("/api/matches?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "matches" in data
    assert len(data["matches"]) == 10
    assert data["total"] >= 1000

    # Search filter
    search_res = client.get("/api/matches?search=Chennai&limit=5")
    assert search_res.status_code == 200
    assert len(search_res.json()["matches"]) > 0

def test_match_replay_endpoint():
    # Grab a match with replay
    res = client.get("/api/matches?has_replay=true&limit=1")
    assert res.status_code == 200
    match_id = res.json()["matches"][0]["match_id"]

    replay_res = client.get(f"/api/matches/{match_id}/replay")
    assert replay_res.status_code == 200
    replay_data = replay_res.json()
    assert "match_info" in replay_data
    assert "deliveries" in replay_data
    assert len(replay_data["deliveries"]) > 0

    first_deliv = replay_data["deliveries"][0]
    assert "chasing_win_probability" in first_deliv
    assert 0.0 <= first_deliv["chasing_win_probability"] <= 1.0

def test_predict_endpoint_valid():
    payload = {
        "runs_needed": 35.0,
        "balls_remaining": 24,
        "wickets_in_hand": 6,
        "current_run_rate": 8.5,
        "required_run_rate": 8.75,
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "chasing_win_probability" in data
    assert "defending_win_probability" in data
    assert round(data["chasing_win_probability"] + data["defending_win_probability"], 2) == 1.0
    assert 0.0 <= data["chasing_win_probability"] <= 1.0

def test_predict_endpoint_terminal_states():
    # Target achieved
    win_res = client.post("/api/predict", json={
        "runs_needed": 0.0,
        "balls_remaining": 10,
        "wickets_in_hand": 5,
        "current_run_rate": 8.0,
    })
    assert win_res.status_code == 200
    assert win_res.json()["chasing_win_probability"] == 1.0

    # All out
    loss_res = client.post("/api/predict", json={
        "runs_needed": 20.0,
        "balls_remaining": 12,
        "wickets_in_hand": 0,
        "current_run_rate": 7.0,
    })
    assert loss_res.status_code == 200
    assert loss_res.json()["chasing_win_probability"] == 0.0

def test_predict_invalid_input():
    # Invalid balls remaining > 120
    bad_res = client.post("/api/predict", json={
        "runs_needed": 50,
        "balls_remaining": 150,
        "wickets_in_hand": 5,
        "current_run_rate": 8.0,
    })
    assert bad_res.status_code == 422

