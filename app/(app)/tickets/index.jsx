import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../constants/theme";
import { ENDPOINTS_EVENTS } from "../../../Connections/APIURLS";
import { useAuthContext } from "../../../context/AuthContext";
import { useFetch } from "../../../lib/useFetch";
import LoadingScreen from "../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const EventTicketItem = ({ event, onPress }) => (
  <TouchableOpacity style={styles.eventCard} onPress={() => onPress(event.id)}>
    <View style={styles.cardBody}>
      <View style={styles.cardInfo}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.eventPlace} numberOfLines={1}>
          <Ionicons name="location-outline" size={13} /> {event.place ?? "—"}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.priceTag}>S/ {event.ticketPrice?.toFixed(2)} c/u</Text>
          <Text style={styles.availableTag}>
            {event.availableTickets ?? 0} disponibles
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={GREEN_900} />
    </View>
  </TouchableOpacity>
);

export default function TicketsIndex() {
  const router = useRouter();
  const { userData, loading: loadingAuth } = useAuthContext();

  const userId = userData?.userId;
  const shouldFetch = Boolean(userId && !loadingAuth);

  // Fetch active events (status 3 = activos/empezados)
  const { loading, data } = useFetch(
    shouldFetch ? `${ENDPOINTS_EVENTS.GET_BY_USER}?userId=${userId}&eventStatus=3` : null
  );

  const events = data ?? [];

  const handleSelectEvent = (eventId) => {
    router.push({ pathname: "/(app)/tickets/sell/[id]", params: { id: eventId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {(loadingAuth || loading) && <LoadingScreen />}

      <View style={styles.header}>
        <Text style={styles.title}>Vender Tickets</Text>
        <Text style={styles.subtitle}>
          Selecciona un evento para gestionar sus tickets
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventTicketItem event={item} onPress={handleSelectEvent} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={50} color={NEUTRAL_200} />
              <Text style={styles.emptyText}>
                No tienes eventos activos asignados.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 4,
  },
  listContent: { padding: 20 },
  eventCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardInfo: { flex: 1, marginRight: 10 },
  eventTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 4,
  },
  eventPlace: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceTag: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: RED_500,
  },
  availableTag: {
    fontSize: Typography.sizes.sm,
    color: GREEN_500,
    fontWeight: Typography.weights.medium,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 10,
    textAlign: "center",
  },
});
