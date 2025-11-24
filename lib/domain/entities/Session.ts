/**
 * Domain Entity - Domain-Driven Design
 * Represents the Session entity in the domain layer
 */
import { User } from './User';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  user?: User;
}

export function isSessionExpired(session: Session): boolean {
  return session.expiresAt < new Date();
}

