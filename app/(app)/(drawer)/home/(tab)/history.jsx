import { useEffect, useState } from "react";
import { View } from "react-native";
import { ENDPOINTS_EVENTS } from "../../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../../context/AuthContext";
import { usePaginatedFetch } from "../../../../../lib/usePaginatedFetch";
import LoadingScreen from "../../../../../screens/LoadingScreen";
import ScreenHistoryTickets from "../../../../../screens/ScreenHistoryTickets";

const BASE_URL = ENDPOINTS_EVENTS.GET_BY_USER;

export default function History() {
  const { userData, loading: loadingAuth } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);

  const shouldFetch = !!userData?.userId && !loadingAuth;

  const espera = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=HOST&eventStatus=1` : null,
  );

  const creada = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=HOST&eventStatus=2` : null,
  );
  const ganada = usePaginatedFetch(
    shouldFetch ? `${BASE_URL}?role=HOST&eventStatus=3` : null,
  );

  // Desactiva el indicador de refresh cuando los tres terminan de cargar
  useEffect(() => {
    if (refreshing && !espera.loading && !creada.loading && !ganada.loading) {
      setRefreshing(false);
    }
  }, [refreshing, espera.loading, creada.loading, ganada.loading]);

  const handleRefresh = () => {
    setRefreshing(true);
    espera.refresh();
    creada.refresh();
    ganada.refresh();
  };

  // Muestra LoadingScreen solo durante la carga inicial (antes del primer fetch)
  const isInitialLoading =
    !refreshing &&
    (loadingAuth || !espera.fetched || !creada.fetched || !ganada.fetched);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isInitialLoading ? (
        <LoadingScreen />
      ) : (
        <ScreenHistoryTickets
          initialTab={1}
          tabs={[
            {
              label: "En espera",
              items: espera.items,
              loading: espera.loading,
              hasMore: espera.hasMore,
              total: espera.totalElements,
              loadMore: espera.loadMore,
            },
            {
              label: "Creados",
              items: creada.items,
              loading: creada.loading,
              hasMore: creada.hasMore,
              total: creada.totalElements,
              loadMore: creada.loadMore,
            },
            {
              label: "Sorteados",
              items: ganada.items,
              loading: ganada.loading,
              hasMore: ganada.hasMore,
              total: ganada.totalElements,
              loadMore: ganada.loadMore,
            },
          ]}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}
