import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EventCard from "../../../components/cards/EventCard";
import { Colors, Typography } from "../../../constants/theme";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const WHITE = "white";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const URL_EVENTS = ENDPOINTS_EVENTS.GET_BY_USER;

const TABS = [
  { key: "1", title: "En Espera", icon: "time-outline", status: 1 },
  { key: "2", title: "Creados", icon: "cube-outline", status: 2 },
  { key: "3", title: "Activos", icon: "play-circle-outline", status: 3 },
];

export default function MisEventos() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const { userData, loading: loadingAuth } = useAuthContext();

  const userId = userData?.userId;
  const shouldFetch = Boolean(userId && !loadingAuth);

  const { loading: l1, data: dataEnEspera } = useFetch(
    shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=1` : null
  );
  const { loading: l2, data: dataCreado } = useFetch(
    shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=2` : null
  );
  const { loading: l3, data: dataActivo } = useFetch(
    shouldFetch ? `${URL_EVENTS}?userId=${userId}&eventStatus=3` : null
  );

  const isLoading = loadingAuth || l1 || l2 || l3;

  const getDataForTab = () => {
    switch (activeTab) {
      case "1": return dataEnEspera ?? [];
      case "2": return dataCreado ?? [];
      case "3": return dataActivo ?? [];
      default: return [];
    }
  };

  const events = getDataForTab();

  return (
    <View style={styles.container}>
      {isLoading && <LoadingScreen />}

      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.key ? WHITE : GREEN_900}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <Text style={styles.eventCountText}>
          {events.length} evento{events.length !== 1 ? "s" : ""} encontrado{events.length !== 1 ? "s" : ""}
        </Text>

        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          !isLoading && (
            <View style={styles.noEventsContainer}>
              <Ionicons name="search-outline" size={50} color={NEUTRAL_200} />
              <Text style={styles.noEventsText}>No tienes eventos en este estado.</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.principal.green[50],
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    gap: 5,
  },
  tabItemActive: {
    backgroundColor: GREEN_900,
    borderColor: GREEN_900,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  tabTextActive: { color: WHITE },
  listContent: { padding: 20 },
  eventCountText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginBottom: 15,
    fontWeight: Typography.weights.medium,
  },
  noEventsContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 12,
    marginTop: 20,
  },
  noEventsText: {
    fontSize: Typography.sizes.lg,
    color: NEUTRAL_700,
    marginTop: 10,
  },
});
