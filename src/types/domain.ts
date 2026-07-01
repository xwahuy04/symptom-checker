// src/types/domain.ts

export type UrgencyLevel = 'RINGAN' | 'SEDANG' | 'DARURAT';
export type UserRole = 'user' | 'admin';
export type AuthProvider = 'email' | 'google';
export type RatingValue = 'up' | 'down';
export type NotificationStatus = 'pending' | 'sent' | 'cancelled';
export type NotificationChannel = 'email' | 'push' | 'whatsapp';
export type Gender = 'laki-laki' | 'perempuan' | 'lainnya';