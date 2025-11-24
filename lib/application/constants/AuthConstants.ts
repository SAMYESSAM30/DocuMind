/**
 * Constants - Single Source of Truth
 * Centralized constants for authentication
 */
export const AUTH_CONSTANTS = {
  SESSION_DURATION_HOURS: 4,
  PASSWORD_MIN_LENGTH: 6,
  OAUTH_PROVIDERS: {
    GOOGLE: 'google',
    GITHUB: 'github',
    APPLE: 'apple',
  } as const,
  ROUTES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    ANALYZE: '/analyze',
  },
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    OAUTH_ACCOUNT: 'This account was created with OAuth. Please sign in with your OAuth provider.',
    USER_EXISTS: 'User with this email already exists',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    OAUTH_ERROR: 'Failed to sign in with OAuth provider. Please try again.',
    OAUTH_CANCELLED: 'OAuth sign-in was cancelled.',
  },
} as const;

