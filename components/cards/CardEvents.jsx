import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

const STATUS_CONFIG = {
  1: { label: "EN ESPERA", bg: "#E2E8F0", text: "#64748B" },
  2: { label: "ACTIVO", bg: "#D1FAE5", text: "#065F46" },
  3: { label: "FINALIZADO", bg: "#E2E8F0", text: "#475569" },
  4: { label: "PAUSADO", bg: "#FEF3C7", text: "#92400E" },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] ?? STATUS_CONFIG[1];

export default function CardEvents({ item, userId, selectedStatus }) {
  console.log("Item , ", item);

  const router = useRouter();
  const status = getStatusConfig(selectedStatus);
  const sold = item.soldTickets ?? item.ticketsSold ?? 0;
  const total = item.ticketsPerCollection ?? item.totalTickets ?? 0;

  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.85}
      onPress={() => {
        if (selectedStatus !== 1) {
          router.push({
            pathname: "/(app)/(admin)/events/[id]",
            params: {
              id: item.id,
              eventStatus: selectedStatus,
              userId,
            },
          });
        }
        return;
      }}
    >
      <View style={styles.eventImageWrapper}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.eventImage}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.eventImage, styles.eventImagePlaceholder]} />
        )}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusBadgeText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.eventInfo}>
        <View style={styles.eventInfoRow}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title ?? "Evento"}
          </Text>
          {total > 0 && (
            <View style={styles.ticketsBox}>
              <Text style={styles.ticketsLabel}>Tickets</Text>
              <Text style={styles.ticketsValue}>
                {sold}/{total}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Event cards
  eventCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImageWrapper: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 160,
  },
  eventImagePlaceholder: {
    backgroundColor: NEUTRAL_200,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eventInfo: {
    padding: 14,
  },
  eventInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN_900,
    flex: 1,
    marginRight: 8,
  },
  ticketsBox: {
    alignItems: "flex-end",
  },
  ticketsLabel: {
    fontSize: 10,
    color: NEUTRAL_500,
    fontWeight: "500",
  },
  ticketsValue: {
    fontSize: 13,
    fontWeight: "700",
    color: NEUTRAL_700,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: GREEN_500,
  },
});
