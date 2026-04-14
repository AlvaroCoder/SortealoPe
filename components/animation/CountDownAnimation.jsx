import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const BLUE = "#1E82D9";
const RED = "#D52941";
const AMBER = "#F59E0B";
const WHITE = "#FFFFFF";

export default function CountDownAnimation({ onDone }) {
  const [step, setStep] = useState(0);
  const scale = useRef(new Animated.Value(3)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const LABELS = ["5", "4", "3", "2", "1", "¡Ya!"];
  const NUM_COLORS = [RED, AMBER, AMBER, BLUE, GREEN_500, GREEN_500];

  const runStep = useCallback(
    (s) => {
      scale.setValue(3);
      opacity.setValue(1);
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.65,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(opacity, {
          toValue: s < 5 ? 0 : 1,
          duration: 600,
          delay: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (s < 5) {
          setStep(s + 1);
        } else {
          setTimeout(onDone, 900);
        }
      });
    },
    [onDone, opacity, scale],
  );

  useEffect(() => {
    if (step <= 5) runStep(step);
  }, [step, runStep]);

  const color = NUM_COLORS[step] ?? GREEN_500;

  return (
    <View style={co.root}>
      <Text style={co.hint}>
        {step < 5
          ? "El ganador se revelará en…"
          : "¡El ganador ha sido seleccionado!"}
      </Text>

      {/* Pulsing ring */}
      <View style={[co.ringOuter, { borderColor: color + "30" }]}>
        <View style={[co.ringInner, { borderColor: color + "60" }]}>
          <Animated.View
            style={[
              co.circle,
              { borderColor: color },
              { transform: [{ scale }], opacity },
            ]}
          >
            <Text style={[co.number, { color }]}>{LABELS[step] ?? "¡Ya!"}</Text>
          </Animated.View>
        </View>
      </View>

      {step < 5 && (
        <View style={co.dotsRow}>
          {LABELS.slice(0, 5).map((_, i) => (
            <View
              key={i}
              style={[
                co.dot,
                i < step && co.dotDone,
                i === step && co.dotCurrent,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const co = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    backgroundColor: GREEN_900,
    paddingHorizontal: 32,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.6)",
    fontWeight: Typography.weights.medium,
    textAlign: "center",
  },
  ringOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 84,
    fontWeight: Typography.weights.extrabold,
    lineHeight: 96,
  },
  dotsRow: { flexDirection: "row", gap: 10 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  dotDone: { backgroundColor: GREEN_500 },
  dotCurrent: { backgroundColor: WHITE, width: 28, borderRadius: 5 },
});
