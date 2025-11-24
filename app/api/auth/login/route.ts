/**
 * Login API Route - Clean Architecture
 * Uses service layer for business logic
 */
import { NextRequest, NextResponse } from 'next/server';
import { serviceContainer } from '@/lib/application/di/ServiceContainer';
import { toUserDTO } from '@/lib/domain/entities/User';
import { AUTH_CONSTANTS } from '@/lib/application/constants/AuthConstants';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use service layer for business logic
    const authService = serviceContainer.authService;
    const { user, token } = await authService.login(email, password);

    const response = NextResponse.json({
      user: toUserDTO(user),
      token,
    });

    // Set cookie with session expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + AUTH_CONSTANTS.SESSION_DURATION_HOURS);
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Invalid') ? 401 : 500 }
    );
  }
}

