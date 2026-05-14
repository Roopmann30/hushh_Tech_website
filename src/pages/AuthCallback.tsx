import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Button,
  Flex,
  Icon,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import config from '../resources/config/config';
import { DEFAULT_AUTH_REDIRECT, sanitizeInternalRedirect } from '../utils/security';
import { useAuthSession } from '../auth/AuthSessionProvider';
import {
  FINANCIAL_LINK_ROUTE,
  normalizeLegacyOnboardingRedirectTarget,
} from '../services/onboarding/flow';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { revalidateSession } = useAuthSession();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Guard to prevent double-execution in React Strict Mode or rapid re-renders
  const processingStarted = useRef(false);

  // Get custom redirect from URL param (for Hushh AI and other modules)
  const redirectParam = searchParams.get('redirect');
  const customRedirect = redirectParam
    ? normalizeLegacyOnboardingRedirectTarget(
      sanitizeInternalRedirect(redirectParam, DEFAULT_AUTH_REDIRECT)
    )
    : null;

  const getRedirectDestination = (hasCompletedOnboarding: boolean) => {
    if (customRedirect) return customRedirect;
    return hasCompletedOnboarding ? '/hushh-user-profile' : FINANCIAL_LINK_ROUTE;
  };

  const queueWelcomeToast = (userId?: string | null) => {
    sessionStorage.setItem('showWelcomeToast', 'true');
    if (userId) {
      sessionStorage.setItem('showWelcomeToastUserId', userId);
    } else {
      sessionStorage.removeItem('showWelcomeToastUserId');
    }
  };

  useEffect(() => {
    // Fail-fast if processing is already underway
    if (processingStarted.current) return;
    processingStarted.current = true;

    const handleAuthCallback = async () => {
      try {
        const supabase = config.supabaseClient;
        if (!supabase) {
          throw new Error('Supabase configuration missing');
        }

        // Clear stale toast flags before processing
        sessionStorage.removeItem('showWelcomeToast');
        sessionStorage.removeItem('showWelcomeToastUserId');

        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || 'An error occurred during verification');
        }

        // 1. Exchange Code for Session with Retry Logic
        if (code) {
          let retryCount = 0;
          const maxRetries = 2;

          const exchangeWithRetry = async (): Promise<void> => {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              if (retryCount < maxRetries) {
                retryCount++;
                console.warn(`[Hushh] Exchange failed, retrying (${retryCount})...`);
                await new Promise(res => setTimeout(res, 1000 * retryCount)); // Exponential backoff
                return exchangeWithRetry();
              }
              throw exchangeError;
            }
          };

          await exchangeWithRetry();

          // Standardize: Clean URL to prevent re-exchanging same code on refresh
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        // 2. Handle Signup Legacy Tokens
        const type = searchParams.get('type');
        if (type === 'signup') {
          const accessToken = searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (sessionError) throw sessionError;
          }
        }

        // 3. Revalidate Global Auth Context
        const sessionSnapshot = await revalidateSession();

        if (sessionSnapshot.status !== 'authenticated' || !sessionSnapshot.user) {
          throw new Error('No active session found. Please try signing in again.');
        }

        // 4. Check Onboarding Status
        const { data: onboardingData, error: dbError } = await supabase
          .from('onboarding_data')
          .select('is_completed')
          .eq('user_id', sessionSnapshot.user.id)
          .maybeSingle();

        if (dbError) console.error('[Hushh] Onboarding check failed', dbError);

        queueWelcomeToast(sessionSnapshot.user.id);
        setVerificationStatus('success');

        // Smooth transition timing to match Profile Page entry animations
        setTimeout(() => {
          const hasCompletedOnboarding = onboardingData?.is_completed ?? false;
          navigate(getRedirectDestination(hasCompletedOnboarding));
        }, 1200);

      } catch (err: any) {
        console.error('[Hushh][AuthCallback] Error:', err);
        setVerificationStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, revalidateSession]);

  return (
    <Container maxW="container.md" py={12}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={8}
        boxShadow="lg"
        bg="white"
        textAlign="center"
      >
        {verificationStatus === 'loading' && (
          <Flex direction="column" align="center" py={10}>
            <Spinner size="xl" color="#0AADBC" thickness="4px" speed="0.65s" mb={6} />
            <Heading size="lg" mb={4}>Verifying your email...</Heading>
            <Text color="gray.600">Please wait while we confirm your identity.</Text>
          </Flex>
        )}

        {verificationStatus === 'success' && (
          <Flex direction="column" align="center" py={6}>
            <Icon as={CheckCircle} w={16} h={16} color="green.500" mb={6} />
            <Heading size="lg" mb={4}>Welcome to HushhTech!</Heading>
            <Text color="gray.600" mb={8}>
              Your email has been verified. Redirecting you to your dashboard...
            </Text>
          </Flex>
        )}

        {verificationStatus === 'error' && (
          <Flex direction="column" align="center" py={6}>
            <Icon as={AlertTriangle} w={16} h={16} color="red.500" mb={6} />
            <Heading size="lg" mb={4}>Verification Failed</Heading>
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {errorMessage}
            </Alert>
            <Flex gap={4}>
              <Button colorScheme="blue" size="lg" onClick={() => navigate('/login')}>
                Try Logging In
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default AuthCallback;