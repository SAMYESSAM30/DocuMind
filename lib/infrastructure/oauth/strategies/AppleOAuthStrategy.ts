/**
 * Apple OAuth Strategy - Strategy Pattern
 * Implements OAuth authentication for Apple
 */
import * as jose from 'jose';
import { IOAuthStrategy, OAuthUserInfo, OAuthAuthorizationUrl, OAuthCallbackResult } from '@/lib/domain/interfaces/IOAuthStrategy';
import { OAuthTokenExchange } from '../OAuthTokenExchange';
import { OAuthUserService } from '../OAuthUserService';

const APPLE_CONFIG = {
  authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
  tokenEndpoint: 'https://appleid.apple.com/auth/token',
  scopes: 'name email',
};

export class AppleOAuthStrategy implements IOAuthStrategy {
  constructor(
    private tokenExchange: OAuthTokenExchange,
    private userService: OAuthUserService
  ) {}

  async getAuthorizationUrl(redirectUri: string): Promise<OAuthAuthorizationUrl> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullRedirectUri = `${baseUrl}${redirectUri}`;
    const clientId = process.env.APPLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('APPLE_CLIENT_ID is not configured');
    }

    const { state, codeVerifier, codeChallenge } = await this.generatePKCE();

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: fullRedirectUri,
      response_type: 'code',
      scope: APPLE_CONFIG.scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      response_mode: 'form_post', // Apple requires this
    });

    const url = `${APPLE_CONFIG.authorizationEndpoint}?${params.toString()}`;

    return { url, state, codeVerifier };
  }

  async handleCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthCallbackResult> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/oauth/apple/callback`;

    const { accessToken, idToken } = await this.tokenExchange.exchange(
      'apple',
      code,
      redirectUri,
      codeVerifier
    );

    const userInfo = await this.getUserInfo(accessToken, idToken);
    return await this.userService.findOrCreateUser('apple', userInfo, accessToken);
  }

  async getUserInfo(accessToken: string, idToken?: string): Promise<OAuthUserInfo> {
    if (!idToken) {
      throw new Error('ID token is required for Apple OAuth');
    }

    // Apple uses ID token for user info
    const decoded = jose.decodeJwt(idToken);

    return {
      id: decoded.sub as string,
      email: decoded.email as string,
      name: (decoded.name as any) || null,
    };
  }

  private async generatePKCE(): Promise<{ state: string; codeVerifier: string; codeChallenge: string }> {
    const { generateState, generateCodeVerifier, generateCodeChallenge } = await import('@/lib/oauth');
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    return { state, codeVerifier, codeChallenge };
  }
}

