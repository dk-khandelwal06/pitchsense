# PitchSense 🏏
> **"What are the real odds, right now?"**

PitchSense is a production-grade sports analytics web platform that predicts the ball-by-ball win probability of the chasing team in T20 cricket matches using historical IPL data and an explainable scikit-learn Logistic Regression pipeline.

---

## 🌟 Key Highlights
- **Authentic Machine Learning:** Trained on 138,683 historical deliveries from 1,195 verified IPL fixtures sourced from Cricsheet.
- **Match-Level Split:** Zero data leakage. 956 matches train, 239 matches held-out test.
- **Calibrated Log-Loss:** Achieves **0.4461 log-loss** and **77.97% accuracy** (substantially outperforming the domain baseline of 0.5437 log-loss).
- **Stadium Intelligence Design:** 3 themes (Stadium Mode [default], Light Mode, Dark Mode) with persistent storage.
- **Broadcast Replay Suite:** 22-yard interactive vector pitch visualizer with ball trajectory and boundary/wicket impact animations.
- **Synthesized Cricket Audio:** Procedural Web Audio API sound effects (bat crack, delivery whoosh, boundary fanfare, wicket chime). Muted by default.
- **10 Complete Pages:** Landing Page, Dashboard, Match Explorer, Match Center, Win Probability Lab, Model Intelligence, Methodology, Data & Sources, Security & Privacy, About.
- **Vercel & GitHub Ready:** Zero required paid API keys, clean dependency hygiene, complete test suite.

---

## 🚀 Quick Start

### 1. Backend ML Setup
```bash
pip install -r requirements.txt
python tests/backend/run_tests.py
```

### 2. Frontend Next.js Setup
```bash
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📊 Model Evaluation Summary

| Metric | Logistic Regression | Heuristic Baseline | Delta / Status |
| :--- | :---: | :---: | :---: |
| **Log-Loss** | **0.4461** | 0.5437 | -0.0976 (Superior) |
| **Accuracy** | **77.97%** | 72.17% | +5.80% |
| **F1-Score** | **0.7966** | 0.7236 | +0.0730 |
| **Brier Score**| **0.1469** | 0.1825 | -0.0356 |
| **ROC AUC** | **0.8734** | — | Strong Discrimination |

---

## 📁 Repository Structure
```
pitchsense/
├── app/                  # Next.js 15 App Router pages and native API routes
├── components/           # Cricket animations, pitch, ball, charts, theme & sound
├── api/                  # Python FastAPI application (api/index.py)
├── ml/                   # Model training and evaluation scripts
├── backend/              # Ingestion, feature extraction, match store
├── data/processed/       # Processed match metadata & curated replays
├── artifacts/model/      # Saved .joblib pipeline & evaluation_metrics.json
├── tests/backend/        # Backend test suite
├── docs/                 # Architecture, methodology, licensing, deployment guides
├── package.json          # Frontend dependencies
├── requirements.txt      # Python ML dependencies
└── vercel.json           # Vercel deployment configuration
```

---

## 📜 Licensing & Attribution
- Match data courtesy of [Cricsheet.org](https://cricsheet.org) under the [Open Data Commons Attribution License (ODC-By v1.0)](https://cricsheet.org/licensing/).
- Application source code licensed under the MIT License.

