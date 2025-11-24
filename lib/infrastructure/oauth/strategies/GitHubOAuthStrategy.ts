/**
 * GitHub OAuth Strategy - Strategy Pattern
 * Implements OAuth authentication for GitHub
 */
import { IOAuthStrategy, OAuthUserInfo, OAuthAuthorizationUrl, OAuthCallbackResult } from '@/lib/domain/interfaces/IOAuthStrategy';
import { OAuthTokenExchange } from '../OAuthTokenExchange';
import { OAuthUserInfoFetcher } from '../OAuthUserInfoFetcher';
import { OAuthUserService } from '../OAuthUserService';

const GITHUB_CONFIG = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  userInfoEndpoint: 'https://api.github.com/user',
  emailEndpoint: 'https://api.github.com/user/emails',
  scopes: 'user:email',
};

export class GitHubOAuthStrategy implements IOAuthStrategy {
  constructor(
    private tokenExchange: OAuthTokenExchange,
    private userInfoFetcher: OAuthUserInfoFetcher,
    private userService: OAuthUserService
  ) {}

  async getAuthorizationUrl(redirectUri: string): Promise<OAuthAuthorizationUrl> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullRedirectUri = `${baseUrl}${redirectUri}`;
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
      throw new Error('GITHUB_CLIENT_ID is not configured');
    }

    const { state, codeVerifier, codeChallenge } = await this.generatePKCE();

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: fullRedirectUri,
      response_type: 'code',
      scope: GITHUB_CONFIG.scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const url = `${GITHUB_CONFIG.authorizationEndpoint}?${params.toString()}`;

    return { url, state, codeVerifier };
  }

  async handleCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthCallbackResult> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/oauth/github/callback`;

    const { accessToken } = await this.tokenExchange.exchange(
      'github',
      code,
      redirectUri,
      codeVerifier
    );

    const userInfo = await this.getUserInfo(accessToken);
    return await this.userService.findOrCreateUser('github', userInfo, accessToken);
  }

  async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    // Fetch user info
    const userInfo = await this.userInfoFetcher.fetch(
      GITHUB_CONFIG.userInfoEndpoint,
      accessToken
    );

    // Fetch email separately (GitHub specific)
    let email = userInfo.email;
    try {
      const emails = await this.userInfoFetcher.fetch(
        GITHUB_CONFIG.emailEndpoint,
        accessToken
      );
      const primaryEmail = Array.isArray(emails) 
        ? emails.find((e: any) => e.primary) || emails[0]
        : null;
      email = primaryEmail?.email || email || `${userInfo.login}@github.local`;
    } catch (error) {
      // If email fetch fails, use login as fallback
      email = email || `${userInfo.login}@github.local`;
    }

    return {
      id: String(userInfo.id),
      email,
      name: userInfo.name || userInfo.login || null,
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

