import { useState, useEffect } from 'react';
import {useAuth} from "./useAuth.tsx";

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(path: string, method = 'GET' ): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/' + path, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            ...(user && {Authorization: `Bearer ${user.token}`}),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result as T);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, loading, error };
} 