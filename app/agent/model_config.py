"""Model provider configuration.

Two models, used for what each is actually good at:

- Featherless (MiniMax-M2.5): the PawsMatch agent's core reasoning loop.
  Chosen specifically for strong agentic tool-calling — this agent calls
  7 tools (score_matches, draft_outreach, check_escalations, etc.) and
  needs to chain them reliably.
- Sarvam AI: Indic-language translation for the WhatsApp intake
  accessibility feature (non-English-speaking adopter/foster families).
  Not used for agent reasoning — Sarvam is a specialist tool call, not
  the orchestrator.

Both are OpenAI-compatible endpoints, so both use Strands' OpenAIModel
provider — only base_url/api_key/model_id differ.
"""

import os
from dotenv import load_dotenv

from openai import OpenAI
from strands.models.openai import OpenAIModel

load_dotenv()


def get_core_model() -> OpenAIModel:
    """The agent's main reasoning model.

    Configured to use Google Gemini via its OpenAI-compatible endpoint.
    """
    return OpenAIModel(
        client_args={
            "api_key": os.environ["GEMINI_API_KEY"],
            "base_url": os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/"),
        },
        model_id=os.getenv("GEMINI_MODEL_ID", "gemini-pro-latest"),
        params={"max_tokens": 2048, "temperature": 0.4},
    )


def get_sarvam_client() -> OpenAI:
    """Plain OpenAI-compatible client for Sarvam AI. Used directly (not via
    Strands' agent-loop model class) since it only ever does a single
    one-off completion inside the translate_intake tool, not multi-step
    tool-calling."""
    return OpenAI(
        api_key=os.environ["SARVAM_API_KEY"],
        base_url=os.getenv("SARVAM_BASE_URL", "https://api.sarvam.ai/v1"),
    )
