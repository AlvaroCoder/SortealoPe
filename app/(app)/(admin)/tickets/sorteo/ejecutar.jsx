import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CountDownAnimation from "../../../../../components/animation/CountDownAnimation";
import SpinningAnimation from "../../../../../components/animation/SpinningAnimation";
import WheelAnimation from "../../../../../components/animation/WheelAnimation";
import { ENDPOINTS_EVENTS } from "../../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../../constants/theme";
import { fetchWithAuth } from "../../../../../lib/fetchWithAuth";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const WHITE = "#FFFFFF";
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const AMBER = "#F59E0B";
const BLUE = "#1E82D9";
const RED = "#D52941";

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775886772/RifaloPeSuper.png";

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function Ejecutar() {
  const router = useRouter();
  const { selectedAnimation = "spinning", eventId } = useLocalSearchParams();

  // phase: 'intro' | 'choose' | 'loading' | 'animating' | 'result'
  const [phase, setPhase] = useState("intro");
  const [winner, setWinner] = useState(null);
  const [isWinnerMode, setIsWinnerMode] = useState(null); // 0=al agua, 1=ganador
  const [roundCount, setRoundCount] = useState(0);
  const [error, setError] = useState(null);

  // ── Intro animations ───────────────────────────────────────────────────────
  const mascotY = useRef(new Animated.Value(150)).current;
  const mascotOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== "intro") return;
    mascotY.setValue(150);
    mascotOpacity.setValue(0);
    textOpacity.setValue(0);
    btnOpacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(mascotY, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(mascotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 450,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 350,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase, mascotY, mascotOpacity, textOpacity, btnOpacity]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSkipIntro = useCallback(() => setPhase("choose"), []);

  const handleChoose = useCallback(
    async (isWinner) => {
      setIsWinnerMode(isWinner);
      setPhase("loading");
      setError(null);
      try {
        const url = `${ENDPOINTS_EVENTS.RUN}?isWinnerTicket=${isWinner}&eventId=${eventId}`;
        const res = await fetchWithAuth(url, { method: "POST" });

        console.log("Respuesta ");

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        console.log("Data : ", data);

        const ticketNumber = data?.serialNumber ?? data?.id ?? String(data);
        setWinner(ticketNumber);
        setPhase("animating");
      } catch {
        setError("No se pudo obtener el ticket. Intenta de nuevo.");
        setPhase("choose");
      }
    },
    [eventId],
  );

  const handleAnimDone = useCallback(() => setPhase("result"), []);

  const handleContinue = useCallback(() => {
    setWinner(null);
    setIsWinnerMode(null);
    setRoundCount((n) => n + 1);
    setPhase("choose");
  }, []);

  const handleFinish = useCallback(() => router.back(), [router]);

  // ── Animating phase (full screen) ──────────────────────────────────────────
  if (phase === "animating") {
    const AnimComp =
      selectedAnimation === "countdown"
        ? CountDownAnimation
        : selectedAnimation === "wheel"
          ? WheelAnimation
          : SpinningAnimation;
    return (
      <View style={{ flex: 1 }}>
        <AnimComp winner={winner} onDone={handleAnimDone} />
      </View>
    );
  }

  // ── Loading phase ──────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <View style={s.loadingRoot}>
        <ActivityIndicator size="large" color={GREEN_500} />
        <Text style={s.loadingText}>Seleccionando ticket…</Text>
      </View>
    );
  }

  // ── Result phase ───────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <SafeAreaView style={s.resultRoot} edges={["top", "bottom"]}>
        <View style={s.resultContent}>
          <View style={[s.trophyRing, isWinnerMode === 0 && s.trophyRingBlue]}>
            {isWinnerMode === 1 ? (
              <Image
                source={
                  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775889073/RifaloPeGanador.png"
                }
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Image
                source={
                  "https://res.cloudinary.com/dabyqnijl/image/upload/v1776141450/TicketRoto.png"
                }
                style={{ width: 48, height: 48 }}
              />
            )}
          </View>

          <Text style={s.resultTitle}>
            {isWinnerMode === 1 ? "¡Tenemos ganador!" : "¡Ticket al agua!"}
          </Text>
          <Text style={s.resultSub}>Ronda {roundCount + 1} completada</Text>

          <View style={[s.winnerCard, isWinnerMode === 0 && s.winnerCardBlue]}>
            <Text style={s.winnerLabel}>TICKET SELECCIONADO</Text>
            <Text style={s.winnerNumber}>#{winner}</Text>
          </View>

          <View
            style={[
              s.modeBadge,
              isWinnerMode === 1
                ? { backgroundColor: AMBER + "18", borderColor: AMBER + "40" }
                : { backgroundColor: BLUE + "18", borderColor: BLUE + "40" },
            ]}
          >
            <Ionicons
              name={isWinnerMode === 1 ? "trophy-outline" : "water-outline"}
              size={13}
              color={isWinnerMode === 1 ? AMBER : BLUE}
            />
            <Text
              style={[
                s.modeBadgeText,
                { color: isWinnerMode === 1 ? AMBER : BLUE },
              ]}
            >
              {isWinnerMode === 1 ? "Ganador final" : "Al agua"}
            </Text>
          </View>
        </View>

        <View style={s.resultFooter}>
          <TouchableOpacity
            style={s.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={18} color={WHITE} />
            <Text style={s.continueBtnText}>Continuar sorteo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.finishBtn}
            onPress={handleFinish}
            activeOpacity={0.75}
          >
            <Text style={s.finishBtnText}>Finalizar sorteo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Intro phase ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <View style={s.introRoot}>
        <SafeAreaView style={s.introSafe} edges={["top", "bottom"]}>
          <Animated.View
            style={[
              s.mascotWrap,
              { transform: [{ translateY: mascotY }], opacity: mascotOpacity },
            ]}
          >
            <Image
              source={{ uri: MASCOT_URI }}
              style={s.mascot}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Animated.View>

          <Animated.View style={[s.introTextWrap, { opacity: textOpacity }]}>
            <Text style={s.introTitle}>¡El sorteo está{"\n"}por comenzar!</Text>
            <Text style={s.introSub}>
              Prepárate para descubrir al afortunado ticket
            </Text>
          </Animated.View>

          <Animated.View style={[s.introBtnWrap, { opacity: btnOpacity }]}>
            <TouchableOpacity
              style={s.introBtn}
              onPress={handleSkipIntro}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={20} color={GREEN_900} />
              <Text style={s.introBtnText}>¡Comenzar sorteo!</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // ── Choose phase ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.chooseRoot} edges={["top", "bottom"]}>
      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={s.topTitle}>Sorteo en vivo</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.chooseContent}>
        {roundCount > 0 && (
          <View style={s.roundBadge}>
            <Text style={s.roundBadgeText}>Ronda {roundCount + 1}</Text>
          </View>
        )}

        <Text style={s.chooseTitle}>
          ¿Qué tipo de ticket{"\n"}deseas sortear?
        </Text>
        <Text style={s.chooseSub}>
          Elige cómo quieres revelar el siguiente ticket
        </Text>

        {error && (
          <View style={s.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={RED} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        )}

        {/* Al agua */}
        <TouchableOpacity
          style={[s.choiceCard, { borderColor: BLUE + "50" }]}
          onPress={() => handleChoose(0)}
          activeOpacity={0.82}
        >
          <View style={[s.choiceIcon, { backgroundColor: BLUE + "18" }]}>
            <Ionicons name="water-outline" size={32} color={BLUE} />
          </View>
          <View style={s.choiceTexts}>
            <Text style={[s.choiceLabel, { color: BLUE }]}>Al agua</Text>
            <Text style={s.choiceDesc}>
              Sortea un ticket que queda eliminado
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={NEUTRAL_500} />
        </TouchableOpacity>

        {/* Ganador */}
        <TouchableOpacity
          style={[s.choiceCard, { borderColor: AMBER + "60" }]}
          onPress={() => handleChoose(1)}
          activeOpacity={0.82}
        >
          <View style={[s.choiceIcon, { backgroundColor: AMBER + "18" }]}>
            <Ionicons name="trophy-outline" size={32} color={AMBER} />
          </View>
          <View style={s.choiceTexts}>
            <Text style={[s.choiceLabel, { color: AMBER }]}>Ganador</Text>
            <Text style={s.choiceDesc}>
              Sortea el ticket ganador del evento
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={NEUTRAL_500} />
        </TouchableOpacity>
      </View>

      {/* Cancel footer */}
      <View style={s.cancelFooter}>
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Text style={s.cancelBtnText}>Cancelar sorteo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // ── Intro ──────────────────────────────────────────────────────────────────
  introRoot: {
    flex: 1,
    backgroundColor: GREEN_900,
  },
  introSafe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  mascotWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: 220,
    height: 220,
  },
  introTextWrap: {
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  introTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    textAlign: "center",
    lineHeight: 38,
  },
  introSub: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
  },
  introBtnWrap: {
    width: "100%",
  },
  introBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: GREEN_500,
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: GREEN_500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  introBtnText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Loading ────────────────────────────────────────────────────────────────
  loadingRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: NEUTRAL_50,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    fontWeight: Typography.weights.medium,
  },

  // ── Choose ────────────────────────────────────────────────────────────────
  chooseRoot: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },
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
  chooseContent: {
    flex: 1,
    padding: 20,
    gap: 14,
    justifyContent: "center",
  },
  roundBadge: {
    alignSelf: "center",
    backgroundColor: GREEN_50,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: GREEN_500 + "50",
    marginBottom: 4,
  },
  roundBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  chooseTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
    lineHeight: 32,
  },
  chooseSub: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 6,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: RED + "30",
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: RED,
    fontWeight: Typography.weights.medium,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  choiceIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  choiceTexts: {
    flex: 1,
    gap: 3,
  },
  choiceLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
  },
  choiceDesc: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    lineHeight: 16,
  },
  cancelFooter: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelBtnText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },

  // ── Result ────────────────────────────────────────────────────────────────
  resultRoot: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },
  resultContent: {
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
  trophyRingBlue: {
    backgroundColor: "#EFF6FF",
    borderColor: BLUE,
    shadowColor: BLUE,
  },
  resultTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  resultSub: {
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
  winnerCardBlue: {
    backgroundColor: BLUE,
    shadowColor: BLUE,
  },
  winnerLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1.5,
  },
  winnerNumber: {
    fontSize: 52,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    lineHeight: 60,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  modeBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  resultFooter: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  continueBtn: {
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
  continueBtnText: {
    color: WHITE,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  finishBtn: {
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  finishBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: NEUTRAL_700,
  },
});
