"""Rule-based, explainable compatibility scoring.

Matches the PRD (section 10): hard vetoes exclude an applicant entirely;
everything that clears the vetoes gets a weighted 0.0-1.0 score. Deliberately
NOT ML-based — a coordinator (and a judge) should be able to see exactly why
an applicant ranked where they did.
"""

from datetime import datetime, timezone

WEIGHTS = {
    "temperament_fit": 0.40,
    "experience_match": 0.25,
    "housing_fit": 0.20,
    "availability_recency": 0.15,
}

DIFFICULT_TAGS = {"resource-guarding", "reactive", "fear-aggression"}


def check_vetoes(animal: dict, applicant: dict) -> str | None:
    """Return a veto reason string, or None if the pairing clears all vetoes."""
    # Breed restriction conflict
    if not applicant.get("breed_restrictions_ok", True):
        return f"Applicant's housing doesn't allow {animal['breed']}"

    # Medical needs mismatch
    medical_needs = set(animal.get("medical_needs", []))
    medical_capability = set(applicant.get("medical_capability", []))
    if medical_needs and not medical_needs.issubset(medical_capability):
        missing = medical_needs - medical_capability
        return f"Applicant can't provide required care: {', '.join(missing)}"

    # Unsafe pet incompatibility: a difficult-behavior animal into an
    # inexperienced multi-pet home is excluded outright, not just downweighted.
    behavior_tags = set(animal.get("behavior_tags", []))
    household_pets = applicant.get("household_pets", [])
    if behavior_tags & DIFFICULT_TAGS and household_pets:
        if applicant.get("experience_level") == "first_time":
            return "Difficult-behavior animal into an inexperienced multi-pet home"

    return None


def _temperament_fit(animal: dict, applicant: dict) -> float:
    behavior_tags = set(animal.get("behavior_tags", []))
    household_pets = applicant.get("household_pets", [])

    if not household_pets:
        return 0.8  # no existing pets to conflict with

    conflicts = 0
    for pet in household_pets:
        species = pet.get("species", "")
        if f"no-{species}" in behavior_tags:
            conflicts += 1
    if conflicts:
        return max(0.0, 0.5 - 0.25 * conflicts)
    return 1.0


def _experience_match(animal: dict, applicant: dict) -> float:
    difficulty = 0
    if animal.get("special_needs_flag"):
        difficulty += 1
    if set(animal.get("behavior_tags", [])) & DIFFICULT_TAGS:
        difficulty += 1

    level = applicant.get("experience_level", "first_time")
    level_score = {"first_time": 0.3, "experienced": 0.7, "medical_capable": 1.0}[level]

    if difficulty == 0:
        return min(1.0, level_score + 0.3)  # easy animals suit any experience level well
    return level_score


def _housing_fit(animal: dict, applicant: dict) -> float:
    score = 0.6
    if applicant.get("yard"):
        score += 0.2
    if applicant.get("housing_type") == "apartment" and animal.get("species") == "dog":
        score -= 0.2
    return max(0.0, min(1.0, score))


def _availability_recency(applicant: dict) -> float:
    app_date = applicant.get("application_date")
    if isinstance(app_date, str):
        app_date = datetime.fromisoformat(app_date)
    if app_date.tzinfo is None:
        app_date = app_date.replace(tzinfo=timezone.utc)
    days_old = (datetime.now(timezone.utc) - app_date).days
    return max(0.2, 1.0 - days_old / 60)  # decays over ~2 months, floors at 0.2


def score_pairing(animal: dict, applicant: dict) -> dict:
    """Score a single animal/applicant pairing. Returns a dict with the total
    score, a per-factor breakdown, and a veto reason if excluded."""
    veto = check_vetoes(animal, applicant)
    if veto:
        return {"applicant_id": applicant["id"], "score": 0.0, "breakdown": {}, "veto_reason": veto}

    breakdown = {
        "temperament_fit": _temperament_fit(animal, applicant),
        "experience_match": _experience_match(animal, applicant),
        "housing_fit": _housing_fit(animal, applicant),
        "availability_recency": _availability_recency(applicant),
    }
    total = sum(WEIGHTS[k] * v for k, v in breakdown.items())
    return {"applicant_id": applicant["id"], "score": round(total, 3), "breakdown": breakdown, "veto_reason": None}


def score_all_matches(animal: dict, applicants: list[dict]) -> list[dict]:
    """Score every applicant against one animal, ranked descending. Vetoed
    applicants are included with score 0.0 so the reason is still visible."""
    results = [score_pairing(animal, a) for a in applicants]
    return sorted(results, key=lambda r: r["score"], reverse=True)
