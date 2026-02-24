import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ENDPOINTS_TIKCETS } from "../../../Connections/APIURLS";
import { Colors, Typography } from "../../../constants/theme";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const URL_GET_TICKETS = ENDPOINTS_TIKCETS.GET_EVENTS_COLLECTIONS;

const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const EventCard = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardContent}>
      <View style={styles.iconCircle}>
        <Ionicons name="gift-outline" size={24} color={GREEN_900} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {item.title || "Evento sin título"}
        </Text>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={NEUTRAL_700} />
          <Text style={styles.detailText}>
            {item.date || "Fecha por definir"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="ticket-outline" size={14} color={NEUTRAL_700} />
          <Text style={styles.detailText}>
            {item.ticketsPerCollection || 0} tickets asignados
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={NEUTRAL_200} />
    </View>
  </TouchableOpacity>
);

export default function Asignados() {
  const { userData, loading: loadingAuth } = useAuthContext();
  const [querySearch, setQuerySearch] = useState("");

  const shouldFetch = userData?.userId && !loadingAuth;
  const { data, loading } = useFetch(
    shouldFetch ? `${URL_GET_TICKETS}${userData?.userId}` : null,
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!querySearch) return data;
    return data.filter((item) =>
      item.title?.toLowerCase().includes(querySearch.toLowerCase()),
    );
  }, [data, querySearch]);

  const handleChange = (text) => {
    setQuerySearch(text);
  };

  if (loadingAuth || loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mis Eventos Asignados</Text>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={NEUTRAL_700} />
          <TextInput
            placeholder="Buscar evento..."
            placeholderTextColor={NEUTRAL_200}
            style={styles.input}
            value={querySearch}
            onChangeText={handleChange}
          />
          {querySearch.length > 0 && (
            <TouchableOpacity onPress={() => setQuerySearch("")}>
              <Ionicons name="close-circle" size={18} color={NEUTRAL_200} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de Eventos */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => <EventCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // 🟢 Vista cuando no hay información
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="folder-open-outline"
                size={60}
                color={NEUTRAL_200}
              />
            </View>
            <Text style={styles.emptyTitle}>No hay información</Text>
            <Text style={styles.emptySubtitle}>
              {querySearch
                ? "No encontramos eventos que coincidan con tu búsqueda."
                : "Aún no tienes eventos asignados en este momento."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: WHITE,
  },
  screenTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 15,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEUTRAL_100,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: Typography.sizes.base,
    color: GREEN_900,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // --- Estilos de Tarjeta ---
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.principal.green[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  detailText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginLeft: 6,
  },
  // --- Estilos Estado Vacío ---
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: NEUTRAL_100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    textAlign: "center",
    lineHeight: 22,
  },
});
