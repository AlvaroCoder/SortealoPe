import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../../../constants/theme";
import { ENDPOINTS_TICKETS } from "../../../../../Connections/APIURLS";
import { useAuthContext } from "../../../../../context/AuthContext";
import { useFetch } from "../../../../../lib/useFetch";
import LoadingScreen from "../../../../../screens/LoadingScreen";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const BLUE_500 = Colors.principal.blue[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

const TABS = [
  { key: "SOLD", label: "Comprados", icon: "checkmark-circle-outline", color: GREEN_500 },
  { key: "RESERVED", label: "Reservados", icon: "time-outline", color: BLUE_500 },
];

const TicketItem = ({ ticket }) => (
  <View style={styles.ticketCard}>
    <View style={styles.ticketHeader}>
      <Text style={styles.ticketEvent} numberOfLines={1}>
        {ticket.eventTitle ?? ticket.event?.title ?? "Evento"}
      </Text>
      <Text style={styles.ticketCode}>#{ticket.code?.slice(0, 8) ?? "—"}</Text>
    </View>
    <View style={styles.ticketDetails}>
      <View style={styles.ticketDetailRow}>
        <Ionicons name="cash-outline" size={14} color={NEUTRAL_700} style={{ marginRight: 4 }} />
        <Text style={styles.ticketDetailText}>
          S/ {ticket.price?.toFixed(2) ?? "—"}
        </Text>
      </View>
      <View style={styles.ticketDetailRow}>
        <Ionicons name="person-outline" size={14} color={NEUTRAL_700} style={{ marginRight: 4 }} />
        <Text style={styles.ticketDetailText}>
          Vendedor: {ticket.seller?.username ?? "—"}
        </Text>
      </View>
    </View>
  </View>
);

export default function HistoryTickets() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const { userData, loading: loadingAuth } = useAuthContext();

  const userId = userData?.userId;
  const shouldFetch = Boolean(userId && !loadingAuth);

  const { loading, data } = useFetch(
    shouldFetch ? `${ENDPOINTS_TICKETS.GET_BY_USER}?userId=${userId}` : null
  );

  const filteredTickets = (data ?? []).filter(
    (ticket) => ticket.status === activeTab
  );

  return (
    <View style={styles.container}>
      {(loadingAuth || loading) && <LoadingScreen />}

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
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item, idx) => item.id?.toString() ?? idx.toString()}
        renderItem={({ item }) => <TicketItem ticket={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={50} color={NEUTRAL_200} />
              <Text style={styles.emptyText}>
                No tienes tickets {activeTab === "SOLD" ? "comprados" : "reservados"}.
              </Text>
            </View>
          )
        }
      />
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
    gap: 6,
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
  ticketCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketEvent: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    flex: 1,
    marginRight: 8,
  },
  ticketCode: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontFamily: "monospace",
  },
  ticketDetails: { gap: 4 },
  ticketDetailRow: { flexDirection: "row", alignItems: "center" },
  ticketDetailText: { fontSize: Typography.sizes.sm, color: NEUTRAL_700 },
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
