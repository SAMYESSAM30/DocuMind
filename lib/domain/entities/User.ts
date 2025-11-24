/**
 * Domain Entity - Domain-Driven Design
 * Represents the User entity in the domain layer
 */
export interface User {
  id: string;
  email: string;
  password?: string | null;
  name?: string | null;
  plan: string;
  aiCallsUsed: number;
  aiCallsLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  aiCallsUsed: number;
  aiCallsLimit: number;
}

/**
 * Maps User entity to DTO (Data Transfer Object)
 */
export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name || null,
    plan: user.plan,
    aiCallsUsed: user.aiCallsUsed,
    aiCallsLimit: user.aiCallsLimit,
  };
}

