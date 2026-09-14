"""Async SQLite persistence for ShelterOps.

Deliberately simple (aiosqlite, hand-rolled DDL, no ORM) — this is a 6-week
hackathon build, not a production system. Swap for Postgres later if the
project grows past the demo.
"""

import json
import os
import shutil
from datetime import datetime

import aiosqlite

DB_PATH = "shelterops.db"

if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/shelterops.db"
    if not os.path.exists(DB_PATH) and os.path.exists("shelterops.db"):
        shutil.copy("shelterops.db", DB_PATH)

SCHEMA = """
CREATE TABLE IF NOT EXISTS animals (
    id TEXT PRIMARY KEY,
    name TEXT, species TEXT, breed TEXT, age REAL,
    intake_date TEXT, medical_needs TEXT, behavior_tags TEXT,
    special_needs_flag INTEGER, kennel_location TEXT, status TEXT
);
CREATE TABLE IF NOT EXISTS applicants (
    id TEXT PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT, type TEXT,
    household_pets TEXT, housing_type TEXT, yard INTEGER,
    experience_level TEXT, breed_restrictions_ok INTEGER,
    medical_capability TEXT, application_date TEXT, status TEXT,
    preferred_language TEXT
);
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    animal_id TEXT, applicant_id TEXT, score REAL,
    score_breakdown TEXT, veto_reason TEXT, status TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS outreach_log (
    id TEXT PRIMARY KEY,
    match_id TEXT, channel TEXT, subject TEXT, body TEXT,
    status TEXT, sent_at TEXT
);
CREATE TABLE IF NOT EXISTS escalations (
    id TEXT PRIMARY KEY,
    type TEXT, animal_id TEXT, details TEXT, status TEXT,
    created_at TEXT, resolved_at TEXT
);
CREATE TABLE IF NOT EXISTS shelter_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    shelter_name TEXT, total_kennel_capacity INTEGER,
    occupancy_threshold_pct REAL, current_occupancy INTEGER
);
"""


async def init_db(db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.executescript(SCHEMA)
        await db.commit()


async def create_animal(animal: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO animals
               (id, name, species, breed, age, intake_date, medical_needs,
                behavior_tags, special_needs_flag, kennel_location, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                animal["id"], animal["name"], animal["species"], animal["breed"],
                animal["age"], animal["intake_date"],
                json.dumps(animal.get("medical_needs", [])),
                json.dumps(animal.get("behavior_tags", [])),
                int(animal.get("special_needs_flag", False)),
                animal.get("kennel_location", ""), animal.get("status", "available"),
            ),
        )
        await db.commit()


async def get_animals(status: str | None = None, db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        query = "SELECT * FROM animals"
        params: tuple = ()
        if status:
            query += " WHERE status = ?"
            params = (status,)
        rows = await db.execute_fetchall(query, params)
        return [_row_to_animal(r) for r in rows]


def _row_to_animal(row: aiosqlite.Row) -> dict:
    d = dict(row)
    d["medical_needs"] = json.loads(d["medical_needs"] or "[]")
    d["behavior_tags"] = json.loads(d["behavior_tags"] or "[]")
    d["special_needs_flag"] = bool(d["special_needs_flag"])
    return d


async def create_applicant(applicant: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO applicants
               (id, name, email, phone, type, household_pets, housing_type, yard,
                experience_level, breed_restrictions_ok, medical_capability,
                application_date, status, preferred_language)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                applicant["id"], applicant["name"], applicant["email"],
                applicant.get("phone", ""), applicant["type"],
                json.dumps(applicant.get("household_pets", [])),
                applicant.get("housing_type", ""), int(applicant.get("yard", False)),
                applicant.get("experience_level", "first_time"),
                int(applicant.get("breed_restrictions_ok", True)),
                json.dumps(applicant.get("medical_capability", [])),
                applicant["application_date"], applicant.get("status", "active"),
                applicant.get("preferred_language", "en"),
            ),
        )
        await db.commit()


async def get_applicants(db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM applicants")
        out = []
        for r in rows:
            d = dict(r)
            d["household_pets"] = json.loads(d["household_pets"] or "[]")
            d["yard"] = bool(d["yard"])
            d["breed_restrictions_ok"] = bool(d["breed_restrictions_ok"])
            d["medical_capability"] = json.loads(d["medical_capability"] or "[]")
            out.append(d)
        return out


async def create_match(match: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO matches
               (id, animal_id, applicant_id, score, score_breakdown, veto_reason,
                status, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                match["id"], match["animal_id"], match["applicant_id"], match["score"],
                json.dumps(match.get("score_breakdown", {})), match.get("veto_reason"),
                match.get("status", "proposed"),
                match.get("created_at", datetime.utcnow().isoformat()),
            ),
        )
        await db.commit()


async def get_matches_for_animal(animal_id: str, db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM matches WHERE animal_id = ? ORDER BY score DESC", (animal_id,)
        )
        out = []
        for r in rows:
            d = dict(r)
            d["score_breakdown"] = json.loads(d["score_breakdown"] or "{}")
            out.append(d)
        return out


async def create_escalation(escalation: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO escalations
               (id, type, animal_id, details, status, created_at, resolved_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                escalation["id"], escalation["type"], escalation.get("animal_id"),
                escalation["details"], escalation.get("status", "open"),
                escalation.get("created_at", datetime.utcnow().isoformat()),
                escalation.get("resolved_at"),
            ),
        )
        await db.commit()


async def get_open_escalations(db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM escalations WHERE status = 'open'"
        )
        return [dict(r) for r in rows]


async def get_shelter_config(db_path: str = DB_PATH) -> dict | None:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM shelter_config WHERE id = 1") as cursor:
            row = await cursor.fetchone()
        return dict(row) if row else None


async def set_shelter_config(config: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO shelter_config
               (id, shelter_name, total_kennel_capacity, occupancy_threshold_pct, current_occupancy)
               VALUES (1, ?, ?, ?, ?)""",
            (
                config["shelter_name"], config["total_kennel_capacity"],
                config["occupancy_threshold_pct"], config.get("current_occupancy", 0),
            ),
        )
        await db.commit()


async def get_all_matches(db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM matches ORDER BY score DESC"
        )
        out = []
        for r in rows:
            d = dict(r)
            d["score_breakdown"] = json.loads(d["score_breakdown"] or "{}")
            out.append(d)
        return out


async def get_outreach(db_path: str = DB_PATH) -> list[dict]:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM outreach_log")
        return [dict(r) for r in rows]


async def create_outreach(msg: dict, db_path: str = DB_PATH) -> None:
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            """INSERT OR REPLACE INTO outreach_log
               (id, match_id, channel, subject, body, status, sent_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                msg["id"], msg["match_id"], msg.get("channel", "email"),
                msg.get("subject", ""), msg.get("body", ""),
                msg.get("status", "draft"), msg.get("sent_at"),
            ),
        )
        await db.commit()


async def update_outreach_status(msg_id: str, status: str, db_path: str = DB_PATH) -> dict | None:
    async with aiosqlite.connect(db_path) as db:
        db.row_factory = aiosqlite.Row
        await db.execute(
            "UPDATE outreach_log SET status = ? WHERE id = ?",
            (status, msg_id),
        )
        await db.commit()
        async with db.execute("SELECT * FROM outreach_log WHERE id = ?", (msg_id,)) as cursor:
            row = await cursor.fetchone()
        return dict(row) if row else None
