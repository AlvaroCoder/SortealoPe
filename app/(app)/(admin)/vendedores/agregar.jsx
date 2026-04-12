import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImportExcelModal from "../../../../components/common/Dividers/ImportExcelModal";
import QRVendedorModal from "../../../../components/common/Modal/QRVendedorModal";
import { Colors, Typography } from "../../../../constants/theme";

const URL_IMAGEN =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1775314294/mascotas_zlqjn5.png";

// ── Color constants ────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_50 = Colors.principal.green[50];
const GREEN_100 = Colors.principal.green[100];
const WHITE = "#FFFFFF";
const BG_PAGE = "#F0F4F8";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];

// ── Action card ────────────────────────────────────────────────────────────────
function ActionCard({ icon, title, description, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.actionIconBox}>
        <Ionicons name={icon} size={26} color={GREEN_900} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={NEUTRAL_500} />
    </TouchableOpacity>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function AgregarVendedor() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();

  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  return (
    <View style={styles.root}>
      {/* Status bar spacer */}
      <View style={styles.statusBar} />

      {/* ── Top nav bar ───────────────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={GREEN_900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Agregar Vendedor</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Agregar{"\n"}Vendedor</Text>
            <Text style={styles.heroSubtitle}>
              Solo puedes agregar vendedores que ya estén registrados en la
              aplicación RIFALOPE.
            </Text>
          </View>
          {/* Decorative mascot placeholder */}
          <View style={styles.heroDeco}>
            <View style={styles.heroDecoCircle}>
              <Image
                source={{ uri: URL_IMAGEN }}
                style={{ width: 80, height: 120 }}
              />
            </View>
          </View>
        </View>

        {/* ── Action cards ───────────────────────────────────────────────── */}
        <ActionCard
          icon="qr-code-outline"
          title="Agregar por Código QR"
          description="Genera un código QR para que el vendedor lo escanee y se agregue automáticamente al evento."
          onPress={() => setIsQrModalVisible(true)}
        />

        <ActionCard
          icon="document-text-outline"
          title="Importar desde Excel"
          description="Sube un archivo .xlsx con los correos de los vendedores registrados."
          onPress={() => setIsImportModalVisible(true)}
        />

        {/* ── Help hint ──────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.helpRow} activeOpacity={0.7}>
          <View style={styles.helpIconBox}>
            <Ionicons name="help-circle" size={20} color={GREEN_900} />
          </View>
          <Text style={styles.helpText}>¿Cómo funciona la importación?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <QRVendedorModal
        visible={isQrModalVisible}
        onClose={() => setIsQrModalVisible(false)}
        eventId={eventId}
      />

      <ImportExcelModal
        visible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        eventId={eventId}
      />
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

  // ── Nav bar ────────────────────────────────────────────────────────────────
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    flex: 1,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginLeft: 10,
  },
  navPlaceholder: {
    width: 32,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },

  // ── Hero card ──────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: "#E8F0FE",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 4,
  },
  heroContent: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    lineHeight: 30,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    lineHeight: 20,
  },
  heroDeco: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  heroDecoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GREEN_100,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Action card ────────────────────────────────────────────────────────────
  actionCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  actionIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    lineHeight: 18,
  },

  // ── Help row ───────────────────────────────────────────────────────────────
  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GREEN_50,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: GREEN_100,
    marginTop: 4,
  },
  helpIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN_100,
    alignItems: "center",
    justifyContent: "center",
  },
  helpText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
});
