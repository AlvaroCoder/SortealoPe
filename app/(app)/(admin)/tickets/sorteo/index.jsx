import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "../../../../../constants/theme";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const GREEN_200 = Colors.principal.green[200];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775886772/RifaloPeSuper.png";

// ── Animation options config ───────────────────────────────────────────────────
const ANIMATION_OPTIONS = [
  {
    id: "spinning",
    label: "Tickets Giratorios",
    description: "Los tickets vuelan y giran hasta que uno emerge como ganador",
    icon: "ticket-outline",
    accent: GREEN_500,
  },
  {
    id: "countdown",
    label: "Cuenta Regresiva",
    description: "Una cuenta atrás dramática revela al ganador con tensión",
    icon: "timer-outline",
    accent: "#1E82D9",
  },
  {
    id: "wheel",
    label: "Ruleta de la Fortuna",
    description: "Una ruleta gira hasta detenerse en el ticket ganador",
    icon: "disc-outline",
    accent: "#7C3AED",
  },
];
// ── Stepper component ──────────────────────────────────────────────────────────
function Stepper({ value, onDecrement, onIncrement, min, max, unit }) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={[styles.stepperBtn, value <= min && styles.stepperBtnDisabled]}
        onPress={onDecrement}
        disabled={value <= min}
        activeOpacity={0.7}
      >
        <Ionicons
          name="remove"
          size={22}
          color={value <= min ? NEUTRAL_400 : GREEN_900}
        />
      </TouchableOpacity>

      <View style={styles.stepperValue}>
        <Text style={styles.stepperNumber}>{value}</Text>
        {unit && <Text style={styles.stepperUnit}>{unit}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.stepperBtn, value >= max && styles.stepperBtnDisabled]}
        onPress={onIncrement}
        disabled={value >= max}
        activeOpacity={0.7}
      >
        <Ionicons
          name="add"
          size={22}
          color={value >= max ? NEUTRAL_400 : GREEN_900}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function IndexSorteo() {
  const router = useRouter();
  const { eventTitle } = useLocalSearchParams();

  const [selectedAnimation, setSelectedAnimation] = useState("spinning");
  const [winners, setWinners] = useState(1);
  const [tiradas, setTiradas] = useState(5);

  const selectedOpt = ANIMATION_OPTIONS.find((o) => o.id === selectedAnimation);

  const handleSortear = () => {
    Alert.alert("Próximamente", "Esta función estará disponible pronto.");
  };

  return (
    <View style={styles.root}>
      {/* Status bar spacer */}
      <View style={styles.statusBar} />

      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={GREEN_900} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Ionicons
            name="trophy-outline"
            size={18}
            color={GREEN_900}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.navTitle} numberOfLines={1}>
            {eventTitle ? `Sortear — ${eventTitle}` : "Sortear"}
          </Text>
        </View>
      </View>

      {/* Scrollable body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: MASCOT_URI }}
            style={styles.mascot}
            contentFit="contain"
          />
          <Text style={styles.heroTitle}>Configura el Sorteo</Text>
          <Text style={styles.heroSubtitle}>
            Personaliza cómo se realizará el sorteo antes de iniciarlo
          </Text>
        </View>

        {/* ── Card: Animación ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-wand-outline" size={18} color={GREEN_900} />
            <Text style={styles.cardTitle}>Animación del Sorteo</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Elige cómo se mostrará el sorteo a la audiencia
          </Text>

          <View style={styles.animationList}>
            {ANIMATION_OPTIONS.map((opt) => {
              const active = selectedAnimation === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.animationOption,
                    active && {
                      borderColor: opt.accent,
                      backgroundColor: opt.accent + "10",
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedAnimation(opt.id)}
                >
                  {/* Icon box */}
                  <View
                    style={[
                      styles.animationIconBox,
                      {
                        backgroundColor: active
                          ? opt.accent + "20"
                          : NEUTRAL_100,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={22}
                      color={active ? opt.accent : NEUTRAL_400}
                    />
                  </View>

                  {/* Texts */}
                  <View style={styles.animationTexts}>
                    <Text
                      style={[
                        styles.animationLabel,
                        active && { color: GREEN_900 },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.animationDesc}>{opt.description}</Text>
                  </View>

                  {/* Radio */}
                  <View
                    style={[
                      styles.radioOuter,
                      active && { borderColor: opt.accent },
                    ]}
                  >
                    {active && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: opt.accent },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Card: Ganadores ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy-outline" size={18} color={GREEN_900} />
            <Text style={styles.cardTitle}>Número de Ganadores</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            ¿Cuántos ganadores deseas seleccionar en este sorteo?
          </Text>
          <Stepper
            value={winners}
            onDecrement={() => setWinners((v) => Math.max(1, v - 1))}
            onIncrement={() => setWinners((v) => Math.min(10, v + 1))}
            min={1}
            max={10}
            unit={winners === 1 ? "ganador" : "ganadores"}
          />
        </View>

        {/* ── Card: Tiradas ────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water-outline" size={18} color={GREEN_900} />
            <Text style={styles.cardTitle}>Tickets al Agua</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Cantidad de tickets eliminados antes de revelar al ganador. Más
            tiradas = mayor emoción en el sorteo.
          </Text>
          <Stepper
            value={tiradas}
            onDecrement={() => setTiradas((v) => Math.max(1, v - 1))}
            onIncrement={() => setTiradas((v) => Math.min(50, v + 1))}
            min={1}
            max={50}
            unit={tiradas === 1 ? "tirada" : "tiradas"}
          />
        </View>

        {/* ── Resumen de configuración ─────────────────────────────────────── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="color-wand-outline" size={16} color={GREEN_500} />
              <Text style={styles.summaryLabel}>Animación</Text>
              <Text style={styles.summaryValue}>{selectedOpt?.label}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="people-outline" size={16} color={GREEN_500} />
              <Text style={styles.summaryLabel}>Ganadores</Text>
              <Text style={styles.summaryValue}>{winners}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="water-outline" size={16} color={GREEN_500} />
              <Text style={styles.summaryLabel}>Tiradas</Text>
              <Text style={styles.summaryValue}>{tiradas}</Text>
            </View>
          </View>
        </View>

        {/* Warning notice */}
        <View style={styles.notice}>
          <Ionicons name="warning-outline" size={16} color="#B45309" />
          <Text style={styles.noticeText}>
            Esta acción es irreversible. Asegúrate de que todos los tickets
            estén confirmados antes de iniciar el sorteo.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Sticky CTA ──────────────────────────────────────────────────────── */}
      <SafeAreaView style={styles.bottomBar} edges={["bottom"]}>
        <TouchableOpacity
          style={styles.sortearBtn}
          activeOpacity={0.85}
          onPress={handleSortear}
        >
          <Ionicons name="trophy-outline" size={20} color={WHITE} />
          <Text style={styles.sortearBtnText}>Iniciar Sorteo</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: WHITE,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 20,
  },

  // ── Nav ─────────────────────────────────────────────────────────────────────
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  navBack: {
    padding: 4,
    marginRight: 8,
  },
  navCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  navTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    flex: 1,
  },

  // ── Hero ────────────────────────────────────────────────────────────────────
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 28,
    marginBottom: 24,
    gap: 8,
  },
  mascot: {
    width: 110,
    height: 110,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Generic card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  cardSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginBottom: 16,
    lineHeight: 18,
  },

  // ── Animation options ────────────────────────────────────────────────────────
  animationList: {
    gap: 10,
  },
  animationOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
  },
  animationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  animationTexts: {
    flex: 1,
    gap: 2,
  },
  animationLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
  },
  animationDesc: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    lineHeight: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ── Stepper ─────────────────────────────────────────────────────────────────
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    marginTop: 4,
  },
  stepperBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GREEN_50,
    borderWidth: 1.5,
    borderColor: GREEN_200,
  },
  stepperBtnDisabled: {
    backgroundColor: NEUTRAL_100,
    borderColor: NEUTRAL_200,
  },
  stepperValue: {
    alignItems: "center",
    minWidth: 110,
  },
  stepperNumber: {
    fontSize: 46,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 54,
  },
  stepperUnit: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Summary card ────────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: GREEN_900,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: "rgba(255,255,255,0.60)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.60)",
    fontWeight: Typography.weights.medium,
  },
  summaryValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // ── Notice ──────────────────────────────────────────────────────────────────
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginHorizontal: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: "#92400E",
    lineHeight: 18,
    fontWeight: Typography.weights.medium,
  },

  // ── Sticky bottom ───────────────────────────────────────────────────────────
  bottomBar: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  sortearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: GREEN_900,
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: GREEN_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  sortearBtnText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
  },
});
