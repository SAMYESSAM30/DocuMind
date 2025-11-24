/**
 * Service Implementation - Service Layer Pattern
 * Contains business logic for authentication operations
 */
import { IAuthService, LoginResult, SignupResult } from '@/lib/domain/interfaces/IAuthService';
import { IUserRepository } from '@/lib/domain/interfaces/IUserRepository';
import { ISessionRepository } from '@/lib/domain/interfaces/ISessionRepository';
import { hashPassword, verifyPassword } from '@/lib/infrastructure/security/PasswordHasher';
import { SessionTokenGenerator } from '@/lib/infrastructure/security/SessionTokenGenerator';
import { User } from '@/lib/domain/entities/User';
import { Session } from '@/lib/domain/entities/Session';
import { isSessionExpired } from '@/lib/domain/entities/Session';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository,
    private sessionTokenGenerator: SessionTokenGenerator
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user has a password (OAuth users don't have passwords)
    if (!user.password) {
      throw new Error('This account was created with OAuth. Please sign in with your OAuth provider.');
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const token = await this.createSessionToken(user.id);

    return { user, token };
  }

  async signup(email: string, password: string, name?: string): Promise<SignupResult> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      plan: 'FREE',
      aiCallsLimit: 5,
    });

    // Create session
    const token = await this.createSessionToken(user.id);

    return { user, token };
  }

  async logout(token: string): Promise<void> {
    await this.sessionRepository.deleteByToken(token);
  }

  async validateSession(token: string): Promise<User | null> {
    const session = await this.sessionRepository.findByToken(token);
    
    if (!session) {
      return null;
    }

    if (isSessionExpired(session)) {
      await this.sessionRepository.deleteByToken(token);
      return null;
    }

    return session.user as User || null;
  }

  async refreshSession(userId: string): Promise<string> {
    // Delete old sessions for this user
    await this.sessionRepository.deleteByUserId(userId);
    
    // Create new session
    return await this.createSessionToken(userId);
  }

  private async createSessionToken(userId: string): Promise<string> {
    const token = this.sessionTokenGenerator.generate();
    const expiresAt = this.sessionTokenGenerator.getExpirationDate();

    await this.sessionRepository.create({
      userId,
      token,
      expiresAt,
    });

    return token;
  }
}

