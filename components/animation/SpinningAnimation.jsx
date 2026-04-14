import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION 1 — SPINNING (Slot Machine)
// ═══════════════════════════════════════════════════════════════════════════════

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";

export default function SpinningAnimation({ winner, onDone }) {
  const wd = String(winner).padStart(3, "0").split("");
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0); // 0=all spin, 1/2/3=drums locked
  const [digits, setDigits] = useState(["?", "?", "?"]);

  useEffect(() => {
    let count = 0;
    const TOTAL = 65;
    const id = setInterval(() => {
      count++;
      const p = count < 22 ? 0 : count < 44 ? 1 : count < 58 ? 2 : 3;
      if (p !== phaseRef.current) {
        phaseRef.current = p;
        setPhase(p);
      }
      setDigits([
        p >= 1 ? wd[0] : String(Math.floor(Math.random() * 10)),
        p >= 2 ? wd[1] : String(Math.floor(Math.random() * 10)),
        p >= 3 ? wd[2] : String(Math.floor(Math.random() * 10)),
      ]);
      if (count >= TOTAL) {
        clearInterval(id);
        setTimeout(onDone, 1800);
      }
    }, 80);
    return () => clearInterval(id);
  }, [onDone, wd]);

  return (
    <View style={sa.root}>
      <Text style={sa.title}>Seleccionando ticket ganador…</Text>

      {/* Drum labels */}
      <View style={sa.drumLabels}>
        {["C", "D", "U"].map((l, i) => (
          <Text key={i} style={sa.drumLabel}>
            {l}
          </Text>
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
              <Text style={[sa.drumDigit, locked && sa.drumDigitLocked]}>
                {d}
              </Text>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
    backgroundColor: GREEN_900,
  },
  title: {
    fontSize: Typography.sizes.base,
    color: "rgba(255,255,255,0.7)",
    fontWeight: Typography.weights.medium,
  },
  drumLabels: { flexDirection: "row", gap: 12 },
  drumLabel: {
    width: 80,
    textAlign: "center",
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.4)",
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  drumRow: { flexDirection: "row", gap: 12 },
  drum: {
    width: 80,
    height: 112,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  drumLocked: { backgroundColor: GREEN_500, borderColor: GREEN_500 },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
  },
  drumDigit: {
    fontSize: 52,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 60,
  },
  drumDigitLocked: { color: GREEN_900 },
  tag: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
  },
  dots: { flexDirection: "row", gap: 8, marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: { backgroundColor: GREEN_500 },
});
