# Career Copilot — Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER                             │
│              http://localhost:5173                      │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │           React + Vite + Tailwind CSS           │   │
│   │                                                 │   │
│   │   Landing → Assessment → Results → Streams      │   │
│   │                  ↓ Axios HTTP                   │   │
│   └─────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │ POST /api/v1/recommend
                      ↓
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                   │
│              http://127.0.0.1:8000                      │
│                                                         │
│   RecommendationService                                 │
│   ├── Rule Engine  (40% skills + 40% interests          │
│   │                + 20% subjects → score 0-100)        │
│   ├── ML Model     (Logistic Regression, calibrated)    │
│   └── Hybrid Score (w_rule × S_rule + w_ml × P_ml×100) │
│                                                         │
│   DataService → loads 8 CSV files into memory          │
└─────────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  Data Layer (CSV)                       │
│   streams.csv  │ skills.csv   │ interests.csv           │
│   courses.csv  │ careers.csv  │ subjects.csv            │
│   course_career_mapping.csv                             │
│   stream_recommendation_rules.csv                       │
└─────────────────────────────────────────────────────────┘
```

---

## Recommendation Flow

```
Student Input (name + subjects + skills + interests)
        ↓
Input Resolver → matches against catalog vocabulary
        ↓
Rule Engine → scores all 12 streams (0-100)
        ↓
ML Model → predicts class probabilities for 12 streams
        ↓
Hybrid Scoring → blends rule + ML with dynamic weights
   • Sparse input  → w_rule=0.85, w_ml=0.15
   • Full input    → w_rule=0.50, w_ml=0.50
        ↓
Uncertainty Analysis → top-1 vs top-2 probability margin
        ↓
Status Classification
   • high_confidence       (ΔP ≥ 0.30, ΔS ≥ 25)
   • moderate_confidence   (0.12 ≤ ΔP < 0.30)
   • conflicting_evidence  (ΔP < 0.12 and ΔS < 10)
   • needs_more_information (total inputs ≤ 2)
        ↓
Response → top 3 streams + courses + careers + follow-up questions
```

---

## ML Model Details

| Property | Value |
|---|---|
| Model | Logistic Regression (CalibratedClassifierCV) |
| Features | 240 binary (105 subjects + 76 skills + 59 interests) |
| Training data | 600 synthetic profiles (80/20 split) |
| Classes | 12 streams (S01–S12) |
| Saved as | logistic_regression_model.pkl |
