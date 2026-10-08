from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from server.core.models import TurnRequest, TurnResponse, LanguageCode
from server.core.session import session_store, SessionData
from server.core.state_machine import state_machine
from server.services.form_engine import form_engine

router = APIRouter(prefix="/api/session", tags=["Session"])

class CreateSessionRequest(BaseModel):
    language: Optional[LanguageCode] = "hi"

@router.post("", response_model=TurnResponse)
async def create_session(req: Optional[CreateSessionRequest] = None):
    lang = req.language if req else "hi"
    session = session_store.create_session(language=lang)
    # Return initial turn response
    init_req = TurnRequest(language=lang)
    return await state_machine.handle_turn(session, init_req)

@router.get("/{session_id}", response_model=SessionData)
async def get_session(session_id: str):
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session

@router.post("/{session_id}/turn", response_model=TurnResponse)
async def process_turn(session_id: str, req: TurnRequest):
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return await state_machine.handle_turn(session, req)

@router.post("/{session_id}/action", response_model=TurnResponse)
async def process_action(session_id: str, req: TurnRequest):
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return await state_machine.handle_turn(session, req)

@router.get("/{session_id}/summary")
async def get_session_summary(session_id: str, language: str = "hi"):
    session = session_store.get_session(session_id)
    if not session or not session.formSession:
        raise HTTPException(status_code=404, detail="Form session not found.")
    return {
        "sessionId": session_id,
        "isComplete": form_engine.is_complete(session.formSession),
        "fields": form_engine.get_summary(session.formSession, language)
    }

@router.get("/{session_id}/handoff")
async def get_session_handoff(session_id: str):
    session = session_store.get_session(session_id)
    if not session or not session.handoffRecord:
        raise HTTPException(status_code=404, detail="No handoff record exists for this session.")
    return session.handoffRecord
