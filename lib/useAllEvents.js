import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

function useAllEvents(baseUrl) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 3 llamadas paralelas, una por estado
      const [r1, r2, r3] = await Promise.all([
        fetch(`${baseUrl}&eventStatus=1`, { headers }),
        fetch(`${baseUrl}&eventStatus=2`, { headers }),
        fetch(`${baseUrl}&eventStatus=3`, { headers }),
      ]);

      const [d1, d2, d3] = await Promise.all([
        r1.ok ? r1.json() : [],
        r2.ok ? r2.json() : [],
        r3.ok ? r3.json() : [],
      ]);

      // Ajusta según la forma de tu respuesta:
      // Si tu API devuelve { content: [...] } (paginado Spring)
      const extract = (d) =>
        Array.isArray(d) ? d : (d?.content ?? d?.data ?? []);

      const merged = [...extract(d1), ...extract(d2), ...extract(d3)];

      // Ordena: activos primero, luego en espera, luego sorteados
      merged.sort((a, b) => {
        const order = { 2: 0, 1: 1, 3: 2 };
        const sa = a.eventStatus ?? a.status ?? 1;
        const sb = b.eventStatus ?? b.status ?? 1;
        return (order[sa] ?? 1) - (order[sb] ?? 1);
      });

      setItems(merged);
    } catch (err) {
      console.log("Error fetchAll:", err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { items, loading, refresh: fetchAll };
}

export default useAllEvents;
