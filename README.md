# PawsMatch (ShelterOps) 🐾

**An AI-Powered Matchmaking and Operations Agent for Animal Rescues**

Built for the **AWS "Agents for Humans" Hackathon** — *Good Neighbor Agents Track*.

---

## 📖 The Vision

Animal shelters and rescues are consistently under-resourced, relying heavily on volunteers and manual processes to match animals with the perfect foster or forever home. **PawsMatch** reimagines this process by introducing an intelligent, autonomous agent that orchestrates the heavy lifting of rescue operations. 

By leveraging the **Strands Agents SDK**, PawsMatch evaluates compatibility, handles multi-language outreach, proactively flags capacity escalations, and gives shelter operators a conversational interface to interact with their entire database. 

It’s not just a dashboard—it’s an active operational partner.

---

## ✨ Key Features

- **🧠 Autonomous Match Engine**: Uses intelligent scoring models to evaluate hard vetoes (e.g., "no cats") alongside soft preferences (e.g., energy levels, yard size) to pair animals with the perfect applicants.
- **💬 Conversational Operations Agent**: A Strands-powered AI assistant that has access to all shelter data. Ask it *"Who is the best match for Maple?"* or *"Draft an outreach message for Max"* and watch it use its tools to accomplish the task.
- **🌐 Accessible Multi-Lingual Intake**: Integrates with Sarvam AI to translate applicant communications into localized Indic languages, ensuring accessibility for diverse communities (such as via WhatsApp intake).
- **🚨 Smart Escalation Monitoring**: Automatically alerts staff when kennel occupancy hits critical thresholds (e.g., >90%) or when animals have been waiting too long without a match.
- **🎨 Digital Wellness Dashboard**: A premium, responsive React SPA designed with a calming "digital wellness" aesthetic to reduce cognitive load on stressed shelter workers.

---

## 🛠️ Architecture & Tech Stack

PawsMatch is built using a modern decoupled architecture:

### **Backend Core (Python & FastAPI)**
- **Framework:** FastAPI for rapid, asynchronous API development.
- **Agent Orchestration:** [Strands Agents SDK](https://github.com/awslabs/strands) for multi-tool agentic workflows.
- **Core Reasoning Model:** **Featherless (MiniMax-M2.5)** — chosen specifically for its strong tool-calling reliability.
- **Translation Model:** **Sarvam AI (sarvam-105b)** — handles localized Indic language translations independently of the core reasoning loop.
- **Database:** SQLite for lightweight, reliable persistence.

### **Frontend App (React & Vite)**
- **Framework:** React 18, bundled with Vite for lightning-fast HMR.
- **Styling:** Vanilla CSS with a highly custom, polished design system (glassmorphism, micro-animations, cinematic hero layouts).
- **Icons:** Lucide React.

---

## 🚀 Getting Started

Follow these instructions to run the entire stack locally. 

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm
- API Keys for Featherless and Sarvam AI.

### 1. Backend Setup (FastAPI & Agent)

Open a terminal and navigate to the project root:

```bash
# 1. Create and activate a virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# 2. Install Python dependencies
pip install -e .

# 3. Configure environment variables
cp .env.example .env
# Open .env and fill in your FEATHERLESS_API_KEY and SARVAM_API_KEY

# 4. Seed the database with mock animals, applicants, and shelter config
python -m app.seed_data

# 5. Start the backend server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (React Dashboard)

Open a **second** terminal, ensure you are in the project root, and run:

```bash
# 1. Install Node dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

---

## 🧪 Testing the Agent Manually (Smoke Test)

If you want to verify that the Strands agent is properly calling tools without booting the whole UI, you can run the built-in smoke test script from your activated Python environment:

```bash
python -m app.agent.pawsmatch_agent
```
*Note: Frontier-sized models on Featherless may limit you to 1 concurrent request on free plans. Ensure no other agent calls are running when testing.*

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---
*Built with ❤️ for animals everywhere.*
