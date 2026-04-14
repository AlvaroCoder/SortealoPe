import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CountDownAnimation from "../../../../../components/animation/CountDownAnimation";
import SpinningAnimation from "../../../../../components/animation/SpinningAnimation";
import WheelAnimation from "../../../../../components/animation/WheelAnimation";
import { Colors, Typography } from "../../../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLUE = "#1E82D9";
const PURPLE = "#7C3AED";
const RED = "#D52941";
const AMBER = "#F59E0B";
const TEAL = "#10B981";

// ── Animation metadata (mirrors index.jsx) ────────────────────────────────────
const ANIM_CONFIG = {
  spinning: {
    label: "Tickets Giratorios",
    icon: "ticket-outline",
    accent: GREEN_500,
  },
  countdown: { label: "Cuenta Regresiva", icon: "timer-outline", accent: BLUE },
  wheel: {
    label: "Ruleta de la Fortuna",
    icon: "disc-outline",
    accent: PURPLE,
  },
};

// ── Wheel constants ────────────────────────────────────────────────────────────
const WHEEL_SIZE = 260;
const RADIUS = WHEEL_SIZE / 2;
const N_SEGS = 6;
const HALF_BASE = RADIUS * Math.tan(Math.PI / N_SEGS);
const SEG_COLORS = [GREEN_500, BLUE, PURPLE, RED, AMBER, TEAL];
const SEG_LABELS = [
  "Tickets 1-100",
  "Tickets 101-200",
  "Tickets 201-300",
  "Tickets 301-400",
  "Tickets 401-500",
  "Tickets 501-600",
];

const genWinner = () => Math.floor(Math.random() * 999) + 1;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function Simular() {
  const router = useRouter();
  const { selectedAnimation = "spinning", eventTitle } = useLocalSearchParams();

  const [phase, setPhase] = useState("ready"); // 'ready' | 'running' | 'done'
  const [winner, setWinner] = useState(null);

  const config = ANIM_CONFIG[selectedAnimation] ?? ANIM_CONFIG.spinning;

  const handleStart = useCallback(() => {
    setWinner(genWinner());
    setPhase("running");
  }, []);

  const handleDone = useCallback(() => setPhase("done"), []);

  const handleReset = useCallback(() => {
    setWinner(null);
    setPhase("ready");
  }, []);

  // ── Running phase (full screen, no safe area chrome) ─────────────────────────
  if (phase === "running") {
    const AnimComp =
      selectedAnimation === "countdown"
        ? CountDownAnimation
        : selectedAnimation === "wheel"
          ? WheelAnimation
          : SpinningAnimation;

    return (
      <View style={{ flex: 1 }}>
        <AnimComp winner={winner} onDone={handleDone} />
      </View>
    );
  }

  // ── Done phase ───────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={GREEN_900} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Resultado</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.doneContent}>
          {/* Trophy */}
          <View style={styles.trophyRing}>
            <Ionicons name="trophy" size={48} color={AMBER} />
          </View>

          <Text style={styles.doneTitle}>Simulación completada</Text>
          <Text style={styles.doneSub}>
            El ticket seleccionado aleatoriamente fue:
          </Text>

          {/* Winner card */}
          <View style={styles.winnerCard}>
            <Text style={styles.winnerCardLabel}>TICKET GANADOR</Text>
            <Text style={styles.winnerCardNumber}>#{winner}</Text>
          </View>

          {/* Animation badge */}
          <View
            style={[
              styles.animBadge,
              {
                backgroundColor: config.accent + "18",
                borderColor: config.accent + "35",
              },
            ]}
          >
            <Ionicons name={config.icon} size={13} color={config.accent} />
            <Text style={[styles.animBadgeText, { color: config.accent }]}>
              {config.label}
            </Text>
          </View>

          <Text style={styles.doneDisclaimer}>
            Esta es una simulación. Los resultados no afectan al sorteo real.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleReset}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={18} color={WHITE} />
            <Text style={styles.primaryBtnText}>Simular de nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryBtnText}>Volver a configuración</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Ready phase ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Simular Sorteo</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.readyContent}>
        {/* Config card */}
        <View
          style={[styles.configCard, { borderColor: config.accent + "40" }]}
        >
          <View
            style={[
              styles.configIcon,
              { backgroundColor: config.accent + "18" },
            ]}
          >
            <Ionicons name={config.icon} size={32} color={config.accent} />
          </View>
          <Text style={styles.configMeta}>Animación seleccionada</Text>
          <Text style={[styles.configName, { color: config.accent }]}>
            {config.label}
          </Text>
          <Text style={styles.configDesc}>
            La simulación usará esta animación para revelar el ticket ganador de
            forma aleatoria.
          </Text>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={16} color={BLUE} />
          <Text style={styles.noticeText}>
            Esta es solo una simulación. Los resultados no afectan al sorteo
            real del evento.
          </Text>
        </View>

        {/* Event name if provided */}
        {!!eventTitle && (
          <View style={styles.eventRow}>
            <Ionicons name="calendar-outline" size={14} color={NEUTRAL_500} />
            <Text style={styles.eventName} numberOfLines={1}>
              {eventTitle}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={20} color={WHITE} />
          <Text style={styles.primaryBtnText}>Iniciar simulación</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NEUTRAL_50 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Ready ────────────────────────────────────────────────────────────────────
  readyContent: {
    flex: 1,
    padding: 20,
    gap: 14,
    justifyContent: "center",
  },
  configCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  configIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  configMeta: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  configName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },
  configDesc: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  noticeText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: "#1D4ED8",
    lineHeight: 18,
    fontWeight: Typography.weights.medium,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  eventName: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Done ─────────────────────────────────────────────────────────────────────
  doneContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 14,
  },
  trophyRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFBEB",
    borderWidth: 2,
    borderColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AMBER,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  doneTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  doneSub: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
  },
  winnerCard: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 52,
    alignItems: "center",
    gap: 6,
    shadowColor: GREEN_900,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  winnerCardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1.5,
  },
  winnerCardNumber: {
    fontSize: 52,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 60,
  },
  animBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  animBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  doneDisclaimer: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    textAlign: "center",
  },

  // ── Shared footer ─────────────────────────────────────────────────────────────
  footer: { paddingHorizontal: 20, paddingBottom: 12, gap: 10 },
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
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  secondaryBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },
});
