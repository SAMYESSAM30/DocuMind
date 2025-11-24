/**
 * Strategy Interface - Strategy Pattern
 * Defines the contract for OAuth authentication strategies
 */
import { User } from '../entities/User';

export type OAuthProvider = 'google' | 'github' | 'apple';

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string | null;
}

export interface IOAuthStrategy {
  getAuthorizationUrl(redirectUri: string): Promise<OAuthAuthorizationUrl>;
  handleCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthCallbackResult>;
  getUserInfo(accessToken: string, idToken?: string): Promise<OAuthUserInfo>;
}

export interface OAuthAuthorizationUrl {
  url: string;
  state: string;
  codeVerifier?: string;
}

export interface OAuthCallbackResult {
  user: User;
  token: string;
}

