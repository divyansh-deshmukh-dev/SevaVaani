from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from server.services.catalog import catalog
from server.core.models import ServiceDefinition

router = APIRouter(prefix="/api", tags=["Services"])

class DiscoverRequest(BaseModel):
    query: str
    language: Optional[str] = "hi"

class DiscoverResponse(BaseModel):
    matched: bool
    service: Optional[ServiceDefinition] = None
    confidence: float
    candidates: list[ServiceDefinition]

@router.get("/services", response_model=list[ServiceDefinition])
async def list_services():
    """List all available government services in the catalog"""
    return catalog.list_services()

@router.get("/services/search", response_model=list[ServiceDefinition])
async def search_services(
    q: str = Query(..., description="Search query string"),
    language: str = Query("hi", description="Language code")
):
    """Search services in catalog by name, category, or alias"""
    matched_service, confidence, candidates = catalog.match_service(q, language)
    if candidates:
        return candidates
    if matched_service:
        return [matched_service]
    return []

@router.get("/services/{service_id}", response_model=ServiceDefinition)
async def get_service(service_id: str):
    """Get service details by service ID"""
    service = catalog.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found.")
    return service

@router.get("/services/{service_id}/form")
async def get_service_form(service_id: str):
    """Get dynamic form schema for a service if configured"""
    from server.services.form_engine import form_engine
    service = catalog.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found.")
    if not service.formSchemaId:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' has no direct form configured in prototype.")
    schema = form_engine.get_form_schema(service.formSchemaId)
    if not schema:
        raise HTTPException(status_code=404, detail=f"Form schema '{service.formSchemaId}' not found.")
    return schema

@router.get("/services/{service_id}/eligibility")
async def get_service_eligibility(service_id: str):
    """Get eligibility criteria metadata for a service"""
    service = catalog.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found.")
    return {
        "serviceId": service.serviceId,
        "eligibilityRuleId": service.eligibilityRuleId,
        "criteria": service.guidance.get("eligibilityCriteria", []) if service.guidance else [],
        "whoIsItFor": service.guidance.get("whoIsItFor") if service.guidance else None
    }

@router.post("/service/discover", response_model=DiscoverResponse)
async def discover_service(req: DiscoverRequest):
    """Match user input against catalog to find target service"""
    matched_service, confidence, candidates = catalog.match_service(req.query, req.language or "hi")
    return DiscoverResponse(
        matched=matched_service is not None,
        service=matched_service,
        confidence=confidence,
        candidates=candidates
    )

@router.get("/services/{service_id}/guidance")
async def get_guidance(service_id: str, language: str = Query("hi")):
    """Get guidance information for a service"""
    guidance = catalog.get_service_guidance(service_id, language)
    if not guidance:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found.")
    return guidance
