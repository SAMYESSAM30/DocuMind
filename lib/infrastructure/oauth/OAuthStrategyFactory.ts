/**
 * OAuth Strategy Factory - Factory Pattern
 * Creates appropriate OAuth strategy instances
 */
import { OAuthProvider, IOAuthStrategy } from '@/lib/domain/interfaces/IOAuthStrategy';
import { GoogleOAuthStrategy } from './strategies/GoogleOAuthStrategy';
import { GitHubOAuthStrategy } from './strategies/GitHubOAuthStrategy';
import { AppleOAuthStrategy } from './strategies/AppleOAuthStrategy';
import { OAuthTokenExchange } from './OAuthTokenExchange';
import { OAuthUserInfoFetcher } from './OAuthUserInfoFetcher';
import { OAuthUserService } from './OAuthUserService';

/**
 * Singleton Factory - Ensures single instance of dependencies
 */
export class OAuthStrategyFactory {
  private static instance: OAuthStrategyFactory;
  private tokenExchange: OAuthTokenExchange;
  private userInfoFetcher: OAuthUserInfoFetcher;
  private userService: OAuthUserService;

  private constructor() {
    this.tokenExchange = new OAuthTokenExchange();
    this.userInfoFetcher = new OAuthUserInfoFetcher();
    this.userService = new OAuthUserService();
  }

  static getInstance(): OAuthStrategyFactory {
    if (!OAuthStrategyFactory.instance) {
      OAuthStrategyFactory.instance = new OAuthStrategyFactory();
    }
    return OAuthStrategyFactory.instance;
  }

  create(provider: OAuthProvider): IOAuthStrategy {
    switch (provider) {
      case 'google':
        return new GoogleOAuthStrategy(
          this.tokenExchange,
          this.userInfoFetcher,
          this.userService
        );
      case 'github':
        return new GitHubOAuthStrategy(
          this.tokenExchange,
          this.userInfoFetcher,
          this.userService
        );
      case 'apple':
        return new AppleOAuthStrategy(
          this.tokenExchange,
          this.userService
        );
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  // Static convenience method
  static create(provider: OAuthProvider): IOAuthStrategy {
    return OAuthStrategyFactory.getInstance().create(provider);
  }
}

