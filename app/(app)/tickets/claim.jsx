import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookTickets } from "../../../Connections/tickets";
import { Colors, Typography } from "../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

// ── Status: "loading" | "success" | "error" ───────────────────────────────────
export default function TicketClaimScreen() {
  const router = useRouter();
  const { reservationCode } = useLocalSearchParams();

  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!reservationCode) {
      setErrorMsg("No se encontró el código de reserva.");
      setStatus("error");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await BookTickets(reservationCode);
        console.log("Estatus : ", res.status);

        if (!res.ok) {
          throw new Error("O no No se pudo confirmar la reserva.");
        }
        if (!cancelled) setStatus("success");
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message ?? "Ocurrió un error inesperado.");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reservationCode]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Brand header */}
      <View style={styles.brandHeader}>
        <Image
          source={{ uri: MASCOT_URI }}
          style={styles.mascot}
          contentFit="contain"
        />
        <Text style={styles.brandName}>RIFALOPE</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon/indicator */}
        <View
          style={[
            styles.iconBox,
            isSuccess && styles.iconBoxSuccess,
            !isLoading && !isSuccess && styles.iconBoxError,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={WHITE} />
          ) : isSuccess ? (
            <Ionicons name="checkmark-circle" size={52} color={WHITE} />
          ) : (
            <Ionicons name="close-circle" size={52} color={WHITE} />
          )}
        </View>

        {/* Texts */}
        <Text style={styles.title}>
          {isLoading
            ? "Confirmando tickets…"
            : isSuccess
              ? "¡Tickets confirmados!"
              : "No se pudo confirmar"}
        </Text>
        <Text style={styles.subtitle}>
          {isLoading
            ? "Por favor espera mientras procesamos tu reserva."
            : isSuccess
              ? "Tus tickets han sido reservados con éxito. ¡Buena suerte!"
              : (errorMsg ?? "Ocurrió un error al procesar la reserva.")}
        </Text>

        {/* Success chips */}
        {isSuccess && (
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name="ticket-outline" size={13} color={GREEN_500} />
              <Text style={styles.chipText}>Tickets reservados</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons
                name="shield-checkmark-outline"
                size={13}
                color={GREEN_500}
              />
              <Text style={styles.chipText}>Reserva válida</Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      {!isLoading && (
        <View style={styles.actions}>
          {isSuccess && (
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => router.replace("/(app)/(buyer)")}
            >
              <Ionicons name="home-outline" size={18} color={WHITE} />
              <Text style={styles.primaryBtnText}>Ver mis eventos</Text>
            </TouchableOpacity>
          )}

          {!isSuccess && (
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => router.replace("/(app)/(buyer)")}
            >
              <Ionicons name="arrow-back-outline" size={18} color={WHITE} />
              <Text style={styles.primaryBtnText}>Volver al inicio</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.75}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },

  // ── Brand header ────────────────────────────────────────────────────────────
  brandHeader: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    gap: 4,
  },
  mascot: {
    width: 52,
    height: 52,
  },
  brandName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },

  // ── Content ─────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 0,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: GREEN_900,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  iconBoxSuccess: {
    backgroundColor: GREEN_500,
    shadowColor: GREEN_500,
  },
  iconBoxError: {
    backgroundColor: RED_500,
    shadowColor: RED_500,
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
    lineHeight: 21,
    marginBottom: 24,
  },

  // ── Success chips ────────────────────────────────────────────────────────────
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },

  // ── Actions ─────────────────────────────────────────────────────────────────
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 16,
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
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  primaryBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
  },
});
