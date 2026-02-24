import { View } from "react-native";
import { ENDPOINTS_EVENTS } from "../../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../../context/AuthContext";
import { useFetch } from "../../../../../lib/useFetch";
import LoadingScreen from "../../../../../screens/LoadingScreen";
import ScreenHistoryTickets from "../../../../../screens/ScreenHistoryTickets";

const URL_GET_EVENTS = ENDPOINTS_EVENTS.GET_EVENTS_BY_ID;

export default function History() {
  const { userData, loading: loadingAuth } = useAuthContext();
  const shouldFetch = userData?.userId && !loadingAuth;

  const { loading: loadingDataEspera, data: dataEspera } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}${userData?.userId}&eventStatus=1` : null,
  );

  const { loading: loadingDataCreada, data: dataCreada } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}${userData?.userId}&eventStatus=2` : null,
  );

  const { loading: loadingDataGanada, data: dataGanada } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}${userData?.userId}&eventStatus=3` : null,
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {loadingAuth ||
      loadingDataEspera ||
      loadingDataCreada ||
      loadingDataGanada ? (
        <LoadingScreen />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ScreenHistoryTickets
            dataEspera={dataEspera}
            dataCreada={dataCreada}
            dataGanada={dataGanada}
          />
        </View>
      )}
    </View>
  );
}
