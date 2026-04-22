import services from "../services";

let tokenPromise: Promise<string | null> | null = null;


export const clearTokenCache = () => {
  tokenPromise = null;
};

export default async function getAccessToken(setAccessToken?: (token: string) => void) {
  
  if (!tokenPromise) {
    tokenPromise = (async () => {
      try {
        const userDetails = await services.authentication.getUserDetails(null);
        return userDetails?.data?.access_token || null;
      } catch (error) {
        console.error("Auth Service: Request failed", error);
        tokenPromise = null; // Allow retry on failure
        return null;
      }
    })();
  }

  // Await the promise (either new or cached)
  const token = await tokenPromise;

  // FIX: Ensure the callback is honored for EVERY caller, even on cache hits
  if (token && setAccessToken) {
    setAccessToken(token);
  }

  return token;
}
