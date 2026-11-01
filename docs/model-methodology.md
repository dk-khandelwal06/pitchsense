# Machine Learning Model Methodology

## 1. Problem Formulation
Predict the posterior win probability of the chasing team in an IPL match given the current match state:

$$P(\text{Chasing Team Wins} \mid \mathbf{x}) = \frac{1}{1 + e^{-\mathbf{w}^T \mathbf{z}}}$$

where $\mathbf{z} = \frac{\mathbf{x} - \boldsymbol{\mu}}{\boldsymbol{\sigma}}$ represents standardized match-state features.

## 2. Feature Vectors
1. `runs_needed`: $\max(0, \text{Target} - \text{Current Score})$
2. `balls_remaining`: $120 - \text{Legal Balls Bowled}$ (wides/no-balls do not decrement remaining balls)
3. `wickets_in_hand`: $10 - \text{Wickets Fallen}$
4. `current_run_rate`: $\frac{\text{Current Score}}{\text{Legal Balls Bowled}} \times 6$ (0 if 0 balls)
5. `required_run_rate`: $\frac{\text{Runs Needed}}{\text{Balls Remaining}} \times 6$ (clamped to 99 if balls remaining = 0)
6. `innings_progress`: $\min\left(1.0, \frac{\text{Legal Balls Bowled}}{120.0}\right)$

## 3. Train/Test Splitting Integrity
To eliminate data leakage, deliveries are split by **Match ID**:
- **Train Set:** 956 matches (111,052 deliveries)
- **Test Set:** 239 matches (27,631 deliveries)
- **Leakage Protection:** No deliveries from any test match were seen during StandardScaler fitting or Logistic Regression training.

## 4. Evaluated Results
- **Logistic Regression Log-Loss:** 0.4461
- **Heuristic Baseline Log-Loss:** 0.5437 (Improvement: 0.0976)
- **Accuracy:** 77.97% (vs 72.17% baseline)
- **ROC AUC:** 0.8734
- **Brier Score:** 0.1469
- **Confusion Matrix:**
  - True Negative: 9,629
  - False Positive: 2,524
  - False Negative: 3,562
  - True Positive: 11,916

