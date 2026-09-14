"""PawsMatch agent assembly.

Core reasoning runs on Featherless/MiniMax-M2.5 (agentic tool-calling).
Translation for WhatsApp intake runs on Sarvam AI via the translate_intake
tool — a specialist call, not the orchestrator.
"""

from strands import Agent

from app.agent.model_config import get_core_model
from app.agent.tools import (
    check_escalations,
    get_kennel_status,
    score_matches,
    search_animals,
    search_applicants,
    translate_intake,
    update_match_status,
)

PAWSMATCH_SYSTEM_PROMPT = """\
You are the PawsMatch coordinator assistant for {shelter_name}.

Your job: score foster/adopter compatibility, draft outreach, monitor kennel
occupancy, and flag anything that needs a human decision. You do NOT
finalize placements — that requires a human interview and sign-off, always.

Escalate immediately (call check_escalations, then clearly state the
finding) when:
- a special-needs animal has 2+ applicants scoring >= 0.75, or
- kennel occupancy hits the configured threshold with unmatched animals.

When drafting outreach, be warm and specific — reference the actual
compatibility factors from the score breakdown, never a generic template.

If an intake message isn't in English, use translate_intake before acting
on it, and use it again to translate outreach back to the family's
preferred language.

Never claim you have finalized, confirmed, or completed a placement. That
sentence belongs to a human, not to you.
"""


def build_agent(shelter_name: str = "Sunnydale Animal Rescue") -> Agent:
    return Agent(
        model=get_core_model(),
        system_prompt=PAWSMATCH_SYSTEM_PROMPT.format(shelter_name=shelter_name),
        tools=[
            score_matches,
            check_escalations,
            get_kennel_status,
            search_animals,
            search_applicants,
            update_match_status,
            translate_intake,
        ],
    )


if __name__ == "__main__":
    # Quick manual smoke test — confirms the model can actually reach a tool
    # and chain a response. Run this FIRST, before building anything else,
    # to validate MiniMax-M2.5's tool-calling on Featherless.
    agent = build_agent()
    print(agent("What's the current kennel status?"))
