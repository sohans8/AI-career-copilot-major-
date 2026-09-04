# Career Copilot — Full Project Report

**Project:** Career Copilot — AI-Powered Career Recommendation System  
**Version:** 1.0.0 (Phase 1)  
**Repository:** https://github.com/sohans8/AI-career-copilot-major-  
**Branch:** feature/backend-api  
**Live Backend:** https://career-copilot-api-9591.onrender.com  
**Date:** September 2026  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Dataset & Data Catalog](#5-dataset--data-catalog)
6. [Backend — FastAPI](#6-backend--fastapi)
7. [Recommendation Engine](#7-recommendation-engine)
8. [ML Pipeline](#8-ml-pipeline)
9. [Robustness & Noise Analysis](#9-robustness--noise-analysis)
10. [Frontend — React](#10-frontend--react)
11. [Deployment](#11-deployment)
12. [Git History & Work Done](#12-git-history--work-done)
13. [API Reference](#13-api-reference)
14. [Known Limitations & Future Work](#14-known-limitations--future-work)

---

## 1. Project Overview

Career Copilot is a full-stack AI/ML-powered web application designed to help Class 10 students decide which academic stream to choose for Class 11–12. It is a critical decision that determines a student's university options and career trajectory.

The system takes a student's favourite subjects, key skills, and areas of interest as input, runs them through a hybrid rule + machine learning engine, and returns:

- A ranked list of top 3 recommended streams out of 12 options
- A match score (0–100) for each stream
- Subject, skill, and interest match breakdowns
- Confidence status and uncertainty score
- Recommended courses and mapped career pathways
- Adaptive follow-up questions when the recommendation is ambiguous

---

## 2. Problem Statement

Students in India face a high-stakes stream selection decision after Class 10 (typically at age 15–16). The available options — Science, Commerce, Humanities, Vocational, Fine Arts, etc. — have long-term consequences on career options and college admissions.

Most students make this decision based on:
- Parental or peer pressure
- Score-based shortlisting without preference alignment
- Limited access to career counseling

Career Copilot addresses this by providing a data-driven, personalized, explainable recommendation that factors in a student's actual interests, skills, and subject preferences — not just marks.

---

## 3. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| Vite | 6.0.7 | Dev server and build tool |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Axios | 1.7.9 | HTTP client |
| Lucide React | 0.469.0 | Icon library |
| Plus Jakarta Sans | Google Fonts | Typography |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Language |
| FastAPI | 0.115.0 | REST API framework |
| Uvicorn | 0.30.6 | ASGI server |
| Pydantic | 2.9.2 | Request/response validation |
| pandas | 2.2.3 | Data loading and manipulation |
| NumPy | 1.26.4 | Numerical operations |
| scikit-learn | 1.5.2 | ML model (Logistic Regression) |
| joblib | 1.4.2 | Model serialization |

### Deployment
| Service | Technology | Purpose |
|---|---|---|
| Render | Python/Uvicorn | Backend hosting |
| Netlify | Static CDN | Frontend hosting |
| GitHub | Git | Version control |

---

## 4. System Architecture

```
BROWSER (localhost:5173 or Netlify)
         │
         │  React + Vite + Tailwind
         │  Axios HTTP (60s timeout)
         ▼
RENDER BACKEND
https://career-copilot-api-9591.onrender.com
         │
         │  FastAPI + Uvicorn
         │  POST /api/v1/recommend
         ▼
RECOMMENDATION SERVICE (Python)
         ├── DataService (loads 8 CSVs into memory)
         ├── Rule Engine (domain weight scoring)
         ├── ML Model (Logistic Regression .pkl)
         └── Hybrid Scoring (dynamic weight blend)
         │
         ▼
RESPONSE
Top 3 streams + scores + courses + careers + follow-up questions
```

### Data Flow

1. Student fills in subjects, skills, interests on the React frontend
2. Frontend validates all 3 categories are filled before submitting
3. Axios sends POST request to `/api/v1/recommend` on Render
4. FastAPI validates the request with Pydantic schemas
5. `RecommendationService.recommend()` runs:
   - Resolves inputs against catalog vocabulary
   - Computes rule-based scores for all 12 streams
   - Computes ML class probabilities
   - Blends with adaptive hybrid weights
   - Calculates uncertainty and recommendation status
   - Generates follow-up questions if needed
6. JSON response returned to frontend
7. React renders animated results with score ring, match bars, courses, careers

---

## 5. Dataset & Data Catalog

All data lives in `backend/data/raw/career_copilot_expanded_dataset/`.

### Files

| File | Records | Description |
|---|---|---|
| `streams.csv` | 12 | Academic stream definitions (S01–S12) |
| `subjects.csv` | 105 | Canonical subject names |
| `skills.csv` | 76 | Skills with category tags (Analytical, Technical, Creative, etc.) |
| `interests.csv` | 59 | Interest areas with category tags (STEM, Healthcare, Business, etc.) |
| `courses.csv` | 104 | Degree/diploma courses mapped to streams with typical subjects |
| `careers.csv` | 200 | Career names with domain tags |
| `course_career_mapping.csv` | — | Many-to-many course → career relationship table |
| `stream_recommendation_rules.csv` | 1,250 | Domain rule pairs for rule engine |

### 12 Academic Streams

| ID | Stream Name | Domain |
|---|---|---|
| S01 | Science (PCM) | STEM & Engineering |
| S02 | Science (PCB) | Medical & Life Sciences |
| S03 | Science (PCMB) | Interdisciplinary Science |
| S04 | Commerce with Mathematics | Finance & Analytics |
| S05 | Commerce without Mathematics | Business Management |
| S06 | Humanities & Social Sciences | Liberal Arts & Law |
| S07 | Fine Arts & Design | Creative & VFX |
| S08 | Vocational & Applied Technologies | Applied Tech |
| S09 | Agriculture & Environmental Sciences | Agri-Tech |
| S10 | Legal & Administrative Studies | Law & Governance |
| S11 | Paramedical & Allied Healthcare | Allied Health |
| S12 | Mass Media & Communication | Media & Journalism |

---

## 6. Backend — FastAPI

### Entry Point: `backend/app/main.py`

- FastAPI app with title "Career Copilot API", version 1.0.0
- CORS middleware configured with `allow_origins=["*"]` to allow Netlify and any frontend origin
- Routes: `recommendation_router` mounted at `/api/v1`
- Health check at `GET /api/v1/health` → `{"status": "ok"}`

### Request Schema: `backend/app/models/schemas.py`

```python
class RecommendationRequest(BaseModel):
    name: str           # min_length=1, required
    subjects: list[str] # optional, defaults to []
    skills: list[str]   # optional, defaults to []
    interests: list[str]# optional, defaults to []
```

### Data Service: `backend/app/services/data_service.py`

Loads all 8 required CSV files into memory as pandas DataFrames at startup. Uses `pathlib` for path resolution. Supports both direct and subdirectory file resolution. Raises `FileNotFoundError` with a clear message if any CSV is missing.

### Route: `backend/app/routes/recommendation.py`

Single endpoint `POST /api/v1/recommend`. Validates request with Pydantic, calls `RecommendationService.recommend()`, returns the result. Returns HTTP 500 if an exception occurs.

---

## 7. Recommendation Engine

### Input Resolution

The engine resolves raw string inputs against the catalog:
- Skills matched by ID (case-insensitive) or name (lowercase)
- Interests matched by ID (case-insensitive) or name (lowercase)  
- Subjects matched by canonical name (lowercase)
- Unrecognized inputs are collected separately and returned in `unrecognized_inputs`

### System A — Rule Engine

For each of the 12 streams:

**Subject Match Score:**
```
subject_match = (matched_subjects ∩ stream_subjects) / total_user_subjects × 100
Default if no subjects: 50.0
```

**Skill Match Score:**
Uses `STREAM_SKILL_WEIGHTS` — a per-stream dictionary mapping skill categories to weights (0.1–1.0):
```
skill_match = sum(weight[category] for each skill) / count(skills) × 100
Default if no skills: 50.0
```

Skill categories: `Analytical`, `Technical`, `Professional & Business`, `Creative`, `Language & Communication`, `Interpersonal`

**Interest Match Score:**
Uses `STREAM_INT_WEIGHTS` — same structure for interest categories:
```
interest_match = sum(weight[category] for each interest) / count(interests) × 100
Default if no interests: 50.0
```

Interest categories: `STEM`, `Healthcare`, `Business`, `Social Science`, `Humanities`, `Creative`, `Services & Trades`

**Rule Score:**
```
rule_score = 0.40 × skill_match + 0.40 × interest_match + 0.20 × subject_match
```

### System B — ML Classifier

Calibrated Logistic Regression (`CalibratedClassifierCV` with `method="sigmoid"`) trained on 600 synthetic student profiles.

**Feature Encoding:**
- 240-dimensional multi-hot binary feature vector
- 105 subject binary features
- 76 skill binary features
- 59 interest binary features

**Output:** Class probability `P_ML(s)` for each stream `s` ∈ {S01…S12}

Model loaded at service initialization from `backend/ml/models/logistic_regression_model.pkl`. Falls back to uniform probabilities (1/12) if model not available.

### System C — Adaptive Hybrid (Production)

```
S_hybrid(s) = w_rule × S_rule(s) + w_ml × (P_ML(s) × 100)
```

**Dynamic weights:**
| Input Condition | w_rule | w_ml |
|---|---|---|
| Sparse (≤ 2 total inputs) or missing skills/interests | 0.85 | 0.15 |
| Complete profile | 0.50 | 0.50 |

### Uncertainty & Confidence Status

```
ΔP = P_ML(top1) − P_ML(top2)
uncertainty = round(1.0 − max(ΔP, 0.05), 2)
```

| Status | Condition |
|---|---|
| `needs_more_information` | total_valid ≤ 2 OR (no subjects AND total ≤ 3) |
| `conflicting_evidence` | rule margin < 10 AND ΔP < 0.12 |
| `moderate_confidence` | ΔP < 0.25 OR rule margin < 20 |
| `high_confidence` | ΔP ≥ 0.30 AND rule margin ≥ 25 |

### Follow-up Questions

Generated when:
- Top-2 streams are from competing domains (Science vs Commerce, PCM vs PCB, etc.)
- Input categories are missing

Examples:
- PCM vs PCB: *"Which do you enjoy more: Mathematics/Physics or Biology/health sciences?"*
- Science vs Commerce: *"Which do you enjoy more: solving technical problems or understanding business and finance?"*
- Missing inputs: *"Adding your skills will significantly improve recommendation precision."*

---

## 8. ML Pipeline

### Dataset Generation (`backend/ml/data/generate_synthetic_dataset.py`)

- 600 synthetic student profiles across 12 stream archetypes
- Each archetype samples from fixed, domain-specific feature pools
- Controlled cross-domain noise added for realism
- Saved to `synthetic_student_dataset.csv`

### Dataset Schema

| Column | Type | Description |
|---|---|---|
| student_id | String | Unique ID (STU0001…) |
| student_name | String | Synthetic name |
| subjects | String | Semicolon-separated subjects |
| skills | String | Semicolon-separated skills |
| interests | String | Semicolon-separated interests |
| target_stream_id | String | Target class label (S01–S12) |
| target_broad_pathway | String | Science / Commerce / Humanities / Other |
| archetype | String | Domain archetype name |

### Training (`backend/ml/train.py`)

- Stratified 80/20 train/test split
- Training: 480 samples, Test: 120 samples (saved to `held_out_test_set.csv`)
- Multi-hot encoding with vocabulary fitted strictly on training data only
- Trains both Logistic Regression and Random Forest
- Saves models as `.pkl` files

### Evaluation Results (held-out test, N=120)

| System | Top-1 Accuracy | Top-3 Accuracy | Macro F1 |
|---|---|---|---|
| Rule Engine Baseline | 91.67% | 100.00% | 91.68% |
| Pure ML (Logistic Regression) | 100.00% | 100.00% | 100.00% |
| Hybrid Ensemble | 100.00% | 100.00% | 100.00% |

> Note: 100% accuracy on synthetic data is an artifact of deterministic archetype generation (data leakage). Real-world accuracy will be lower.

---

## 9. Robustness & Noise Analysis

### Methodology

Four noise levels applied to the test set:
- **0%:** Pure archetype sampling
- **10%:** 10% feature corruption + 5% label swaps
- **20%:** 20% feature corruption + 10% label swaps
- **30%:** 30% feature corruption + 15% label swaps

### Results

| Noise | Rule Top-1 | Rule Top-3 | ML Top-1 | ML Top-3 | Hybrid Top-1 | Hybrid Top-3 |
|---|---|---|---|---|---|---|
| 0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| 10% | 96.67% | 97.5% | 96.67% | 96.67% | 96.67% | 97.5% |
| 20% | 93.33% | 95.0% | 92.5% | 95.0% | 92.5% | 94.17% |
| 30% | 81.67% | 85.0% | 79.17% | 85.83% | 80.83% | 85.0% |

### Key Finding

The Rule Engine consistently outperforms pure ML under sparse and missing input conditions. This is why the hybrid shifts weight to w_rule=0.85 when inputs are incomplete.

### Edge Case Suite (25 cases)

Covers: strong domain profiles, cross-domain conflicts, missing input categories, single-item sparse inputs, empty profiles, invalid/unknown input names.

---

## 10. Frontend — React

### Application Structure

```
App.jsx
├── LandingScreen     — Dark glassmorphism name entry
├── Sidebar           — Navigation with logo image
├── Header            — Breadcrumb, active view title, AI badge
├── AssessmentView    — Step-tabbed form with validation
├── ResultsView       — Animated score ring, match bars, courses
├── StreamsView       — 12-stream catalog with search
└── CareersView       — Career explorer with domain filters
```

### Landing Screen
- Deep space gradient background (`#0f0c29 → #302b63 → #24243e`)
- Glowing gradient card border (indigo → purple → pink)
- Animated floating badges (AI-Powered, 12 Streams, 200+ Careers)
- Official logo image (`assets/logo.png`)
- Stats grid with glassmorphism tiles

### Assessment View
- 3-tab step navigation: Subjects / Skills / Interests
- Each tab shows count of selected items
- Chip-based multi-select with spring animation on hover
- Per-category color coding (indigo / violet / rose)
- Form validation: blocks submission unless all 3 categories have at least 1 selection
- Warning banner shown if user tries to submit incomplete profile
- Bottom summary bar appears when all 3 categories filled
- Step dot progress indicator

### Results View
- Animated SVG score ring (amber gradient, 1.4s cubic-bezier animation)
- Hero card with dark indigo gradient showing recommended stream
- Confidence status badge (High / Moderate / Conflicting / Needs Info)
- Alternative streams (#2, #3) with mini match bars
- Match breakdown: Subject / Skill / Interest bars with individual colors
- Course cards with career pathway listings
- Follow-up questions panel (amber gradient) with numbered items

### Streams View
- Grid of 12 cards, color-coded per stream domain
- Top accent strip in stream's signature color
- Live search filter
- "Explore Courses" button with hover color transition

### Careers View
- 200+ career cards across 6 domains
- Domain filter pills using each domain's color
- Live search by career name or description

### API Client (`services/api.js`)
- Base URL: `https://career-copilot-api-9591.onrender.com` (from env var or hardcoded default)
- Timeout: 60,000ms (to handle Render cold starts)
- Endpoints: `GET /api/v1/health`, `POST /api/v1/recommend`

---

## 11. Deployment

### Backend — Render

- Platform: Render (free tier)
- URL: `https://career-copilot-api-9591.onrender.com`
- Start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`
- CORS: `allow_origins=["*"]`
- Cold start: up to 60 seconds after inactivity (free tier limitation)
- API timeout on frontend set to 60s to handle this

### Frontend — Netlify

- Platform: Netlify
- Build config (`netlify.toml`):
  ```toml
  [build]
    base    = "frontend"
    command = "npm run build"
    publish = "dist"
  ```
- Node.js version: 20
- SPA redirect: All routes → `index.html` (status 200)
- Environment variable: `VITE_API_BASE_URL=https://career-copilot-api-9591.onrender.com`

### Local Development

```bash
# Frontend only (uses live Render backend)
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Full local stack (optional)
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
# Set VITE_API_BASE_URL=http://127.0.0.1:8000 in frontend/.env.local
```

---

## 12. Git History & Work Done

### Commits (chronological)

| Commit | Description |
|---|---|
| `8367571` | Remove node_modules from tracking, add frontend .gitignore |
| `2e2992f` | Add comprehensive README for Career Copilot |
| `7ba8198` | Complete UI redesign — dark glassmorphism, animated score ring, step assessment |
| `db2f545` | Fix requirements.txt — replace non-existent package versions with real stable versions |
| `b677049` | Update README — fix backend run commands, reflect UI redesign |
| `f12bcbe` | Add docs/ folder with PROJECT_INFO, ARCHITECTURE, screenshots placeholder |
| `d867183` | Update README.md |
| `a6ee571` | Add dashboard screenshot to README preview section |
| `0a6d91f` | Fix premature assessment submission, enforce 3-category completion |
| `1f7defd` | Fix CORS middleware, update SettingsView API URL |
| `f9b6bcc` | Fix production API connection to Render backend |
| `5eb84d9` | Replace sidebar header icon with official logo image |
| `f66bc3b` | Replace title text with official uploaded logo image |
| `b0099ab` | Update API base URL to Render backend |
| `46478b0` | Allow Netlify frontend in API CORS |
| `87a0c5b` | Rewrite README to reflect actual deployment state (Render + Netlify) |
| `1500e9c` | Replace dashboard screenshot with new results page preview |

### Major Work Completed

1. **Full-stack application built** — FastAPI backend + React frontend
2. **ML pipeline** — Synthetic data generation, model training, evaluation
3. **Hybrid recommendation engine** — Rule + ML with adaptive weights
4. **Robustness analysis** — 4 noise levels × 3 systems + 25 edge cases
5. **Complete UI redesign** — Glassmorphism, animations, step form, results ring
6. **Backend deployed** to Render (live at career-copilot-api-9591.onrender.com)
7. **Frontend configured** for Netlify deployment
8. **README** — Full accurate documentation
9. **docs/ folder** — Architecture, project info, screenshots

---

## 13. API Reference

### Base URL
```
https://career-copilot-api-9591.onrender.com
```

### GET /api/v1/health

**Response:**
```json
{ "status": "ok" }
```

### POST /api/v1/recommend

**Request Body:**
```json
{
  "name": "Aarav Patel",
  "subjects": ["Mathematics", "Physics", "Computer Science"],
  "skills": ["Logical Thinking", "Problem Solving", "Programming"],
  "interests": ["Technology", "Engineering"]
}
```

**Full Response:**
```json
{
  "student_profile": {
    "name": "Aarav Patel",
    "subjects": ["Mathematics", "Physics", "Computer Science"],
    "skills": ["Logical Thinking", "Problem Solving", "Programming"],
    "interests": ["Technology", "Engineering"],
    "unrecognized_inputs": {
      "subjects": [],
      "skills": [],
      "interests": []
    }
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
      "description": "STEM pathway focusing on Physics, Chemistry, and Mathematics.",
      "score": 94.5,
      "overall_match_score": 94.5,
      "skill_match_score": 97.0,
      "interest_match_score": 96.0,
      "subject_match_score": 100.0,
      "ml_probability": 0.9312,
      "uncertainty": 0.12,
      "recommendation_status": "high_confidence",
      "matched_skills": ["Logical Thinking", "Problem Solving"],
      "matched_interests": ["Technology", "Engineering"],
      "explanation_factors": [
        "Strong skill alignment (2 skill(s)): Logical Thinking, Problem Solving",
        "High interest domain match (2 interest(s)): Technology, Engineering",
        "Aligned with favourite subject(s): Computer Science, Mathematics, Physics"
      ],
      "recommended_courses": [
        {
          "course_id": "C001",
          "course_name": "Science - PCM with Computer Science",
          "typical_subjects": "Mathematics;Physics;Chemistry;Computer Science",
          "related_careers": [
            { "career_id": "CAR001", "career_name": "Software Engineer", "domain": "Technology" },
            { "career_id": "CAR002", "career_name": "Data Scientist", "domain": "Technology" }
          ]
        }
      ]
    }
  ]
}
```

---

## 14. Known Limitations & Future Work

### Current Limitations

| Limitation | Description |
|---|---|
| Synthetic training data | ML model trained on synthetic profiles. Real-world accuracy requires real student data. |
| Fixed vocabulary | Unrecognized input names are silently dropped. |
| No authentication | No user accounts or result persistence. |
| Render cold starts | Free tier spins down after inactivity — first request takes up to 60s. |
| English only | Dataset and UI are in English. |
| No feedback loop | No mechanism to collect student outcomes for future retraining. |

### Phase 2 Roadmap

| Feature | Description |
|---|---|
| User authentication | JWT-based login, save and revisit results |
| PostgreSQL database | Store student profiles, recommendation history |
| Real data collection | Log actual student feedback and stream choices |
| Model retraining | Retrain on real data using MLflow |
| TypeScript migration | Convert frontend from JavaScript to TypeScript |
| CI/CD pipeline | GitHub Actions for automated testing and deployment |
| Multi-language support | Hindi and regional language support |
