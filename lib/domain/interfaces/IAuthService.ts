/**
 * Service Interface - Service Layer Pattern
 * Defines the contract for authentication business logic
 */
import { User } from '../entities/User';

export interface IAuthService {
  login(email: string, password: string): Promise<LoginResult>;
  signup(email: string, password: string, name?: string): Promise<SignupResult>;
  logout(token: string): Promise<void>;
  validateSession(token: string): Promise<User | null>;
  refreshSession(userId: string): Promise<string>;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface SignupResult {
  user: User;
  token: string;
}

