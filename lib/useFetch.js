import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "./fetchWithAuth";

export function useFetch(URL = "", options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const abortControllerRef = useRef(null);

  const refetch = useCallback(() => {
    setRefreshCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!URL) return;

    abortControllerRef.current = new AbortController();
    const abortSignal = abortControllerRef.current.signal;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth(URL, {
          ...options,
          signal: abortSignal,
        });

        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(errMsg || "Error en la solicitud");
        }

        const responseJSON = await response.json();

        setData(responseJSON);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => abortControllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [URL, refreshCounter]);

  return { loading, data, error, refetch };
}
