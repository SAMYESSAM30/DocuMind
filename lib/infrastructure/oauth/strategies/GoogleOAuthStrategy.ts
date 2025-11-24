/**
 * Google OAuth Strategy - Strategy Pattern
 * Implements OAuth authentication for Google
 */
import { IOAuthStrategy, OAuthUserInfo, OAuthAuthorizationUrl, OAuthCallbackResult } from '@/lib/domain/interfaces/IOAuthStrategy';
import { OAuthTokenExchange } from '../OAuthTokenExchange';
import { OAuthUserInfoFetcher } from '../OAuthUserInfoFetcher';
import { OAuthUserService } from '../OAuthUserService';

const GOOGLE_CONFIG = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
  scopes: 'openid email profile',
};

export class GoogleOAuthStrategy implements IOAuthStrategy {
  constructor(
    private tokenExchange: OAuthTokenExchange,
    private userInfoFetcher: OAuthUserInfoFetcher,
    private userService: OAuthUserService
  ) {}

  async getAuthorizationUrl(redirectUri: string): Promise<OAuthAuthorizationUrl> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullRedirectUri = `${baseUrl}${redirectUri}`;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID is not configured');
    }

    const { state, codeVerifier, codeChallenge } = await this.generatePKCE();

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: fullRedirectUri,
      response_type: 'code',
      scope: GOOGLE_CONFIG.scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const url = `${GOOGLE_CONFIG.authorizationEndpoint}?${params.toString()}`;

    return { url, state, codeVerifier };
  }

  async handleCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthCallbackResult> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;

    const { accessToken } = await this.tokenExchange.exchange(
      'google',
      code,
      redirectUri,
      codeVerifier
    );

    const userInfo = await this.getUserInfo(accessToken);
    return await this.userService.findOrCreateUser('google', userInfo, accessToken);
  }

  async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    const userInfo = await this.userInfoFetcher.fetch(
      GOOGLE_CONFIG.userInfoEndpoint,
      accessToken
    );

    return {
      id: userInfo.id || userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || null,
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

