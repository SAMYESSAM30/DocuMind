/**
 * Session Token Generator - Single Responsibility Principle
 * Handles session token generation and expiration
 */
import { randomBytes } from 'crypto';

const SESSION_DURATION_HOURS = 4;

export class SessionTokenGenerator {
  generate(): string {
    return randomBytes(32).toString('hex');
  }

  getExpirationDate(): Date {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
    return expiresAt;
  }
}

