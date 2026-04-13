import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50  = Colors.principal.green[50];
const WHITE     = "#FFFFFF";
const NEUTRAL_50  = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLUE   = "#1E82D9";
const PURPLE = "#7C3AED";
const RED    = "#D52941";
const AMBER  = "#F59E0B";
const TEAL   = "#10B981";

// ── Animation metadata (mirrors index.jsx) ────────────────────────────────────
const ANIM_CONFIG = {
  spinning: { label: "Tickets Giratorios", icon: "ticket-outline",   accent: GREEN_500 },
  countdown:{ label: "Cuenta Regresiva",   icon: "timer-outline",    accent: BLUE },
  wheel:    { label: "Ruleta de la Fortuna",icon: "disc-outline",    accent: PURPLE },
};

// ── Wheel constants ────────────────────────────────────────────────────────────
const WHEEL_SIZE = 260;
const RADIUS     = WHEEL_SIZE / 2;
const N_SEGS     = 6;
const HALF_BASE  = RADIUS * Math.tan(Math.PI / N_SEGS);
const SEG_COLORS = [GREEN_500, BLUE, PURPLE, RED, AMBER, TEAL];
const SEG_LABELS = [
  "Tickets 1-100", "Tickets 101-200", "Tickets 201-300",
  "Tickets 301-400", "Tickets 401-500", "Tickets 501-600",
];

const genWinner = () => Math.floor(Math.random() * 999) + 1;

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION 1 — SPINNING (Slot Machine)
// ═══════════════════════════════════════════════════════════════════════════════
function SpinningAnim({ winner, onDone }) {
  const wd = String(winner).padStart(3, "0").split("");
  const phaseRef = useRef(0);
  const [phase, setPhase]   = useState(0); // 0=all spin, 1/2/3=drums locked
  const [digits, setDigits] = useState(["?", "?", "?"]);

  useEffect(() => {
    let count = 0;
    const TOTAL = 65;
    const id = setInterval(() => {
      count++;
      const p = count < 22 ? 0 : count < 44 ? 1 : count < 58 ? 2 : 3;
      if (p !== phaseRef.current) { phaseRef.current = p; setPhase(p); }
      setDigits([
        p >= 1 ? wd[0] : String(Math.floor(Math.random() * 10)),
        p >= 2 ? wd[1] : String(Math.floor(Math.random() * 10)),
        p >= 3 ? wd[2] : String(Math.floor(Math.random() * 10)),
      ]);
      if (count >= TOTAL) { clearInterval(id); setTimeout(onDone, 1800); }
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={sa.root}>
      <Text style={sa.title}>Seleccionando ticket ganador…</Text>

      {/* Drum labels */}
      <View style={sa.drumLabels}>
        {["C", "D", "U"].map((l, i) => (
          <Text key={i} style={sa.drumLabel}>{l}</Text>
        ))}
      </View>

      {/* Drums */}
      <View style={sa.drumRow}>
        {digits.map((d, i) => {
          const locked = phase > i;
          return (
            <View key={i} style={[sa.drum, locked && sa.drumLocked]}>
              {locked && (
                <View style={sa.checkBadge}>
                  <Ionicons name="checkmark" size={11} color={WHITE} />
                </View>
              )}
              <Text style={[sa.drumDigit, locked && sa.drumDigitLocked]}>{d}</Text>
            </View>
          );
        })}
      </View>

      <Text style={sa.tag}>N° DE TICKET</Text>

      {/* Progress dots */}
      <View style={sa.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[sa.dot, phase > i && sa.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const sa = StyleSheet.create({
  root: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 16, paddingHorizontal: 32, backgroundColor: GREEN_900,
  },
  title: {
    fontSize: Typography.sizes.base, color: "rgba(255,255,255,0.7)",
    fontWeight: Typography.weights.medium,
  },
  drumLabels: { flexDirection: "row", gap: 12 },
  drumLabel: {
    width: 80, textAlign: "center",
    fontSize: Typography.sizes.xs, color: "rgba(255,255,255,0.4)",
    fontWeight: Typography.weights.bold, letterSpacing: 1,
  },
  drumRow: { flexDirection: "row", gap: 12 },
  drum: {
    width: 80, height: 112, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  drumLocked: { backgroundColor: GREEN_500, borderColor: GREEN_500 },
  checkBadge: {
    position: "absolute", top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: GREEN_900,
    alignItems: "center", justifyContent: "center",
  },
  drumDigit: {
    fontSize: 52, fontWeight: Typography.weights.extrabold, color: WHITE, lineHeight: 60,
  },
  drumDigitLocked: { color: GREEN_900 },
  tag: {
    fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.35)", letterSpacing: 2,
  },
  dots: { flexDirection: "row", gap: 8, marginTop: 4 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: { backgroundColor: GREEN_500 },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION 2 — COUNTDOWN
// ═══════════════════════════════════════════════════════════════════════════════
function CountdownAnim({ onDone }) {
  const [step, setStep] = useState(0);
  const scale   = useRef(new Animated.Value(3)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const LABELS     = ["5", "4", "3", "2", "1", "¡Ya!"];
  const NUM_COLORS = [RED, AMBER, AMBER, BLUE, GREEN_500, GREEN_500];

  const runStep = useCallback((s) => {
    scale.setValue(3);
    opacity.setValue(1);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.65, duration: 900,
        useNativeDriver: true, easing: Easing.out(Easing.quad),
      }),
      Animated.timing(opacity, {
        toValue: s < 5 ? 0 : 1,
        duration: 600, delay: 250, useNativeDriver: true,
      }),
    ]).start(() => {
      if (s < 5) {
        setStep(s + 1);
      } else {
        setTimeout(onDone, 900);
      }
    });
  }, [onDone]);

  useEffect(() => {
    if (step <= 5) runStep(step);
  }, [step]);

  const color = NUM_COLORS[step] ?? GREEN_500;

  return (
    <View style={co.root}>
      <Text style={co.hint}>
        {step < 5 ? "El ganador se revelará en…" : "¡El ganador ha sido seleccionado!"}
      </Text>

      {/* Pulsing ring */}
      <View style={[co.ringOuter, { borderColor: color + "30" }]}>
        <View style={[co.ringInner, { borderColor: color + "60" }]}>
          <Animated.View
            style={[co.circle, { borderColor: color }, { transform: [{ scale }], opacity }]}
          >
            <Text style={[co.number, { color }]}>{LABELS[step] ?? "¡Ya!"}</Text>
          </Animated.View>
        </View>
      </View>

      {step < 5 && (
        <View style={co.dotsRow}>
          {LABELS.slice(0, 5).map((_, i) => (
            <View key={i} style={[co.dot, i < step && co.dotDone, i === step && co.dotCurrent]} />
          ))}
        </View>
      )}
    </View>
  );
}

const co = StyleSheet.create({
  root: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 28, backgroundColor: GREEN_900, paddingHorizontal: 32,
  },
  hint: {
    fontSize: Typography.sizes.sm, color: "rgba(255,255,255,0.6)",
    fontWeight: Typography.weights.medium, textAlign: "center",
  },
  ringOuter: {
    width: 260, height: 260, borderRadius: 130, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  ringInner: {
    width: 230, height: 230, borderRadius: 115, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  circle: {
    width: 190, height: 190, borderRadius: 95, borderWidth: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center", justifyContent: "center",
  },
  number: {
    fontSize: 84, fontWeight: Typography.weights.extrabold, lineHeight: 96,
  },
  dotsRow: { flexDirection: "row", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.15)" },
  dotDone: { backgroundColor: GREEN_500 },
  dotCurrent: { backgroundColor: WHITE, width: 28, borderRadius: 5 },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION 3 — WHEEL (Ruleta)
// Uses CSS border-triangle trick to create pie slices inside overflow:hidden circle
// ═══════════════════════════════════════════════════════════════════════════════
function WheelAnim({ winner, onDone }) {
  const [winSeg] = useState(() => Math.floor(Math.random() * N_SEGS));
  // Rotate so that winSeg ends at 0° (12 o'clock, where pointer is)
  const finalAngle =
    5 * 360 + (360 - ((winSeg * (360 / N_SEGS)) % 360)) % 360;

  const rotation = useRef(new Animated.Value(0)).current;
  const [done, setDone] = useState(false);

  const spin = rotation.interpolate({
    inputRange:  [0, finalAngle],
    outputRange: ["0deg", `${finalAngle}deg`],
  });

  useEffect(() => {
    Animated.timing(rotation, {
      toValue:  finalAngle,
      duration: 4500,
      easing:   Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setDone(true);
      setTimeout(onDone, 2200);
    });
  }, []);

  return (
    <View style={wa.root}>
      <Text style={wa.hint}>
        {done ? "¡La ruleta ha decidido!" : "La ruleta está girando…"}
      </Text>

      {/* Pointer (downward triangle, fixed above wheel) */}
      <View style={wa.pointer} />

      {/* Rotating wheel */}
      <Animated.View style={[wa.wheel, { transform: [{ rotate: spin }] }]}>
        {/* Pie slices via border triangles — apex at center, base at rim */}
        {SEG_COLORS.map((color, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              top:  RADIUS,
              left: RADIUS,
              width:  0,
              height: 0,
              borderTopWidth:    RADIUS,
              borderLeftWidth:   HALF_BASE,
              borderRightWidth:  HALF_BASE,
              borderTopColor:    color,
              borderLeftColor:   "transparent",
              borderRightColor:  "transparent",
              transform: [{ rotate: `${i * (360 / N_SEGS)}deg` }],
            }}
          />
        ))}
      </Animated.View>

      {/* Fixed center donut (does not rotate) */}
      <View style={wa.centerDonut}>
        <Ionicons name="trophy" size={22} color={GREEN_900} />
      </View>

      {/* Result shown after wheel stops */}
      {done && (
        <View style={[wa.resultCard, { borderColor: SEG_COLORS[winSeg] + "50" }]}>
          <Text style={wa.resultZone}>{SEG_LABELS[winSeg]}</Text>
          <View style={wa.resultDivider} />
          <Text style={wa.resultTicketLabel}>Ticket seleccionado</Text>
          <Text style={[wa.resultTicketNumber, { color: SEG_COLORS[winSeg] }]}>
            #{winner}
          </Text>
        </View>
      )}
    </View>
  );
}

const wa = StyleSheet.create({
  root: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 0, paddingHorizontal: 24, backgroundColor: WHITE,
  },
  hint: {
    fontSize: Typography.sizes.base, color: NEUTRAL_700,
    fontWeight: Typography.weights.semibold, marginBottom: 8,
  },
  pointer: {
    width: 0, height: 0,
    borderLeftWidth: 14, borderRightWidth: 14, borderTopWidth: 26,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderTopColor: RED,
    zIndex: 10, marginBottom: -2,
  },
  wheel: {
    width: WHEEL_SIZE, height: WHEEL_SIZE,
    borderRadius: RADIUS,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  centerDonut: {
    position: "absolute",
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: WHITE,
    // positioned to overlap the center of the wheel
    // hint: parent is flex column, wheel is at index 2 (~hint + pointer + wheel)
    // We use negative margin to bring the donut up into the wheel's center
    marginTop: -(WHEEL_SIZE / 2 + 32),
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
    zIndex: 20,
  },
  resultCard: {
    marginTop: WHEEL_SIZE / 2 + 32 + 20, // offset for donut overlap + gap
    alignItems: "center", backgroundColor: WHITE, borderRadius: 20,
    borderWidth: 1.5, paddingVertical: 16, paddingHorizontal: 32,
    gap: 6, width: "100%",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  resultZone: {
    fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: NEUTRAL_700,
  },
  resultDivider: { width: 40, height: 1.5, backgroundColor: NEUTRAL_200 },
  resultTicketLabel: {
    fontSize: Typography.sizes.xs, color: NEUTRAL_500, fontWeight: Typography.weights.medium,
  },
  resultTicketNumber: {
    fontSize: Typography.sizes["2xl"], fontWeight: Typography.weights.extrabold,
  },
});

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
      selectedAnimation === "countdown" ? CountdownAnim :
      selectedAnimation === "wheel"     ? WheelAnim    :
      SpinningAnim;

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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
          <Text style={styles.doneSub}>El ticket seleccionado aleatoriamente fue:</Text>

          {/* Winner card */}
          <View style={styles.winnerCard}>
            <Text style={styles.winnerCardLabel}>TICKET GANADOR</Text>
            <Text style={styles.winnerCardNumber}>#{winner}</Text>
          </View>

          {/* Animation badge */}
          <View style={[styles.animBadge, { backgroundColor: config.accent + "18", borderColor: config.accent + "35" }]}>
            <Ionicons name={config.icon} size={13} color={config.accent} />
            <Text style={[styles.animBadgeText, { color: config.accent }]}>{config.label}</Text>
          </View>

          <Text style={styles.doneDisclaimer}>
            Esta es una simulación. Los resultados no afectan al sorteo real.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleReset} activeOpacity={0.85}>
            <Ionicons name="refresh" size={18} color={WHITE} />
            <Text style={styles.primaryBtnText}>Simular de nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()} activeOpacity={0.75}>
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
        <View style={[styles.configCard, { borderColor: config.accent + "40" }]}>
          <View style={[styles.configIcon, { backgroundColor: config.accent + "18" }]}>
            <Ionicons name={config.icon} size={32} color={config.accent} />
          </View>
          <Text style={styles.configMeta}>Animación seleccionada</Text>
          <Text style={[styles.configName, { color: config.accent }]}>{config.label}</Text>
          <Text style={styles.configDesc}>
            La simulación usará esta animación para revelar el ticket ganador de forma aleatoria.
          </Text>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={16} color={BLUE} />
          <Text style={styles.noticeText}>
            Esta es solo una simulación. Los resultados no afectan al sorteo real del evento.
          </Text>
        </View>

        {/* Event name if provided */}
        {!!eventTitle && (
          <View style={styles.eventRow}>
            <Ionicons name="calendar-outline" size={14} color={NEUTRAL_500} />
            <Text style={styles.eventName} numberOfLines={1}>{eventTitle}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStart} activeOpacity={0.85}>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: NEUTRAL_200,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: GREEN_50, alignItems: "center", justifyContent: "center",
  },
  topTitle: {
    fontSize: Typography.sizes.lg, fontWeight: Typography.weights.extrabold, color: GREEN_900,
  },

  // ── Ready ────────────────────────────────────────────────────────────────────
  readyContent: {
    flex: 1, padding: 20, gap: 14, justifyContent: "center",
  },
  configCard: {
    backgroundColor: WHITE, borderRadius: 22, borderWidth: 1.5,
    padding: 28, alignItems: "center", gap: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  configIcon: {
    width: 80, height: 80, borderRadius: 22, alignItems: "center", justifyContent: "center",
  },
  configMeta: {
    fontSize: Typography.sizes.xs, fontWeight: Typography.weights.medium,
    color: NEUTRAL_500, textTransform: "uppercase", letterSpacing: 0.5,
  },
  configName: {
    fontSize: Typography.sizes.xl, fontWeight: Typography.weights.extrabold,
  },
  configDesc: {
    fontSize: Typography.sizes.sm, color: NEUTRAL_500, textAlign: "center", lineHeight: 20,
  },
  notice: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#EFF6FF", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#BFDBFE",
  },
  noticeText: {
    flex: 1, fontSize: Typography.sizes.xs, color: "#1D4ED8",
    lineHeight: 18, fontWeight: Typography.weights.medium,
  },
  eventRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    justifyContent: "center",
  },
  eventName: {
    fontSize: Typography.sizes.sm, color: NEUTRAL_500, fontWeight: Typography.weights.medium,
  },

  // ── Done ─────────────────────────────────────────────────────────────────────
  doneContent: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: 32, gap: 14,
  },
  trophyRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#FFFBEB", borderWidth: 2, borderColor: AMBER,
    alignItems: "center", justifyContent: "center",
    shadowColor: AMBER, shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  doneTitle: {
    fontSize: Typography.sizes["2xl"], fontWeight: Typography.weights.extrabold, color: GREEN_900,
  },
  doneSub: {
    fontSize: Typography.sizes.sm, color: NEUTRAL_500, textAlign: "center",
  },
  winnerCard: {
    backgroundColor: GREEN_900, borderRadius: 20,
    paddingVertical: 24, paddingHorizontal: 52, alignItems: "center", gap: 6,
    shadowColor: GREEN_900, shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  winnerCardLabel: {
    fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.5)", letterSpacing: 1.5,
  },
  winnerCardNumber: {
    fontSize: 52, fontWeight: Typography.weights.extrabold, color: WHITE, lineHeight: 60,
  },
  animBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7,
  },
  animBadgeText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  doneDisclaimer: {
    fontSize: Typography.sizes.xs, color: NEUTRAL_500, textAlign: "center",
  },

  // ── Shared footer ─────────────────────────────────────────────────────────────
  footer: { paddingHorizontal: 20, paddingBottom: 12, gap: 10 },
  primaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: GREEN_900, borderRadius: 16, paddingVertical: 16,
    shadowColor: GREEN_900, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  primaryBtnText: { color: WHITE, fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold },
  secondaryBtn: {
    backgroundColor: WHITE, borderRadius: 16, paddingVertical: 14,
    alignItems: "center", borderWidth: 1.5, borderColor: NEUTRAL_200,
  },
  secondaryBtnText: {
    fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: NEUTRAL_700,
  },
});
