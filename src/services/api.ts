import {
  Animal,
  Applicant,
  DashboardStats,
  Escalation,
  Match,
  MatchEngineResult,
  OutreachMessage,
} from '../types';

/**
 * All API calls hit the real FastAPI backend via Vite's /api proxy.
 * There are NO mock fallbacks — if the backend is down, the error propagates
 * to the UI so the user knows to check the backend connection.
 */

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/dashboard/stats');
  if (!res.ok) throw new Error(`Dashboard stats failed: ${res.status}`);
  return res.json();
}

export async function fetchAnimals(): Promise<Animal[]> {
  const res = await fetch('/api/animals');
  if (!res.ok) throw new Error(`Animals fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchApplicants(): Promise<Applicant[]> {
  const res = await fetch('/api/applicants');
  if (!res.ok) throw new Error(`Applicants fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch('/api/matches');
  if (!res.ok) throw new Error(`Matches fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchOutreach(): Promise<OutreachMessage[]> {
  const res = await fetch('/api/outreach');
  if (!res.ok) throw new Error(`Outreach fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchEscalations(): Promise<Escalation[]> {
  const res = await fetch('/api/escalations');
  if (!res.ok) throw new Error(`Escalations fetch failed: ${res.status}`);
  return res.json();
}

export async function runMatchEngine(): Promise<MatchEngineResult> {
  const res = await fetch('/api/match-engine/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Match engine failed: ${res.status}`);
  return res.json();
}

export async function updateOutreachStatus(id: string | number, status: 'sent' | 'draft'): Promise<OutreachMessage> {
  const res = await fetch(`/api/outreach/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Outreach update failed: ${res.status}`);
  return res.json();
}

export async function sendAgentChat(message: string): Promise<string> {
  const res = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    // Return a clear error message instead of a fake response
    return 'Agent unavailable — check backend connection.';
  }
  const data = await res.json();
  return data.response;
}
