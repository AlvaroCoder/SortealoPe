import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../constants/theme";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const BLUE_50 = Colors.principal.blue[50];
const NEUTRAL_500 = Colors.principal.neutral[500];
const ORANGE = "#F59E0B";

const MASCOT_URL =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

const STATUS_GUIDE = [
  {
    color: GREEN_500,
    bg: GREEN_50,
    label: "Vendido",
    desc: "Ticket comprado y confirmado correctamente.",
  },
  {
    color: ORANGE,
    bg: "#FFFBEB",
    label: "En espera",
    desc: "El vendedor ha generado el QR pero aún no se escanea.",
  },
  {
    color: BLUE_500,
    bg: BLUE_50,
    label: "Reservado",
    desc: "El cliente escaneo el QR y se reservó el ticket, pero no se ha confirmado la venta.",
  },
];
export default function GuideStatusCard() {
  return (
    <View style={styles.statusGuide}>
      {/* Header con mascota */}
      <View style={styles.statusGuideHeader}>
        <Image
          source={{ uri: MASCOT_URL }}
          style={styles.statusGuideIcon}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <View style={styles.statusGuideHeaderText}>
          <Text style={styles.statusGuideTitle}>Guía de estados</Text>
          <Text style={styles.statusGuideSubtitle}>
            ¿Qué significa cada color?
          </Text>
        </View>
      </View>

      {/* Items */}
      {STATUS_GUIDE.map((item) => (
        <View key={item.label} style={styles.statusGuideItem}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.bg, borderColor: item.color },
            ]}
          >
            <View
              style={[styles.statusDotInner, { backgroundColor: item.color }]}
            />
          </View>
          <View style={styles.statusGuideItemText}>
            <Text style={[styles.statusGuideItemLabel, { color: item.color }]}>
              {item.label}
            </Text>
            <Text style={styles.statusGuideItemDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statusGuide: {
    backgroundColor: GREEN_50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.principal.green[100],
    padding: 16,
    gap: 14,
  },
  statusGuideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  statusGuideIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  statusGuideHeaderText: {
    flex: 1,
  },
  statusGuideTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 2,
  },
  statusGuideSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  statusGuideItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  statusDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusGuideItemText: {
    flex: 1,
    gap: 2,
  },
  statusGuideItemLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  statusGuideItemDesc: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    lineHeight: 17,
  },
});
