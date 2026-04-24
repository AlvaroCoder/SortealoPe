import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../../../constants/theme";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ── Helpers ───────────────────────────────────────────────────────────────────
function displayName(user) {
  if (!user) return "—";
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.username ?? "—";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ── Detail screen ─────────────────────────────────────────────────────────────
export default function ReservationDetailScreen() {
  const router = useRouter();
  const { data, accentColor } = useLocalSearchParams();

  const accent = accentColor ?? "#16CD91";

  let reservation = null;
  try {
    reservation = data ? JSON.parse(data) : null;
  } catch {
    reservation = null;
  }

  const buyerName = displayName(reservation?.buyer);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* ── Top bar ── */}
      <SafeAreaView
        style={[styles.topBar, { borderBottomColor: accent + "40" }]}
        edges={["top"]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <Text style={styles.screenTitle}>Detalle de reservación</Text>
        </View>

        <View style={styles.backBtnSpacer} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Yape / payment image ── */}
        <View style={styles.imageSection}>
          {reservation?.image ? (
            <Image
              source={{ uri: reservation.image }}
              style={styles.paymentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.paymentImagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={NEUTRAL_200} />
              <Text style={styles.placeholderText}>Sin comprobante</Text>
            </View>
          )}
          <View style={styles.imageLabelRow}>
            <Ionicons name="card-outline" size={14} color={NEUTRAL_500} />
            <Text style={styles.imageLabelText}>Comprobante de pago</Text>
          </View>
        </View>

        {/* ── Info section ── */}
        <View style={styles.infoSection}>
          <InfoRow
            icon="person-outline"
            label="Comprador"
            value={buyerName}
            accent={accent}
          />
          <View style={styles.infoSeparator} />
          <InfoRow
            icon="ticket-outline"
            label="Tickets"
            value={`${reservation?.ticketQuantity ?? "—"} ticket${
              reservation?.ticketQuantity !== 1 ? "s" : ""
            }`}
            accent={accent}
            valueColor={accent}
          />
          <View style={styles.infoSeparator} />
          <InfoRow
            icon="time-outline"
            label="Creado"
            value={formatDate(reservation?.createdAt)}
            accent={accent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, accent, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconWrap, { backgroundColor: accent + "18" }]}>
        <Ionicons name={icon} size={16} color={accent} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[styles.infoValue, valueColor ? { color: valueColor } : null]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnSpacer: { width: 40 },
  titleArea: {
    flex: 1,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },

  // Image
  imageSection: {
    gap: 8,
  },
  paymentImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: NEUTRAL_200,
  },
  paymentImagePlaceholder: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: NEUTRAL_200 + "60",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  placeholderText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
  },
  imageLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  imageLabelText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
  },

  // Info section
  infoSection: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: WHITE,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoLabel: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },
  infoValue: {
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    fontWeight: Typography.weights.semibold,
    maxWidth: "50%",
    textAlign: "right",
  },
  infoSeparator: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginHorizontal: 14,
  },
});
