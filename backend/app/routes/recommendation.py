from fastapi import APIRouter, HTTPException

from backend.app.models.schemas import RecommendationRequest
from backend.app.services.recommendation_service import RecommendationService

router = APIRouter(
    prefix="/api/v1",
    tags=["Recommendations"]
)

recommendation_service = RecommendationService()


@router.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    try:
        profile = request.model_dump()

        result = recommendation_service.recommend(profile)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate career recommendations."
        )