/**
 * OAuth User Info Fetcher - Single Responsibility Principle
 * Handles fetching user information from OAuth providers
 */
export class OAuthUserInfoFetcher {
  async fetch(endpoint: string, accessToken: string): Promise<any> {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info from ${endpoint}`);
    }

    return await response.json();
  }
}

