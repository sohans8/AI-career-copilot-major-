from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    name: str = Field(..., min_length=1)
    subjects: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str