import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../constants/theme";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const RED_500 = Colors.principal.red[500];
const WHITE = "#FFFFFF";

export default function ClaimTicketScreen() {
  const router = useRouter();
  const { reservationCode } = useLocalSearchParams();

  // ── Error state: no reservation code provided ────────────────────────────────
  if (!reservationCode) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={64} color={RED_500} />
          <Text style={styles.errorTitle}>Código inválido</Text>
          <Text style={styles.errorBody}>
            No se encontró un código de reserva válido. Asegúrate de escanear el
            QR correcto.
          </Text>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.back()}
          >
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Success header ── */}
        <View style={styles.successHeader}>
          <View style={styles.successIconRing}>
            <Ionicons name="checkmark-circle" size={52} color={WHITE} />
          </View>
          <Text style={styles.successTitle}>¡Tickets reservados!</Text>
          <Text style={styles.successSubtitle}>
            Tu reserva fue confirmada. En breves el vendedor confirmará la
            compra.
          </Text>
        </View>

        {/* ── QR de presentación ── */}
        <View style={styles.qrCard}>
          <QRCode
            value={reservationCode}
            size={220}
            color={GREEN_900}
            backgroundColor={WHITE}
            quietZone={16}
          />
        </View>

        {/* ── Info box ── */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={GREEN_500}
          />
          <Text style={styles.infoText}>
            Guarda una captura de pantalla de este QR. Lo necesitarás para
            validar tu participación en el sorteo.
          </Text>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() =>
            router.replace("/(app)/(drawer)/home/(tab)/historyTickets")
          }
          activeOpacity={0.85}
        >
          <Ionicons name="ticket-outline" size={20} color={WHITE} />
          <Text style={styles.btnPrimaryText}>Ver mis tickets</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  scrollContent: { padding: 24, paddingBottom: 48 },

  // Success header
  successHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  successIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: GREEN_500,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  successTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // QR card
  qrCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GREEN_100,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  codeBox: {
    width: "100%",
    backgroundColor: GREEN_50,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GREEN_100,
  },
  codeLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
    fontFamily: "monospace",
    textAlign: "center",
  },

  // Info box
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: GREEN_100,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    lineHeight: 20,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  btnSecondary: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  btnSecondaryText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // Error state
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    textAlign: "center",
  },
  errorBody: {
    marginTop: 8,
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
  },
});
