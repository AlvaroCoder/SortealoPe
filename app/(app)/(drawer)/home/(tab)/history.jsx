import { useEffect, useState } from "react";
import { View } from "react-native";
import { ENDPOINTS_EVENTS } from "../../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../../context/AuthContext";
import { useFetch } from "../../../../../lib/useFetch";
import LoadingScreen from "../../../../../screens/LoadingScreen";
import ScreenHistoryTickets from "../../../../../screens/ScreenHistoryTickets";

const URL_GET_EVENTS = ENDPOINTS_EVENTS.GET_BY_USER;

export default function History() {
  const { userData, loading: loadingAuth } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);

  const shouldFetch = userData?.userId && !loadingAuth;

  const { loading: loadingEspera, data: dataEspera, refetch: refetchEspera } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}?userId=${userData?.userId}&eventStatus=1` : null,
  );
  const { loading: loadingCreada, data: dataCreada, refetch: refetchCreada } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}?userId=${userData?.userId}&eventStatus=2` : null,
  );
  const { loading: loadingGanada, data: dataGanada, refetch: refetchGanada } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}?userId=${userData?.userId}&eventStatus=3` : null,
  );

  // Stop the refresh indicator once all fetches finish
  useEffect(() => {
    if (refreshing && !loadingEspera && !loadingCreada && !loadingGanada) {
      setRefreshing(false);
    }
  }, [refreshing, loadingEspera, loadingCreada, loadingGanada]);

  const handleRefresh = () => {
    setRefreshing(true);
    refetchEspera();
    refetchCreada();
    refetchGanada();
  };

  const isInitialLoading =
    !refreshing && (loadingAuth || loadingEspera || loadingCreada || loadingGanada);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isInitialLoading ? (
        <LoadingScreen />
      ) : (
        <ScreenHistoryTickets
          dataEspera={dataEspera}
          dataCreada={dataCreada}
          dataGanada={dataGanada}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}
