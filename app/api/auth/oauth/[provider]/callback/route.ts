/**
 * OAuth Callback Route - Clean Architecture
 * Uses Strategy Pattern and Factory Pattern
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuthStrategyFactory } from '@/lib/infrastructure/oauth/OAuthStrategyFactory';
import { OAuthProvider } from '@/lib/domain/interfaces/IOAuthStrategy';
import { toUserDTO } from '@/lib/domain/entities/User';
import { AUTH_CONSTANTS } from '@/lib/application/constants/AuthConstants';

async function handleOAuthCallback(
  request: NextRequest,
  provider: OAuthProvider,
  code: string,
  state: string,
  codeVerifier?: string
) {
  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get(`oauth_state_${provider}`)?.value;
  const storedCodeVerifier = cookieStore.get(`oauth_code_verifier_${provider}`)?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL('/login?error=invalid_state', request.url)
    );
  }

  // Clear state cookie
  cookieStore.delete(`oauth_state_${provider}`);
  if (storedCodeVerifier) {
    cookieStore.delete(`oauth_code_verifier_${provider}`);
  }

  // Use Factory Pattern to get appropriate strategy
  const strategy = OAuthStrategyFactory.create(provider);
  
  // Use Strategy Pattern to handle callback
  const { user, token } = await strategy.handleCallback(
    code,
    state,
    codeVerifier || storedCodeVerifier
  );

  // Set auth cookie
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + AUTH_CONSTANTS.SESSION_DURATION_HOURS);

  const response = NextResponse.redirect(new URL(AUTH_CONSTANTS.ROUTES.DASHBOARD, request.url));
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const resolvedParams = await params;
    const provider = resolvedParams.provider as OAuthProvider;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/login?error=missing_code_or_state', request.url)
      );
    }

    return await handleOAuthCallback(request, provider, code, state);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'oauth_failed')}`, request.url)
    );
  }
}

// Apple uses POST for callback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const resolvedParams = await params;
    const provider = resolvedParams.provider as OAuthProvider;
    
    if (provider !== 'apple') {
      return NextResponse.json(
        { error: 'POST only supported for Apple' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const code = formData.get('code') as string;
    const state = formData.get('state') as string;
    const error = formData.get('error') as string | null;

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/login?error=missing_code_or_state', request.url)
      );
    }

    return await handleOAuthCallback(request, provider, code, state);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'oauth_failed')}`, request.url)
    );
  }
}

