import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "./fetchWithAuth";

export function useFetch(URL = "", options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

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
        console.log(responseJSON);

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
  }, [URL]);

  return { loading, data, error };
}
