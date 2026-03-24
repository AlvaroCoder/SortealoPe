import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "./fetchWithAuth";

const PAGE_SIZE = 10;

/**
 * Hook para fetch paginado acumulativo (infinite scroll).
 *
 * @param {string|null} baseUrl  URL base SIN page/size. El hook los agrega internamente.
 *                               Pasar null para skip.
 * @returns {{ items, loading, hasMore, totalElements, fetched, loadMore, refresh }}
 */
export function usePaginatedFetch(baseUrl) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [fetched, setFetched] = useState(false); // true una vez que llega la primera respuesta

  // Usamos refs para evitar closures obsoletos dentro de fetchPage
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNum, reset = false) => {
      if (!baseUrl || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const separator = baseUrl.includes("?") ? "&" : "?";
        const url = `${baseUrl}${separator}page=${pageNum}&size=${PAGE_SIZE}`;
        const res = await fetchWithAuth(url);

        if (!res.ok) return;

        const json = await res.json();
        const newItems = Array.isArray(json.content) ? json.content : [];

        setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(!json.last);
        setTotalElements(json.totalElements ?? 0);
        pageRef.current = pageNum;
        setFetched(true);
      } catch {
        // AbortError u otros — ignorar silenciosamente
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [baseUrl],
  );

  // Fetch inicial cuando cambia la URL
  useEffect(() => {
    if (!baseUrl) {
      setItems([]);
      setHasMore(false);
      setTotalElements(0);
      setFetched(false);
      pageRef.current = 0;
      return;
    }
    pageRef.current = 0;
    fetchPage(0, true);
  }, [baseUrl, fetchPage]);

  /** Carga la siguiente página y la agrega a los items existentes. */
  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) {
      fetchPage(pageRef.current + 1, false);
    }
  }, [hasMore, fetchPage]);

  /** Resetea a página 0 y reemplaza los items. */
  const refresh = useCallback(() => {
    pageRef.current = 0;
    fetchPage(0, true);
  }, [fetchPage]);

  return { items, loading, hasMore, totalElements, fetched, loadMore, refresh };
}