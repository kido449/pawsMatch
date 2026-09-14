import asyncio
import uuid
from datetime import datetime, timezone

import pandas as pd
import streamlit as st

# Import the existing backend services
from app import database as db
from app.scoring import score_all_matches
from app.agent.pawsmatch_agent import build_agent
from app.agent.tools import check_escalations

st.set_page_config(page_title="PawsMatch ShelterOps", layout="wide")

# Helper to run async code synchronously for Streamlit
def run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)

# Ensure DB is initialized
run_async(db.init_db())

st.title("🐾 PawsMatch — ShelterOps")

tabs = st.tabs(["Overview", "Roster", "Applicants", "Match Board", "Agent Chat"])

with tabs[0]:
    st.header("Dashboard Overview")
    
    animals = run_async(db.get_animals())
    applicants = run_async(db.get_applicants())
    escalations = run_async(db.get_open_escalations())
    config = run_async(db.get_shelter_config())
    
    capacity = config.get("total_kennel_capacity", 20) if config else 20
    occupancy = config.get("current_occupancy", 0) if config else 0
    available_animals = [a for a in animals if a.get("status") == "available"]
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Kennels Used", f"{occupancy} / {capacity}")
    col2.metric("Available Animals", len(available_animals))
    col3.metric("Active Applicants", len([a for a in applicants if a.get("status") == "active"]))
    col4.metric("Open Escalations", len(escalations))
    
    st.markdown("---")
    st.subheader("Run Match Engine")
    st.write("Score every available animal against all active applicants using the intelligent scoring engine.")
    
    if st.button("Run Compatibility Engine", type="primary"):
        with st.spinner("Processing match algorithms..."):
            total_matches = 0
            for animal in available_animals:
                ranked = score_all_matches(animal, applicants)
                for r in ranked:
                    if r["score"] > 0:
                        run_async(db.create_match({
                            "id": str(uuid.uuid4()),
                            "animal_id": animal["id"],
                            "applicant_id": r["applicant_id"],
                            "score": r["score"],
                            "score_breakdown": r["breakdown"],
                            "veto_reason": r.get("veto_reason"),
                            "status": "proposed",
                            "created_at": datetime.now(timezone.utc).isoformat(),
                        }))
                        total_matches += 1
            
            # Run escalations checks (it's sync)
            new_escalations = check_escalations()
            st.success(f"Generated {total_matches} new proposed matches!")
            if new_escalations:
                st.warning(f"Triggered {len(new_escalations)} new escalations.")
            st.rerun()

with tabs[1]:
    st.header("Animal Roster")
    animals_df = pd.DataFrame(run_async(db.get_animals()))
    if not animals_df.empty:
        st.dataframe(animals_df, use_container_width=True)
    else:
        st.info("No animals found.")

with tabs[2]:
    st.header("Applicants")
    applicants_df = pd.DataFrame(run_async(db.get_applicants()))
    if not applicants_df.empty:
        st.dataframe(applicants_df, use_container_width=True)
    else:
        st.info("No applicants found.")

with tabs[3]:
    st.header("Match Board")
    matches_df = pd.DataFrame(run_async(db.get_all_matches()))
    if not matches_df.empty:
        st.dataframe(matches_df, use_container_width=True)
    else:
        st.info("No matches generated yet.")

with tabs[4]:
    st.header("Strands Agent Chat")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask the agent... (e.g. 'what's the score breakdown for Maple?')"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
            
        with st.chat_message("assistant"):
            with st.spinner("Agent is reasoning..."):
                try:
                    agent = build_agent()
                    # Call agent synchronously
                    result = agent(prompt)
                    response_text = str(result)
                    st.markdown(response_text)
                    st.session_state.messages.append({"role": "assistant", "content": response_text})
                except Exception as e:
                    st.error(f"Agent error: {e}")
