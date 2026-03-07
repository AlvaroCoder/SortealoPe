import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "white";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

const STATUS_CONFIG = {
  EMPEZADO: { label: "Activo", color: GREEN_500 },
  CREADO: { label: "Nuevo", color: RED_500 },
  EN_ESPERA: { label: "En Espera", color: NEUTRAL_700 },
};

export default function EventCard({ event }) {
  const router = useRouter();
  const { label, color } = STATUS_CONFIG[event?.currentState] ?? {
    label: event?.currentState ?? "—",
    color: NEUTRAL_700,
  };

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push({ pathname: "/event/[id]", params: { id: event.id } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={[styles.cardStatus, { color }]}>{label}</Text>
      </View>
      <View style={styles.cardDetail}>
        <Ionicons name="pricetags-outline" size={16} color={GREEN_900} style={{ marginRight: 5 }} />
        <Text style={styles.cardDetailText}>
          {event.totalTickets ?? "—"} Tickets @ S/{event.ticketPrice?.toFixed(2) ?? "0.00"}
        </Text>
      </View>
      <View style={styles.cardDetail}>
        <Ionicons name="calendar-outline" size={16} color={GREEN_900} style={{ marginRight: 5 }} />
        <Text style={styles.cardDetailText}>
          Sorteo: {event.date ? new Date(event.date).toLocaleDateString("es-PE") : "Sin definir"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: Colors.principal.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    flex: 1,
    marginRight: 10,
  },
  cardStatus: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  cardDetailText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
  },
});
