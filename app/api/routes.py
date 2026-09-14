"""FastAPI routes that wire the frontend to the existing backend logic.

Every route calls into the existing app/database.py, app/scoring.py, or
app/agent/pawsmatch_agent.py — NO logic is duplicated here.
"""

import asyncio
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import database as db
from app.agent.pawsmatch_agent import build_agent
from app.scoring import score_all_matches

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class OutreachPatchRequest(BaseModel):
    status: str


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

@router.get("/dashboard/stats")
async def dashboard_stats():
    """Compute live dashboard stats from the database — NOT cached or mocked."""
    animals = await db.get_animals()
    applicants = await db.get_applicants()
    escalations = await db.get_open_escalations()
    config = await db.get_shelter_config()

    counts = {"available": 0, "pending": 0, "placed": 0}
    for a in animals:
        s = a.get("status", "available")
        counts[s] = counts.get(s, 0) + 1

    capacity = config.get("total_kennel_capacity", 0) if config else 0
    occupancy = config.get("current_occupancy", 0) if config else 0

    return {
        "occupancy_pct": round(100 * occupancy / capacity, 1) if capacity else 0,
        "kennels_used": occupancy,
        "kennels_total": capacity,
        "available_animals": counts["available"],
        "pending_animals": counts["pending"],
        "placed_animals": counts["placed"],
        "active_applicants": len([a for a in applicants if a.get("status") == "active"]),
        "open_escalations": len(escalations),
    }


# ---------------------------------------------------------------------------
# CRUD endpoints
# ---------------------------------------------------------------------------

@router.get("/animals")
async def list_animals():
    return await db.get_animals()


@router.get("/applicants")
async def list_applicants():
    return await db.get_applicants()


@router.get("/matches")
async def list_matches():
    return await db.get_all_matches()


@router.get("/outreach")
async def list_outreach():
    return await db.get_outreach()


@router.patch("/outreach/{msg_id}")
async def patch_outreach(msg_id: str, body: OutreachPatchRequest):
    result = await db.update_outreach_status(msg_id, body.status)
    if not result:
        raise HTTPException(status_code=404, detail=f"Outreach message {msg_id} not found")
    return result


@router.get("/escalations")
async def list_escalations():
    return await db.get_open_escalations()


# ---------------------------------------------------------------------------
# Match engine — runs the REAL scoring engine + escalation checks
# ---------------------------------------------------------------------------

@router.post("/match-engine/run")
async def run_match_engine():
    """Score every available animal against all active applicants using the
    real scoring engine in app/scoring.py, then run escalation checks.
    This is NOT a mock — it writes real matches to the database."""
    animals = await db.get_animals(status="available")
    applicants = await db.get_applicants()

    total_matches = 0
    for animal in animals:
        ranked = score_all_matches(animal, applicants)
        for r in ranked:
            if r["score"] > 0:
                await db.create_match({
                    "id": str(uuid.uuid4()),
                    "animal_id": animal["id"],
                    "applicant_id": r["applicant_id"],
                    "score": r["score"],
                    "score_breakdown": r["breakdown"],
                    "veto_reason": r.get("veto_reason"),
                    "status": "proposed",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })
                total_matches += 1

    # Run escalation checks (sync wrapper — the tool itself is synchronous)
    from app.agent.tools import check_escalations as _check_escalations_tool
    loop = asyncio.get_running_loop()
    escalations = await loop.run_in_executor(None, _check_escalations_tool)
    escalation_count = len(escalations) if isinstance(escalations, list) else 0

    return {
        "matches_created": total_matches,
        "escalations_triggered": escalation_count,
    }


# ---------------------------------------------------------------------------
# Agent chat — calls the REAL Strands agent, not a mock
# ---------------------------------------------------------------------------

@router.post("/agent/chat", response_model=ChatResponse)
async def agent_chat(req: ChatRequest):
    """Send a message to the real Strands-powered PawsMatch agent.
    The agent has access to all 7 tools and will reason + call them as needed."""
    try:
        agent = build_agent()
        # The Strands agent's __call__ is synchronous — run in executor
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, agent, req.message)
        # The agent returns a result object; extract the text
        response_text = str(result)
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.exception("Agent chat failed")
        raise HTTPException(
            status_code=503,
            detail=f"Agent unavailable — check backend connection. Error: {str(e)}",
        )
