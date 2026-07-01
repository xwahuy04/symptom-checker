// src/types/database.ts

import { UrgencyLevel, UserRole, AuthProvider, RatingValue, Gender } from './domain';

export interface User {
  id: string;                    // UUID
  email: string;
  auth_provider: AuthProvider;
  role: UserRole;
  created_at: string;            // ISO 8601
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;               // FK → users.id
  usia: number;                  // 0-120
  jenis_kelamin: Gender;
  created_at: string;
}

export interface AnalysisCondition {
  name: string;                  // Nama kondisi (Bahasa Indonesia)
  confidence: number;            // 0-100 (persentase)
}

export interface AnalysisResult {
  id: string;
  user_id: string;
  symptom_text: string;
  conditions: AnalysisCondition[];
  urgency: UrgencyLevel;
  recommendation: string;
  disclaimer_shown: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  analysis_id: string;
  user_id: string;
  rating: RatingValue;
  created_at: string;
}

export interface ShareLink {
  id: string;
  analysis_id: string;
  token: string;
  expired_at: string | null;
  created_at: string;
}

export type { UrgencyLevel };
