import { prisma } from './db';
import { createSession } from './auth';
import { randomBytes } from 'crypto';
import * as jose from 'jose';

// OAuth providers configuration
export const oauthProviders = {
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: 'openid email profile',
  },
  github: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
    emailEndpoint: 'https://api.github.com/user/emails',
    scopes: 'user:email',
  },
  apple: {
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
    userInfoEndpoint: null, // Apple uses ID token
    scopes: 'name email',
  },
};

// Generate state for CSRF protection
export function generateState(): string {
  return randomBytes(32).toString('hex');
}

// Generate code verifier for PKCE
export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

// Generate code challenge from verifier
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(digest).toString('base64url');
}

export async function getOAuthAuthorizationUrl(
  provider: 'google' | 'github' | 'apple',
  redirectUri: string
): Promise<{ url: string; state: string; codeVerifier?: string }> {
  const config = oauthProviders[provider];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullRedirectUri = `${baseUrl}${redirectUri}`;

  const state = generateState();
  let codeVerifier: string | undefined;
  let codeChallenge: string | undefined;
  let codeChallengeMethod: string | undefined;

  // Use PKCE for all providers (required for Apple, recommended for others)
  codeVerifier = generateCodeVerifier();
  codeChallenge = await generateCodeChallenge(codeVerifier);
  codeChallengeMethod = 'S256';

  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  if (!clientId) {
    throw new Error(`${provider.toUpperCase()}_CLIENT_ID is not configured`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: fullRedirectUri,
    response_type: 'code',
    scope: config.scopes,
    state,
    ...(codeChallenge && { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
  });

  // Apple requires response_mode
  if (provider === 'apple') {
    params.set('response_mode', 'form_post');
  }

  const url = `${config.authorizationEndpoint}?${params.toString()}`;

  return { url, state, codeVerifier };
}

export async function handleOAuthCallback(
  provider: 'google' | 'github' | 'apple',
  code: string,
  state: string,
  codeVerifier?: string
) {
  const config = oauthProviders[provider];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;

  const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

  if (!clientId || !clientSecret) {
    throw new Error(`${provider.toUpperCase()} credentials are not configured`);
  }

  // Exchange code for token
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    ...(codeVerifier && { code_verifier: codeVerifier }),
  });

  const tokenResponse = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: tokenParams.toString(),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const idToken = tokenData.id_token; // For Apple

  // Get user info
  let userInfo: any;
  
  if (provider === 'apple' && idToken) {
    // Apple uses ID token for user info
    const decoded = jose.decodeJwt(idToken);
    userInfo = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || null,
    };
  } else if (provider === 'github') {
    // GitHub needs separate call for email
    const userResponse = await fetch(config.userInfoEndpoint!, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch GitHub user info');
    }

    const githubUser = await userResponse.json();
    
    // Get primary email (GitHub specific)
    const emailEndpoint = provider === 'github' ? oauthProviders.github.emailEndpoint : null;
    let emailResponse: Response | null = null;
    if (emailEndpoint) {
      emailResponse = await fetch(emailEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });
    }

    let email = githubUser.email;
    if (emailResponse && emailResponse.ok) {
      const emails = await emailResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
      email = primaryEmail?.email || email;
    }

    userInfo = {
      id: githubUser.id,
      email: email || `${githubUser.login}@github.local`,
      name: githubUser.name || githubUser.login,
    };
  } else if (config.userInfoEndpoint) {
    const userInfoResponse = await fetch(config.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    userInfo = await userInfoResponse.json();
  } else {
    throw new Error('No user info endpoint available');
  }

  // Normalize user info
  const email = userInfo.email;
  const name = userInfo.name || null;
  const providerAccountId = String(userInfo.id || userInfo.sub);

  if (!email) {
    throw new Error('Email is required but not provided by OAuth provider');
  }

  // Find or create user
  // @ts-ignore - Account model will be available after migration
  let account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: { user: true },
  });

  let user;
  if (account) {
    user = account.user;
    // Update account tokens
    // @ts-ignore - Account model will be available after migration
    await prisma.account.update({
      where: { id: account.id },
      data: {
        accessToken,
        refreshToken: tokenData.refresh_token || null,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      },
    });
  } else {
    // Check if user exists with this email
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: null as any, // OAuth users don't have passwords
          plan: 'FREE',
          aiCallsLimit: 5,
        },
      });
    }

    // Create account
    // @ts-ignore - Account model will be available after migration
    await prisma.account.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId,
        accessToken,
        refreshToken: tokenData.refresh_token || null,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      },
    });
  }

  // Create session
  const token = await createSession(user.id);

  return { user, token };
}
