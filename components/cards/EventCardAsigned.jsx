import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

const STATUS_CONFIG = {
  1: { label: "EN ESPERA", bg: "#FEF3C7", text: "#92400E" },
  2: { label: "ACTIVO", bg: "#D1FAE5", text: "#065F46" },
  3: { label: "FINALIZADO", bg: "#E2E8F0", text: "#475569" },
  4: { label: "PAUSADO", bg: "#FEF3C7", text: "#92400E" },
};

const getStatus = (s) => STATUS_CONFIG[s] ?? STATUS_CONFIG[1];

export default function EventCardAsigned({ item }) {
  const router = useRouter();
  const status = getStatus(item.eventStatus ?? item.status ?? 2);

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
      })
    : "—";
  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.82}
      onPress={() =>
        router.push({
          pathname: "/(app)/(seller)/events/[id]",
          params: { id: item.id },
        })
      }
    >
      {/* Thumbnail */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.eventThumb}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.eventThumb, styles.eventThumbPlaceholder]}>
          <Ionicons name="ticket-outline" size={22} color={NEUTRAL_200} />
        </View>
      )}

      {/* Info */}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title ?? "Evento"}
        </Text>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar-outline" size={12} color={NEUTRAL_500} />
          <Text style={styles.eventMetaText}>{formattedDate}</Text>
          {item.place ? (
            <>
              <Ionicons
                name="location-outline"
                size={12}
                color={NEUTRAL_500}
                style={{ marginLeft: 8 }}
              />
              <Text style={styles.eventMetaText} numberOfLines={1}>
                {item.place}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Right side */}
      <View style={styles.eventRight}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusBadgeText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  eventThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    flexShrink: 0,
  },
  eventThumbPlaceholder: {
    backgroundColor: NEUTRAL_100,
    alignItems: "center",
    justifyContent: "center",
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    lineHeight: 18,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  eventMetaText: {
    fontSize: 11,
    color: NEUTRAL_500,
  },
  eventRight: {
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  soldCount: {
    fontSize: 11,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
});
