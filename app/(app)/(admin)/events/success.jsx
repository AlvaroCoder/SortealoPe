import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const { width: SCREEN_W } = Dimensions.get("window");

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775620710/SuperTicket.png";

export default function EventSuccessScreen() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Text slides up after mascot appears
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Gentle continuous bounce for mascot
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -12,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, [bounceAnim, fadeAnim, scaleAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti dots (decorative) */}
      <View style={styles.confettiRow}>
        {["#16CD91", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"].map(
          (color, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: color,
                  width: 8 + (i % 3) * 4,
                  height: 8 + (i % 3) * 4,
                  marginHorizontal: 6 + i * 4,
                  marginTop: i % 2 === 0 ? 0 : 12,
                },
              ]}
            />
          ),
        )}
      </View>

      {/* Mascot */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
          },
        ]}
      >
        <Image
          source={{ uri: MASCOT_URI }}
          style={styles.mascot}
          contentFit="contain"
        />
      </Animated.View>

      {/* Text block */}
      <Animated.View
        style={[
          styles.textBlock,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.headline}>¡Tu evento está en camino!</Text>
        <Text style={styles.tagline}>
          Gracias por confiar en Rifalope para organizar tu evento.
        </Text>
        <Text style={styles.subtext}>
          Está pendiente de aprobación. Te avisaremos cuando esté listo para
          vender tickets.
        </Text>
      </Animated.View>

      {/* CTA button */}
      <Animated.View style={[styles.buttonWrapper, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/(app)/(admin)")}
        >
          <Text style={styles.ctaText}>¡A vender tickets!</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_900,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  confettiRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  dot: {
    borderRadius: 50,
    opacity: 0.75,
  },
  mascotWrapper: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: SCREEN_W * 0.65,
    height: SCREEN_W * 0.65,
  },
  textBlock: {
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  emoji: {
    fontSize: 42,
    lineHeight: 50,
  },
  headline: {
    fontFamily: Typography.fonts.rounded,
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    textAlign: "center",
    lineHeight: 32,
  },
  tagline: {
    fontFamily: Typography.fonts.sans,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: GREEN_500,
    textAlign: "center",
    lineHeight: 24,
  },
  subtext: {
    fontFamily: Typography.fonts.sans,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.normal,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 36,
  },
  ctaButton: {
    backgroundColor: GREEN_500,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    fontFamily: Typography.fonts.rounded,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
});
