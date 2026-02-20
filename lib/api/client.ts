/**
 * API Client - Centralized API call utilities
 * Extracts fetch logic from components
 */

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base API client class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = "") {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}${searchParams.toString()}`;
  }

  /**
   * Make API request
   */
  private async request<T>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = 30000, ...fetchOptions } = options;

    const fullUrl = this.buildURL(url, params);
    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      if (timeoutId) clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.statusText}`,
          response.status,
          data
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await this.request<T>(url, {
      ...options,
      method: "GET",
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> {
    const response = await this.request<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> {
    const response = await this.request<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> {
    const response = await this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await this.request<T>(url, {
      ...options,
      method: "DELETE",
    });
    return response.data;
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient, ApiError };

// Convenience functions
export const api = {
  get: <T>(url: string, options?: ApiOptions) => apiClient.get<T>(url, options),
  post: <T>(url: string, data?: any, options?: ApiOptions) => apiClient.post<T>(url, data, options),
  put: <T>(url: string, data?: any, options?: ApiOptions) => apiClient.put<T>(url, data, options),
  patch: <T>(url: string, data?: any, options?: ApiOptions) => apiClient.patch<T>(url, data, options),
  delete: <T>(url: string, options?: ApiOptions) => apiClient.delete<T>(url, options),
};



