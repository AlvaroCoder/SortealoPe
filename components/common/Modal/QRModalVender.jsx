import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { Colors, Typography } from "../../../constants/theme";
import { createTicketClaimURL } from "../../../lib/deepLinks";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];

const SCREEN_W = Dimensions.get("window").width;
const CARD_W = SCREEN_W - 56; // modal paddingHorizontal × 2
const QR_SIZE = CARD_W * 0.58;

const MASCOT_URI =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

export default function QRModalVender({
  visible,
  reservationCode,
  ticketCount,
  onSellMore,
  onClose,
}) {
  const deepLink = reservationCode ? createTicketClaimURL(reservationCode) : "";

  const viewShotRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!deepLink || !viewShotRef.current) return;
    try {
      setSharing(true);
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Compartir QR de reserva",
      });
    } catch (_err) {
      // sharing cancelled or failed — no alert needed
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <View style={styles.qrSuccessIcon}>
            <Ionicons name="checkmark-circle" size={36} color={WHITE} />
          </View>
          <Text style={styles.qrTitle}>QR listo</Text>
          <Text style={styles.qrSubtitle}>
            {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} reservado
            {ticketCount !== 1 ? "s" : ""}.{"\n"}
            El comprador escanea el QR con la app RIFALOPE.
          </Text>

          {/* ── Branded QR card (captured by ViewShot) ── */}
          {deepLink ? (
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 1 }}
              style={styles.brandedCard}
            >
              {/* Dark green background */}
              <View style={styles.brandedCardInner} collapsable={false}>
                {/* Header: mascot + brand name */}
                <View style={styles.brandHeader}>
                  <Image
                    source={{ uri: MASCOT_URI }}
                    style={styles.mascot}
                    contentFit="contain"
                  />
                  <Text style={styles.brandName}>RIFALOPE</Text>
                  <Text style={styles.brandTagline}>Tu rifa, tu suerte</Text>
                </View>

                {/* QR on white card */}
                <View style={styles.qrInnerCard}>
                  <QRCode
                    value={deepLink}
                    size={QR_SIZE}
                    color={GREEN_900}
                    backgroundColor={WHITE}
                    quietZone={10}
                  />
                </View>

                {/* Ticket info */}
                <Text style={styles.cardTicketCount}>
                  {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} reservado
                  {ticketCount !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.cardScanHint}>
                  Escanea con la app RIFALOPE
                </Text>

                {/* Bottom stripe */}
                <View style={styles.cardStripe} />
              </View>
            </ViewShot>
          ) : null}

          {/* ── Buttons ── */}
          {deepLink ? (
            <TouchableOpacity
              style={[styles.btnShare, sharing && { opacity: 0.6 }]}
              onPress={handleShare}
              disabled={sharing}
              activeOpacity={0.8}
            >
              {sharing ? (
                <ActivityIndicator size="small" color={WHITE} />
              ) : (
                <>
                  <Ionicons name="share-outline" size={18} color={WHITE} />
                  <Text style={styles.btnShareText}>Compartir QR</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.btnSellMore}
            onPress={onSellMore}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSellMoreText}>Vender más tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCloseText}>Volver al evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── Modal ─────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEUTRAL_200,
    marginTop: 14,
    marginBottom: 20,
  },

  // ── Header ───────────────────────────────────────────────────────────────────
  qrSuccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: GREEN_500,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  qrTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },

  // ── Branded card (ViewShot target) ───────────────────────────────────────────
  brandedCard: {
    width: CARD_W,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  brandedCardInner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  mascot: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  brandName: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_500,
    letterSpacing: 3,
  },
  brandTagline: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // ── QR inner card ────────────────────────────────────────────────────────────
  qrInnerCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  // ── Card footer text ─────────────────────────────────────────────────────────
  cardTicketCount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
    marginBottom: 4,
  },
  cardScanHint: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  cardStripe: {
    width: "100%",
    height: 6,
    backgroundColor: GREEN_500,
  },

  // ── Buttons ──────────────────────────────────────────────────────────────────
  btnShare: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GREEN_500,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: GREEN_500,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  btnShareText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },
  btnSellMore: {
    width: "100%",
    borderWidth: 2,
    borderColor: GREEN_900,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  btnSellMoreText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  btnClose: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  btnCloseText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: NEUTRAL_500,
  },
});
