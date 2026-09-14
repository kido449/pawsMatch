export type TabKey = 'dashboard' | 'animals' | 'applicants' | 'matches' | 'outreach' | 'escalations';

export interface DashboardStats {
  occupancy_pct: number;
  kennels_used: number;
  kennels_total: number;
  available_animals: number;
  pending_animals: number;
  placed_animals: number;
  active_applicants: number;
  open_escalations: number;
}

export interface Animal {
  id: string | number;
  name: string;
  species: string;
  breed: string;
  age: string | number;
  photo_url: string;
  status: 'available' | 'pending' | 'placed' | 'medical_hold' | string;
  special_needs_flag: boolean;
  behavior_tags: string[];
  size?: string;
  intake_date?: string;
}

export interface Applicant {
  id: string | number;
  name: string;
  type: 'foster' | 'adopter' | string;
  photo_url: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Experienced' | string;
  housing_type: string;
  application_date: string;
  has_yard?: boolean;
  notes?: string;
  preferred_size?: string;
}

export type MatchStatus = 'proposed' | 'contacted' | 'interested' | 'declined' | 'placed';

export interface ScoreBreakdown {
  housing?: number;
  experience?: number;
  lifestyle?: number;
  species_fit?: number;
  notes?: string;
  [key: string]: any;
}

export interface Match {
  id: string | number;
  animal_id: string | number;
  applicant_id: string | number;
  score: number;
  score_breakdown?: ScoreBreakdown;
  status: MatchStatus;
}

export interface OutreachMessage {
  id: string | number;
  match_id: string | number;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | string;
}

export interface Escalation {
  id: string | number;
  type: string;
  animal_id?: string | number | null;
  details: string;
  status: 'open' | 'investigating' | 'resolved' | string;
  created_at: string;
}

export interface MatchEngineResult {
  matches_created: number;
  escalations_triggered: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
