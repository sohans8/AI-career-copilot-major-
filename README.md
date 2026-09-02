# Career Forge AI 🎓✨

An AI-powered career recommendation system for Class 10 students deciding their Class 11–12 academic stream. Career Copilot combines a domain rule engine with a calibrated machine learning classifier to produce explainable, uncertainty-aware stream recommendations mapped to real courses and career pathways.

---

## Preview

> Screenshots live in [`docs/screenshots/`](docs/screenshots/). Add your own by taking a screenshot of `localhost:5173` and saving it there.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Dataset Catalog](#dataset-catalog)
- [Recommendation Engine](#recommendation-engine)
- [ML Pipeline](#ml-pipeline)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Robustness & Testing](#robustness--testing)
- [Known Limitations](#known-limitations)

---

## Overview

Career Copilot helps students navigate the critical Class 10 → Class 11 transition by analyzing their favourite subjects, skills, and interests and recommending the most suitable academic stream from 12 options (Science PCM, Commerce, Humanities, Fine Arts, Vocational, and more).

The system returns a ranked list of top-3 streams, a match score, an uncertainty rating, aligned courses and careers, and adaptive follow-up questions when the recommendation is ambiguous.

---

## Features

- **AI Stream Recommendation** — Hybrid rule + ML model scores all 12 streams against a student profile and returns a ranked top-3 list with match scores and explanations.
- **Uncertainty Awareness** — Every recommendation carries a confidence status (`high_confidence`, `moderate_confidence`, `conflicting_evidence`, `needs_more_information`) and an uncertainty score.
- **Adaptive Follow-up Questions** — When competing streams are close or inputs are sparse, targeted clarification questions are generated automatically.
- **Course & Career Mapping** — The top recommended stream links directly to relevant courses and mapped career options (e.g., Software Engineer → B.Tech Computer Science → Science PCM).
- **12 Stream Catalog** — Browse all Class 11–12 academic pathways with descriptions and domain tags.
- **Career Explorer** — Search and filter 200+ careers across Technology, Engineering, Healthcare, Finance, Law, Creative, and more.
- **Modern UI** — Dark glassmorphism landing screen, animated SVG score ring on results, step-based tabbed assessment form, color-coded stream and career cards, and a fully responsive sidebar layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS 3, Axios, Lucide React |
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| ML | scikit-learn (Logistic Regression, Random Forest), pandas, NumPy |
| Deployment | Netlify (frontend), any Python host (backend) |

---

## Project Structure

```
career-copilot/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI app entry point, CORS config
│   │   ├── routes/
│   │   │   └── recommendation.py       # POST /api/v1/recommend endpoint
│   │   ├── models/
│   │   │   └── schemas.py              # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── data_service.py         # CSV data loader (streams, skills, interests, etc.)
│   │   │   └── recommendation_service.py  # Hybrid rule + ML recommendation engine
│   │   └── utils/
│   ├── data/
│   │   └── raw/
│   │       └── career_copilot_expanded_dataset/
│   │           ├── streams.csv
│   │           ├── subjects.csv
│   │           ├── skills.csv
│   │           ├── interests.csv
│   │           ├── courses.csv
│   │           ├── careers.csv
│   │           ├── stream_recommendation_rules.csv
│   │           └── course_career_mapping.csv
│   ├── ml/
│   │   ├── data/
│   │   │   ├── generate_synthetic_dataset.py
│   │   │   ├── synthetic_student_dataset.csv
│   │   │   └── held_out_test_set.csv
│   │   ├── models/
│   │   │   ├── baseline_ml.py
│   │   │   ├── logistic_regression_model.pkl
│   │   │   └── random_forest_model.pkl
│   │   ├── robustness/
│   │   │   ├── ROBUSTNESS_REPORT.md
│   │   │   └── RECOMMENDATION_ROBUSTNESS.md
│   │   ├── train.py                    # Train and save ML models
│   │   ├── evaluate.py                 # Evaluate all three systems on held-out test set
│   │   └── README.md
│   ├── tests/
│   ├── requirements.txt
│   └── test_data_service.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # Root app with name entry and view routing
│   │   ├── views/
│   │   │   ├── AssessmentView.jsx      # Subject / skill / interest selection form
│   │   │   ├── ResultsView.jsx         # Recommendation results display
│   │   │   ├── StreamsView.jsx         # 12-stream catalog browser
│   │   │   └── CareersView.jsx         # Career explorer with search and filters
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── data/
│   │   │   ├── optionsData.js          # Curated subject, skill, interest chip lists
│   │   │   └── presetProfiles.js       # Pre-built student profiles for testing
│   │   └── services/
│   │       └── api.js                  # Axios API client
│   ├── package.json
│   ├── vite.config.js                  # Dev proxy to FastAPI on port 8000
│   └── index.html
└── netlify.toml                        # Netlify build config for SPA deployment
```

---

## Dataset Catalog

All reference data lives in `backend/data/raw/career_copilot_expanded_dataset/`.

| File | Records | Description |
|---|---|---|
| `streams.csv` | 12 | Academic stream definitions (S01–S12) |
| `subjects.csv` | 105 | Canonical subject names |
| `skills.csv` | 76 | Skills with category tags |
| `interests.csv` | 59 | Interest areas with category tags |
| `courses.csv` | 104 | Courses mapped to streams with typical subjects |
| `careers.csv` | 200 | Career names with domain tags |
| `course_career_mapping.csv` | — | Course → Career relationship table |
| `stream_recommendation_rules.csv` | 1,250 | Domain rule pairs for rule engine scoring |

---

## Recommendation Engine

The engine in `recommendation_service.py` runs three systems and blends them via adaptive hybrid scoring.

### 1. Rule Engine (System A)
Scores each stream against the student's matched subjects, skills (by category weight), and interests (by category weight). Subject match is 20%, skill match 40%, interest match 40% of the rule score.

### 2. ML Classifier (System B)
A calibrated Logistic Regression model (`CalibratedClassifierCV`) trained on 480 synthetic student profiles represented as 240-dimensional multi-hot binary feature vectors (105 subjects + 76 skills + 59 interests). Outputs per-class probabilities for all 12 streams.

### 3. Adaptive Hybrid (System C)

```
S_hybrid(s) = w_rule × S_rule(s) + w_ml × (100 × P_ml(s))
```

Dynamic weights based on input completeness:

| Input Condition | w_rule | w_ml |
|---|---|---|
| Sparse / incomplete (≤ 2 total inputs or missing skills/interests) | 0.85 | 0.15 |
| Standard complete profile | 0.50 | 0.50 |

### Recommendation Status Logic

| Status | Trigger |
|---|---|
| `needs_more_information` | Total valid inputs ≤ 2, or subjects missing with ≤ 3 total |
| `conflicting_evidence` | Rule score margin < 10 **and** ML probability margin < 0.12 |
| `moderate_confidence` | ML margin 0.12–0.30 **or** rule margin < 20 |
| `high_confidence` | ML margin ≥ 0.30 **and** rule margin ≥ 25 |

---

## ML Pipeline

```bash
# 1. Generate 600-profile synthetic dataset
python backend/ml/data/generate_synthetic_dataset.py

# 2. Train Logistic Regression and Random Forest models
python backend/ml/train.py

# 3. Evaluate all three systems on the held-out test set (N=120)
python backend/ml/evaluate.py
```

### Held-Out Benchmark (clean synthetic data, N=120)

| System | Top-1 Accuracy | Top-3 Accuracy | Macro F1 |
|---|---|---|---|
| Rule Engine Baseline | 91.67% | 100.00% | 91.68% |
| Pure ML (Logistic Regression) | 100.00% | 100.00% | 100.00% |
| Hybrid Ensemble (Rule + ML) | 100.00% | 100.00% | 100.00% |

> ⚠️ The 100% clean accuracy reflects deterministic synthetic data generation, not real-world student diversity. See `backend/ml/robustness/ROBUSTNESS_REPORT.md` for a full noise sensitivity analysis.

---

## API Reference

Base URL: `http://127.0.0.1:8000`

### `GET /api/v1/health`
Returns server health status.

**Response**
```json
{ "status": "ok" }
```

---

### `POST /api/v1/recommend`
Generates stream recommendations for a student profile.

**Request Body**
```json
{
  "name": "Aarav Patel",
  "subjects": ["Mathematics", "Physics", "Chemistry", "Computer Science"],
  "skills": ["Logical Thinking", "Problem Solving", "Programming"],
  "interests": ["Technology", "Engineering"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Student name (min 1 character) |
| `subjects` | string[] | — | Favourite subject names |
| `skills` | string[] | — | Skill names or IDs |
| `interests` | string[] | — | Interest names or IDs |

**Response**
```json
{
  "student_profile": {
    "name": "Aarav Patel",
    "subjects": ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    "skills": ["Logical Thinking", "Problem Solving", "Programming"],
    "interests": ["Technology", "Engineering"],
    "unrecognized_inputs": { "subjects": [], "skills": [], "interests": [] }
  },
  "recommendation_metadata": {
    "recommendation_status": "high_confidence",
    "uncertainty_score": 0.12,
    "uncertainty_reason": "Strong clear alignment with target stream requirements.",
    "missing_information": [],
    "follow_up_questions": []
  },
  "recommendations": [
    {
      "rank": 1,
      "stream_id": "S01",
      "stream_name": "Science (PCM)",
      "score": 94.5,
      "skill_match_score": 97.0,
      "interest_match_score": 96.0,
      "subject_match_score": 100.0,
      "ml_probability": 0.9312,
      "uncertainty": 0.12,
      "recommendation_status": "high_confidence",
      "matched_skills": ["Logical Thinking", "Problem Solving"],
      "matched_interests": ["Technology", "Engineering"],
      "explanation_factors": ["Strong skill alignment (2 skill(s)): Logical Thinking, Problem Solving"],
      "recommended_courses": [...]
    }
  ]
}
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+
- pip

### Backend Setup

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server from the project root
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive docs: `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (proxies /api to localhost:8000)
npm run dev
```

The app will open at `http://localhost:5173`.

> The Vite dev server automatically proxies all `/api` requests to `http://127.0.0.1:8000`, so no extra CORS configuration is needed during development.

---

## Environment Variables

### Frontend

Create `frontend/.env.local` for a custom backend URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If the variable is not set, the frontend defaults to `http://127.0.0.1:8000`.

---

## Deployment

### Frontend (Netlify)

The `netlify.toml` at the project root is pre-configured:

```toml
[build]
  base    = "frontend"
  command = "npm run build"
  publish = "dist"
```

All SPA routes are redirected to `index.html` via a catch-all redirect rule.  
Set `VITE_API_BASE_URL` in your Netlify environment variables to point to your deployed backend.

### Backend

Any platform that runs Python/Uvicorn works (Railway, Render, Fly.io, etc.):

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

---

## Robustness & Testing

Full robustness analysis is documented in `backend/ml/robustness/`:

| Noise Level | Rule Top-1 | ML Top-1 | Hybrid Top-1 |
|---|---|---|---|
| 0% | 100.0% | 100.0% | 100.0% |
| 10% | 96.67% | 96.67% | 96.67% |
| 20% | 93.33% | 92.5% | 92.5% |
| 30% | 81.67% | 79.17% | 80.83% |

An extended 25-case edge suite covers sparse inputs, missing input categories, cross-domain conflicts, and completely invalid/unknown input values. The rule engine consistently outperforms pure ML on sparse and missing-input scenarios, which is why the hybrid shifts weight to the rule engine (0.85 / 0.15) when inputs are incomplete.

---

## Known Limitations

- **Synthetic training data** — The ML model is trained on synthetically generated profiles with fixed archetypes. Accuracy on real student data will differ. Real student feedback should be collected during production use to retrain future model versions.
- **Fixed vocabulary** — Input values are matched against a fixed catalog. Unrecognized subject, skill, or interest names are silently dropped and listed in `unrecognized_inputs` in the response.
- **No user accounts** — There is no authentication or persistence layer in Phase 1. Assessment results are session-only.
- **English only** — The UI and dataset are in English.
