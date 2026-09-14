"""Synthetic demo data — deliberately engineered to trigger both escalation
rules, so the demo video has something real to show at the exact right
moment. Small on purpose (scaffold-scale); grow it once the pipeline works."""

import asyncio
from datetime import datetime, timedelta, timezone

from app import database as db

NOW = datetime.now(timezone.utc)


ANIMALS = [
    {
        "id": "animal-1", "name": "Maple", "species": "cat", "breed": "domestic shorthair",
        "age": 9, "intake_date": (NOW - timedelta(days=5)).isoformat(),
        "medical_needs": ["diabetic"], "behavior_tags": ["senior", "calm"],
        "special_needs_flag": True, "kennel_location": "C-3", "status": "available",
    },
    {
        "id": "animal-2", "name": "Rex", "species": "dog", "breed": "pit bull mix",
        "age": 3, "intake_date": (NOW - timedelta(days=2)).isoformat(),
        "medical_needs": [], "behavior_tags": ["resource-guarding", "no-cat"],
        "special_needs_flag": True, "kennel_location": "D-1", "status": "available",
    },
    {
        "id": "animal-3", "name": "Biscuit", "species": "rabbit", "breed": "holland lop",
        "age": 1, "intake_date": (NOW - timedelta(days=10)).isoformat(),
        "medical_needs": [], "behavior_tags": ["easygoing"],
        "special_needs_flag": False, "kennel_location": "R-2", "status": "available",
    },
]

APPLICANTS = [
    {
        "id": "app-1", "name": "Priya Nair", "email": "priya@example.com", "type": "foster",
        "household_pets": [], "housing_type": "house", "yard": True,
        "experience_level": "medical_capable", "breed_restrictions_ok": True,
        "medical_capability": ["diabetic", "senior-care"],
        "application_date": (NOW - timedelta(days=3)).isoformat(), "preferred_language": "hi",
    },
    {
        "id": "app-2", "name": "Daniel K.", "email": "daniel@example.com", "type": "adopter",
        "household_pets": [], "housing_type": "apartment", "yard": False,
        "experience_level": "medical_capable", "breed_restrictions_ok": True,
        "medical_capability": ["diabetic"],
        "application_date": (NOW - timedelta(days=1)).isoformat(), "preferred_language": "en",
    },
    {
        "id": "app-3", "name": "Meera S.", "email": "meera@example.com", "type": "foster",
        "household_pets": [], "housing_type": "house", "yard": True,
        "experience_level": "medical_capable", "breed_restrictions_ok": True,
        "medical_capability": ["diabetic", "senior-care"],
        "application_date": (NOW - timedelta(days=6)).isoformat(), "preferred_language": "en",
    },
    {
        "id": "app-4", "name": "First Timer", "email": "ft@example.com", "type": "adopter",
        "household_pets": [{"species": "cat", "temperament": "shy"}],
        "housing_type": "apartment", "yard": False, "experience_level": "first_time",
        "breed_restrictions_ok": False, "medical_capability": [],
        "application_date": (NOW - timedelta(days=4)).isoformat(), "preferred_language": "en",
    },
]

SHELTER_CONFIG = {
    "shelter_name": "Sunnydale Animal Rescue",
    "total_kennel_capacity": 20,
    "occupancy_threshold_pct": 90,
    "current_occupancy": 18,  # 90% — the seed data alone should trip the capacity rule
}


async def seed() -> None:
    await db.init_db()
    for a in ANIMALS:
        await db.create_animal(a)
    for a in APPLICANTS:
        await db.create_applicant(a)
    await db.set_shelter_config(SHELTER_CONFIG)


if __name__ == "__main__":
    asyncio.run(seed())
    print("Seeded animals, applicants, and shelter config.")
    print("Maple (animal-1) has 3 medical-capable applicants >=0.75 -> should trigger competing_applicants.")
    print("Occupancy is at 90% -> should trigger capacity_threshold.")
