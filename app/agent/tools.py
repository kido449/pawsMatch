"""Custom Strands tools for the PawsMatch agent.

Every escalation-worthy decision is deliberately NOT a tool the agent can
resolve on its own — check_escalations only ever flags and returns; nothing
here writes a "placed" status without a human calling update_match_status
explicitly from the dashboard.
"""

import os
import uuid
from datetime import datetime, timezone

from strands import tool

from app import database as db
from app.scoring import score_all_matches
from app.agent.model_config import get_sarvam_client


@tool
def score_matches(animal_id: str) -> dict:
    """Score every active applicant against one animal. Returns ranked
    matches with per-factor breakdowns and veto reasons for excluded
    applicants."""
    animals = [a for a in _sync_get_animals() if a["id"] == animal_id]
    if not animals:
        return {"error": f"animal {animal_id} not found"}
    animal = animals[0]
    applicants = _sync_get_applicants()
    ranked = score_all_matches(animal, applicants)

    for r in ranked:
        if r["score"] > 0:
            _sync_create_match({
                "id": str(uuid.uuid4()),
                "animal_id": animal_id,
                "applicant_id": r["applicant_id"],
                "score": r["score"],
                "score_breakdown": r["breakdown"],
                "status": "proposed",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
    return {"animal_id": animal_id, "ranked_matches": ranked}


@tool
def check_escalations() -> list[dict]:
    """Evaluate the escalation rules and return any newly triggered
    escalations. This tool only flags — it never resolves anything."""
    triggered = []
    animals = _sync_get_animals()
    config = _sync_get_shelter_config()

    for animal in animals:
        if not animal.get("special_needs_flag"):
            continue
        matches = _sync_get_matches_for_animal(animal["id"])
        serious = [m for m in matches if m["score"] >= 0.75]
        if len(serious) >= 2:
            triggered.append({
                "type": "competing_applicants",
                "animal_id": animal["id"],
                "details": (
                    f"{len(serious)} applicants scored >=0.75 for "
                    f"{animal['name']} (special needs) — needs human review"
                ),
            })

    if config:
        occupancy_pct = 100 * config["current_occupancy"] / config["total_kennel_capacity"]
        if occupancy_pct >= config["occupancy_threshold_pct"]:
            unmatched = [a for a in animals if a["status"] == "available"
                         and not _sync_get_matches_for_animal(a["id"])]
            if unmatched:
                triggered.append({
                    "type": "capacity_threshold",
                    "animal_id": None,
                    "details": (
                        f"Occupancy at {occupancy_pct:.0f}% with "
                        f"{len(unmatched)} unmatched animal(s) — transfer review needed"
                    ),
                })

    for e in triggered:
        _sync_create_escalation({
            "id": str(uuid.uuid4()),
            "type": e["type"],
            "animal_id": e["animal_id"],
            "details": e["details"],
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "resolved_at": None,
        })
    return triggered


@tool
def get_kennel_status() -> dict:
    """Return current kennel occupancy and animal status counts."""
    animals = _sync_get_animals()
    config = _sync_get_shelter_config() or {}
    counts = {"available": 0, "pending": 0, "placed": 0}
    for a in animals:
        counts[a["status"]] = counts.get(a["status"], 0) + 1
    capacity = config.get("total_kennel_capacity", 0)
    occupancy = config.get("current_occupancy", 0)
    return {
        "counts": counts,
        "capacity": capacity,
        "current_occupancy": occupancy,
        "occupancy_pct": round(100 * occupancy / capacity, 1) if capacity else 0,
    }


@tool
def search_animals(query: str) -> list[dict]:
    """Search/filter animals by species, breed, status, or behavior tag."""
    animals = _sync_get_animals()
    q = query.lower()
    return [
        a for a in animals
        if q in a["species"].lower() or q in a["breed"].lower()
        or q in a["status"].lower() or any(q in t.lower() for t in a["behavior_tags"])
    ]


@tool
def search_applicants(query: str) -> list[dict]:
    """Search/filter applicants by type, experience level, or housing type."""
    applicants = _sync_get_applicants()
    q = query.lower()
    return [
        a for a in applicants
        if q in a["type"].lower() or q in a["experience_level"].lower()
        or q in a.get("housing_type", "").lower()
    ]


@tool
def update_match_status(match_id: str, new_status: str, notes: str = "") -> dict:
    """Update a match's status after a HUMAN interview/sign-off. This is the
    only path a match can ever reach 'placed' — the agent never calls this
    tool on its own initiative to finalize a placement."""
    # Left intentionally minimal for the scaffold — wire to database.py's
    # match table once the FastAPI layer calls this from an explicit
    # coordinator action, not from agent autonomy.
    return {"match_id": match_id, "status": new_status, "notes": notes, "updated_by": "human"}


@tool
def translate_intake(text: str, target_language: str = "en") -> str:
    """Translate WhatsApp intake text to/from a regional Indian language
    using Sarvam AI. Used for non-English-speaking adopter/foster families —
    the accessibility feature from the PRD. This is a plain translation
    call, not agent reasoning."""
    client = get_sarvam_client()
    model_id = os.getenv("SARVAM_MODEL_ID", "sarvam-105b")
    response = client.chat.completions.create(
        model=model_id,
        messages=[
            {
                "role": "system",
                "content": (
                    f"Translate the user's message to {target_language}. "
                    "Return only the translated text, no commentary."
                ),
            },
            {"role": "user", "content": text},
        ],
    )
    return response.choices[0].message.content


# --- sync wrappers around the async database module -----------------------
# Strands tools are called synchronously by the agent loop; these small
# wrappers keep tools.py simple. Swap for native async tool support if/when
# Strands' async tool calling is wired into the FastAPI layer.

import asyncio


def _run(coro):
    return asyncio.get_event_loop().run_until_complete(coro)


def _sync_get_animals():
    return _run(db.get_animals())


def _sync_get_applicants():
    return _run(db.get_applicants())


def _sync_create_match(match):
    return _run(db.create_match(match))


def _sync_get_matches_for_animal(animal_id):
    return _run(db.get_matches_for_animal(animal_id))


def _sync_create_escalation(escalation):
    return _run(db.create_escalation(escalation))


def _sync_get_shelter_config():
    return _run(db.get_shelter_config())
