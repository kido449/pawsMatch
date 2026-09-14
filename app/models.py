"""Pydantic data models for ShelterOps / PawsMatch.

These mirror the data model agreed in the PRD (paws-match-prd.md, section 10).
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class AnimalStatus(str, Enum):
    available = "available"
    pending = "pending"
    placed = "placed"


class ApplicantType(str, Enum):
    foster = "foster"
    adopter = "adopter"


class ExperienceLevel(str, Enum):
    first_time = "first_time"
    experienced = "experienced"
    medical_capable = "medical_capable"


class MatchStatus(str, Enum):
    proposed = "proposed"
    contacted = "contacted"
    interested = "interested"
    declined = "declined"
    placed = "placed"


class EscalationType(str, Enum):
    competing_applicants = "competing_applicants"
    capacity_threshold = "capacity_threshold"
    manual_review = "manual_review"


class EscalationStatus(str, Enum):
    open = "open"
    resolved = "resolved"


class HouseholdPet(BaseModel):
    species: str
    temperament: str = ""


class AnimalProfile(BaseModel):
    id: str
    name: str
    species: str
    breed: str
    age: float = Field(description="age in years")
    intake_date: datetime
    medical_needs: list[str] = Field(default_factory=list)
    behavior_tags: list[str] = Field(default_factory=list)
    special_needs_flag: bool = False
    kennel_location: str = ""
    status: AnimalStatus = AnimalStatus.available


class ApplicantProfile(BaseModel):
    id: str
    name: str
    email: str
    phone: str = ""
    type: ApplicantType
    household_pets: list[HouseholdPet] = Field(default_factory=list)
    housing_type: str = ""
    yard: bool = False
    experience_level: ExperienceLevel = ExperienceLevel.first_time
    breed_restrictions_ok: bool = True
    medical_capability: list[str] = Field(default_factory=list)
    application_date: datetime
    status: str = "active"
    preferred_language: str = "en"  # drives whether outreach goes through the Sarvam translation tool


class MatchRecord(BaseModel):
    id: str
    animal_id: str
    applicant_id: str
    score: float
    score_breakdown: dict[str, float] = Field(default_factory=dict)
    veto_reason: str | None = None
    status: MatchStatus = MatchStatus.proposed
    created_at: datetime = Field(default_factory=datetime.utcnow)


class OutreachMessage(BaseModel):
    id: str
    match_id: str
    channel: str = "email"  # "email" | "whatsapp"
    subject: str = ""
    body: str
    status: str = "draft"  # draft-only for the hackathon demo, see OUTREACH_MODE
    sent_at: datetime | None = None


class Escalation(BaseModel):
    id: str
    type: EscalationType
    animal_id: str | None = None
    details: str
    status: EscalationStatus = EscalationStatus.open
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: datetime | None = None


class ShelterConfig(BaseModel):
    shelter_name: str
    total_kennel_capacity: int
    occupancy_threshold_pct: float
    current_occupancy: int = 0
