// Base API client with common functionality
export class BaseApiClient {
  protected getAuthToken(login: string, password: string): string {
    const credentials = `${login}:${password}`;
    return btoa(credentials);
  }

  protected getHeaders(authToken: string): HeadersInit {
    return {
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    };
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.status_message || 'API request failed');
    }
    return response.json();
  }
}