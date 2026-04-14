import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLUE = "#1E82D9";
const PURPLE = "#7C3AED";
const RED = "#D52941";
const AMBER = "#F59E0B";
const TEAL = "#10B981";

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

export default function WheelAnimation({ winner, onDone }) {
  const [winSeg] = useState(() => Math.floor(Math.random() * N_SEGS));
  // Rotate so that winSeg ends at 0° (12 o'clock, where pointer is)
  const finalAngle =
    5 * 360 + ((360 - ((winSeg * (360 / N_SEGS)) % 360)) % 360);

  const rotation = useRef(new Animated.Value(0)).current;
  const [done, setDone] = useState(false);

  const spin = rotation.interpolate({
    inputRange: [0, finalAngle],
    outputRange: ["0deg", `${finalAngle}deg`],
  });

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: finalAngle,
      duration: 4500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setDone(true);
      setTimeout(onDone, 2200);
    });
  }, [finalAngle, onDone, rotation]);
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
              top: RADIUS,
              left: RADIUS,
              width: 0,
              height: 0,
              borderTopWidth: RADIUS,
              borderLeftWidth: HALF_BASE,
              borderRightWidth: HALF_BASE,
              borderTopColor: color,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
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
        <View
          style={[wa.resultCard, { borderColor: SEG_COLORS[winSeg] + "50" }]}
        >
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    paddingHorizontal: 24,
    backgroundColor: WHITE,
  },
  hint: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.semibold,
    marginBottom: 8,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: RED,
    zIndex: 10,
    marginBottom: -2,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WHITE,
    marginTop: -(WHEEL_SIZE / 2 + 32),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 20,
  },
  resultCard: {
    marginTop: WHEEL_SIZE / 2 + 32 + 20,
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 6,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultZone: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  resultDivider: { width: 40, height: 1.5, backgroundColor: NEUTRAL_200 },
  resultTicketLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  resultTicketNumber: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
  },
});
