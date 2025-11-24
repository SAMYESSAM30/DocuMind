/**
 * Repository Interface - Repository Pattern
 * Defines the contract for session data access operations
 */
import { Session } from '../entities/Session';

export interface ISessionRepository {
  create(sessionData: CreateSessionData): Promise<Session>;
  findByToken(token: string): Promise<Session | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}

export interface CreateSessionData {
  userId: string;
  token: string;
  expiresAt: Date;
}

