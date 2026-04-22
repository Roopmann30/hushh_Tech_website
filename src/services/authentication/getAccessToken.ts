import services from "../services";

let tokenPromise: Promise<string | null> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 50; // 50 minutes (assuming 1hr token life)

/**
 * STANDOUT FIX v2: 
 * 1. Implements Promise Caching to resolve secondary-caller 'null' returns.
 * 2. Implements Cache Invalidation based on timestamp.
 */
export default async function getAccessToken(setAccessToken?: (token: string) => void) {
  const currentTime = Date.now();
  const isCacheStale = currentTime - lastFetchTime > CACHE_DURATION;

  // If we have a fresh token/promise, return it. If stale, clear it.
  if (isCacheStale) {
    tokenPromise = null;
  }

  if (!tokenPromise) {
    tokenPromise = (async () => {
      try {
        const userDetails = await services.authentication.getUserDetails(null);
        if (userDetails?.data?.access_token) {
          lastFetchTime = Date.now();
          const token = userDetails.data.access_token;
          if (setAccessToken) setAccessToken(token);
          return token;
        }
        return null;
      } catch (error) {
        console.error("Auth Service Error:", error);
        tokenPromise = null; // Clear on error so we can retry
        return null;
      }
    })();
  }

  return tokenPromise;
}
