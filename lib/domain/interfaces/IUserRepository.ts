/**
 * Repository Interface - Repository Pattern
 * Defines the contract for user data access operations
 */
import { User } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface CreateUserData {
  email: string;
  password?: string | null;
  name?: string | null;
  plan?: string;
  aiCallsLimit?: number;
}

