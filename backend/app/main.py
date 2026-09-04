from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.recommendation import router as recommendation_router
from backend.app.models.schemas import HealthResponse


app = FastAPI(
    title="Career Copilot API",
    description="AI/ML powered career recommendation API for students.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(recommendation_router)


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Career Copilot API"}


@app.get(
    "/api/v1/health",
    response_model=HealthResponse,
    tags=["Health"]
)
def health_check():
    return {"status": "ok"}