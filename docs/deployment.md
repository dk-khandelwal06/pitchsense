# GitHub & Vercel Deployment Guide

## 1. Prerequisites
- Node.js 18+ (tested with Node 20 / 22)
- Python 3.10+ (tested with Python 3.13)
- Git 2.30+

## 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/your-username/pitchsense.git
cd pitchsense

# Install Python ML dependencies
pip install -r requirements.txt

# Run ML verification tests
python tests/backend/run_tests.py

# Install Node.js frontend packages
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. GitHub Readiness
Ensure the following files are tracked:
- `app/` (all 10 pages and route handlers)
- `components/` (all UI and cricket visualization components)
- `api/` (FastAPI backend)
- `ml/` (training and evaluation scripts)
- `data/processed/` (matches metadata and curated replays)
- `artifacts/model/` (`logistic_regression.joblib` and `evaluation_metrics.json`)
- `package.json`, `requirements.txt`, `tsconfig.json`, `vercel.json`

Verify `.gitignore` excludes:
- `node_modules/`
- `.next/`
- `data/raw/`
- `data/processed/deliveries.csv` (can be regenerated with `python backend/ingestion/process_matches.py`)

## 4. Deploying to Vercel
PitchSense is preconfigured for zero-configuration Vercel deployment:
1. Push your repository to GitHub.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import the `pitchsense` repository.
4. Select **Next.js** framework preset.
5. Click **Deploy**.
No environment variables or paid API keys are required for Version 1.0!

