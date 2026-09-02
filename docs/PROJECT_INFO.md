# Career Copilot — Project Info

## Project Details

| Field | Info |
|---|---|
| Project Name | Career Copilot |
| Version | 1.0.0 (Phase 1) |
| Type | AI/ML Web Application |
| Target Users | Class 10 Students |
| Purpose | Career & Stream Recommendation after Class 10 |
| GitHub | https://github.com/sohans8/AI-career-copilot-major- |

---

## How to Run Locally

### Backend (Terminal 1)
```bash
cd AI-career-copilot-major-
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Terminal 2)
```bash
cd AI-career-copilot-major-\frontend
npm install
npm run dev
```

### Then open browser at:
```
http://localhost:5173
```

---

## Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.10+ |
| ML | scikit-learn (Logistic Regression) |
| Data | CSV files (12 streams, 200+ careers) |
| Deploy | Netlify (frontend), Any Python host (backend) |

---

## API Endpoints

| Method | URL | Description |
|---|---|---|
| GET | /api/v1/health | Health check |
| POST | /api/v1/recommend | Get stream recommendations |

---

## Folder Structure

```
AI-career-copilot-major-/
├── backend/          → FastAPI + ML backend
├── frontend/         → React + Vite frontend
├── docs/             → Project documentation & assets
│   ├── PROJECT_INFO.md
│   ├── ARCHITECTURE.md
│   └── screenshots/  → UI screenshots
└── README.md
```
