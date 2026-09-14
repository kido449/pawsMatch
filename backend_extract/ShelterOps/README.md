# PawsMatch (ShelterOps)

AI agent for foster/adopter matching — AWS "Agents for Humans" hackathon,
Good Neighbor Agents track. Built on the Strands Agents SDK.

Full concept and rationale: see the PRD. This repo is the backend core —
data model, scoring engine, escalation logic, and the agent + tools. The
FastAPI routes and dashboard frontend are the next layer to build on top.

## Two models, used for what each is good at

- **Featherless (MiniMax-M2.5)** — the agent's core reasoning loop. Picked
  for strong agentic tool-calling, since this agent chains through 7 tools.
- **Sarvam AI** — Indic-language translation for the WhatsApp intake
  accessibility feature. Called directly by `translate_intake`, not part of
  the agent's orchestration.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e .
cp .env.example .env              # fill in FEATHERLESS_API_KEY and SARVAM_API_KEY
python -m app.seed_data           # seeds animals/applicants + shelter config
python -m app.agent.pawsmatch_agent   # smoke test — do this FIRST
```

That last command is deliberate: it's the smallest possible check that
MiniMax-M2.5 can actually call a tool and return a sane answer, before any
more code gets built on top of it. If it doesn't behave, swap
`get_core_model()` in `app/agent/model_config.py` back to a proven provider
(Anthropic direct) rather than debugging tool-calling and the rest of the
app at the same time.

## What's scaffolded vs. still to build

**Done:**
- Data models (`app/models.py`) — matches the PRD's animal/applicant/match schema
- SQLite persistence (`app/database.py`)
- Scoring engine (`app/scoring.py`) — hard vetoes + explainable weighted score
- Agent + 6 tools (`app/agent/`) — scoring, escalation, kennel status, search, translation
- Seed data engineered to trigger both escalation rules

**Not yet built (next steps):**
- `draft_outreach` as a standalone tool — for the scaffold, drafting outreach
  is just something you can ask the agent directly ("draft outreach for
  Maple's top match"); formalize into a dedicated tool once the FastAPI
  layer needs to call it on a schedule
- FastAPI routes (`app/api/`) exposing all of this over HTTP
- The web dashboard (full SPA — match board, occupancy gauge, agent chat)
- `update_match_status` currently returns a stub — wire it to
  `app/database.py`'s matches table once the dashboard's "confirm placement"
  button exists, since that's the one action that must always be a human click

## Before you run this

- **Verify `MiniMax-M2.5`'s exact model ID** on featherless.ai/models — the
  one in `.env.example` is a best guess at their catalog naming convention,
  not confirmed against the live catalog.
- **Check MiniMax-M2.5's size tier** against Featherless's concurrency table
  — frontier-sized models cap you at 1 concurrent request on the free plan.
- **A LICENSE file (MIT) is included** — required for the hackathon
  submission's "About" section.
