/**
 * Dependency Injection Container - Dependency Injection Pattern
 * Centralized service instantiation and dependency management
 */
import { IUserRepository } from '@/lib/domain/interfaces/IUserRepository';
import { ISessionRepository } from '@/lib/domain/interfaces/ISessionRepository';
import { IAuthService } from '@/lib/domain/interfaces/IAuthService';
import { UserRepository } from '@/lib/infrastructure/repositories/UserRepository';
import { SessionRepository } from '@/lib/infrastructure/repositories/SessionRepository';
import { AuthService } from '@/lib/application/services/AuthService';
import { SessionTokenGenerator } from '@/lib/infrastructure/security/SessionTokenGenerator';

/**
 * Service Container - Singleton Pattern
 * Provides centralized access to service instances
 */
class ServiceContainer {
  private static instance: ServiceContainer;
  
  private _userRepository: IUserRepository;
  private _sessionRepository: ISessionRepository;
  private _authService: IAuthService;
  private _sessionTokenGenerator: SessionTokenGenerator;

  private constructor() {
    // Initialize repositories
    this._userRepository = new UserRepository();
    this._sessionRepository = new SessionRepository();
    this._sessionTokenGenerator = new SessionTokenGenerator();

    // Initialize services with dependencies
    this._authService = new AuthService(
      this._userRepository,
      this._sessionRepository,
      this._sessionTokenGenerator
    );
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get userRepository(): IUserRepository {
    return this._userRepository;
  }

  get sessionRepository(): ISessionRepository {
    return this._sessionRepository;
  }

  get authService(): IAuthService {
    return this._authService;
  }

  get sessionTokenGenerator(): SessionTokenGenerator {
    return this._sessionTokenGenerator;
  }
}

export const serviceContainer = ServiceContainer.getInstance();

