import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ENDPOINTS_EVENTS } from "../../Connections/APIURLS";
import { Colors, Typography } from "../../constants/theme";
import { useFetch } from "../../lib/useFetch";
import LoadingScreen from "../../screens/LoadingScreen";
import ButtonGradiend from "../common/Buttons/ButtonGradiendt";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_GAP = 14;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CARD_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// Gradient config por nivel (índice en el array filtrado)
const TIER_CONFIGS = [
  {
    colors: ["#004739", "#16CD91"],
    locations: [0, 1],
    label: "Básico",
    icon: "leaf-outline",
    textColor: WHITE,
    subColor: "rgba(255,255,255,0.7)",
    checkBg: "rgba(255,255,255,0.2)",
  },
  {
    colors: ["#1E3A5F", "#1E82D9"],
    locations: [0, 1],
    label: "Estándar",
    icon: "star-outline",
    textColor: WHITE,
    subColor: "rgba(255,255,255,0.7)",
    checkBg: "rgba(255,255,255,0.2)",
  },
  {
    colors: ["#2D1B69", "#7C3AED"],
    locations: [0, 1],
    label: "Avanzado",
    icon: "diamond-outline",
    textColor: WHITE,
    subColor: "rgba(255,255,255,0.7)",
    checkBg: "rgba(255,255,255,0.2)",
  },
  {
    // Último plan — dorado Premium
    colors: ["#5C2E00", "#C77B00", "#FFD700"],
    locations: [0, 0.55, 1],
    label: "Premium",
    icon: "trophy-outline",
    textColor: "#3D1C00",
    subColor: "rgba(61,28,0,0.65)",
    checkBg: "rgba(61,28,0,0.2)",
    isGold: true,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
  },
];

function PackCard({ item, tier, isSelected, onPress, index }) {
  const isGold = tier.isGold;

  return (
    <TouchableOpacity
      style={[
        styles.cardWrapper,
        isGold && styles.cardWrapperGold,
        isSelected && styles.cardWrapperSelected,
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.88}
    >
      <LinearGradient
        colors={tier.colors}
        locations={tier.locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative background circle */}
        <View style={styles.bgCircle} />
        <View style={[styles.bgCircleSmall]} />

        {/* Top row: tier badge + check */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.tierBadge,
              { backgroundColor: "rgba(255,255,255,0.18)" },
            ]}
          >
            <Ionicons
              name={tier.icon}
              size={13}
              color={isGold ? "#3D1C00" : WHITE}
            />
            <Text
              style={[styles.tierLabel, { color: isGold ? "#3D1C00" : WHITE }]}
            >
              {tier.label}
            </Text>
          </View>

          {isSelected && (
            <View
              style={[styles.checkBadge, { backgroundColor: tier.checkBg }]}
            >
              <Ionicons
                name="checkmark"
                size={14}
                color={isGold ? "#3D1C00" : WHITE}
              />
            </View>
          )}
        </View>

        {/* Pack name */}
        <Text
          style={[styles.packName, { color: tier.textColor }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        {/* Ticket count — hero number */}
        <View style={styles.ticketCountRow}>
          <Text
            style={[styles.ticketNumber, { color: isGold ? "#FFD700" : WHITE }]}
          >
            {item.maximumCapacity?.toLocaleString()}
          </Text>
          <Text style={[styles.ticketLabel, { color: tier.subColor }]}>
            {" "}
            tickets
          </Text>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isGold
                ? "rgba(61,28,0,0.25)"
                : "rgba(255,255,255,0.25)",
            },
          ]}
        />

        {/* Price */}
        <Text style={[styles.price, { color: tier.subColor }]}>Precio</Text>
        <Text style={[styles.priceValue, { color: tier.textColor }]}>
          S/ {Number(item.price ?? 0).toFixed(2)}
        </Text>

        {/* Gold sparkle icon */}
        {isGold && (
          <View style={styles.goldStar}>
            <Ionicons name="sparkles" size={20} color="#FFD700" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function Step1Content({ form, setForm, onNext }) {
  const { data, loading } = useFetch(ENDPOINTS_EVENTS.GET_PACKS);

  const PACK_IDS = [1, 3, 6, 9];
  const filteredPacks = (data ?? []).filter((item) =>
    PACK_IDS.includes(parseInt(item?.id)),
  );

  const handleNext = () => {
    if (form?.packId === undefined || form?.packId === null) {
      Alert.alert(
        "Selecciona un plan",
        "Por favor elige un plan de tickets para continuar.",
      );
      return;
    }
    onNext();
  };

  const handleSelect = (item) => {
    setForm((prev) => ({
      ...prev,
      packId: parseInt(item?.id),
    }));
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1. Elige tu Plan</Text>
      <Text style={styles.subtitle}>
        Selecciona el plan que mejor se adapte a tu sorteo. Desliza para ver más
        opciones.
      </Text>

      {/* Horizontal carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.carousel,
          { paddingHorizontal: CARD_PADDING },
        ]}
        style={styles.carouselScroll}
      >
        {filteredPacks.map((item, index) => {
          const tierIndex = Math.min(index, TIER_CONFIGS.length - 1);
          // Force last item always gold
          const effectiveTier =
            index === filteredPacks.length - 1
              ? TIER_CONFIGS[3]
              : TIER_CONFIGS[tierIndex];

          return (
            <PackCard
              key={item.id}
              item={item}
              tier={effectiveTier}
              isSelected={String(form?.packId) === String(item?.id)}
              onPress={handleSelect}
              index={index}
            />
          );
        })}
      </ScrollView>

      {/* Dot indicators */}
      {filteredPacks.length > 1 && (
        <View style={styles.dots}>
          {filteredPacks.map((item, index) => {
            const isActive = String(form?.packId) === String(item?.id);
            return (
              <View
                key={item.id}
                style={[styles.dot, isActive && styles.dotActive]}
              />
            );
          })}
        </View>
      )}

      {/* Selected summary */}
      {form?.packId != null && (
        <View style={styles.summary}>
          <Ionicons name="checkmark-circle" size={16} color={GREEN_900} />
          <Text style={styles.summaryText}>
            {filteredPacks.find((p) => String(p.id) === String(form.packId))
              ?.name ?? "Plan seleccionado"}
            {" · "}
            {form.ticketsPerCollection?.toLocaleString()} tickets
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
          Continuar
        </ButtonGradiend>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 40,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    marginBottom: 24,
    lineHeight: 20,
  },

  // ── Carousel ──────────────────────────────────────────────
  carouselScroll: {
    marginHorizontal: -24, // compensate parent padding
  },
  carousel: {
    gap: CARD_GAP,
    alignItems: "center",
    paddingVertical: 8,
  },

  // ── Card ──────────────────────────────────────────────────
  cardWrapper: {
    width: CARD_WIDTH,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardWrapperGold: {
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 22,
    // Gold border via extra wrapper shadow
  },
  cardWrapperSelected: {
    transform: [{ scale: 1.02 }],
  },
  card: {
    borderRadius: 22,
    padding: 24,
    minHeight: 240,
    overflow: "hidden",
    borderWidth: 0,
  },

  // Background decorative circles
  bgCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -50,
  },
  bgCircleSmall: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -30,
    left: -20,
  },

  // Top row
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tierLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pack info
  packName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 10,
    lineHeight: 22,
  },
  ticketCountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  ticketNumber: {
    fontSize: 42,
    fontWeight: Typography.weights.extrabold,
    lineHeight: 44,
  },
  ticketLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    paddingBottom: 6,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  price: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },
  goldStar: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  // ── Dot indicators ────────────────────────────────────────
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NEUTRAL_200,
  },
  dotActive: {
    width: 18,
    backgroundColor: GREEN_900,
  },

  // ── Selected summary ──────────────────────────────────────
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.principal.green[50],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.principal.green[200],
  },
  summaryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Button ────────────────────────────────────────────────
  buttonContainer: {
    marginTop: 24,
  },
  nextButton: {
    width: "100%",
  },
});
