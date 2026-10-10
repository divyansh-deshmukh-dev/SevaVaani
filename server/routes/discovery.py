from typing import Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.eligibility import eligibility_engine, CitizenProfile, EligibilityResult
from services.catalog import catalog
from services.adapters.demo_pm_kisan import demo_pm_kisan_adapter

router = APIRouter(prefix="/api", tags=["Discovery & Submission"])

class RecommendRequest(BaseModel):
    problemText: str
    language: Optional[str] = "hi"
    profile: Optional[CitizenProfile] = None

class RecommendResponse(BaseModel):
    recommendedService: Optional[dict[str, Any]]
    eligibility: Optional[EligibilityResult]
    explanation: str
    candidates: list[dict[str, Any]]

class EligibilityCheckRequest(BaseModel):
    serviceId: str
    profile: CitizenProfile

class SubmitApplicationRequest(BaseModel):
    formData: dict[str, Any]

@router.post("/service/recommend", response_model=RecommendResponse)
async def recommend_service(req: RecommendRequest):
    """Recommends services based on problem statement and citizen profile"""
    matched_service, conf, candidates = catalog.match_service(req.problemText, req.language or "hi")
    
    # If not matched from query, default to PM-Kisan for farmer problems or general schemes
    target = matched_service or catalog.get_service("pm_kisan")
    
    profile = req.profile or CitizenProfile()
    # If problem mentions farmer, set occupation to farmer
    if any(k in req.problemText.lower() for k in ["farmer", "kisan", "शेतकरी", "किसान"]):
        profile.occupation = "farmer"
        profile.isFarmer = True
        if profile.landHeldAcres is None:
            profile.landHeldAcres = 2.0

    eligibility = eligibility_engine.evaluate(target.serviceId, profile)

    return RecommendResponse(
        recommendedService=target.model_dump(),
        eligibility=eligibility,
        explanation=getattr(eligibility.explanation, req.language or "hi", eligibility.explanation.en),
        candidates=[c.model_dump() for c in candidates]
    )

@router.post("/service/eligibility", response_model=EligibilityResult)
async def check_eligibility(req: EligibilityCheckRequest):
    """Deterministically evaluates citizen eligibility for a specific service"""
    return eligibility_engine.evaluate(req.serviceId, req.profile)

@router.post("/services/{service_id}/submit")
async def submit_service_application(service_id: str, req: SubmitApplicationRequest):
    """Submits application via the service adapter"""
    if service_id == "pm_kisan":
        result = await demo_pm_kisan_adapter.submit_application(req.formData)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result)
        return result
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Service '{service_id}' does not support direct submission in this demo."
        )

@router.get("/services/{service_id}/status/{application_id}")
async def get_service_status(service_id: str, application_id: str):
    """Gets application status from the service adapter"""
    if service_id == "pm_kisan":
        res = await demo_pm_kisan_adapter.get_status(application_id)
        if not res["found"]:
            raise HTTPException(status_code=404, detail=res)
        return res
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Status lookup not available for '{service_id}'."
        )
