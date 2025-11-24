/**
 * Custom Hook - Separation of Concerns
 * Encapsulates authentication logic for UI components
 */
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser, fetchUser } from '@/lib/slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { AUTH_CONSTANTS } from '../constants/AuthConstants';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL parameters
  const expired = searchParams.get('expired') === 'true';
  const redirect = searchParams.get('redirect');
  const oauthError = searchParams.get('error');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirect || AUTH_CONSTANTS.ROUTES.DASHBOARD);
    }
  }, [user, loading, router, redirect]);

  // Handle expired session
  useEffect(() => {
    if (expired) {
      toast({
        title: 'Session Expired',
        description: AUTH_CONSTANTS.ERROR_MESSAGES.SESSION_EXPIRED,
        variant: 'destructive',
      });
    }
  }, [expired, toast]);

  // Handle OAuth errors
  useEffect(() => {
    if (oauthError) {
      toast({
        title: 'OAuth Error',
        description: oauthError === 'access_denied'
          ? AUTH_CONSTANTS.ERROR_MESSAGES.OAUTH_CANCELLED
          : AUTH_CONSTANTS.ERROR_MESSAGES.OAUTH_ERROR,
        variant: 'destructive',
      });
    }
  }, [oauthError, toast]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      router.push(redirect || AUTH_CONSTANTS.ROUTES.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  return {
    user,
    loading,
    error,
    expired,
    redirect,
    oauthError,
    handleLogin,
    handleOAuthLogin,
  };
}

