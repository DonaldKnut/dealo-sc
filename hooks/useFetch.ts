import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  refetchInterval?: number;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook for fetching data from API
 * Handles loading, error, and data states automatically
 */
export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { immediate = true, onSuccess, onError, refetchInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [immediate, url, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && url) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, url, fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}



