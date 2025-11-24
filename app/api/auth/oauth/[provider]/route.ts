/**
 * OAuth Initiation Route - Clean Architecture
 * Uses Strategy Pattern and Factory Pattern
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuthStrategyFactory } from '@/lib/infrastructure/oauth/OAuthStrategyFactory';
import { OAuthProvider } from '@/lib/domain/interfaces/IOAuthStrategy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const resolvedParams = await params;
    const provider = resolvedParams.provider as OAuthProvider;
    
    if (!['google', 'github', 'apple'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // Use Factory Pattern to get appropriate strategy
    const strategy = OAuthStrategyFactory.create(provider);
    const redirectUri = `/api/auth/oauth/${provider}/callback`;
    
    // Use Strategy Pattern to get authorization URL
    const { url, state, codeVerifier } = await strategy.getAuthorizationUrl(redirectUri);

    // Store state and codeVerifier in cookies for verification
    const cookieStore = await cookies();
    cookieStore.set(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    if (codeVerifier) {
      cookieStore.set(`oauth_code_verifier_${provider}`, codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
      });
    }

    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

