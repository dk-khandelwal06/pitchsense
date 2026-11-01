"""
PitchSense FastAPI Backend
Exposes endpoints for match discovery, ball-by-ball replays, model evaluation metrics, and live ML probability inference.
Compatible with Vercel Serverless Python runtime and standalone Uvicorn execution.
"""
from typing import Optional, List, Dict, Any
from pathlib import Path
import json
import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# Base Paths (resolves correctly in both local and Vercel environments)
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "artifacts" / "model" / "logistic_regression.joblib"
METRICS_PATH = BASE_DIR / "artifacts" / "model" / "evaluation_metrics.json"
MATCHES_PATH = BASE_DIR / "data" / "processed" / "matches.json"
REPLAYS_DIR = BASE_DIR / "data" / "processed" / "replays"
FEATURED_REPLAYS_PATH = BASE_DIR / "data" / "processed" / "featured_replays.json"

# FastAPI app
app = FastAPI(
    title="PitchSense API",
    description="Ball-by-Ball Win Probability Engine for T20 Cricket powered by scikit-learn Logistic Regression.",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Global in-memory cache
_MODEL = None
_METRICS = None
_MATCHES = None
_FEATURED_REPLAYS = None

def get_model():
    global _MODEL
    if _MODEL is None:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Trained ML model artifact is unavailable."
            )
        try:
            _MODEL = joblib.load(MODEL_PATH)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load ML model artifact: {str(e)}"
            )
    return _MODEL

def get_metrics() -> Dict[str, Any]:
    global _METRICS
    if _METRICS is None:
        if not METRICS_PATH.exists():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model evaluation metrics file is unavailable."
            )
        try:
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                _METRICS = json.load(f)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load metrics: {str(e)}"
            )
    return _METRICS

def get_matches() -> List[Dict[str, Any]]:
    global _MATCHES
    if _MATCHES is None:
        if not MATCHES_PATH.exists():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Matches dataset is unavailable."
            )
        try:
            with open(MATCHES_PATH, "r", encoding="utf-8") as f:
                _MATCHES = json.load(f)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load matches: {str(e)}"
            )
    return _MATCHES

def get_featured_replays() -> List[Dict[str, Any]]:
    global _FEATURED_REPLAYS
    if _FEATURED_REPLAYS is None:
        if not FEATURED_REPLAYS_PATH.exists():
            return []
        try:
            with open(FEATURED_REPLAYS_PATH, "r", encoding="utf-8") as f:
                _FEATURED_REPLAYS = json.load(f)
        except Exception:
            return []
    return _FEATURED_REPLAYS


# Pydantic Schemas
class PredictRequest(BaseModel):
    runs_needed: float = Field(..., ge=0, le=400, description="Runs needed by chasing team to win")
    balls_remaining: int = Field(..., ge=0, le=120, description="Legal balls remaining in the innings (0-120)")
    wickets_in_hand: int = Field(..., ge=0, le=10, description="Wickets remaining (0-10)")
    current_run_rate: float = Field(..., ge=0.0, le=36.0, description="Current run rate of chasing team")
    required_run_rate: Optional[float] = Field(None, ge=0.0, le=99.0, description="Required run rate")
    innings_progress: Optional[float] = Field(None, ge=0.0, le=1.0, description="Innings progress ratio (0.0 to 1.0)")

    @field_validator("required_run_rate", mode="before")
    def compute_rrr(cls, v, values):
        return v


class PredictResponse(BaseModel):
    chasing_win_probability: float
    defending_win_probability: float
    chasing_win_percentage: float
    defending_win_percentage: float
    features_used: Dict[str, float]
    model_name: str
    target_description: str
    status: str


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    model_loaded: bool
    total_historical_matches: int
    total_replays_available: int


# Endpoints

@app.get("/api/health", response_model=HealthResponse)
def health():
    model_ok = False
    try:
        model = get_model()
        model_ok = model is not None
    except Exception:
        pass

    matches_count = 0
    try:
        matches = get_matches()
        matches_count = len(matches)
    except Exception:
        pass

    replays_count = len(get_featured_replays())

    return {
        "status": "healthy" if model_ok else "degraded",
        "service": "pitchsense-api",
        "version": "1.0.0",
        "model_loaded": model_ok,
        "total_historical_matches": matches_count,
        "total_replays_available": replays_count,
    }


@app.get("/api/matches")
def list_matches(
    search: Optional[str] = None,
    season: Optional[str] = None,
    venue: Optional[str] = None,
    has_replay: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0,
):
    # Unwrap if passed as FastAPI Query object directly
    if hasattr(search, "default"):
        search = None
    if hasattr(season, "default"):
        season = None
    if hasattr(venue, "default"):
        venue = None
    if hasattr(has_replay, "default"):
        has_replay = None
    if hasattr(limit, "default"):
        limit = 20
    if hasattr(offset, "default"):
        offset = 0
    matches = get_matches()
    featured_ids = {str(item["match_id"]) for item in get_featured_replays()}

    filtered = matches

    if season:
        filtered = [m for m in filtered if str(m.get("season", "")) == str(season)]

    if venue:
        filtered = [m for m in filtered if venue.lower() in str(m.get("venue", "")).lower()]

    if search:
        s_lower = search.lower()
        filtered = [
            m for m in filtered
            if s_lower in str(m.get("team1", "")).lower()
            or s_lower in str(m.get("team2", "")).lower()
            or s_lower in str(m.get("venue", "")).lower()
            or s_lower in str(m.get("winner", "")).lower()
        ]

    if has_replay is True:
        filtered = [m for m in filtered if str(m.get("match_id")) in featured_ids]

    total_count = len(filtered)
    page_items = filtered[offset : offset + limit]

    # Add flag whether full replay is available
    results = []
    for m in page_items:
        m_copy = dict(m)
        m_copy["has_replay"] = str(m.get("match_id")) in featured_ids
        results.append(m_copy)

    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "matches": results,
    }


@app.get("/api/matches/{match_id}")
def get_match(match_id: str):
    matches = get_matches()
    found = next((m for m in matches if str(m.get("match_id")) == str(match_id)), None)
    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found."
        )
    featured_ids = {str(item["match_id"]) for item in get_featured_replays()}
    res = dict(found)
    res["has_replay"] = str(match_id) in featured_ids
    return res


@app.get("/api/matches/{match_id}/replay")
def get_match_replay(match_id: str):
    # Check if precomputed replay exists
    replay_file = REPLAYS_DIR / f"{match_id}.json"
    if replay_file.exists():
        try:
            with open(replay_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error reading replay file: {str(e)}"
            )

    # If not in precomputed set, check if match exists
    matches = get_matches()
    found = next((m for m in matches if str(m.get("match_id")) == str(match_id)), None)
    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found."
        )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Ball-by-ball replay not yet compiled for match {match_id}. Please select a featured match."
    )


@app.get("/api/matches/{match_id}/deliveries")
def get_match_deliveries(match_id: str):
    replay_data = get_match_replay(match_id)
    return {
        "match_id": match_id,
        "total_deliveries": replay_data.get("total_deliveries", 0),
        "deliveries": replay_data.get("deliveries", []),
    }


@app.get("/api/model/metrics")
def model_metrics():
    return get_metrics()


@app.get("/api/model/info")
def model_info():
    metrics = get_metrics()
    lr = metrics.get("logistic_regression", {})
    return {
        "model_type": "Logistic Regression with StandardScaler Pipeline",
        "framework": "scikit-learn",
        "target": "P(Chasing team wins) [1 = Won, 0 = Lost]",
        "features": lr.get("features", []),
        "coefficients": lr.get("coefficients", {}),
        "intercept": lr.get("intercept", 0.0),
        "dataset_summary": metrics.get("dataset_summary", {}),
        "random_state": 42,
        "split_method": "Match-level split (Prevents cross-match data leakage)",
    }


@app.post("/api/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    model = get_model()

    # Safe handling of edge-cases
    runs_needed = float(req.runs_needed)
    balls_rem = int(req.balls_remaining)
    w_in_hand = int(req.wickets_in_hand)
    crr = float(req.current_run_rate)

    # Terminal state checks:
    # If runs needed == 0 and wickets in hand > 0 -> 100% win
    if runs_needed <= 0:
        return {
            "chasing_win_probability": 1.0,
            "defending_win_probability": 0.0,
            "chasing_win_percentage": 100.0,
            "defending_win_percentage": 0.0,
            "features_used": {
                "runs_needed": 0.0,
                "balls_remaining": balls_rem,
                "wickets_in_hand": w_in_hand,
                "current_run_rate": crr,
                "required_run_rate": 0.0,
                "innings_progress": 1.0,
            },
            "model_name": "Logistic Regression Pipeline",
            "target_description": "P(Chasing team wins)",
            "status": "target_achieved",
        }

    # If all 10 wickets lost and runs needed > 0 -> 0% win
    if w_in_hand <= 0:
        return {
            "chasing_win_probability": 0.0,
            "defending_win_probability": 1.0,
            "chasing_win_percentage": 0.0,
            "defending_win_percentage": 100.0,
            "features_used": {
                "runs_needed": runs_needed,
                "balls_remaining": balls_rem,
                "wickets_in_hand": 0.0,
                "current_run_rate": crr,
                "required_run_rate": 99.0,
                "innings_progress": 1.0,
            },
            "model_name": "Logistic Regression Pipeline",
            "target_description": "P(Chasing team wins)",
            "status": "all_out",
        }

    # If 0 balls remaining and runs needed > 0 -> 0% win
    if balls_rem <= 0:
        return {
            "chasing_win_probability": 0.0,
            "defending_win_probability": 1.0,
            "chasing_win_percentage": 0.0,
            "defending_win_percentage": 100.0,
            "features_used": {
                "runs_needed": runs_needed,
                "balls_remaining": 0.0,
                "wickets_in_hand": w_in_hand,
                "current_run_rate": crr,
                "required_run_rate": 99.0,
                "innings_progress": 1.0,
            },
            "model_name": "Logistic Regression Pipeline",
            "target_description": "P(Chasing team wins)",
            "status": "overs_completed",
        }

    # Calculate required run rate if not explicitly supplied
    if req.required_run_rate is not None:
        rrr = float(req.required_run_rate)
    else:
        rrr = round((runs_needed / balls_rem) * 6, 2)

    # Calculate innings progress
    if req.innings_progress is not None:
        prog = float(req.innings_progress)
    else:
        legal_bowled = max(0, 120 - balls_rem)
        prog = round(min(1.0, max(0.0, legal_bowled / 120.0)), 3)

    # Feature vector in exact training order
    feat_vector = np.array([[runs_needed, balls_rem, w_in_hand, crr, rrr, prog]], dtype=float)

    # Real model predict_proba
    probs = model.predict_proba(feat_vector)[0]
    p_defend = round(float(probs[0]), 4)
    p_chase = round(float(probs[1]), 4)

    return {
        "chasing_win_probability": p_chase,
        "defending_win_probability": p_defend,
        "chasing_win_percentage": round(p_chase * 100, 2),
        "defending_win_percentage": round(p_defend * 100, 2),
        "features_used": {
            "runs_needed": runs_needed,
            "balls_remaining": float(balls_rem),
            "wickets_in_hand": float(w_in_hand),
            "current_run_rate": crr,
            "required_run_rate": rrr,
            "innings_progress": prog,
        },
        "model_name": "scikit-learn Logistic Regression Pipeline",
        "target_description": "P(Chasing team wins)",
        "status": "success",
    }

