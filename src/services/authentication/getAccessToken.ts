import services from "../services";


let tokenCache: string | null = null;
let isFetching = false;


export default async function getAccessToken(setAccessToken?: (token: string) => void) {
  
  // 1. Return memoized token to minimize network latency
  if (tokenCache) {
    if (setAccessToken) setAccessToken(tokenCache);
    return tokenCache;
  }

  // 2. Prevent race conditions if multiple components call this simultaneously
  if (isFetching) {
    console.warn("Auth Service: Access token request already in progress.");
    return null;
  }

  try {
    isFetching = true;
    const userDetails = await services.authentication.getUserDetails(null);

    if (userDetails?.data?.access_token) {
      const token = userDetails.data.access_token;
      tokenCache = token; // Update module-level cache
      
      if (setAccessToken) setAccessToken(token);
      return token;
    }

    return null;
  } catch (error) {
    // 3. Error Boundary to prevent application crash during auth failure
    console.error("CRITICAL: Failed to retrieve access token", error);
    return null;
  } finally {
    // Ensure lock is released regardless of request success/failure
    isFetching = false;
  }
}
