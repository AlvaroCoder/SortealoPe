import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775886772/RifaloPeSuper.png";

// ── Screen ────────────────────────────────────────────────────────────────────
export default function AdminExitoConfirmar() {
  const router = useRouter();

  const handleConfirmarMas = () => {
    // Go back to confirmar (2 screens: exitoConfirmar ← ingresarDatosVenta ← confirmar)
    router.back();
    router.back();
  };

  const handleVolverEvento = () => {
    // Pop all the way back past confirmar to the event detail
    router.dismiss(3);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* ── Content ────────────────────────────────────────────────────────── */}
      <View style={styles.content}>
        {/* Checkmark ring */}
        <View style={styles.checkRing}>
          <Ionicons name="checkmark-circle" size={52} color={GREEN_500} />
        </View>

        {/* Mascot */}
        <Image
          source={{ uri: MASCOT_URI }}
          style={styles.mascot}
          contentFit="contain"
          transition={300}
          cachePolicy="memory-disk"
        />

        {/* Title */}
        <Text style={styles.title}>¡Venta Confirmada!</Text>
        <Text style={styles.subtitle}>
          El pago fue registrado correctamente.{"\n"}El comprador ya puede ver
          su ticket confirmado.
        </Text>

        {/* Chips */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Ionicons name="shield-checkmark-outline" size={13} color={GREEN_500} />
            <Text style={styles.chipText}>Pago validado</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="ticket-outline" size={13} color={GREEN_500} />
            <Text style={styles.chipText}>Ticket activo</Text>
          </View>
        </View>
      </View>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleConfirmarMas}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-done-outline" size={18} color={WHITE} />
          <Text style={styles.primaryBtnText}>Confirmar más reservas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleVolverEvento}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back-outline" size={16} color={GREEN_900} />
          <Text style={styles.secondaryBtnText}>Volver al evento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 0,
  },
  checkRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  mascot: {
    width: 200,
    height: 200,
    marginBottom: 28,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  chipsRow: { flexDirection: "row", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_50,
    borderWidth: 1,
    borderColor: GREEN_100,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  actions: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_900,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  secondaryBtnText: {
    color: GREEN_900,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
