// src/types/api.ts

import { AnalysisCondition, UrgencyLevel, AnalysisResult } from './database';

// POST /api/analyze
export interface AnalyzeRequest {
  symptom_text: string;           // min: 10, max: 1000 karakter
}

export interface AnalyzeResponse {
  conditions: AnalysisCondition[];
  urgency: UrgencyLevel;
  recommendation: string;
  disclaimer: string;
}

// GET /api/history (dengan paginasi)
export interface HistoryListResponse {
  data: AnalysisResult[];
  total: number;
  page: number;
  per_page: number;              // default: 10
  has_more: boolean;
}

// POST /api/share
export interface ShareRequest {
  analysis_id: string;
}

export interface ShareResponse {
  token: string;
  share_url: string;
  expired_at: string | null;
}

// GET /api/admin/stats
export interface AdminStats {
  total_users: number;
  total_analyses: number;
  total_tokens_used: number;     // estimasi dari token_count per analisis
  avg_rating_score: number;      // 0-1 (rasio up terhadap total rating)
  urgency_distribution: {
    RINGAN: number;
    SEDANG: number;
    DARURAT: number;
  };
}

// Error Response (standard untuk semua endpoint)
export interface ApiError {
  error: string;                 // Pesan error dalam Bahasa Indonesia
  code: string;                  // Machine-readable error code
  details?: unknown;             // Detail tambahan (opsional)
}